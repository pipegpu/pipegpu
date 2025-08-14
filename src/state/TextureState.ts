import type { Context } from "../res/Context"
import type { TypedArray1DFormat, TypedArray2DFormat } from "../res/Format";
import type { BaseTexture } from "../res/texture/BaseTexture";
import { SurfaceTexture2D } from "../res/texture/SurfaceTexture2D";
import { Texture2D } from "../res/texture/Texture2D";
import { Texture2DArray } from "../res/texture/Texture2DArray";
import { TextureStorage2D } from "../res/texture/TextureStorage2D";
import { uniqueID } from "../util/uniqueID";


/**
 * 
 */
class TextureState {
    /**
     * 
     */
    private static TEXTURE_SET: Map<number, BaseTexture> = new Map();

    /**
     * 
     */
    private ctx: Context;

    /**
     * 
     * @param opts 
     */
    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    getTexture = (textureID: number): BaseTexture | undefined => {
        if (!TextureState.TEXTURE_SET.has(textureID)) {
            throw new Error(`[E][TextureState][getTexture] find texture failed, id: ${textureID}`);
        }
        return TextureState.TEXTURE_SET.get(textureID);
    }

    /**
     * 
     * @param id 
     * 
     */
    createTexutre2D = (
        opts: {
            width: number,
            height: number,
            textureData?: TypedArray1DFormat,
            textureFormat?: GPUTextureFormat,
            mipmapCount?: number,
            appendixTextureUsages?: number,
        }
    ): Texture2D => {
        const textureID: number = uniqueID();
        const texture: Texture2D = new Texture2D({
            id: textureID,
            context: this.ctx,
            width: opts.width,
            height: opts.height,
            textureData: opts.textureData,
            textureFormat: opts.textureFormat,
            mipmapCount: opts.mipmapCount,
            appendixTextureUsages: opts.appendixTextureUsages,
        });
        TextureState.TEXTURE_SET.set(textureID, texture);
        return TextureState.TEXTURE_SET.get(textureID) as Texture2D;
    }

    /**
     * 
     * @param opts 
     * @returns 
     * 
     */
    createTextureStorage2D = (
        opts: {
            width: number,
            height: number,
            textureData?: TypedArray1DFormat,
            textureFormat?: GPUTextureFormat,
            maxMipLevel?: number,
            appendixTextureUsages?: number,
        }
    ): TextureStorage2D => {
        const textureID: number = uniqueID();
        const texture: TextureStorage2D = new TextureStorage2D({
            id: textureID,
            context: this.ctx,
            width: opts.width,
            height: opts.height,
            textureData: opts.textureData,
            maxMipLevel: opts.maxMipLevel,
            textureUsageFlags: opts.appendixTextureUsages,
            textureFormat: opts.textureFormat,
        });
        TextureState.TEXTURE_SET.set(textureID, texture);
        return TextureState.TEXTURE_SET.get(textureID) as TextureStorage2D;
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createSurfaceTexture2D = (): SurfaceTexture2D => {
        const textureID: number = uniqueID();
        const texture = new SurfaceTexture2D({
            id: textureID,
            ctx: this.ctx
        });
        TextureState.TEXTURE_SET.set(textureID, texture);
        return texture;
    }

    /**
     * 
     * @param opts 
     * @returns 
     */
    createTexture2DArray = (
        opts: {
            width: number,
            height: number,
            array: number,
            appendixTextureUsages?: number,
            textureDataArray?: TypedArray2DFormat,
            textureFormat?: GPUTextureFormat,
            maxMipLevel?: number
        }
    ): Texture2DArray => {
        const textureArrayID: number = uniqueID();
        const texture = new Texture2DArray({
            id: textureArrayID,
            ctx: this.ctx,
            width: opts.width,
            height: opts.height,
            array: opts.array,
            appendixTextureUsages: opts.appendixTextureUsages,
            textureDataArray: opts.textureDataArray,
            textureFormat: opts.textureFormat,
            maxMipLevel: opts.maxMipLevel,
        });
        TextureState.TEXTURE_SET.set(textureArrayID, texture);
        return TextureState.TEXTURE_SET.get(textureArrayID) as Texture2DArray;
    }
}

export {
    TextureState
}