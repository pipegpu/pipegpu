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
    constructor(
        opts: {
            id: number,
            ctx: Context,
            shaderStage: GPUFlagsConstant,
            code: string,
            entryPoint: string
        }
    ) {
        this.ctx = opts.ctx;
        this.shaderStage = opts.shaderStage;
    }

}

export {
    BaseShader
}