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
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx
        })
    }

    /**
     * 
     */
    createGpuSampler = (): void => {
        const desc: GPUSamplerDescriptor = {};
        this.sampler = this.ctx.getGpuDevice().createSampler(desc);
    }

    /**
     * 
     * @param _encoder 
     * @param _frameStage 
     * @returns 
     */
    override getGpuSampler = (_encoder: GPUCommandEncoder | null = null, _frameStage: FrameStageFormat = 'FrameBegin'): GPUSampler => {
        if (!this.sampler) {
            this.createGpuSampler();
        }
        return this.sampler as GPUSampler;
    }

}

export {
    TextureSampler
}