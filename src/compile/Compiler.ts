import type { VariableInfo } from "wgsl_reflect";
import { ComputeHolder } from "../holder/ComputeHolder";
import { RenderHolder } from "../holder/RenderHolder";
import type { ComputeProperty } from "../property/dispatch/ComputeProperty";
import type { RenderProperty } from "../property/dispatch/RenderProperty";
import type { Attributes, Uniforms } from "../property/Properties";
import type { ColorAttachment } from "../res/attachment/ColorAttachment";
import type { DepthStencilAttachment } from "../res/attachment/DepthStencilAttachment";
import type { Handle1D, Handle2D } from "../res/buffer/BaseBuffer";
import type { UniformBuffer } from "../res/buffer/UniformBuffer";
import type { VertexBuffer } from "../res/buffer/VertexBuffer";
import { Context } from "../res/Context";
import type { BlendFormat, ColorLoadStoreFormat, DepthLoadStoreFormat, MultiSampleFormat, StencilLoadStoreFormat, StencilStateFormat, TypedArray1DFormat, TypedArray2DFormat } from "../res/Format";
import type { ComputeHandle, RenderHandle } from "../res/Handle";
import type { ComputeShader } from "../res/shader/ComputeShader";
import type { FragmentShader } from "../res/shader/FragmentShader";
import type { VertexShader } from "../res/shader/VertexShader";
import { BufferState } from "../state/BufferState";
import { ShaderState } from "../state/ShaderState";
import { TextureState } from "../state/TextureState";
import { emitAttributes } from "./emitAttributes";
import { parseAttribute, type IAttributeRecord } from "./parseAttribute";
import { parseColorAttachments } from "./parseColorAttachments";
import { parseFragmentState } from "./parseFragmentState";
import { parseMultisampleState } from "./parseMultisampleState";
import { parsePipelineLayout } from "./parsePipelineLayout";
import { parsePrimitiveState, type PrimitiveDesc } from "./parsePrimitiveState";
import { parseRenderBindGroupLayout } from "./parseRenderBindGroupLayout";
import { parseRenderDispatch } from "./parseRenderDispatch";
import { parseUniform, type IUniformRecord, type UniformHandle } from "./parseUniform";
import { emitUniforms } from "./emitUniforms";
import { SamplerState } from "../state/SamplerState";
import { emitRenderPipeline } from "./emitRenderPipeline";
import { PipelineState } from "../state/PipelineState";
import type { RenderPipeline } from "../res/pipeline/RenderPipeline";
import type { BaseTexture } from "../res/texture/BaseTexture";
import { AttachmentState } from "../state/AttachmentState";
import type { Texture2D } from "../res/texture/Texture2D";
import { uniqueID } from "../util/uniqueID";
import { parseComputeBindGroupLayout } from "./parseComputeBindGroupLayout";
import { parseComputeDispatch } from "./parseComputeDispatch";
import { parseComputeProgrammableStage } from "./parseComputeProgrammableStage";
import { emitComputePipeline } from "./emitComputePipeline";
import type { StorageBuffer } from "../res/buffer/StorageBuffer";
import type { MapBuffer } from "../res/buffer/Mapbuffer";
import type { IndexBuffer } from "../res/buffer/IndexBuffer";

/**
 * 
 * render holde descriptor
 * @param label {String} 
 * @param vertexShader {VertexShader}
 * 
 */
interface RenderHolderDesc {

    /**
     * debug label(stats info head bar)
     */
    label: string,

    /**
     * 
     */
    vertexShader: VertexShader,

    /**
     * 
     */
    fragmentShader: FragmentShader,

    /**
     * 
     */
    attributes?: Attributes,

    /**
     * 
     */
    uniforms?: Uniforms,

    /**
     * 
     */
    multiSampleFormat?: MultiSampleFormat,

    /**
     * 
     */
    dispatch: RenderProperty,

    /**
     * 
     */
    primitiveDesc?: PrimitiveDesc,

    /**
     * 
     */
    colorAttachments: ColorAttachment[],

    /**
     * 
     */
    depthStencilAttachment: DepthStencilAttachment,
}

/**
 * support:
 * gpu-driven style
 */
interface ComputeHolderDesc {
    /**
     * 
     */
    label: string,

    /**
     * 
     */
    computeShader: ComputeShader,

    /**
     * 
     */
    uniforms: Uniforms,

