import type { StorageBuffer } from "../res/buffer/StorageBuffer";
import { UniformBuffer } from "../res/buffer/UniformBuffer";
import type { VertexBuffer } from "../res/buffer/VertexBuffer";
import { VertexBufferProperty } from "./attribute/VertexBufferProperty";
import type { BaseProperty } from "./BaseProperty";
import { UniformBufferProperty } from "./uniform/UniformBufferProperty";

/**
 * 
 */
class Properties {
    /**
     * 
     */
    protected propertyMap: Map<string, BaseProperty> = new Map();

    /**
     * 
     */
    constructor() {

    }

    /**
     * 
     */
    getPropertyMap = (): Map<string, BaseProperty> => {
        return this.propertyMap;
    }

}

/**
 * @example
 * attributes.assing("position", vertexBuffer);
 */
class Attributes extends Properties {
    /**
     * 
     */
    constructor() {
        super();
    }

    /**
     * 
     * @returns 
     */
    isEmpty = (): boolean => {
        return this.propertyMap.size === 0;
    }

    /**
     * 
     * @param propertyName 
     * @param buffer 
     */
    assign = (propertyName: string, buffer: VertexBuffer): void => {
        if (this.propertyMap.has(propertyName)) {
            console.log(`[I][Properties][Attributes] duplicated key :${propertyName}`);
            return;
        }
        const vertexBufferProperty = new VertexBufferProperty(propertyName, buffer);
        this.propertyMap.set(propertyName, vertexBufferProperty);
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
    assign(a: string, b: any): void {
        if (b instanceof UniformBuffer) {
            const uniformBufferProperty: UniformBufferProperty = new UniformBufferProperty(a, b);
            this.propertyMap.set(a, uniformBufferProperty);
            return;
        }
        console.log(`[E][Properties][Uniforms][assign] unsupported buffer type, buffer: ${b}`);
    }

}


export {
    Properties,
    Attributes,
    Uniforms
}