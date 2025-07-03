import type { TextureSampler } from "../../res/sampler/TextureSampler";
import { BaseProperty } from "../BaseProperty";

/**
 * 
 */
class TextureSamplerProperty extends BaseProperty {
    /**
     * 
     */
    private textureSampler: TextureSampler;

    /**
     * 
     * @param propertyName 
     * @param sampler 
     */
    constructor(propertyName: string, sampler: TextureSampler) {
        super(propertyName, 'textureSampler');
        this.textureSampler = sampler;
    }

    /**
     * 
     * @returns 
     */
    getTextureSamplerID = (): number => {
        return this.textureSampler.getID();
    }

}

export {
    TextureSamplerProperty
}