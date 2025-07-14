import type { Context } from "../Context";
import type { TypedArray2DFormat } from "../Format";
import type { Handle2D } from "./BaseBuffer";
import { StorageBuffer } from "./StorageBuffer";

/**
 * 
 * 
 */
class IndexedStorageBuffer extends StorageBuffer {

    constructor(
        opts: {
            id: number,
            ctx: Context,
            totalByteLength: number,
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            typedArrayData2D: opts.typedArrayData2D,
            handler: opts.handler,
        });
    }

}

export {
    IndexedStorageBuffer
}