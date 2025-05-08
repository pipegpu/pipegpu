import type { Context } from "../res/Context";
import type { ComputeShader } from "../res/shader/ComputeShader";
import type { FragmentShader } from "../res/shader/FragmentShader";
import type { VertexShader } from "../res/shader/VertexShader";
import { BufferState } from "../state/BufferState";
import { ShaderState } from "../state/ShaderState";
import { StringState } from "../state/StringState";

// interface RenderHolderDesc {
//     debugLable: string,
//     vertexShader: VertexShader,
//     fragmentShader: FragmentShader,
// attributes:Map<string,

// }

// interface ComputeHolderDesc {

// }

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

    createVertexShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): VertexShader => {
        return this.shaderState.createVertexShader(opts, id);
    }

    createFragmentShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): FragmentShader => {
        return this.shaderState.createFragmentShader(opts, id);
    }

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
    Compiler
}