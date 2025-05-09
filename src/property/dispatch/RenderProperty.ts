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
    private instanceCount: number = 0;

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
            this.propertyFormat = 'DrawIndexed'
        } else if (a instanceof IndirectBuffer) {
            this.propertyFormat = 'DrawIndirect'
        } else {

        }
    }

    getMaxDrawCount(): number {
        return this.maxDrawCount;
    }
}

export { RenderProperty };