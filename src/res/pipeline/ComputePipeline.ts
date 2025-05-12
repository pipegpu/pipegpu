import type { Context } from "../Context";
import { BasePipeline } from "./BasePipeline";

class ComputePipeline extends BasePipeline {
    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            propertyFormat: 'ComputePipeline'
        });
    }
}

export {
    ComputePipeline
}