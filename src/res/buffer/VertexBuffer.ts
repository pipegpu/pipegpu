import { type Context } from "../Context"
import { type TypedArray1DFormat } from "../Format";
import { type Handle1D } from "./BaseBuffer"
import { Buffer1D } from "./Buffer1D";

/**
 * @class VertexBuffer
 */
class VertexBuffer extends Buffer1D {
    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            totalByteLength: number,
            typedArrayData1D?: TypedArray1DFormat,
            handler?: Handle1D
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            typedArrayData1D: opts.typedArrayData1D,
            handler: opts.handler
        });
    }
}

export {
    VertexBuffer
}