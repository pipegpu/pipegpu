import type { Context } from "../Context";
import { BaseBuffer } from "./BaseBuffer";

class UniformBuffer extends BaseBuffer {

    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            bufferUsageFlags: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        })
    }

}

export {
    UniformBuffer
}