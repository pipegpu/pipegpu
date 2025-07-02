import type { BaseBuffer, Handle1D, Handle2D } from "../res/buffer/BaseBuffer";
import { IndexBuffer } from "../res/buffer/IndexBuffer";
import { MapBuffer } from "../res/buffer/Mapbuffer";
import { StorageBuffer } from "../res/buffer/StorageBuffer";
import { UniformBuffer } from "../res/buffer/UniformBuffer";
import { VertexBuffer } from "../res/buffer/VertexBuffer";
import type { Context } from "../res/Context";
import type { TypedArray1DFormat, TypedArray2DFormat } from "../res/Format";
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
     */
    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    /**
     * 
     * @param id 
     */
    getBuffer = (bufferID: number): BaseBuffer | undefined => {
        if (!BufferState.BUFFER_SET.has(bufferID)) {
            throw new Error(`[E][BufferState][getBuffer] find buffer failed.`);
        } else {
            return BufferState.BUFFER_SET.get(bufferID);
        }
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    createIndexBuffer(
        opts: {
            indexFormat: GPUIndexFormat,
            rawData: TypedArray1DFormat
        }
    ): IndexBuffer {
        const indexBufferID: number = uniqueID();
        const buffer: IndexBuffer = new IndexBuffer({
            id: indexBufferID,
            ctx: this.ctx,
            indexFormat: opts.indexFormat,
            typedArrayData1D: opts.rawData
        });
        BufferState.BUFFER_SET.set(indexBufferID, buffer);
        return BufferState.BUFFER_SET.get(indexBufferID) as IndexBuffer;
    }

    /**
     * 
     * @param opts 
     * @param id 
     */
    createUniformBuffer = (
        opts: {
            rawData?: TypedArray1DFormat
            handler?: Handle1D
        }
    ): UniformBuffer => {
        const uniformBufferID = uniqueID();
        const buffer: UniformBuffer = new UniformBuffer({
            id: uniformBufferID,
            ctx: this.ctx,
            typedArrayData1D: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(uniformBufferID, buffer);
        return BufferState.BUFFER_SET.get(uniformBufferID) as UniformBuffer;
    }

    /**
     * 
     * @param opts 
     * @returns 
     */
    createMapBuffer = (
        opts: {
            rawData?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ): MapBuffer => {
        const mapBufferID: number = uniqueID();
        const buffer: MapBuffer = new MapBuffer({
            id: mapBufferID,
            ctx: this.ctx,
            typedArrayData2D: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(mapBufferID, buffer);
        return BufferState.BUFFER_SET.get(mapBufferID) as MapBuffer;
    }

    /**
     * 
     * @param opts 
     * @returns 
     */
    createStorageBuffer = (
        opts: {
            rawData?: TypedArray2DFormat,
            handler?: Handle2D
        }
    ): StorageBuffer => {
        const storageBufferID: number = uniqueID();
        const buffer: StorageBuffer = new StorageBuffer({
            id: storageBufferID,
            ctx: this.ctx,
            typedArrayData2D: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(storageBufferID, buffer);
        return BufferState.BUFFER_SET.get(storageBufferID) as StorageBuffer;
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createVertexBuffer = (
        opts: {
            rawData?: TypedArray1DFormat
            handler?: Handle1D
        }
    ): VertexBuffer => {
        const vertexBufferID: number = uniqueID();
        const buffer: VertexBuffer = new VertexBuffer({
            id: vertexBufferID,
            ctx: this.ctx,
            typedArrayData1D: opts.rawData,
            handler: opts.handler
        });
        BufferState.BUFFER_SET.set(vertexBufferID, buffer);
        return BufferState.BUFFER_SET.get(vertexBufferID) as VertexBuffer;
    }
}

export {
    BufferState
}