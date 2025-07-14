import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat } from "../Format";
import { Buffer1D } from "./Buffer1D";

/**
 * 
 * @class IndexedBuffer
 * 
 */
class IndexedBuffer extends Buffer1D {
    /**
     * 
     */
    private indexFormat: GPUIndexFormat;

    /**
     * 
     */
    private drawCount: number;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            totalByteLength: number,
            typedArrayData1D: TypedArray1DFormat,
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            typedArrayData1D: opts.typedArrayData1D,
        });
        this.drawCount = this.typedArrayData1D!.byteLength / this.typedArrayData1D!.BYTES_PER_ELEMENT;
        if (this.typedArrayData1D! instanceof Int16Array) {
            this.indexFormat = 'uint16';
        } else if (this.typedArrayData1D! instanceof Int32Array) {
            this.indexFormat = 'uint32';
        } else {
            throw new Error(`[E][IndexBuffer][constructor] index data type error.`);
        }
    }

    /**
     * 
     * @returns {number}
     * 
     */
    getDrawCount = (): number => {
        return this.drawCount;
    }

    /**
     * 
     * @returns {GPUIndexFormat}
     * 
     */
    getIndexFormat = (): GPUIndexFormat => {
        return this.indexFormat;
    }

    /**
     * 
     * @param _encoder 
     * @param frameStage 
     */
    override getGpuBuffer = (_encoder: GPUCommandEncoder | null = null, _frameStage: FrameStageFormat = 'frameBegin'): GPUBuffer => {
        if (!this.buffer) {
            this.createGpuBuffer();
        }
        return this.buffer as GPUBuffer;
    }

}

export {
    IndexedBuffer
}