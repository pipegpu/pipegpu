import type { BaseTexture } from "../../res/texture/BaseTexture";
import { BaseProperty } from "../BaseProperty";

/**
 * 
 */
class Texture2DArrayProperty extends BaseProperty {
    /**
     * 
     */
    private texture: BaseTexture;

    /**
     * 
     * @param propertyName 
     * @param texture 
     */
    constructor(propertyName: string, texture: BaseTexture) {
        super(propertyName, 'texture2DArray');
        this.texture = texture;
    }

    /**
     * 
     * @returns 
     */
    getTextureID = (): number => {
        return this.texture.getID();
    }
}

export {
    Texture2DArrayProperty
}