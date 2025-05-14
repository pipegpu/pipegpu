import type { Context } from "../res/Context";
import type { BaseSampler } from "../res/sampler/BaseSampler";

/**
 * 
 */
class SamplerState {
    /**
     * 
     */
    private static SAMPLER_SET: Map<number, BaseSampler> = new Map();

    /**
     * 
     */
    ctx: Context;

    /**
     * 
     * @param opts 
     */
    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    getSampler = (samplerID: number): BaseSampler | undefined => {
        if (!SamplerState.SAMPLER_SET.has(samplerID)) {
            throw new Error(`[E][SamplerState][getSampler] find sampler failed, id: ${samplerID}`);
        }
        return SamplerState.SAMPLER_SET.get(samplerID);
    }
}

export {
    SamplerState
}