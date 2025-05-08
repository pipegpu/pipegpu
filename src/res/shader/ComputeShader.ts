import type { Context } from "../Context";
import { BaseShader } from "./BaseShader";

class ComputeShader extends BaseShader {

    constructor(
        opts: {
            ctx: Context,
            code: string,
            entryPoint: string
        }
    ) {
        super({
            ctx: opts.ctx,
            code: opts.code,
            entryPoint: opts.entryPoint,
            shaderStage: GPUShaderStage.COMPUTE
        });
    }

}

export {
    ComputeShader
}