import { BaseBuffer, type Handle1D } from "./BaseBuffer";
import type { Context } from "../Context"
import type { FrameStageFormat, TypedArray1DFormat } from "../Format";

/**
 * 
 */
class Buffer1D extends BaseBuffer {
    /**
     * 
     */
    protected handler?: Handle1D;

    /**
    * 
    */
    protected typedArrayData1D?: TypedArray1DFormat;

    /**
     * 
     * @param {number}              opts.id 
     * @param {Context}             opts.ctx
     * @param {number}              opts.totalByteLength
     * @param {GPUBufferUsageFlags} opts.bufferUsageFlags
     * @param {TypedArray1DFormat}  [opts.typedArrayData1D] - either opts.handler or opts.typedArrayData1D must be assigned a value.
     * @param {Handle1D}            [opts.handler]          - either opts.handler or opts.typedArrayData1D must be assigned a value.
     * 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            totalByteLength: number,
            bufferUsageFlags: GPUBufferUsageFlags
            typedArrayData1D?: TypedArray1DFormat,
            handler?: Handle1D,
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            bufferUsageFlags: opts.bufferUsageFlags,
            totalByteLength: opts.totalByteLength,
        });
        this.handler = opts.handler;
        this.typedArrayData1D = opts.typedArrayData1D;
        if (!this.handler && !this.typedArrayData1D) {
            throw new Error(`[E][Buffer1D][constructor] create buffer error, either opts.handler or opts.typedArrayData1D must be assigned a value.`);
        }
    }

    /**
     * 
     * @param {number}              offset
     * @param {number}              byteLength
     * @param {TypedArray1DFormat}  rawData
     * 
     */
    protected updateGpuBuffer = (offset: number, byteLength: number, rawData: TypedArray1DFormat) => {
        if (offset + byteLength > this.totalByteLength || rawData.byteLength > this.totalByteLength) {
            throw new Error(`[E][VertexBuffer][updateGpuBuffer] buffer bytelength oversized, maximum bytelength: ${this.totalByteLength}`);
        }
        this.ctx?.getGpuQueue().writeBuffer(
            this.buffer as GPUBuffer,
            offset,
            rawData.buffer as ArrayBuffer,
            0,
            byteLength
        );
    }

    /**
     * 
     */
    protected createGpuBuffer = () => {
        if (!this.buffer) {
            const desc: GPUBufferDescriptor = {
                size: this.totalByteLength,
                usage: this.bufferUsageFlags as GPUBufferUsageFlags
            };
            this.buffer = this.ctx!.getGpuDevice().createBuffer(desc);
        }
        if (this.typedArrayData1D) {
            this.updateGpuBuffer(0, this.typedArrayData1D!.byteLength, this.typedArrayData1D!);
        } else if (this.handler) {
            const handData = this.handler();
            if (handData.rewrite) {
                this.updateGpuBuffer(handData.detail.offset, handData.detail.byteLength, handData.detail.rawData);
            }
        } else {
            throw new Error(`[E][Buffer1D][createGpuBuffer] create gpu buffer. unsupport source data array.`);
        }
    }

    /**
     * 
     * @param {(GPUCommandEncoder|null)} encoder 
     * @param {FrameStageFormat} frameStage 
     * 
     */
    override getGpuBuffer(_encoder: GPUCommandEncoder | null, frameStage: FrameStageFormat): GPUBuffer {
        if (!this.buffer) {
            this.createGpuBuffer();
        } else {
            if (frameStage === "frameBegin" && this.handler) {
                const handData = this.handler();
                if (handData.rewrite) {
                    this.updateGpuBuffer(handData.detail.offset, handData.detail.byteLength, handData.detail.rawData);
                }
            }
        }
        return this.buffer as GPUBuffer;
    }

}

export {
    Buffer1D
}