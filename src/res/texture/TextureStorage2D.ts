import type { Context } from "../Context";
import type { FrameStageFormat } from "../Format";
import { BaseTexture } from "./BaseTexture";

class TextureStorage2D extends BaseTexture {
    /**
     * 
     * @param opts 
     */
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

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    getGpuTexture = (encoder: GPUCommandEncoder, frameStage: FrameStageFormat): void => {


    }
}

export {
    TextureStorage2D
}