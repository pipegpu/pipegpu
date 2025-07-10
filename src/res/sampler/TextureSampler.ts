import type { Context } from "../Context";
import type { FrameStageFormat } from "../Format";
import { BaseSampler } from "./BaseSampler";

/**
 * 
 */
class TextureSampler extends BaseSampler {
    /**
     * 
     * @param opts 
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
        super(opts);
    }

    /**
     * 
     * @param _encoder 
     * @param _frameStage 
     * @returns 
     */
    override getGpuSampler = (_encoder: GPUCommandEncoder | null = null, _frameStage: FrameStageFormat = 'frameBegin'): GPUSampler => {
        if (!this.sampler) {
            this.createGpuSampler();
        }
        return this.sampler as GPUSampler;
    }

}

export {
    TextureSampler
}