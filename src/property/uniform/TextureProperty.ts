import type { BaseTexture } from "../../res/texture/BaseTexture";
import { BaseProperty } from "../BaseProperty";

/**
 * 
 */
class TextureProperty extends BaseProperty {

    /**
     * 
     */
    private texture: BaseTexture;

    /**
     * 
     * @param propertyName
     * @param texture
     * 
     */
    constructor(propertyName: string, texture: BaseTexture) {
        super(propertyName, texture.getPropertyFormat());
        this.texture = texture;
    }

    /**
     * 
     * @returns 
     */
    getTextureID = (): number => {
        return this.texture.getID();
    }

    /**
     * 
     * @returns 
     */
    getTexture = (): BaseTexture => {
        return this.texture;
    }

}

export {
    TextureProperty
}