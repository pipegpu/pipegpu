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
    protected sampler: GPUSampler | undefined;

    /**
     * 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
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
     * @param encoder 
     * @param frameStage 
     */
    abstract getGpuSampler(encoder: GPUCommandEncoder | null, frameStage: FrameStageFormat): GPUSampler;
}

export {
    BaseSampler
}