import type { Context } from "../res/Context"
import type { BaseShader } from "../res/shader/BaseShader";
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
        opts: {
            ctx: Context,
            stringState: StringState
        }
    ) {
        this.ctx = opts.ctx;
        this.stringState = opts.stringState;
    }

    hasKey = (key: number): boolean => {
        return ShaderState.CACHE.has(key);
    }

    /**
     * hash32a return uint32, ensure id = -1 is empty
     */
    createVertexShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): VertexShader => {
        if (!this.hasKey(id)) {
            const vertexShader = new VertexShader({
                ctx: this.ctx,
                code: opts.code,
                entryPoint: opts.entryPoint
            })
            id = vertexShader.getID();
            ShaderState.CACHE.set(id, vertexShader);

        }
        return ShaderState.CACHE.get(id) as VertexShader;
    }

    /**
     * 
     */
    createFragmentShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): FragmentShader => {
        if (!this.hasKey(id)) {
            const vertexShader = new FragmentShader({
                ctx: this.ctx,
                code: opts.code,
                entryPoint: opts.entryPoint
            })
            id = vertexShader.getID();
            ShaderState.CACHE.set(id, vertexShader);
        }
        return ShaderState.CACHE.get(id) as FragmentShader;
    }

    /**
     * 
     */
    createComputeShader = (
        opts: {
            code: string,
            entryPoint: string
        },
        id: number = -1
    ): ComputeShader => {
        if (!this.hasKey(id)) {
            const vertexShader = new ComputeShader({
                ctx: this.ctx,
                code: opts.code,
                entryPoint: opts.entryPoint
            })
            id = vertexShader.getID();
            ShaderState.CACHE.set(id, vertexShader);
        }
        return ShaderState.CACHE.get(id) as ComputeShader;
    }

}

export {
    ShaderState
}