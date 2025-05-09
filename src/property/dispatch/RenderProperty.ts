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
    private indexBufferID: number = 0;

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
            this.propertyFormat = 'DrawCount';
            this.maxDrawCount = a;
            this.instanceCount = b;
        } else if (a instanceof IndexBuffer) {
            this.propertyFormat = 'DrawIndexed';
            this.indexBufferID = a.getId();
        } else if (a instanceof IndirectBuffer) {
            this.propertyFormat = 'DrawIndirect'
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
        return this.indexBufferID;
    }
}

export { RenderProperty };