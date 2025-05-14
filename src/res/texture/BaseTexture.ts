import { getMaxMipmapLevel } from "../../util/getMaxMipmapLevel";
import type { Context } from "../Context"
import type { FrameStageFormat, PropertyFormat } from "../Format";

/**
 * 
 * @param propertyFormat 
 * @returns 
 */
const getTextureViewDimension = (propertyFormat: PropertyFormat): GPUTextureViewDimension => {
    switch (propertyFormat) {
        case 'texture2D':
            return '2d';
        default:
            console.log(`[E][getTextureViewDimension] unspported texture property format: ${propertyFormat}`);
            return '2d';
    }
}

/**
 * 
 */
abstract class BaseTexture {
    /**
     * 
     */
    private id: number;

    /**
     * 
     */
    protected textureUsageFlags: GPUTextureUsageFlags;

    /**
     * 
     */
    protected ctx: Context;

    /**
     * 
     */
    protected texture: GPUTexture | undefined;

    /**
     * 
     */
    protected textureViews: GPUTextureView[] = [];

    /**
     * 
     */
    protected mipCurosr: number = 0;

    /**
     * 
     */
    private maxMipLevel: number = 1;

    /**
     * 
     */
    protected extent3d: GPUExtent3D;

    /**
     * 
     */
    protected textureFormat: GPUTextureFormat;

    /**
     * 
     */
    protected width: number;

    /**
     * 
     */
    protected height: number;

    /**
     * 
     */
    protected depthOrArrayLayers: number;

    /**
     * 
     */
    protected propertyFormat: PropertyFormat;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            textureUsageFlags: GPUTextureUsageFlags
            width: number,
            height: number,
            propertyFormat: PropertyFormat,
            textureFormat?: GPUTextureFormat,
            depthOrArrayLayers?: number,
            maxMipLevel?: number
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.textureUsageFlags = opts.textureUsageFlags;
        this.width = opts.width;
        this.height = opts.height;
        this.depthOrArrayLayers = opts.depthOrArrayLayers || 1;
        this.extent3d = [opts.width, opts.height, opts.depthOrArrayLayers || 1];
        this.textureFormat = opts.textureFormat || this.ctx.getPreferredTextureFormat();
        this.propertyFormat = opts.propertyFormat;
        if (this.isDetphTexture()) {
            this.maxMipLevel = 1;
        } else {
            this.maxMipLevel = opts.maxMipLevel || getMaxMipmapLevel(...this.extent3d);
        }
    }

    /**
     * 
     * @returns 
     */
    getPropertyFormat = () => {
        return this.propertyFormat;
    }

    /**
     * 
     * @returns 
     */
    getID = (): number => {
        return this.id;
    }

    /**
     * 
     * @returns 
     */
    getTextureFormat = (): GPUTextureFormat => {
        return this.textureFormat;
    }

    /**
    * depth texture default 
    */
    protected isDetphTexture = () => {
        return this.textureFormat === 'depth16unorm' ||
            this.textureFormat === 'depth24plus' ||
            this.textureFormat === 'depth24plus-stencil8' ||
            this.textureFormat == 'depth32float' ||
            this.textureFormat == 'depth32float-stencil8';
    }

    /**
     * 
     */
    protected createGpuTextureViews = (): void => {
        if (!this.texture) {
            this.createGpuTexture();
        }

        for (let k = 0; k < this.maxMipLevel; k++) {
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
                    desc.mipLevelCount = this.maxMipLevel - k;
                    desc.aspect = 'all';
                    break;
                }
            }
            desc.dimension = getTextureViewDimension(this.propertyFormat);
            desc.format = this.textureFormat;
            this.textureViews[k] = (this.texture as GPUTexture).createView(desc);
        }
    }

    /**
     * cursor to next view
     */
    nextCursor = (): void => {
        this.mipCurosr = (++this.mipCurosr) % this.maxMipLevel;
    }

    /**
     * 
     * @param absCursor 
     */
    cursor = (absCursor: number): void => {
        this.mipCurosr = absCursor % this.maxMipLevel;
    }

    /**
     * 
     */
    protected abstract createGpuTexture(): void;

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    abstract getGpuTexture(encoder: GPUCommandEncoder, frameStage: FrameStageFormat): GPUTexture;

    /**
     * 
     */
    abstract getGpuTextureView(): GPUTextureView;
}

export {
    BaseTexture
}