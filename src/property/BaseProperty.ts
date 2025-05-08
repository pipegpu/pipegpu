import type { PropertyFormat } from "../res/Format";

/**
 * 
 */
class BaseProperty {
    /**
     * 
     */
    private propertyName: string;

    /**
     * 
     */
    private propertyFormat: PropertyFormat;

    /**
     * 
     * @param propertyName 
     * @param supportedProperty 
     */
    constructor(propertyName: string, supportedProperty: PropertyFormat) {

        this.propertyName = propertyName;
        this.propertyFormat = supportedProperty;
    }

    /**
     * 
     * @returns 
     */
    getPropertyFormat = (): PropertyFormat => {
        return this.propertyFormat;
    }

    /**
     * get property string name
     * @returns 
     */
    getPropertyName = (): string => {
        return this.propertyName;
    }
}

export {
    BaseProperty
};
