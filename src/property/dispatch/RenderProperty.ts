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

    /**
     * 
     * @param buffer 
     */
    constructor(buffer: IndexBuffer);
    /**
     * 
     * @param buffer 
     */
    constructor(buffer: IndirectBuffer);
    /**
     * 
     * @param maxDrawCount 
     * @param instanceCount 
     */
    constructor(maxDrawCount: number, instanceCount: number);
    constructor(a?: IndexBuffer | IndirectBuffer | number, b?: number) {
        super('[RenderProperty][constructor]');
        if (typeof a === "number" && typeof b === "number") {
            this.propertyFormat = 'drawCount';
            this.maxDrawCount = a;
            this.instanceCount = b;
        } else if (a instanceof IndexBuffer) {
            this.propertyFormat = 'drawIndexed';
            this.indexBuffer = a;
        } else if (a instanceof IndirectBuffer) {
            this.propertyFormat = 'drawIndirect'
        } else {

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
            return this.indexBuffer.getId();
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