    /**
     * 
     */
    dispatch: ComputeProperty
}

/**
 * 
 */
class Compiler {

    /**
     * 
     */
    private ctx: Context;

    /**
     * 
     */
    private bufferState: BufferState;

    /**
     * 
     */
    private shaderState: ShaderState;

    /**
     * 
     */
    private textureState: TextureState;

    /**
     * 
     */
    private samplerState: SamplerState;

    /**
     * 
     */
    private pipelineState: PipelineState;

    /**
     * 
     */
    private attachmentState: AttachmentState;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            ctx: Context
        }
    ) {
        this.ctx = opts.ctx;
        this.bufferState = new BufferState(this.ctx);
        this.shaderState = new ShaderState(this.ctx);
        this.textureState = new TextureState(this.ctx);
        this.samplerState = new SamplerState(this.ctx);
        this.pipelineState = new PipelineState(this.ctx);
        this.attachmentState = new AttachmentState(this.ctx);
    }

    /**
     * 
     * @param desc 
     * @returns 
     */
    compileRenderHolder = (desc: RenderHolderDesc): RenderHolder => {
        const vertexShader = desc.vertexShader, fragmentShader = desc.fragmentShader;
        // vaildation shader
        if (!vertexShader || !fragmentShader) {
            throw new Error(`[E][Compiler][compileRenderHolder] missing shader, vertexShader: ${vertexShader}; fragmentShader:${fragmentShader}`);
        }

        // parse attribute
        const attributeRecordMap: Map<string, IAttributeRecord> = new Map();
        const bufferAttributeRecordsMap: Map<number, Map<string, IAttributeRecord>> = new Map();
        parseAttribute({
            attributes: desc.attributes,
            attributeRecordMap: attributeRecordMap,
            bufferAttributeRecordsMap: bufferAttributeRecordsMap
        });

        // parse uniform
        const uniformRecordMap: Map<string, IUniformRecord> = new Map();
        const bufferUniformRecordsMap: Map<number, Map<string, IUniformRecord>> = new Map();
        const unifomrHandler: UniformHandle = parseUniform({
            uniforms: desc.uniforms,
            uniformRecordMap: uniformRecordMap,
            bufferUniformRecordsMap: bufferUniformRecordsMap
        });

        // parse render holder bindgrouplayout
        const bindGroupLayouts: GPUBindGroupLayout[] = [];
        const gourpIDWithBindGroupLayoutMap: Map<number, GPUBindGroupLayout> = new Map();
        const gourpIDWithBindGroupLayoutDescriptorMap: Map<number, GPUBindGroupLayoutDescriptor> = new Map();
        parseRenderBindGroupLayout(
            this.ctx,
            vertexShader,
            fragmentShader,
            bindGroupLayouts,
            gourpIDWithBindGroupLayoutMap,
            gourpIDWithBindGroupLayoutDescriptorMap
        );

        // parse render dispatch
        const renderHandler: RenderHandle = parseRenderDispatch(
            this.bufferState,
            desc.dispatch
        );

        // parse multi sample state
        const multiSampleState: GPUMultisampleState = parseMultisampleState(
            desc.multiSampleFormat || '1x'
        );

        // parse color attachments
        const colorTargetStates: GPUColorTargetState[] = parseColorAttachments(
            desc.colorAttachments
        );

        // parse primitive state
        const primitiveState: GPUPrimitiveState = parsePrimitiveState({
            primitiveDesc: desc.primitiveDesc,
            dispatch: desc.dispatch
        });

        // parse fragment state
        const fragmentState: GPUFragmentState = parseFragmentState(
            fragmentShader,
            colorTargetStates
        );

        // parse pipeline layout
        const pipelineLayout: GPUPipelineLayout = parsePipelineLayout(
            this.ctx,
            bindGroupLayouts,
        );

        // emmit vertex state
        let vertexBufferLayouts: GPUVertexBufferLayout[] = [];
        let bufferVertexAttributesMap: Map<number, GPUVertexAttribute[]> = new Map();
        let slotAttributeBufferIDMap: Map<number, number> = new Map();
        const vertexState: GPUVertexState = emitAttributes(
            vertexShader,
            bufferAttributeRecordsMap,
            vertexBufferLayouts,
            bufferVertexAttributesMap,
            slotAttributeBufferIDMap
        ) as GPUVertexState;

        // emit uniform
        const slotBindGroupMap: Map<number, GPUBindGroup> = new Map();
        const mergedUniformResourceMap: Map<number, VariableInfo[]> = new Map();
        emitUniforms(
            {
                ctx: this.ctx,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                bufferState: this.bufferState,
                textureState: this.textureState,
                samplerState: this.samplerState,
                uniformRecordMap: uniformRecordMap,
                bufferIDUniformRecordsMap: bufferUniformRecordsMap,
                gourpIDWithBindGroupLayoutMap: gourpIDWithBindGroupLayoutMap,
                gourpIDWithBindGroupLayoutDescriptorMap: gourpIDWithBindGroupLayoutDescriptorMap
            },
            slotBindGroupMap,
            mergedUniformResourceMap
        );

        // emit render pipeline
        const renderPipeline: RenderPipeline = emitRenderPipeline({
            pipelineState: this.pipelineState,
            depthStencilAttachment: desc.depthStencilAttachment,
            vertexState: vertexState,
            fragmentState: fragmentState,
            pipelineLayout: pipelineLayout,
            primitiveState: primitiveState,
            multisampleState: multiSampleState
        });

        //
        // TODO::   
        // dependeicese, includes input/output
        //

        // render holder
        return new RenderHolder({
            id: uniqueID(),
            ctx: this.ctx,
            renderPipeline: renderPipeline,
            bufferState: this.bufferState,
            texturteState: this.textureState,
            renderHandler: renderHandler,
            uniformHandler: unifomrHandler,
            slotAttributeBufferIDMap: slotAttributeBufferIDMap,
            slotBindGroupMap: slotBindGroupMap,
            colorAttachments: desc.colorAttachments,
            depthStencilAttachment: desc.depthStencilAttachment
        });
    }

    /**
     * 
     * @param desc 
     */
    compileComputeHolder = (desc: ComputeHolderDesc): ComputeHolder => {
        const computeShader = desc.computeShader;

        if (!computeShader) {
            throw new Error(`[E][Compiler][compileComputeHolder] missing shader, computeShader: ${computeShader}`);
        }

        // parse uniform
        const uniformRecordMap: Map<string, IUniformRecord> = new Map();
        const bufferUniformRecordsMap: Map<number, Map<string, IUniformRecord>> = new Map();
        const unifomrHandler: UniformHandle = parseUniform({
            uniforms: desc.uniforms,
            uniformRecordMap: uniformRecordMap,
            bufferUniformRecordsMap: bufferUniformRecordsMap
        });

        // parse render holder bindgrouplayout
        const bindGroupLayouts: GPUBindGroupLayout[] = [];
        const gourpIDWithBindGroupLayoutMap: Map<number, GPUBindGroupLayout> = new Map();
        const gourpIDWithBindGroupLayoutDescriptorMap: Map<number, GPUBindGroupLayoutDescriptor> = new Map();
        parseComputeBindGroupLayout(
            this.ctx,
            computeShader,
            bindGroupLayouts,
            gourpIDWithBindGroupLayoutMap,
            gourpIDWithBindGroupLayoutDescriptorMap
        );

        // parse render dispatch
        const computeHandler: ComputeHandle = parseComputeDispatch(
            desc.dispatch
        );

        // parse compute program stage
        const computeProgrammableStage: GPUProgrammableStage = parseComputeProgrammableStage(
            computeShader
        );

        // parse pipeline layout
        const pipelineLayout: GPUPipelineLayout = parsePipelineLayout(
            this.ctx,
            bindGroupLayouts,
        );

        // emit uniform
        const slotBindGroupMap: Map<number, GPUBindGroup> = new Map();
        const mergedUniformResourceMap: Map<number, VariableInfo[]> = new Map();
        emitUniforms(
            {
                ctx: this.ctx,
                computeShader: computeShader,
                bufferState: this.bufferState,
                textureState: this.textureState,
                samplerState: this.samplerState,
                uniformRecordMap: uniformRecordMap,
                bufferIDUniformRecordsMap: bufferUniformRecordsMap,
                gourpIDWithBindGroupLayoutMap: gourpIDWithBindGroupLayoutMap,
                gourpIDWithBindGroupLayoutDescriptorMap: gourpIDWithBindGroupLayoutDescriptorMap
            },
            slotBindGroupMap,
            mergedUniformResourceMap
        );

        // emit compute pipeline
        const computePipeline = emitComputePipeline({
            computeProgrammableStage: computeProgrammableStage,
            pipelineLayout: pipelineLayout,
            pipelineState: this.pipelineState
        });

        //
        // TODO::   
        // dependeicese, includes input/output
        //

        return new ComputeHolder({
            id: uniqueID(),
            ctx: this.ctx,
            computePipeline: computePipeline,
            bufferState: this.bufferState,
            textureState: this.textureState,
            computeHandler: computeHandler,
            uniformHandler: unifomrHandler,
            slotBindGroupMap: slotBindGroupMap
        });
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createVertexBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray1DFormat,
            handler?: Handle1D,
        }
    ): VertexBuffer => {
        return this.bufferState.createVertexBuffer(opts);
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createIndexBuffer = (
        opts: {
            rawData: TypedArray1DFormat,
        }
    ): IndexBuffer => {
        if (opts.rawData.byteLength % 4 !== 0) {
            throw new Error(`[E][Compiler][createIndexBuffer] buffer bytelength must align with 4. current index buffer byte length: ${opts.rawData.byteLength}`);
        }
        return this.bufferState.createIndexBuffer(opts);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createUniformBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray1DFormat,
            handler?: Handle1D
        }
    ): UniformBuffer => {
        return this.bufferState.createUniformBuffer(opts);
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createStorageBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ): StorageBuffer => {
        return this.bufferState.createStorageBuffer(opts);
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createMapBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ): MapBuffer => {
        return this.bufferState.createMapBuffer(opts)
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createVertexShader = (
        opts: {
            code: string,
            entryPoint: string
        }
    ): VertexShader => {
        return this.shaderState.createVertexShader(opts);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createFragmentShader = (
        opts: {
            code: string,
            entryPoint: string
        }
    ): FragmentShader => {
        return this.shaderState.createFragmentShader(opts);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createComputeShader = (
        opts: {
            code: string,
            entryPoint: string
        }
    ): ComputeShader => {
        return this.shaderState.createComputeShader(opts);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createColorAttachment = (
        opts: {
            texture: BaseTexture,
            blendFormat?: BlendFormat,
            colorLoadStoreFormat?: ColorLoadStoreFormat,
            clearColor?: number[]
        }
    ): ColorAttachment => {
        return this.attachmentState.createColorAttachment(opts);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createDepthStencilAttachment = (
        opts: {
            texture: Texture2D,
            depthLoadStoreFormat?: DepthLoadStoreFormat,
            depthCompareFunction?: GPUCompareFunction,
            stencilFunctionFormat?: StencilStateFormat,
            stencilLoadStoreFormat?: StencilLoadStoreFormat,
            depthReadOnly?: boolean,
            stencilReadOnly?: boolean
        }
    ): DepthStencilAttachment => {
        return this.attachmentState.createDepthStencilAttachment(opts);
    }

    /**
     * 
     * @returns 
     * 
     */
    createSurfaceTexture2D = () => {
        return this.textureState.createSurfaceTexture2D();
    }

    /**
     * 
     */
    createTexture2D = (
        opts: {
            width: number,
            height: number,
            textureData?: TypedArray1DFormat,
            textureFormat?: GPUTextureFormat,
            maxMipLevel?: number,
        }
    ) => {
        return this.textureState.createTexutre2D(opts);
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    crateTexture2DArray = (
        opts: {
            width: number,
            height: number,
            array: number,
            appendixTextureUsages?: number,
            textureDataArray?: TypedArray2DFormat,
            handler?: Handle2D,
            textureFormat?: GPUTextureFormat,
            maxMipLevel?: number
        }
    ) => {
        return this.textureState.createTexture2DArray(opts);
    }

    createTextureSampler = (
        opts: {
            addressModeU?: GPUAddressMode,
            addressModeV?: GPUAddressMode,
            addressModeW?: GPUAddressMode,
            magFilter?: GPUFilterMode,
            minFilter?: GPUFilterMode,
            mipmapFilter?: GPUMipmapFilterMode,
            lodMinClamp?: number,
            lodMaxClamp?: number
            anisotropy?: number,
            compareFunction?: GPUCompareFunction,
        }
    ) => {
        return this.samplerState.createTextureSampler(opts);
    }

}

export {
    type RenderHolderDesc,
    type ComputeHolderDesc,
    Compiler
}