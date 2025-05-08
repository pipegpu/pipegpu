/**
 * 
 */
const SupportedPropertyConst = {
    DrawCount: "DrawCount",
    DrawIndexed: "DrawIndexed",
} as const;

type SupportedProperty = keyof typeof SupportedPropertyConst;

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
    private supportedProperty: SupportedProperty;

    /**
     * 
     * @param propertyName 
     * @param supportedProperty 
     */
    constructor(propertyName: string, supportedProperty: SupportedProperty) {

        this.propertyName = propertyName;
        this.supportedProperty = supportedProperty;
    }

    /**
     * 
     * @returns 
     */
    getSupportedProperty = (): SupportedProperty => {
        return this.supportedProperty;
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
    type SupportedProperty,
    BaseProperty
};
