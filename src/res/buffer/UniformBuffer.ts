import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat } from "../Format";
import { BaseBuffer, type Handle1D } from "./BaseBuffer";

/**
 * 
 */
class UniformBuffer extends BaseBuffer {
    /**
     * 
     */
    private handler: Handle1D | undefined;

    /**
     * 
     */
    private typedArrayData1D: TypedArray1DFormat | undefined;

    /**
     * 
     */
    private byte_length: number = 0;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            typedArrayData1D?: TypedArray1DFormat,
            handler?: Handle1D
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            bufferUsageFlags: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        this.handler = opts.handler;
        this.typedArrayData1D = opts.typedArrayData1D;
        if (this.handler === undefined && this.typedArrayData1D === undefined) {
            throw new Error(`[E][UniformBuffer] constructor error, opts.typedArrayData1D or opts.handler must be assign at least 1.`);
        }
    }

    /**
     * 
     */
    updateGpuBuffer = () => {
        // this.typedArrayData1D?.byteLength
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
     */
    createGpuBuffer = () => {
        if (this.handler) {
            this.typedArrayData1D = this.handler();
        }
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
     * @param _encoder 
     * @param frameStage 
     */
    override getGpuBuffer = (_encoder: GPUCommandEncoder, frameStage: FrameStageFormat): GPUBuffer => {
        if (!this.buffer) {
            this.createGpuBuffer();
        } else {
            // vertex buffer only need update once in each frame at begin stage
            if (frameStage === "frameBegin" && this.handler) {
                this.typedArrayData1D = this.handler();
                this.updateGpuBuffer();
            }
        }
        return this.buffer as GPUBuffer;
    }

    /**
     * 
     */
    override getByteLength = (): number => {
        return this.byte_length;
    }
}

export {
    UniformBuffer
}