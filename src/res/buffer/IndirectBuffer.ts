import type { Context } from "../Context";
import { StorageBuffer } from "./StorageBuffer";

/**
 * 
 */
class IndirectBuffer extends StorageBuffer {
    /**
     * 
     * @param opts 
     */
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

    /**
     * 
     */
    getByteLength(): number {
        throw new Error("Method not implemented.");
    }
}

export {
    IndirectBuffer
}