import type { UniformBuffer } from "../../res/buffer/UniformBuffer";
import { BaseProperty } from "../BaseProperty";

/**
 * 
 * @class UniformBufferProperty
 * 
 */
class UniformBufferProperty extends BaseProperty {

    /**
     * 
     */
    private buffer: UniformBuffer;

    /**
     * 
     * @param propertyName 
     * @param buffer 
     */
    constructor(propertyName: string, buffer: UniformBuffer) {
        super(propertyName, 'uniformBuffer');
        this.buffer = buffer;
    }

    /**
     * 
     * @returns 
     * 
     */
    getUniformBufferID = (): number => {
        return this.buffer.getID();
    }

}

export {
    UniformBufferProperty
}