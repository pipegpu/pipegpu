import type { Context } from "../Context";
import { BaseShader } from "./BaseShader";

class FragmentShader extends BaseShader {
    constructor(
        opts: {
            id: number,
            ctx: Context,
            code: string,
            entryPoint: string
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            code: opts.code,
            entryPoint: opts.entryPoint,
            shaderStage: GPUShaderStage.FRAGMENT
        });
    }

}

export {
    FragmentShader
}