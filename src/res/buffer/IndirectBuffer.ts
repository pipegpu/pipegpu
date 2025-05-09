import type { Context } from "../Context";
import { BaseBuffer } from "./BaseBuffer";
import { StorageBuffer } from "./StorageBuffer";

class IndirectBuffer extends StorageBuffer {

    constructor(
        opts: {
            id: number,
            ctx: Context,
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx
        });
        this.bufferUsageFlags |= GPUBufferUsage.INDIRECT;
    }

}

export {
    IndirectBuffer
}