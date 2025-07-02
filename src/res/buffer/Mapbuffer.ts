import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat, TypedArray2DFormat } from "../Format";
import type { Handle2D } from "./BaseBuffer";
import { StorageBuffer } from "./StorageBuffer";

class MapBuffer extends StorageBuffer {
    /**
     * 
     */
    protected mapReadBuffer!: GPUBuffer;

    /**
     * 
     */
    protected mapWriteBuffer!: GPUBuffer;

    constructor(
        opts: {
            id: number,
            ctx: Context,
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ) {
        super(opts);
    }

    /**
     * 
     */
    private createMapReadBuffer = () => {
        let desc: GPUBufferDescriptor = {
            size: this.getByteLength(),
            label: "[MapBuffer][createMapReadBuffer]",
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
        };
        this.mapReadBuffer = this.ctx?.getGpuDevice().createBuffer(desc) as GPUBuffer;
    }

    /**
     * 
     */
    private createMapWriteBuffer = () => {
        let desc: GPUBufferDescriptor = {
            size: this.getByteLength(),
            label: "[MapBuffer][createMapWriteBuffer]",
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC
        };
        this.mapWriteBuffer = this.ctx?.getGpuDevice().createBuffer(desc) as GPUBuffer;
    }

    /**
     * 
     * @param byteOffset 
     * @param byteLength 
     * @param typedArray 
     * @returns 
     */
    public async PushDataAsync(byteOffset: number, byteLength: number, typedArray: TypedArray1DFormat) {
        if (!this.buffer) {
            this.createGpuBuffer();
        }
        if (!this.mapWriteBuffer) {
            this.createMapWriteBuffer();
        }
        const totalByteLength: number = this.getByteLength();
        if (byteOffset + byteLength > totalByteLength) {
            console.log(`[E][MapBuffer][PushDataAsync] write buffer leak/out of memory: ${byteOffset + byteLength}.`);
            return;
        }
        await this.mapWriteBuffer.mapAsync(GPUMapMode.WRITE, 0, totalByteLength);
        // TODO:: fit typedarray format.
        const resultData: Float32Array = new Float32Array(this.mapWriteBuffer.getMappedRange());
        resultData.set(typedArray, byteOffset);
        this.mapWriteBuffer.unmap();
    }

    /**
     * 
     * @param byteOffset 
     * @param byteLength 
     * @returns 
     */
    public async PullDataAsync(byteOffset: number, byteLength: number) {
        if (!this.buffer) {
            this.createGpuBuffer();
        }
        if (!this.mapReadBuffer) {
            this.createMapReadBuffer();
        }
        const totalByteLength: number = this.getByteLength();
        if (byteOffset + byteLength > totalByteLength) {
            console.log(`[E][MapBuffer][PullDataAsync] pull gpu-side buffer failed. byte length oversize: ${byteOffset + byteLength}.`);
            return;
        }
        await this.mapReadBuffer.mapAsync(GPUMapMode.WRITE, 0, totalByteLength);
        const resultData: Float32Array = new Float32Array(this.mapWriteBuffer.getMappedRange());
        this.mapWriteBuffer.unmap();
        return resultData;
    }

    /**
     * 
     * @param _encoder 
     * @param _frameStage 
     * @returns 
     */
    override getGpuBuffer = (_encoder: GPUCommandEncoder, _frameStage: FrameStageFormat): GPUBuffer => {
        super.getGpuBuffer(_encoder, _frameStage);
        if (!this.mapReadBuffer) {
            this.createMapReadBuffer();
        }
        if (!this.mapWriteBuffer) {
            this.createMapWriteBuffer();
        }
        if (!this.buffer) {
            this.createGpuBuffer();
        }
        if ('frameFinish' === _frameStage && _encoder) {
            const byteLength = this.getByteLength();
            _encoder.copyBufferToBuffer(this.buffer, this.mapReadBuffer, byteLength);
        }
        return this.buffer as GPUBuffer;
    }
}

export {
    MapBuffer
}