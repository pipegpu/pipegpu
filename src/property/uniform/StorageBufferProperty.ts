import type { StorageBuffer } from "../../res/buffer/StorageBuffer";
import { BaseProperty } from "../BaseProperty";

/**
 * 
 */
class StorageBufferProperty extends BaseProperty {

    /**
     * 
     */
    private buffer: StorageBuffer;

    /**
     * 
     * @param propertyName 
     * @param buffer 
     */
    constructor(propertyName: string, buffer: StorageBuffer) {
        super(propertyName, 'storageBuffer');
        this.buffer = buffer;
    }

    /**
     * 
     * @returns 
     */
    getStorageBufferID = () => {
        return this.buffer.getID();
    }

}

export {
    StorageBufferProperty
}