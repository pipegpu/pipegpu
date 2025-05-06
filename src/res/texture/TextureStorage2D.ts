import type { Context } from "../Context";
import { BaseTexture } from "./BaseTexture";

class TextureStorage2D extends BaseTexture {

    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            textureUsageFlags: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC
        });
    }

}

export {
    TextureStorage2D
}