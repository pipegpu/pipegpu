import { reflectShaderUniforms } from "../../util/reflectShaderUniforms";
import type { Context } from "../Context";
import { BaseShader } from "./BaseShader";

class FragmentShader extends BaseShader {

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
            shaderStage: GPUShaderStage.FRAGMENT
        });
    }

    /**
     * 
     */
    protected override reflect = (): void => {
        this.createGpuShader(`[FragmentShader][ID][${this.getID()}]`);
        this.reflectedUniforms = reflectShaderUniforms(this.code, this.entryPoint, this.shaderStage);
    }

}

export {
    FragmentShader
}