import { IndexBuffer } from "../../res/buffer/IndexBuffer";
import { IndirectBuffer } from "../../res/buffer/IndirectBuffer";
import { BaseProperty } from "../BaseProperty";

class RenderProperty extends BaseProperty {
    /**
     * 
     */
    private maxDrawCount: number = 0;

    /**
     * 
     */
    private instanceCount: number = 1;

    /**
     * 
     */
    private indexBuffer: IndexBuffer | undefined;

    constructor(buffer: IndexBuffer)
    constructor(buffer: IndexBuffer, instanceCount: number)
    constructor(buffer: IndirectBuffer)
    constructor(maxDrawCount: number, instanceCount: number)
    constructor(a?: IndexBuffer | IndirectBuffer | number, b?: number) {
        super('[RenderProperty][constructor]');
        if (typeof a === 'number' && typeof b === 'number') {
            this.propertyFormat = 'drawCount';
            this.maxDrawCount = a;
            this.instanceCount = b;
        }
        if (a instanceof IndexBuffer) {
            this.propertyFormat = 'drawIndexed';
            this.indexBuffer = a;
        }
        if (a instanceof IndexBuffer && typeof b === 'number') {
            this.propertyFormat = 'drawIndexed';
            this.indexBuffer = a;
            this.instanceCount = b;
        }
        if (a instanceof IndirectBuffer) {
            this.propertyFormat = 'drawIndirect'
        }
    }

    /**
     * 
     * @returns 
     */
    getMaxDrawCount(): number {
        return this.maxDrawCount;
    }

    /**
     * 
     * @returns 
     */
    getInstanceCount(): number {
        return this.instanceCount;
    }

    /**
     * 
     * @returns 
     */
    getIndexBufferID(): number {
        if (this.indexBuffer) {
            return this.indexBuffer.getID();
        } else {
            console.log(`[E][RenderProperty][getIndexBufferID] missing indexBuffer in 'RenderProperty'.`);
            return 0;
        }
    }

    /**
     * 
     * @returns 
     */
    getIndexFormat(): GPUIndexFormat {
        if (this.indexBuffer) {
            return this.indexBuffer.getIndexFormat();
        } else {
            console.log(`[E][RenderProperty][getIndexFormat] missing indexBuffer in 'RenderProperty'.`);
            return 'uint32';
        }

    }
}

export { RenderProperty };