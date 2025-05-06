import type { Context } from "../Context";
import { BaseBuffer } from "./BaseBuffer";

class StorageBuffer extends BaseBuffer {

    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            bufferUsageFlags: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        })
    }

}

export {
    StorageBuffer
}