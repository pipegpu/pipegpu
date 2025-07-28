import { IndexedBuffer } from "../../res/buffer/IndexedBuffer";
import { IndexedIndirectBuffer } from "../../res/buffer/IndexedIndirectBuffer";
import { IndexedStorageBuffer } from "../../res/buffer/IndexedStorageBuffer";
import { IndirectBuffer } from "../../res/buffer/IndirectBuffer";
import { StorageBuffer } from "../../res/buffer/StorageBuffer";
import { BaseProperty } from "../BaseProperty";

/**
 * 
 * support dynmaic max draw count.
 * - max draw count
 * @example
 * const maxDrawCountHandler = ():number => {
 *   return 0;
 * }
 * 
 */
type MaxDrawCountHandle = { (): number; }

class RenderProperty extends BaseProperty {
    /**
     * 
     */
    private maxDrawCount: number = 0;

    /**
     * 
     */
    private maxDrawCountHandler?: MaxDrawCountHandle;

    /**
     * 
     */
    private instanceCount?: number = 1;

    /**
     * 
     */
    private indexBuffer?: IndexedBuffer;

    /**
     * 
     */
    private indexedStorageBuffer?: IndexedStorageBuffer;

    /**
     * 
     */
    private indexedIndirectBuffer?: IndexedIndirectBuffer;

    /**
     * 
     */
    private indirectDrawCountBuffer?: StorageBuffer;

    /**
     * 
     */
    private indirectBuffer?: IndirectBuffer;

    constructor(maxDrawCount: number, instanceCount: number)
    constructor(indexBuffer: IndexedBuffer)
    constructor(indexBuffer: IndexedBuffer, instanceCount: number)
    constructor(indexStorageBuffer: IndexedStorageBuffer, instanceCount: number)
    constructor(indexStorageBuffer: IndexedStorageBuffer, indexedIndirectBuffer: IndexedIndirectBuffer)
    constructor(indexStorageBuffer: IndexedStorageBuffer, indexedIndirectBuffer: IndexedIndirectBuffer, indirectDrawCountBuffer: StorageBuffer, maxDrawCount: number)
    constructor(indexStorageBuffer: IndexedStorageBuffer, indexedIndirectBuffer: IndexedIndirectBuffer, indirectDrawCountBuffer: StorageBuffer, handler: MaxDrawCountHandle)
    constructor(indirectBuffer: IndirectBuffer)
    constructor(indirectBuffer: IndirectBuffer, indirectDrawCountBuffer: StorageBuffer, maxDrawCount: number)
    constructor(a?: IndexedBuffer | IndirectBuffer | number | IndexedStorageBuffer, b?: number | IndexedIndirectBuffer | StorageBuffer, c?: StorageBuffer | number, d?: number | MaxDrawCountHandle) {
        super('[RenderProperty][constructor]');
        if (typeof a === 'number' && typeof b === 'number') {
            this.propertyFormat = 'drawCount';
            this.maxDrawCount = a;
            this.instanceCount = b;
        }
        if (a instanceof IndexedStorageBuffer && typeof b === 'number') {
            this.propertyFormat = 'drawIndexedStorage';
            this.indexedStorageBuffer = a;
            this.instanceCount = b;
        }
        if (a instanceof IndexedBuffer) {
            this.propertyFormat = 'drawIndexed';
            this.indexBuffer = a;
        }
        if (a instanceof IndexedBuffer && typeof b === 'number') {
            this.propertyFormat = 'drawIndexed';
            this.indexBuffer = a;
            this.instanceCount = b;
        }
        if (a instanceof IndirectBuffer) {
            this.propertyFormat = 'drawIndirect';
            this.indirectBuffer = a;
        }
        if (a instanceof IndirectBuffer && b instanceof StorageBuffer && typeof c === 'number') {
            this.propertyFormat = 'multiDrawIndirect';
            this.indirectBuffer = a;
            this.indirectDrawCountBuffer = b;
            this.maxDrawCount = c;
        }
        if (a instanceof IndexedStorageBuffer && b instanceof IndexedIndirectBuffer) {
            this.propertyFormat = 'drawIndexedIndirect'
            this.indexedStorageBuffer = a;
            this.indexedIndirectBuffer = b;
        }
        if (a instanceof IndexedStorageBuffer && b instanceof IndexedIndirectBuffer && c instanceof StorageBuffer && typeof d === 'number') {
            this.propertyFormat = 'multiDrawIndexedIndirect'
            this.indexedStorageBuffer = a;
            this.indexedIndirectBuffer = b;
            this.indirectDrawCountBuffer = c;
            this.maxDrawCount = d;
        }
        if ((a instanceof IndexedStorageBuffer && b instanceof IndexedIndirectBuffer && c instanceof StorageBuffer && typeof d === "function" && d.length === 0)) {
            this.propertyFormat = 'multiDrawIndexedIndirect'
            this.indexedStorageBuffer = a;
            this.indexedIndirectBuffer = b;
            this.indirectDrawCountBuffer = c;
            this.maxDrawCountHandler = d;
        }
    }

    /**
     * 
     * @returns 
     */
    getMaxDrawCount = (): number => {
        if (this.maxDrawCountHandler) {
            return this.maxDrawCountHandler();
        } else {
            return this.maxDrawCount;
        }
    }

    /**
     * 
     * @returns 
     */
    getInstanceCount(): number | undefined {
        if (this.instanceCount) {
            return this.instanceCount;
        }
        throw new Error(`[E][RenderProperty][getInstanceCount] indvalid instance count.`);
    }

    /**
     * 
     * @returns 
     */
    getIndexBuffer(): IndexedBuffer | undefined {
        if (this.indexBuffer) {
            return this.indexBuffer;
        }
        throw new Error(`[E][RenderProperty][getIndexBufferID] missing indexBuffer in 'RenderProperty'.`);
    }

    /**
     * 
     * @returns 
     */
    getIndexFormat(): GPUIndexFormat {
        if (this.indexBuffer) {
            return this.indexBuffer.getIndexFormat();
        }
        throw new Error(`[E][RenderProperty][getIndexFormat] missing indexBuffer in 'RenderProperty'.`);
    }

    getIndexedIndirectBuffer = (): IndexedIndirectBuffer | undefined => {
        if (this.indexedIndirectBuffer) {
            return this.indexedIndirectBuffer;
        }
        throw new Error(`[E][RenderProperty][getIndexedIndirectBuffer] invalid indexed indirect buffer.`);
    }

    getIndexStorageBuffer = (): IndexedStorageBuffer | undefined => {
        if (this.indexedStorageBuffer) {
            return this.indexedStorageBuffer;
        }
        throw new Error(`[E][RenderProperty][getIndexStorageBuffer] invalid index storage buffer.`);
    }

    getIndirectCountBuffer = (): StorageBuffer | undefined => {
        if (this.indirectDrawCountBuffer) {
            return this.indirectDrawCountBuffer;
        }
        throw new Error(`[E][RenderProperty][getIndirectCountBuffer] invalid indirect draw count buffer for multiDrawIndirect.`);
    }

    getIndirectBuffer = (): IndirectBuffer | undefined => {
        if (this.indirectBuffer) {
            return this.indirectBuffer;
        }
        throw new Error(`[E][RenderProperty][getIndirectCountBuffer] invalid indirect buffer.`)
    }

}

export { RenderProperty };