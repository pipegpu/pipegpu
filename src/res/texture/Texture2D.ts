import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat } from "../Format";
import { BaseTexture } from "./BaseTexture";

/**
 * 
 */
class Texture2D extends BaseTexture {
    /**
     * 
     */
    protected textureData?: TypedArray1DFormat;

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
            appendixTextureUsages?: number,
            textureData?: TypedArray1DFormat,
            textureFormat?: GPUTextureFormat,
            mipmapCount?: number,
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            width: opts.width,
            height: opts.height,
            depthOrArrayLayers: 1,
            textureUsageFlags: (opts.appendixTextureUsages || 0) | GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
            textureFormat: opts.textureFormat,
            mipmapCount: opts.mipmapCount,
            propertyFormat: 'texture2D'
        });
        this.textureData = opts.textureData;
    }

    /**
     * 
     */
    protected refreshTextureDataSource() {
        // depth texture not allow texture write from cpu.
        if (this.textureData && !this.isDetphTexture()) {
            const destination: GPUTexelCopyTextureInfo = {
                texture: this.texture!
            };
            const dataLayout: GPUTexelCopyBufferLayout = this.getTexelCopyBufferLayout();
            this.context.getGpuQueue().writeTexture(destination, this.textureData, dataLayout, this.extent3d);
        }
    }

    /**
     * 
     */
    protected override createGpuTexture(): void {
        const desc: GPUTextureDescriptor = {
            size: this.extent3d,
            format: this.textureFormat,
            usage: this.textureUsageFlags,
            mipLevelCount: this.mipmapCount,
        };
        // write texture
        this.texture = this.context.getGpuDevice().createTexture(desc);
        this.refreshTextureDataSource();
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

    /**
     * 
     * @returns 
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
                switch (this.textureFormat) {
                    case 'depth24plus':
                    case 'depth16unorm':
                    case 'depth24plus-stencil8':
                    case 'depth32float':
                    case 'depth32float-stencil8':
                        {
                            desc.aspect = 'depth-only';
                            desc.mipLevelCount = 1;
                            break;
                        }
                    case 'stencil8':
                        {
                            desc.aspect = 'stencil-only';
                            desc.mipLevelCount = 1;
                            break;
                        }
                    default: {
                        desc.mipLevelCount = this.mipmapCount - k;
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
    Texture2D
}