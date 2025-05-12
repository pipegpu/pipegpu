import type { Context } from "../Context"
import type { FrameStageFormat, TypedArray1DFormat } from "../Format";
import { BaseBuffer, type Handle1D } from "./BaseBuffer"

/**
 * 
 */
class VertexBuffer extends BaseBuffer {
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
            bufferUsageFlags: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        this.handler = opts.handler;
        this.typedArrayData1D = opts.typedArrayData1D;
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
     * @returns 
     */
    needUpdate = (): boolean => {
        if (this.handler !== undefined) {
            this.typedArrayData1D = this.handler();
        }
        return this.handler !== undefined;
    }

    /**
     * 
     */
    createGpuBuffer = () => {
        this.needUpdate();
        this.byte_length = this.typedArrayData1D?.byteLength as number;
        let desc: GPUBufferDescriptor = {
            size: this.byte_length,
            usage: this.bufferUsageFlags as GPUBufferUsageFlags
        };
        this.buffer = this.ctx?.getGpuDevice().createBuffer(desc);
    }

    /**
     * 
     */
    override getByteLength(): number {
        return this.byte_length;
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
            frameStage === "FrameBegin" && this.needUpdate() && this.updateGpuBuffer();
        }
        return this.buffer as GPUBuffer;
    }
}

export {
    VertexBuffer
}