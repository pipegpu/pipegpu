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
    protected propertyFormat: PropertyFormat;

    /**
     * 
     * @param propertyName 
     * @param supportedProperty 
     */
    constructor(propertyName: string, propertyFormat: PropertyFormat = 'none') {
        this.propertyName = propertyName;
        this.propertyFormat = propertyFormat;
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
