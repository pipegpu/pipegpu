import type { VertexBuffer } from "../../res/buffer/VertexBuffer";
import { BaseProperty } from "../BaseProperty";

/**
 * 
 */
class VertexBufferProperty extends BaseProperty {
    /**
     * 
     */
    private vertexBuffer: VertexBuffer;

    /**
     * 
     * @param propertyName 
     * @param vertexBuffer 
     */
    constructor(propertyName: string, vertexBuffer: VertexBuffer) {
        super(propertyName, 'vertexBuffer')
        this.vertexBuffer = vertexBuffer;
    }

    /**
     * 
     * @returns 
     */
    getVertexBufferID = (): number => {
        return this.vertexBuffer.getID();
    }
}

export {
    VertexBufferProperty
}