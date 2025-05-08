import type { BaseBuffer } from "../res/buffer/BaseBuffer";
import { IndexBuffer } from "../res/buffer/IndexBuffer";
import { StorageBuffer } from "../res/buffer/StorageBuffer";
import { VertexBuffer } from "../res/buffer/VertexBuffer";
import type { Context } from "../res/Context";
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

    constructor(opts: { ctx: Context }) {
        this.ctx = opts.ctx;
    }

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

    createStorageBuffer(id: number = 0): StorageBuffer {
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

    createVertexBuffer(id: number = 0): VertexBuffer {
        if (!BufferState.BUFFER_SET.has(id)) {
            const idx: number = uniqueID();
            const buffer: VertexBuffer = new VertexBuffer({
                id: uniqueID(),
                ctx: this.ctx
            });
            BufferState.BUFFER_SET.set(idx, buffer);
        }
        return BufferState.BUFFER_SET.get(id) as VertexBuffer;
    }

}

export {
    BufferState
}