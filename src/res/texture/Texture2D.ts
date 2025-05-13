import type { Context } from "../Context";
import type { FrameStageFormat } from "../Format";
import { BaseTexture } from "./BaseTexture";

class Texture2D extends BaseTexture {
    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            width: number,
            height: number,
            maxMipLevel?: number
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            textureUsageFlags: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            width: opts.width,
            height: opts.height,
            depthOrArrayLayers: 1,
            maxMipLevel: opts.maxMipLevel
        });
    }

    /**
     * 
     */
    protected override createGpuTexture(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    override getGpuTexture = (encoder: GPUCommandEncoder, frameStage: FrameStageFormat): GPUTexture => {
        if (!this.texture) {
            this.createGpuTexture();
        }
        return this.texture as GPUTexture;
    }
}

export {
    Texture2D
}