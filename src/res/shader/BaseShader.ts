import { hash32a } from "../../util/hash32a";
import type { Context } from "../Context"

/**
 * 
 */
class BaseShader {

    /**
     * 
     */
    private ctx: Context | null | undefined;

    /**
     * 
     */
    private shaderStage: GPUFlagsConstant;

    /**
     * 
     */
    private id: number;

    /**
     * @param opts.id a combined of string with hash value
     * 
     */
    constructor(
        opts: {
            ctx: Context,
            shaderStage: GPUFlagsConstant,
            code: string,
            entryPoint: string
        }
    ) {
        this.ctx = opts.ctx;
        this.shaderStage = opts.shaderStage;
        this.id = hash32a(`${opts.code}-${opts.entryPoint}`);
    }

    /**
     * 
     * @returns 
     */
    getID = (): number => {
        return this.id;
    }

}

export {
    BaseShader
}