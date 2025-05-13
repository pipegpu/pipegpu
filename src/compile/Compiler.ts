import type { VariableInfo } from "wgsl_reflect";
import type { ComputeHolder } from "../holder/ComputeHolder";
import { RenderHolder } from "../holder/RenderHolder";
import type { ComputeProperty } from "../property/dispatch/ComputeProperty";
import type { RenderProperty } from "../property/dispatch/RenderProperty";
import type { Attributes, Uniforms } from "../property/Properties";
import type { ColorAttachment } from "../res/attachment/ColorAttachment";
import type { DepthStencilAttachment } from "../res/attachment/DepthStencilAttachment";
import type { Handle1D } from "../res/buffer/BaseBuffer";
import type { UniformBuffer } from "../res/buffer/UniformBuffer";
import type { VertexBuffer } from "../res/buffer/VertexBuffer";
import type { Context } from "../res/Context";
import type { BlendFormat, ColorLoadStoreFormat, DepthLoadStoreFormat, FrameStageFormat, MultiSampleFormat, StencilLoadStoreFormat, StencilStateFormat, TypedArray1DFormat } from "../res/Format";
import type { RenderHandle } from "../res/Handle";
import type { ComputeShader } from "../res/shader/ComputeShader";
import type { FragmentShader } from "../res/shader/FragmentShader";
import type { VertexShader } from "../res/shader/VertexShader";
import { BufferState } from "../state/BufferState";
import { ShaderState } from "../state/ShaderState";
import { StringState } from "../state/StringState";
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

/**
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
    attributes: Attributes,

    /**
     * 
     */
    uniforms: Uniforms,

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
    primitiveDesc: PrimitiveDesc,

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
 * 
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
 * @param _frameStage 
 * @param _encoder 
 * @param _bufferState 
 * @param _textureState 
 */
const _emptyUniformHandler: UniformHandle = (_frameStage: FrameStageFormat, _encoder: GPUCommandEncoder, _bufferState: BufferState, _textureState: TextureState): void => { }

/**
 * 
 * @param encoder 
 */
const _emptyRenderHandler: RenderHandle = (_encoder: GPURenderPassEncoder): void => { };

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
    private stringState: StringState;

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
        this.stringState = new StringState();
        this.bufferState = new BufferState(this.ctx);
        this.shaderState = new ShaderState(this.ctx, this.stringState);
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
    compileRenderHolder = (desc: RenderHolderDesc): RenderHolder | undefined => {
        const vertexShader = desc.vertexShader, fragmentShader = desc.fragmentShader;

        if (!vertexShader || !fragmentShader) {
            console.log(`[E][Compiler][compileRenderHolder] missing shader, vertexShader: ${vertexShader}; fragmentShader:${fragmentShader}`);
            return undefined;
        }

        // parse attribute
        const attributeRecordMap: Map<string, IAttributeRecord> = new Map();
        const bufferAttributeRecordsMap: Map<number, Map<string, IAttributeRecord>> = new Map();
        parseAttribute(
            desc.attributes,
            attributeRecordMap,
            bufferAttributeRecordsMap
        );

        // parse uniform
        let unifomrHandler: UniformHandle = _emptyUniformHandler;
        const uniformRecordMap: Map<string, IUniformRecord> = new Map();
        const bufferUniformRecordsMap: Map<number, Map<string, IUniformRecord>> = new Map();
        parseUniform(
            unifomrHandler,
            desc.uniforms,
            uniformRecordMap,
            bufferUniformRecordsMap
        );

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
        let renderHandler: RenderHandle = _emptyRenderHandler;
        parseRenderDispatch(
            this.bufferState,
            desc.dispatch,
            renderHandler
        );

        // parse multi sample state
        let multiSampleState: GPUMultisampleState = parseMultisampleState(
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
        );

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
    compileComputeHolder = (desc: ComputeHolderDesc): ComputeHolder | undefined => {
        const computeShader = desc.computeShader;
        if (!computeShader) {
            console.log(`[E][Compiler][compileComputeHolder] missing shader, computeShader: ${computeShader}`);
            return undefined;
        }
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createVertexBuffer = (
        opts: {
            rawData?: TypedArray1DFormat,
            handler?: Handle1D,
        },
        id: number = -1
    ): VertexBuffer => {
        return this.bufferState.createVertexBuffer(opts, id);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createUniformBuffer = (
        opts: {
            rawData?: TypedArray1DFormat,
            handler?: Handle1D
        },
        id: number = -1
    ): UniformBuffer => {
        return this.bufferState.createUniformBuffer(opts, id);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createVertexShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): VertexShader => {
        return this.shaderState.createVertexShader(opts, id);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createFragmentShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): FragmentShader => {
        return this.shaderState.createFragmentShader(opts, id);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createComputeShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): ComputeShader => {
        return this.shaderState.createComputeShader(opts, id);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createColorAttachment = (
        opts: {
            texture: BaseTexture,
            blendFormat?: BlendFormat,
            colorLoadStoreFormat?: ColorLoadStoreFormat,
            clearColor?: number[]
        },
        id: number = 0
    ): ColorAttachment => {
        return this.attachmentState.createColorAttachment(opts, id);
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
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
        },
        id: number = 0
    ): DepthStencilAttachment => {
        return this.attachmentState.createDepthStencilAttachment(opts, id);
    }

    /**
     * 
     * @returns 
     */
    createSurfaceTexture = () => {
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
            maxMipLevel?: number
        }
    ) => {
        return this.textureState.createTexutre2D(opts);
    }
}

export {
    type RenderHolderDesc,
    Compiler
}