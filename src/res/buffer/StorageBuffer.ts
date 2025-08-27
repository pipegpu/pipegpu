import { type Context } from "../Context";
import { type TypedArray2DFormat } from "../Format";
import { type Handle2DBuffer } from "./BaseBuffer";
import { Buffer2D } from "./Buffer2D";

/**
 * 
 * @class StorageBuffer
 * 
 */
class StorageBuffer extends Buffer2D {

    /**
     * 
     * @param {number}              opts.id
     * @param {Context}             opts.context
     * @param {number}              opts.totalByteLength
     * @param {GPUBufferUsageFlags} opts.bufferUsageFlags
     * @param {TypedArray2DFormat}  opts.typedArrayData2D
     * @param {Handle2DBuffer}            opts.handler
     * 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            totalByteLength: number,
            bufferUsageFlags?: GPUBufferUsageFlags
            rawData2D?: TypedArray2DFormat,
            handler?: Handle2DBuffer
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: opts.bufferUsageFlags || GPUBufferUsage.STORAGE | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            rawData2D: opts.rawData2D,
            handler: opts.handler
        });
    }

}

export {
    StorageBuffer
}