import type { Context } from "../Context";
import { BaseTexture } from "./BaseTexture";

class SurfaceTexture2D extends BaseTexture {

    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {

        super({
            id: opts.id,
            ctx: opts.ctx,
            textureUsageFlags: GPUTextureUsage.RENDER_ATTACHMENT
        });
    }

}

export {
    SurfaceTexture2D
}