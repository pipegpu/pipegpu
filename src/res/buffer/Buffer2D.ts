import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat, TypedArray2DFormat } from "../Format";
import type { BufferArrayHandle } from "../Handle";
import { BaseBuffer } from "./BaseBuffer";

/**
 * 
 * @class Buffer2D
 * 
 */
class Buffer2D extends BaseBuffer {

    /**
     * 
     */
    protected handler?: BufferArrayHandle;

    /**
     * 
     */
    protected rawDataArray?: TypedArray2DFormat | Array<ArrayBuffer>;

    /**
     * 
     * @param {number}              opts.id 
     * @param {Context}             opts.context
     * @param {number}              opts.totalByteLength
     * @param {GPUBufferUsageFlags} opts.bufferUsageFlags
     * @param {TypedArray2DFormat}  opts.typedArrayData2D
     * @param {BufferArrayHandle}            opts.handler
     * 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            totalByteLength: number,
            bufferUsageFlags: GPUBufferUsageFlags
            rawData?: TypedArray2DFormat | Array<ArrayBuffer>,
            handler?: BufferArrayHandle,
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: opts.bufferUsageFlags | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.rawDataArray = opts.rawData;
        this.handler = opts.handler;
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
            // rawData instanceof ArrayBuffer ? rawData : rawData.buffer,
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
        if (this.rawDataArray) {
            let offset: number = 0;
            this.rawDataArray?.forEach(typedArray => {
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
        }
    }

    /**
     * 
     * @param _encoder 
     * @param frameStage 
     * @returns 
     * 
     */
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