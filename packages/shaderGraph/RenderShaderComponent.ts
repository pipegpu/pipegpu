import type { Compiler, Context } from "../../src";
import { BaseShaderComponent } from "./BaseShaderComponent";

/**
 * 
 */
class RenderShaderComponent extends BaseShaderComponent {
    /**
     * 
     * @param ctx 
     * @param compiler 
     */
    constructor(ctx: Context, compiler: Compiler) {
        super(ctx, compiler);
    }

    /**
     * 
     */
    build(): string {
        throw new Error("Method not implemented.");
    }
}

export {
    RenderShaderComponent
}