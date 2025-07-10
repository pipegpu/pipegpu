import { type Context } from "../Context";
import { type TypedArray2DFormat } from "../Format";
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
            totalByteLength: number,
            typedArrayData2D: TypedArray2DFormat,
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
            typedArrayData2D: opts.typedArrayData2D,
        });
    }

}

export {
    IndirectBuffer
}