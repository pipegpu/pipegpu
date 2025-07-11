import type { Context } from "../Context";
import type { FrameStageFormat } from "../Format";

/**
 * 
 */
abstract class BaseSampler {

    /**
     * 
     */
    private id: number;

    /**
     * 
     */
    protected ctx: Context;

    /**
     * 
     */
    protected sampler!: GPUSampler;

    /**
     * 
     */
    protected samplerDesc!: GPUSamplerDescriptor;

    /**
     * 
     */
    protected addressModeU: GPUAddressMode;

    /**
     * 
     */
    protected addressModeV: GPUAddressMode;

    /**
     * 
     */
    protected addressModeW: GPUAddressMode;

    /**
     * 
     */
    protected magFilter: GPUFilterMode;

    /**
     * 
     */
    protected minFilter: GPUFilterMode;

    /**
     * 
     */
    protected mipmapFilter: GPUMipmapFilterMode;

    /**
     * 
     */
    protected lodMinClamp: number;

    /**
     * 
     */
    protected lodMaxClamp: number;

    /**
     * 
     */
    protected anisotropy: number;

    /**
     * 
     */
    protected compareFunction?: GPUCompareFunction;

    /**
     * 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            addressModeU?: GPUAddressMode,
            addressModeV?: GPUAddressMode,
            addressModeW?: GPUAddressMode,
            magFilter?: GPUFilterMode,
            minFilter?: GPUFilterMode,
            mipmapFilter?: GPUMipmapFilterMode,
            lodMinClamp?: number,
            lodMaxClamp?: number
            anisotropy?: number,
            compareFunction?: GPUCompareFunction,
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.addressModeU = opts.addressModeU || 'clamp-to-edge';
        this.addressModeV = opts.addressModeV || 'clamp-to-edge';
        this.addressModeW = opts.addressModeW || 'clamp-to-edge';
        this.magFilter = opts.magFilter || 'nearest';
        this.minFilter = opts.minFilter || 'nearest';
        this.mipmapFilter = opts.mipmapFilter || 'nearest';
        this.lodMinClamp = opts.lodMinClamp || 0.0;
        this.lodMaxClamp = opts.lodMaxClamp || 1.0;
        this.anisotropy = opts.anisotropy || 1;
        this.compareFunction = opts.compareFunction || 'always';
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
    protected createGpuSampler = (): GPUSampler => {
        if (!this.sampler) {
            this.samplerDesc = {};
            this.samplerDesc.addressModeU = this.addressModeU;
            this.samplerDesc.addressModeV = this.addressModeV;
            this.samplerDesc.addressModeW = this.addressModeW;
            this.samplerDesc.magFilter = this.magFilter;
            this.samplerDesc.minFilter = this.minFilter;
            this.samplerDesc.mipmapFilter = this.mipmapFilter;
            this.samplerDesc.lodMinClamp = this.lodMinClamp;
            this.samplerDesc.lodMaxClamp = this.lodMaxClamp;
            this.samplerDesc.maxAnisotropy = this.anisotropy;
            // TODO:: default non-compre sampler
            // this.samplerDesc.compare = this.compareFunction; 
            this.sampler = this.ctx?.getGpuDevice().createSampler(this.samplerDesc);
        }
        return this.sampler;
    }

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    abstract getGpuSampler(encoder: GPUCommandEncoder | null, frameStage: FrameStageFormat): GPUSampler;

}

export {
    BaseSampler
}