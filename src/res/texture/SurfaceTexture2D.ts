import type { Context } from "../Context";
import type { FrameStageFormat } from "../Format";
import { BaseTexture } from "./BaseTexture";

class SurfaceTexture2D extends BaseTexture {
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
            textureUsageFlags: GPUTextureUsage.RENDER_ATTACHMENT
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
    SurfaceTexture2D
}