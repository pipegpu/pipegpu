import type { Context } from "../Context";
import type { TypedArray2DFormat } from "../Format";
import type { Handle2DBuffer } from "./BaseBuffer";
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

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            totalByteLength: number,
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2DBuffer,
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
            rawData2D: opts.typedArrayData2D,
            handler: opts.handler
        });
        // check total bytelength align by 20.
        if (this.totalByteLength % 20 !== 0) {
            throw new Error(`[E][IndirectBuffer] indexed indirect buffer align byte length is 20, please cheack buffer total byte length. current total byte length: ${this.totalByteLength}`);
        }
    }

    /**
     * 
     * @returns 
     */
    getStride = (): number => {
        return 5 * 4;
    }

    /**
     * 
     * @returns 
     */
    getOffset = (): number => {
        return 0;
    }

    /**
     * 
     * @returns 
     */
    getIndexIndirectCount = (): number => {
        return this.rawData2D?.length || 0;
    }

}

export {
    IndexedIndirectBuffer
}