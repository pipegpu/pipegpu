import type { Context } from "../Context";
import type { TypedArray2DFormat } from "../Format";
import type { Handle2D } from "./BaseBuffer";
import { StorageBuffer } from "./StorageBuffer";

/**
 * 
 * 
 */
class IndexedStorageBuffer extends StorageBuffer {

    /**
    * 
    */
    private indexedFormat: GPUIndexFormat = 'uint32';

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            totalByteLength: number,
            typedArrayData2D?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            totalByteLength: opts.totalByteLength,
            bufferUsageFlags: GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            typedArrayData2D: opts.typedArrayData2D,
            handler: opts.handler,
        });

        // check silced indexed buffer type.
        // TODO runtime handle check WIP.
        if (this.typedArrayData2D) {
            let format = 'none';
            this.typedArrayData2D.forEach(typedarray => {
                if (typedarray instanceof Int16Array && ('uint16' === format || 'none' === format)) {
                    format = 'uint16';
                }
                else if (typedarray instanceof Uint32Array && ('uint32' === format || 'none' === format)) {
                    format = 'uint32';
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


}

export {
    IndexedStorageBuffer
}