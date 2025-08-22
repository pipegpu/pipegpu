import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat, TypedArray2DFormat } from "../Format";
import { BaseBuffer, type Handle2D } from "./BaseBuffer";

/**
 * 
 * @class Buffer2D
 * 
 */
class Buffer2D extends BaseBuffer {

    /**
     * 
     */
    protected handler?: Handle2D;

    /**
     * 
     */
    protected typedArrayData2D?: TypedArray2DFormat;

    /**
     * 
     * @param {number}              opts.id 
     * @param {Context}             opts.context
     * @param {number}              opts.totalByteLength
     * @param {GPUBufferUsageFlags} opts.bufferUsageFlags
     * @param {TypedArray2DFormat}  opts.typedArrayData2D
     * @param {Handle2D}            opts.handler
     * 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            totalByteLength: number,
            bufferUsageFlags: GPUBufferUsageFlags
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2D,
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: opts.bufferUsageFlags | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.typedArrayData2D = opts.typedArrayData2D;
        this.handler = opts.handler;
        //
        // if (this.handler === undefined && this.typedArrayData2D === undefined) {
        //     throw new Error(`[E][Buffer2D][constructor] create buffer error, either opts.handler or opts.typedArrayData2D must be assigned a value.`);
        // }
    }

    /**
     * 
     * @param {number}              offset
     * @param {number}              byteLength
     * @param {TypedArray1DFormat}  rawData
     * 
     */
    protected updateGpuBuffer = (offset: number, byteLength: number, rawData: TypedArray1DFormat | ArrayBuffer) => {
        if (offset + byteLength > this.totalByteLength || rawData.byteLength > this.totalByteLength) {
            throw new Error(`[E][VertexBuffer][updateGpuBuffer] buffer bytelength oversized, maximum bytelength: ${this.totalByteLength}`);
        }
        // rawdata perphaps typeof ArrayBuffer
        this.context?.getGpuQueue().writeBuffer(
            this.buffer as GPUBuffer,
            offset,
            rawData,
            0
        );
    }

    /**
     * 
     * create gpu buffer
     * - with maximum byte length.
     * - write data if typedArrayData2D is valid.
     * - wirte data if handler is valid.
     * 
     */
    protected createGpuBuffer = () => {
        if (!this.buffer) {
            const desc: GPUBufferDescriptor = {
                size: this.totalByteLength,
                usage: this.bufferUsageFlags as GPUBufferUsageFlags
            };
            this.buffer = this.context!.getGpuDevice().createBuffer(desc);
        }
        if (this.typedArrayData2D) {
            let offset: number = 0;
            this.typedArrayData2D?.forEach(typedArray => {
                this.updateGpuBuffer(offset, typedArray.byteLength, typedArray);
                offset += typedArray.byteLength;
            });
        } else if (this.handler) {
            const handData = this.handler();
            if (handData.rewrite) {
                handData.details.forEach(detail => {
                    this.updateGpuBuffer(detail.offset, detail.byteLength, detail.rawData);
                });
            }
        } else {
            console.warn(`[I][Buffer2D] empty source data.`)
        }
    }

    override getGpuBuffer(_encoder?: GPUCommandEncoder | null, frameStage?: FrameStageFormat): GPUBuffer {
        if (!this.buffer) {
            this.createGpuBuffer();
        } else {
            if (frameStage === "frameBegin" && this.handler) {
                const handData = this.handler();
                if (handData.rewrite) {
                    handData.details.forEach(detail => {
                        this.updateGpuBuffer(detail.offset, detail.byteLength, detail.rawData);
                    });
                }
            }
        }
        return this.buffer as GPUBuffer;
    }

}

export {
    Buffer2D
}