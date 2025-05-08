import type { Context } from "../Context";
import { BaseShader } from "./BaseShader";

class VertexShader extends BaseShader {

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
            shaderStage: GPUShaderStage.VERTEX
        });
    }

}

export {
    VertexShader
}