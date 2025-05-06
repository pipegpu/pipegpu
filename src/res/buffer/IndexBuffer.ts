import type { Context } from "../Context";
import { BaseBuffer } from "./BaseBuffer";

class IndexBuffer extends BaseBuffer {

    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            usageFlags: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        })
    }

}

export {
    IndexBuffer
}