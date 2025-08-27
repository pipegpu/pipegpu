import { type Context } from "../Context";
import { type TypedArray1DFormat } from "../Format";
import { type Handle1DBffer } from "./BaseBuffer";
import { Buffer1D } from "./Buffer1D";

/**
 * 
 */
class UniformBuffer extends Buffer1D {

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            totalByteLength: number,
            typedArrayData1D?: TypedArray1DFormat,
            handler?: Handle1DBffer
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            typedArrayData1D: opts.typedArrayData1D,
            handler: opts.handler
        });
    }

}

export {
    UniformBuffer
}