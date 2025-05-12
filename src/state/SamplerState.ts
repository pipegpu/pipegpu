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
    constructor(
        opts: {
            ctx: Context
        }
    ) {
        this.ctx = opts.ctx;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    getSampler = (id: number): BaseSampler | undefined => {
        if (!SamplerState.SAMPLER_SET.has(id)) {
            console.log(`[E][SamplerState][getSampler] find sampler failed, id: ${id}`);
        } else {
            return SamplerState.SAMPLER_SET.get(id);
        }
    }
}

export {
    SamplerState
}