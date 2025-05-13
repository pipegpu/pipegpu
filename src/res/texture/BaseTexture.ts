import { getMaxMipmapLevel } from "../../util/getMaxMipmapLevel";
import type { Context } from "../Context"
import type { FrameStageFormat } from "../Format";

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
    protected textureViewArray: GPUTextureView[] = [];

    /**
     * 
     */
    private mipCurosr: number = 0;

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
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            textureUsageFlags: GPUTextureUsageFlags
            width: number,
            height: number,
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
        this.maxMipLevel = getMaxMipmapLevel(...this.extent3d);
        this.textureFormat = opts.textureFormat || this.ctx.getPreferredTextureFormat();
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
     * 
     */
    protected abstract createGpuTexture(): void;

    /**
     * 
     */
    abstract getGpuTextureView(): GPUTextureView;

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    abstract getGpuTexture(encoder: GPUCommandEncoder, frameStage: FrameStageFormat): GPUTexture;
}

export {
    BaseTexture
}