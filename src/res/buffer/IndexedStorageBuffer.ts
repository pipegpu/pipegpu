import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray2DFormat } from "../Format";
import type { Handle2DBuffer } from "./BaseBuffer";
import { StorageBuffer } from "./StorageBuffer";

/**
 * 
 * @class IndexedStorageBuffer
 * 
 */
class IndexedStorageBuffer extends StorageBuffer {

    /**
    * 
    */
    private indexedFormat: GPUIndexFormat = 'uint32';

    /**
     * 
     */
    private drawCount: number = 0;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            totalByteLength: number,
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2DBuffer
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            rawData2D: opts.typedArrayData2D,
            handler: opts.handler,
        });

        // check silced indexed buffer type.
        // TODO runtime handle check WIP.
        if (this.rawData2D) {
            let format = 'none';
            this.rawData2D.forEach(typedarray => {
                if (typedarray instanceof Uint16Array && ('uint16' === format || 'none' === format)) {
                    format = 'uint16';
                    this.drawCount += typedarray.length;
                }
                else if (typedarray instanceof Uint32Array && ('uint32' === format || 'none' === format)) {
                    format = 'uint32';
                    this.drawCount += typedarray.length;
                }
                else {
                    throw new Error(`[E][IndexedStorageBuffer][constructor] raw data error. only one type of uint16/uint32 support. and all slice of raw must be the same type.`);
                }
            })
            this.indexedFormat = format as GPUIndexFormat;
        }
    }

    /**
     * TODO::
     * handler type need update.
     * 
     * @returns 
     */
    getIndexedFormat = (): GPUIndexFormat => {
        return this.indexedFormat;
    }

    /**
     * 
     * @returns 
     */
    getDrawCount = (): number => {
        return this.drawCount;
    }

    /**
     * 
     * @param _encoder 
     * @param frameStage 
     * @returns 
     */
    override getGpuBuffer(_encoder?: GPUCommandEncoder | null, frameStage?: FrameStageFormat): GPUBuffer {
        if (!this.buffer) {
            this.createGpuBuffer();
        } else {
            if (frameStage === "frameBegin" && this.handler) {
                const handData = this.handler();
                if (handData.rewrite) {
                    this.drawCount = 0;
                    const BYTES_PER_ELEMENT = this.indexedFormat === 'uint16' ? Uint16Array.BYTES_PER_ELEMENT : Uint32Array.BYTES_PER_ELEMENT;
                    handData.details.forEach(detail => {
                        this.updateGpuBuffer(detail.offset, detail.byteLength, detail.rawData);
                        this.drawCount += detail.rawData.byteLength / BYTES_PER_ELEMENT;
                    });
                }
            }
        }
        return this.buffer as GPUBuffer;
    }

}

export {
    IndexedStorageBuffer
}