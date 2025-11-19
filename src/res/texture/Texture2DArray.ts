import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray2DFormat } from "../Format";
import type { TextureArrayHandle } from "../Handle";
import { BaseTexture } from "./BaseTexture";

/**
 * @description
 * @class Texture2DArray
 */
class Texture2DArray extends BaseTexture {
    /**
     * 
     */
    protected textureData2DArray?: TypedArray2DFormat;

    /**
     * 
     */
    protected handler?: TextureArrayHandle;

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
            depthOrArrayLayers: number,
            appendixTextureUsages?: number,
            textureDataArray?: TypedArray2DFormat,
            handler?: TextureArrayHandle,
            textureFormat?: GPUTextureFormat,
            mipmapCount?: number
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            width: opts.width,
            height: opts.height,
            depthOrArrayLayers: opts.depthOrArrayLayers,
            textureUsageFlags: (opts.appendixTextureUsages || 0) | GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
            textureFormat: opts.textureFormat,
            mipmapCount: opts.mipmapCount,
            propertyFormat: 'texture2DArray'
        });
        this.textureData2DArray = opts.textureDataArray;
        this.handler = opts.handler;
    }

    /**
     * 
     */
    protected refreshTextureDataSource() {
        if (this.textureData2DArray && this.textureData2DArray.length > 0 && !this.isDetphTexture()) {
            const destination: GPUTexelCopyTextureInfo = {
                texture: this.texture!
            };
            const dataLayout: GPUTexelCopyBufferLayout = this.getTexelCopyBufferLayout();
            const oneLayerExtent3d: GPUExtent3DDict = {
                width: this.width,
                height: this.height,
                depthOrArrayLayers: 1,
            };
            for (let index: number = 0, len = this.textureData2DArray.length; index < len; index++) {
                destination.origin = [0, 0, index];
                this.context.getGpuQueue().writeTexture(destination, (this.textureData2DArray[index] as Uint8Array).buffer, dataLayout, oneLayerExtent3d);
            }
            // clear
            this.textureData2DArray.length = 0;
            this.textureData2DArray = undefined;
        } else if (this.handler && !this.isDetphTexture()) {
            const handData = this.handler();
            if (handData.rewrite) {
                const destination: GPUTexelCopyTextureInfo = {
                    texture: this.texture!
                };
                const dataLayout: GPUTexelCopyBufferLayout = this.getTexelCopyBufferLayout();
                const oneLayerExtent3d: GPUExtent3DDict = {
                    width: this.width,
                    height: this.height,
                    depthOrArrayLayers: 1,
                };
                handData.details.forEach(detail => {
                    destination.origin = [0, 0, detail.depthOrArrayLayerIndex];
                    this.context.getGpuQueue().writeTexture(destination, (detail.rawData as Uint8Array).buffer, dataLayout, oneLayerExtent3d);
                });
                // clear
                handData.details.length = 0
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
            dimension: this.getTextureDimension(),
            mipLevelCount: this.mipmapCount
        };
        this.texture = this.context.getGpuDevice().createTexture(desc);
        this.refreshTextureDataSource();
    }

    /**
     * 
     * @param _encoder 
     * @param frameStage 
     * @returns 
     */
    override getGpuTexture(_encoder?: GPUCommandEncoder, _frameStage?: FrameStageFormat): GPUTexture {
        if (!this.texture) {
            this.createGpuTexture();
        }
        this.refreshTextureDataSource();
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
            for (let k = 0; k < this.mipmapCount; k++) {
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
    Texture2DArray
}