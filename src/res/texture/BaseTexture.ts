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
    private extent3d: GPUExtent3D;

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
            depthOrArrayLayers?: number,
            maxMipLevel?: number
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.textureUsageFlags = opts.textureUsageFlags;
        this.extent3d = [opts.width, opts.height, opts.depthOrArrayLayers || 1];
        this.maxMipLevel = getMaxMipmapLevel(...this.extent3d);
    }

    /**
     * 
     * @returns 
     */
    getId = (): number => {
        return this.id;
    }

    /**
     * 
     */
    getTextureView = (): GPUTextureView => {
        if (!this.texture) {
            this.createGpuTexture();
        }
        if (this.textureViewArray.length === 0) {

        }
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
    abstract getGpuTexture(encoder: GPUCommandEncoder, frameStage: FrameStageFormat): void;
}

export {
    BaseTexture
}