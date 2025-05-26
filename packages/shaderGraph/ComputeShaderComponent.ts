import type { Compiler, Context } from "../../src";
import { BaseShaderComponent } from "./BaseShaderComponent";

/**
 * 
 */
class ComputeShaderComponent extends BaseShaderComponent {
    /**
     * 
     */
    private wrokGrpupX: number = 0;

    /**
     * 
     */
    private wrokGrpupY: number = 0;

    /**
     * 
     */
    private wrokGrpupZ: number = 0;

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
     * @returns 
     */
    getWorkGroupX(): number {
        return this.wrokGrpupX;
    }

    /**
     * 
     * @returns 
     */
    getWrokGrpupY(): number {
        return this.wrokGrpupY;
    }

    /**
     * 
     * @returns 
     */
    getWrokGrpupZ(): number {
        return this.wrokGrpupZ;
    }

    /**
     * 
     */
    build(): string {
        throw new Error("Method not implemented.");
    }
}

export {
    ComputeShaderComponent
}