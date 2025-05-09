import { RenderHolder } from "../holder/RenderHolder";
import type { RenderProperty } from "../property/dispatch/RenderProperty";
import type { Attributes, Uniforms } from "../property/Properties";
import type { Handle1D } from "../res/buffer/BaseBuffer";
import type { UniformBuffer } from "../res/buffer/UniformBuffer";
import type { VertexBuffer } from "../res/buffer/VertexBuffer";
import type { Context } from "../res/Context";
import type { FrameStageFormat, MultiSampleFormat, TypedArray1DFormat } from "../res/Format";
import type { RenderHandle } from "../res/Handle";
import type { ComputeShader } from "../res/shader/ComputeShader";
import type { FragmentShader } from "../res/shader/FragmentShader";
import type { VertexShader } from "../res/shader/VertexShader";
import { BufferState } from "../state/BufferState";
import { ShaderState } from "../state/ShaderState";
import { StringState } from "../state/StringState";
import { TextureState } from "../state/TextureState";
import { parseAttribute, type IAttributeRecord } from "./parseAttribute";
import { parseMultisampleState } from "./parseMultiSampleState";
import { parseRenderBindGroupLayout } from "./parseRenderBindGroupLayout";
import { parseRenderDispatch } from "./parseRenderDispatch";
import { parseUniform, type IUniformRecord, type UniformHandle } from "./parseUniform";

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

    // colorAttachments: Coloratt
}

/**
 * 
 */
interface ComputeHolderDesc {
    label: string,
    computeShader: ComputeShader,
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
     * @param opts 
     */
    constructor(
        opts: {
            ctx: Context
        }
    ) {
        this.ctx = opts.ctx;
        this.stringState = new StringState();
        this.bufferState = new BufferState({ ctx: this.ctx });
        this.shaderState = new ShaderState({ ctx: this.ctx, stringState: this.stringState });
        this.textureState = new TextureState({ ctx: this.ctx });
    }

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
        let multiSampleState: GPUMultisampleState = {};
        parseMultisampleState(
            desc.multiSampleFormat || '1x',
            multiSampleState
        );




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

}

export {
    type RenderHolderDesc,
    Compiler
}