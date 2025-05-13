import type { Context } from "../res/Context"
import type { TypedArray1DFormat } from "../res/Format";
import type { BaseTexture } from "../res/texture/BaseTexture";
import { SurfaceTexture2D } from "../res/texture/SurfaceTexture2D";
import { Texture2D } from "../res/texture/Texture2D";
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
    getTexture = (id: number): BaseTexture | undefined => {
        if (!TextureState.TEXTURE_SET.has(id)) {
            console.log(`[E][TextureState][getTexture] find texture failed, id: ${id}`);
        } else {
            return TextureState.TEXTURE_SET.get(id);
        }
    }

    /**
     * 
     * @param id 
     */
    createTexutre2D = (
        opts: {
            width: number,
            height: number,
            textureData?: TypedArray1DFormat,
            textureFormat?: GPUTextureFormat,
            maxMipLevel?: number
        },
        id: number = 0
    ): Texture2D => {
        if (!TextureState.TEXTURE_SET.has(id)) {
            id = uniqueID();
            const texture = new Texture2D({
                id: id,
                ctx: this.ctx,
                width: opts.width,
                height: opts.height,
                textureData: opts.textureData,
                textureFormat: opts.textureFormat,
                maxMipLevel: opts.maxMipLevel
            });
            TextureState.TEXTURE_SET.set(id, texture);
        }
        return TextureState.TEXTURE_SET.get(id) as Texture2D;
    }

    /**
     * 
     * @param opts 
     * @param id 
     * @returns 
     */
    createSurfaceTexture2D = (id: number = 0): SurfaceTexture2D => {
        if (!TextureState.TEXTURE_SET.has(id)) {
            id = uniqueID();
            const texture = new SurfaceTexture2D({
                id: id,
                ctx: this.ctx
            });
            TextureState.TEXTURE_SET.set(id, texture);
        }
        return TextureState.TEXTURE_SET.get(id) as SurfaceTexture2D;
    }
}

export {
    TextureState
}