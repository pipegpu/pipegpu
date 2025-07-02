import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray2DFormat } from "../Format";
import { BaseBuffer, type Handle2D } from "./BaseBuffer";

/**
 * 
 */
class StorageBuffer extends BaseBuffer {
    /**
     * 
     */
    protected handler: Handle2D | undefined;

    /**
     * 
     */
    protected typedArrayData2D: TypedArray2DFormat | undefined;

    /**
     * 
     */
    protected byteLength: number = 0;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            bufferUsageFlags: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
        this.handler = opts.handler;
        this.typedArrayData2D = opts.typedArrayData2D;
        if (this.handler === undefined && this.typedArrayData2D === undefined) {
            throw new Error(`[E][StorageBuffer] constructor error, opts.typedArrayData2D or opts.handler must be assign at least 1.`);
        }
    }

    /**
     * 
     */
    updateGpuBuffer = () => {
        let offset: number = 0;
        this.typedArrayData2D?.forEach(typedArray => {
            this.ctx?.getGpuQueue().writeBuffer(
                this.buffer as GPUBuffer,
                offset,
                typedArray?.buffer as ArrayBuffer,
                0,
                typedArray.byteLength
            );
            offset += typedArray.byteLength;
        });
    }

    /**
    * 
    */
    createGpuBuffer = () => {
        if (this.handler) {
            this.typedArrayData2D = this.handler();
        }
        this.byteLength = this.getByteLength();
        let desc: GPUBufferDescriptor = {
            size: this.byteLength,
            usage: this.bufferUsageFlags as GPUBufferUsageFlags
        };
        this.buffer = this.ctx!.getGpuDevice().createBuffer(desc);
        this.updateGpuBuffer();
    }

    /**
     * 
     */
    getByteLength(): number {
        let totalByteLength = 0;
        if (this.typedArrayData2D) {
            for (const typedArray of this.typedArrayData2D) {
                totalByteLength += typedArray.byteLength;
            }
        }
        return totalByteLength;
    }

    /**
     * 
     * @param _encoder 
     * @param _frameStage 
     */
    override getGpuBuffer(_encoder: GPUCommandEncoder, _frameStage: FrameStageFormat): GPUBuffer {
        if (!this.buffer) {
            this.createGpuBuffer();
        } else {
            if (_frameStage === "frameBegin" && this.handler) {
                this.typedArrayData2D = this.handler();
                this.updateGpuBuffer();
            }
        }
        return this.buffer as GPUBuffer;
    }
}

export {
    StorageBuffer
}