import type { Context } from "../Context";
import { BaseTexture } from "./BaseTexture";

class Texture2D extends BaseTexture {

    constructor(
        opts: {
            id: number,
            ctx: Context,
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            textureUsageFlags: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });
    }

}

export {
    Texture2D
}