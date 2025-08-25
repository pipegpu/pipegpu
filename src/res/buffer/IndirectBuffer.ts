import { type Context } from "../Context";
import { type TypedArray2DFormat } from "../Format";
import type { Handle2D } from "./BaseBuffer";
import { StorageBuffer } from "./StorageBuffer";

/**
 * 
 * ref:
 * https://toji.dev/webgpu-best-practices/indirect-draws.html
 * 
 * - vertex_count { 0 };
 * - instance_count { 1 };
 * - first_vertex { 0 };
 * - first_instance { 0 };
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
            context: Context,
            totalByteLength: number,
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2D,
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
            typedArrayData2D: opts.typedArrayData2D,
            handler: opts.handler,
        });
        // check total bytelength align by 16.
        if (this.totalByteLength % 16 !== 0) {
            throw new Error(`[E][IndirectBuffer] indirect buffer align byte length is 16, please cheack buffer total byte length. current total byte length: ${this.totalByteLength}`);
        }
    }

    getStride = (): number => {
        return 4 * 4;
    }

    getOffset = (): number => {
        return 0;
    }

    getIndexIndirectCount = (): number => {
        return this.typedArrayData2D?.length || 0;
    }

}

export {
    IndirectBuffer
}