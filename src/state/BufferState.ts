import type { BaseBuffer, Handle1D, Handle2D } from "../res/buffer/BaseBuffer";
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
import { align4Byte } from "../util/align4Byte";
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
    private ctx: Context;

    /**
     * 
     * @param opts 
     * 
     */
    constructor(ctx: Context) {
        this.ctx = ctx;
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
            rawData: TypedArray1DFormat,
        }
    ): IndexedBuffer {
        const bufferID: number = uniqueID();
        const buffer: IndexedBuffer = new IndexedBuffer({
            id: bufferID,
            ctx: this.ctx,
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
            rawData?: TypedArray1DFormat
            handler?: Handle1D,
        }
    ): UniformBuffer => {
        const bufferID = uniqueID();
        const buffer: UniformBuffer = new UniformBuffer({
            id: bufferID,
            ctx: this.ctx,
            totalByteLength: opts.totalByteLength,
            typedArrayData1D: opts.rawData,
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
            rawData?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ): MapBuffer => {
        const bufferID: number = uniqueID();
        const buffer: MapBuffer = new MapBuffer({
            id: bufferID,
            ctx: this.ctx,
            totalByteLength: opts.totalByteLength,
            typedArrayData2D: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as MapBuffer;
    }

    /**
     * 
     * @param opts 
     * @returns 
     */
    createStorageBuffer = (
        opts: {
            totalByteLength: number,
            bufferUsageFlags?: GPUBufferUsageFlags,
            rawData?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ): StorageBuffer => {
        const bufferID: number = uniqueID();
        const buffer: StorageBuffer = new StorageBuffer({
            id: bufferID,
            ctx: this.ctx,
            totalByteLength: opts.totalByteLength,
            typedArrayData2D: opts.rawData,
            bufferUsageFlags: opts.bufferUsageFlags,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as StorageBuffer;
    }

    /**
     * 
     * @param opts 
     */
    createIndexedStorageBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ): IndexedStorageBuffer => {
        const bufferID: number = uniqueID();
        const buffer: IndexedStorageBuffer = new IndexedStorageBuffer({
            id: bufferID,
            ctx: this.ctx,
            totalByteLength: opts.totalByteLength,
            typedArrayData2D: opts.rawData,
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
            handler?: Handle1D
        }
    ): VertexBuffer => {
        const bufferID: number = uniqueID();
        const buffer: VertexBuffer = new VertexBuffer({
            id: bufferID,
            ctx: this.ctx,
            totalByteLength: opts.totalByteLength,
            typedArrayData1D: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as VertexBuffer;
    }

    createIndirectBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray2DFormat,
            handler?: Handle2D,
        }
    ): IndirectBuffer => {
        const bufferID: number = uniqueID();
        const buffer: IndirectBuffer = new IndirectBuffer({
            id: bufferID,
            ctx: this.ctx,
            totalByteLength: opts.totalByteLength,
            typedArrayData2D: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as IndirectBuffer;
    }

    createIndexedIndirectBuffer = (
        opts: {
            totalByteLength: number,
            rawData?: TypedArray2DFormat,
            handler?: Handle2D,
        }
    ): IndexedIndirectBuffer => {
        const bufferID: number = uniqueID();
        const buffer: IndexedIndirectBuffer = new IndexedIndirectBuffer({
            id: bufferID,
            ctx: this.ctx,
            totalByteLength: opts.totalByteLength,
            typedArrayData2D: opts.rawData,
            handler: opts.handler,
        });
        BufferState.BUFFER_SET.set(bufferID, buffer);
        return BufferState.BUFFER_SET.get(bufferID) as IndexedIndirectBuffer;
    }

}

export {
    BufferState
}