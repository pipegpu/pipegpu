import type { Context } from "../Context";
import type { TypedArray1DFormat } from "../Format";
import { Texture2D } from "./Texture2D";

/**
 * 
 * webgpu use texture storage to write/store result.
 * 
 */
class TextureStorage2D extends Texture2D {

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            width: number,
            height: number,
            textureData?: TypedArray1DFormat,
            mipmapCount?: number,
            textureUsageFlags?: number,
            textureFormat?: GPUTextureFormat,
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            width: opts.width,
            height: opts.height,
            textureFormat: opts.textureFormat,
            mipmapCount: opts.mipmapCount,
        });
        this.textureData = opts.textureData;
        this.depthOrArrayLayers = 1;
        this.textureUsageFlags = this.textureUsageFlags | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC;
        this.propertyFormat = 'textureStorage2D';
    }

    /**
     * texture storage (write enabled texture) must set mipLevelCount as 1
     * @returns 
     * 
     */
    override getGpuTextureView = (): GPUTextureView => {
        if (!this.textureViews.length) {
            if (!this.texture) {
                this.createGpuTexture();
            }
            for (let k = 0; k < this.mipmapCount; k++) {
                const desc: GPUTextureViewDescriptor = {};
                desc.baseArrayLayer = 0;
                desc.arrayLayerCount = 1;
                desc.baseMipLevel = k;
                desc.mipLevelCount = 1;             // each view has 1 miplevel count.
                switch (this.textureFormat) {
                    case 'depth16unorm':
                    case 'depth24plus':
                    case 'depth32float':
                        {
                            desc.aspect = 'depth-only';
                            break;
                        }
                    case 'stencil8':
                        {
                            desc.aspect = 'stencil-only';
                            break;
                        }
                    case 'depth24plus-stencil8':
                    case 'depth32float-stencil8':
                        {
                            desc.aspect = 'depth-only';
                            console.warn(`[W][Texture2D][getGpuTextureView] texture depth24plus-stencil8/depth32float-stencil8 are not 
                                recommanded because we cannot guess it's aspect, so we use depth-only force. Therefore, we recommend using 
                                depth16unorm'/'depth24plus'/'depth32float' for depth-only and 'stencil8' for stencil-only.`)
                            break;
                        };
                    default: {
                        desc.aspect = 'all';
                        break;
                    }
                }
                desc.dimension = this.getTextureViewDimension();
                desc.format = this.textureFormat;
                this.textureViews[k] = (this.texture as GPUTexture).createView(desc);
            }
        }
        return this.textureViews[this.mipCurosr];
    }

}

export {
    TextureStorage2D
}