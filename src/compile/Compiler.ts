import { RenderHolder } from "../holder/RenderHolder";
import type { RenderProperty } from "../property/dispatch/RenderProperty";
import type { Attributes, Uniforms } from "../property/Properties";
import type { Handle1D } from "../res/buffer/BaseBuffer";
import type { UniformBuffer } from "../res/buffer/UniformBuffer";
import type { VertexBuffer } from "../res/buffer/VertexBuffer";
import type { Context } from "../res/Context";
import type { TypedArray1DFormat } from "../res/Format";
import type { ComputeShader } from "../res/shader/ComputeShader";
import type { FragmentShader } from "../res/shader/FragmentShader";
import type { VertexShader } from "../res/shader/VertexShader";
import { BufferState } from "../state/BufferState";
import { ShaderState } from "../state/ShaderState";
import { StringState } from "../state/StringState";
import { parseAttribute } from "./parseAttribute";

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
    dispatch: RenderProperty,
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
    }

    compileRenderHolder = (desc: RenderHolderDesc): RenderHolder | undefined => {
        const vertexShader = desc.vertexShader, fragmentShader = desc.fragmentShader;
        if (!vertexShader || !fragmentShader) {
            console.log(`[E][Compiler][compileRenderHolder] missing shader, vertexShader: ${vertexShader}; fragmentShader:${fragmentShader}`);
            return undefined;
        }
        parseAttribute({});
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