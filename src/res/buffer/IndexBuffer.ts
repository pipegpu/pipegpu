import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat } from "../Format";
import { BaseBuffer } from "./BaseBuffer";

/**
 * 
 */
class IndexBuffer extends BaseBuffer {
    /**
     * 
     */
    private typedArrayData1D: TypedArray1DFormat;

    /**
     * 
     */
    private byte_length: number = 0;

    /**
     * 
     */
    private indexFormat: GPUIndexFormat;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            indexFormat: GPUIndexFormat,
            typedArrayData1D: TypedArray1DFormat,
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            bufferUsageFlags: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        });
        this.typedArrayData1D = opts.typedArrayData1D;
        this.indexFormat = opts.indexFormat;
    }

    /**
     * 
     * @returns 
     */
    getIndexCount = (): number => {
        if (this.typedArrayData1D) {
            return this.typedArrayData1D.byteLength / this.typedArrayData1D.BYTES_PER_ELEMENT;
        } else {
            return 0;
        }
    }

    /**
     * 
     */
    createGpuBuffer = () => {
        this.byte_length = this.typedArrayData1D?.byteLength as number;
        let desc: GPUBufferDescriptor = {
            size: this.byte_length,
            usage: this.bufferUsageFlags as GPUBufferUsageFlags
        };
        this.buffer = this.ctx?.getGpuDevice().createBuffer(desc);
        this.updateGpuBuffer();
    }

    /**
     * 
     */
    updateGpuBuffer = () => {
        this.ctx?.getGpuQueue().writeBuffer(
            this.buffer as GPUBuffer,
            0,
            this.typedArrayData1D?.buffer as ArrayBuffer,
            0,
            this.byte_length
        );
    }

    /**
     * 
     * @returns 
     */
    getIndexFormat = (): GPUIndexFormat => {
        return this.indexFormat;
    }

    /**
     * 
     * @returns 
     */
    override getByteLength(): number {
        return this.byte_length;
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
    IndexBuffer
}