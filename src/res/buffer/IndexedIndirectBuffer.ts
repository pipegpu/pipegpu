import type { Context } from "../Context";
import type { TypedArray2DFormat } from "../Format";
import { StorageBuffer } from "./StorageBuffer";

/**
 * 
 * https://gpuweb.github.io/gpuweb/#dom-gpurendercommandsmixin-drawindexedindirect
 *   
 * - index_count { 0 };
 * - instance_count { 1 };
 * - first_index { 0 };
 * - vertex_offset { 0 };
 * - first_instance { 0 };
 * 
 */
class IndexedIndirectBuffer extends StorageBuffer {

    constructor(
        opts: {
            id: number,
            ctx: Context,
            totalByteLength: number,
            typedArrayData2D?: TypedArray2DFormat
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

    getStride = (): number => {
        return 5 * 4;
    }

    getOffset = (): number => {
        return 0;
    }

    getIndexIndirectCount = (): number => {
        return this.typedArrayData2D?.length || 0;
    }

}

export {
    IndexedIndirectBuffer
}