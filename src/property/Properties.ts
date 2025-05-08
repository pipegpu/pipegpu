import type { StorageBuffer } from "../res/buffer/StorageBuffer";
import { UniformBuffer } from "../res/buffer/UniformBuffer";
import type { VertexBuffer } from "../res/buffer/VertexBuffer";

/**
 * 
 */
class Properties {

    /**
     * 
     */
    protected propertyMap: Map<string, Properties> = new Map();

    /**
     * 
     */
    constructor() {

    }

    /**
     * 
     */
    getPropertyMap = (): Map<string, Properties> => {
        return this.propertyMap;
    }

}

/**
 * 
 */
class Attributes extends Properties {

    constructor() {
        super();
    }

    assign = (propertyName: string, buffer: VertexBuffer): void => {

    }

}

/**
 * 
 */
class Uniforms extends Properties {

    constructor() {
        super();
    }


    assign(propertyName: string, buffer: UniformBuffer): void;
    assign(propertyName: string, buffer: StorageBuffer): void;
    assign(propertyName: string, buffer: any): void {
        if (buffer instanceof UniformBuffer) {

        }
    }

}


export {
    Properties,
    Attributes
}