import type { Handle2D } from "../buffer/BaseBuffer";
import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray2DFormat } from "../Format";
import { BaseTexture } from "./BaseTexture";

/**
 * 
 */
class Texture2DArray extends BaseTexture {
    /**
     * 
     */
    protected textureDataArray?: TypedArray2DFormat;

    /**
     * 
     */
    protected handler?: Handle2D;

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
            array: number,
            appendixTextureUsages?: number,
            textureDataArray?: TypedArray2DFormat,
            handler?: Handle2D,
            textureFormat?: GPUTextureFormat,
            maxMipLevel?: number
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            width: opts.width,
            height: opts.height,
            depthOrArrayLayers: opts.array,
            textureUsageFlags: (opts.appendixTextureUsages || 0) | GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
            textureFormat: opts.textureFormat,
            maxMipLevel: opts.maxMipLevel,
            propertyFormat: 'texture2DArray'
        });
        this.textureDataArray = opts.textureDataArray;
        this.handler = opts.handler;
    }

    /**
     * 
     */
    protected refreshTextureDataSource() {
        if (this.textureDataArray && !this.isDetphTexture()) {
            const destination: GPUTexelCopyTextureInfo = {
                texture: this.texture!
            };
            const dataLayout: GPUTexelCopyBufferLayout = this.getTexelCopyBufferLayout();
            for (let index: number = 0; index < this.textureDataArray.length; index++) {
                destination.origin = [0, 0, index];
                this.ctx.getGpuQueue().writeTexture(destination, this.textureDataArray[index], dataLayout, this.extent3d);
            }
        }
    }

    /**
     * 
     */
    protected override createGpuTexture(): void {
        const desc: GPUTextureDescriptor = {
            label: `[TextureArray]`,
            size: this.extent3d,
            format: this.textureFormat,
            usage: this.textureUsageFlags,
            dimension: this.getTextureDimension()
        };
        this.texture = this.ctx.getGpuDevice().createTexture(desc);
        this.refreshTextureDataSource();
    }

    /**
     * 
     * @param _encoder 
     * @param frameStage 
     * @returns 
     */
    override getGpuTexture(_encoder: GPUCommandEncoder, frameStage: FrameStageFormat): GPUTexture {
        if (!this.texture) {
            this.createGpuTexture();
        }
        if ('frameBegin' === frameStage && this.handler) {
            this.textureDataArray = this.handler();
            this.refreshTextureDataSource();
        }
        return this.texture!;
    }

    /**
     * 
     * @returns 
     */
    override getGpuTextureView(): GPUTextureView {
        if (!this.textureViews.length) {
            if (!this.texture) {
                this.createGpuTexture();
            }
            for (let k = 0; k < this.maxMipLevel; k++) {
                const desc: GPUTextureViewDescriptor = {};
                desc.baseArrayLayer = 0;
                desc.arrayLayerCount = (this.extent3d as GPUExtent3DDict).depthOrArrayLayers;
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
                        desc.mipLevelCount = this.maxMipLevel - k;
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
    Texture2DArray
}