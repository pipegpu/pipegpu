import type { Context } from "../Context"
import { BaseBuffer } from "./BaseBuffer"

class VertexBuffer extends BaseBuffer {

    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            usageFlags: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        })
    }

}

export {
    VertexBuffer
}