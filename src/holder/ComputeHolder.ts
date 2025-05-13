import type { Context } from "../res/Context";
import { BaseHolder } from "./BaseHolder";

/**
 * 
 */
class ComputeHolder extends BaseHolder {
    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            poropertyFormat: 'computeHolder'
        });
    }

    /**
     * 
     * @param encoder 
     */
    override build(encoder: GPUCommandEncoder): void {
        throw new Error("Method not implemented.");
    }
}

export {
    ComputeHolder
}