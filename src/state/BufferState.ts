import type { BaseBuffer } from "../res/buffer/BaseBuffer";
import { IndexedBuffer } from "../res/buffer/IndexedBuffer";
import { IndexedIndirectBuffer } from "../res/buffer/IndexedIndirectBuffer";
import { IndexedStorageBuffer } from "../res/buffer/IndexedStorageBuffer";
import { IndirectBuffer } from "../res/buffer/IndirectBuffer";
import { MapBuffer } from "../res/buffer/Mapbuffer";
import { StorageBuffer } from "../res/buffer/StorageBuffer";
import { UniformBuffer } from "../res/buffer/UniformBuffer";
import { VertexBuffer } from "../res/buffer/VertexBuffer";
import type { Context } from "../res/Context";
import type { TypedArray1DFormat, TypedArray2DFormat } from "../res/Format";
import type { BufferHandle, BufferArrayHandle } from "../res/Handle";
import { uniqueID } from "../util/uniqueID";

/**
 * 
 */
class BufferState {
    /**
     * 
     */
    private static BUFFER_SET: Map<number, BaseBuffer> = new Map();

    /**
     * 
     */
    private context: Context;

    /**
     * 
     * @param opts 
     * 
     */
    constructor(context: Context) {
        this.context = context;
    }

    /**
     * 
     * @param id 
     * 
     */
    getBuffer = (bufferID: number): BaseBuffer => {
        if (!BufferState.BUFFER_SET.has(bufferID)) {
            throw new Error(`[E][BufferState][getBuffer] find buffer failed.`);
        } else {
            return BufferState.BUFFER_SET.get(bufferID)!;
        }
    }

    /**
     * 
     * @param id 
     * @returns 
     * 
     */
    createIndexBuffer(
        opts: {
            rawData: Uint16Array | Uint32Array,
        }
    ): IndexedBuffer {
        const bufferID: number = uniqueID();
        const buffer: IndexedBuffer = new IndexedBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.rawData.byteLength,
            typedArrayData1D: opts.rawData
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as IndexedBuffer;
    }

    /**
     * 
     * @param opts 
     * @param id 
     * 
     */
    createUniformBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray1DFormat | ArrayBuffer,
            handler?: BufferHandle,
        }
    ): UniformBuffer => {
        const bufferID = uniqueID();
        const buffer: UniformBuffer = new UniformBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.totalByteLength,
            rawData: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as UniformBuffer;
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createMapBuffer = (
        opts: {
            totalByteLength: number,
            appendixBufferUsageFlags?: number,
            rawDataArray?: TypedArray2DFormat,
            handler?: BufferArrayHandle
        }
    ): MapBuffer => {
        const bufferID: number = uniqueID();
        const buffer: MapBuffer = new MapBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.totalByteLength,
            appendixBufferUsageFlags: opts.appendixBufferUsageFlags,
            rawDataArray: opts.rawDataArray,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as MapBuffer;
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createStorageBuffer = (
        opts: {
            totalByteLength: number,
            bufferUsageFlags?: GPUBufferUsageFlags,
            rawDataArray?: TypedArray2DFormat | Array<ArrayBuffer>,
            handler?: BufferArrayHandle
        }
    ): StorageBuffer => {
        const bufferID: number = uniqueID();
        const buffer: StorageBuffer = new StorageBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.totalByteLength,
            rawDataArray: opts.rawDataArray,
            bufferUsageFlags: opts.bufferUsageFlags,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as StorageBuffer;
    }

    /**
     * 
     * @param opts
     * 
     */
    createIndexedStorageBuffer = (
        opts: {
            totalByteLength: number,
            rawDataArray?: Array<Uint16Array> | Array<Uint32Array>,
            handler?: BufferArrayHandle
        }
    ): IndexedStorageBuffer => {
        const bufferID: number = uniqueID();
        const buffer: IndexedStorageBuffer = new IndexedStorageBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.totalByteLength,
            rawDataArray: opts.rawDataArray,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as IndexedStorageBuffer;
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     * 
     */
    createVertexBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray1DFormat
            handler?: BufferHandle
        }
    ): VertexBuffer => {
        const bufferID: number = uniqueID();
        const buffer: VertexBuffer = new VertexBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.totalByteLength,
            rawData: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as VertexBuffer;
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createIndirectBuffer = (
        opts: {
            totalByteLength: number,
            rawDataArray?: TypedArray2DFormat | Array<ArrayBuffer>,
            handler?: BufferArrayHandle,
        }
    ): IndirectBuffer => {
        const bufferID: number = uniqueID();
        const buffer: IndirectBuffer = new IndirectBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.totalByteLength,
            rawDataArray: opts.rawDataArray,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as IndirectBuffer;
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createIndexedIndirectBuffer = (
        opts: {
            totalByteLength: number,
            rawDataArray?: TypedArray2DFormat | Array<ArrayBuffer>,
            handler?: BufferArrayHandle,
        }
    ): IndexedIndirectBuffer => {
        const bufferID: number = uniqueID();
        const buffer: IndexedIndirectBuffer = new IndexedIndirectBuffer({
            id: bufferID,
            context: this.context,
            totalByteLength: opts.totalByteLength,
            rawDataArray: opts.rawDataArray,
            handler: opts.handler,
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as IndexedIndirectBuffer;
    }

}

export {
    BufferState
}