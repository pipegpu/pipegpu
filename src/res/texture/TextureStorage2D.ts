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
            ctx: Context,
            width: number,
            height: number,
            maxMipLevel?: number,
            textureUsageFlags?: number,
            textureFormat?: GPUTextureFormat,
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            width: opts.width,
            height: opts.height,
            depthOrArrayLayers: 1,
            textureUsageFlags: (opts.textureUsageFlags || 0) | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
            textureFormat: opts.textureFormat,
            maxMipLevel: opts.maxMipLevel,
            propertyFormat: 'textureStorage2D'
        });
    }

    /**
     * 
     */
    protected createGpuTexture(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * 
     */
    override getGpuTextureView(): GPUTextureView {
        throw new Error("Method not implemented.");
    }

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    override getGpuTexture = (_encoder?: GPUCommandEncoder, _frameStage?: FrameStageFormat): GPUTexture => {
        if (!this.texture) {
            this.createGpuTexture();
        }
        return this.texture as GPUTexture;
    }
}

export {
    TextureStorage2D
}