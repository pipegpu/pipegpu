import type { Context } from "../res/Context"
import { BaseShader } from "../res/shader/BaseShader";
import { ComputeShader } from "../res/shader/ComputeShader";
import { FragmentShader } from "../res/shader/FragmentShader";
import { VertexShader } from "../res/shader/VertexShader";
import type { StringState } from "./StringState";

/**
 * 
 */
class ShaderState {

    /**
     * 
     */
    private static CACHE: Map<number, BaseShader> = new Map();

    /**
     * 
     */
    private ctx: Context;

    /**
     * 
     */
    private stringState: StringState;

    /**
     * 
     * @param opts 
     */
    constructor(
        ctx: Context,
        stringState: StringState
    ) {
        this.ctx = ctx;
        this.stringState = stringState;
    }

    /**
     * 
     * @param key 
     * @returns 
     */
    hasKey = (key: number): boolean => {
        return ShaderState.CACHE.has(key);
    }

    /**
     * hash32a return uint32
     */
    createVertexShader = (
        opts: {
            code: string,
            entryPoint: string
        }
    ): VertexShader => {
        const shaderID: number = BaseShader.hash32aID(opts.code, opts.entryPoint);
        if (!ShaderState.CACHE.has(shaderID)) {
            const shader = new VertexShader({
                ctx: this.ctx,
                code: opts.code,
                entryPoint: opts.entryPoint
            });
            ShaderState.CACHE.set(shaderID, shader);
        }
        return ShaderState.CACHE.get(shaderID) as VertexShader;
    }

    /**
     * 
     */
    createFragmentShader = (
        opts: {
            code: string,
            entryPoint: string
        }
    ): FragmentShader => {
        const shaderID: number = BaseShader.hash32aID(opts.code, opts.entryPoint);
        if (!ShaderState.CACHE.has(shaderID)) {
            const shader = new FragmentShader({
                ctx: this.ctx,
                code: opts.code,
                entryPoint: opts.entryPoint
            });
            ShaderState.CACHE.set(shaderID, shader);
        }
        return ShaderState.CACHE.get(shaderID) as FragmentShader;
    }

    /**
     * 
     */
    createComputeShader = (
        opts: {
            code: string,
            entryPoint: string
        }
    ): ComputeShader => {
        const shaderID: number = BaseShader.hash32aID(opts.code, opts.entryPoint);
        if (!ShaderState.CACHE.has(shaderID)) {
            const shader = new ComputeShader({
                ctx: this.ctx,
                code: opts.code,
                entryPoint: opts.entryPoint
            });
            ShaderState.CACHE.set(shaderID, shader);
        }
        return ShaderState.CACHE.get(shaderID) as ComputeShader;
    }

}

export {
    ShaderState
}