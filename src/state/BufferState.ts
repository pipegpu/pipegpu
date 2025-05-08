import type { BaseBuffer, Handle1D } from "../res/buffer/BaseBuffer";
import { IndexBuffer } from "../res/buffer/IndexBuffer";
import { StorageBuffer } from "../res/buffer/StorageBuffer";
import { UniformBuffer } from "../res/buffer/UniformBuffer";
import { VertexBuffer } from "../res/buffer/VertexBuffer";
import type { Context } from "../res/Context";
import type { TypedArray1DFormat } from "../res/Format";
import { uniqueID } from "../util/uniqueID";

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
    constructor(opts: { ctx: Context }) {
        this.ctx = opts.ctx;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    createIndexBuffer(id: number = 0): IndexBuffer {
        if (!BufferState.BUFFER_SET.has(id)) {
            const idx: number = uniqueID();
            const buffer: IndexBuffer = new IndexBuffer({
                id: uniqueID(),
                ctx: this.ctx
            });
            BufferState.BUFFER_SET.set(idx, buffer);
        }
        return BufferState.BUFFER_SET.get(id) as IndexBuffer;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    createStorageBuffer(id: number = -1): StorageBuffer {
        if (!BufferState.BUFFER_SET.has(id)) {
            const idx: number = uniqueID();
            const buffer: StorageBuffer = new StorageBuffer({
                id: uniqueID(),
                ctx: this.ctx
            });
            BufferState.BUFFER_SET.set(idx, buffer);
        }
        return BufferState.BUFFER_SET.get(id) as StorageBuffer;
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
        },
        id: number = -1
    ): UniformBuffer => {
        if (!BufferState.BUFFER_SET.has(id)) {
            const idx: number = uniqueID();
            const buffer: UniformBuffer = new UniformBuffer({
                id: uniqueID(),
                ctx: this.ctx,
                typedArrayData1D: opts.rawData,
                handler: opts.handler
            });
            BufferState.BUFFER_SET.set(idx, buffer);
        }
        return BufferState.BUFFER_SET.get(id) as UniformBuffer;
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
        },
        id: number = -1
    ): VertexBuffer => {
        if (!BufferState.BUFFER_SET.has(id)) {
            const idx: number = uniqueID();
            const buffer: VertexBuffer = new VertexBuffer({
                id: uniqueID(),
                ctx: this.ctx,
                typedArrayData1D: opts.rawData,
                handler: opts.handler
            });
            BufferState.BUFFER_SET.set(idx, buffer);
        }
        return BufferState.BUFFER_SET.get(id) as VertexBuffer;
    }

}

export {
    BufferState
}