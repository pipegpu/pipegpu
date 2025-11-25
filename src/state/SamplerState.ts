import type { Context } from "../res/Context";
import type { BaseSampler } from "../res/sampler/BaseSampler";
import { ComparisonSampler } from "../res/sampler/ComparisonSampler";
import { TextureSampler } from "../res/sampler/TextureSampler";
import { uniqueID } from "../util/uniqueID";

/**
 * @class SamplerState
 */
class SamplerState {
    /**
     * 
     */
    private static SAMPLER_SET: Map<number, BaseSampler> = new Map();

    /**
     * 
     */
    private context: Context;

    /**
     * @param opts 
     */
    constructor(context: Context) {
        this.context = context;
    }

    /**
     * @param id 
     * @returns 
     */
    getSampler = (samplerID: number): BaseSampler | undefined => {
        if (!SamplerState.SAMPLER_SET.has(samplerID)) {
            throw new Error(`[E][SamplerState][getSampler] find sampler failed, id: ${samplerID}`);
        }
        return SamplerState.SAMPLER_SET.get(samplerID);
    }

    /**
     * @param opts 
     * @returns 
     */
    createTextureSampler = (
        opts: {
            addressModeU?: GPUAddressMode,
            addressModeV?: GPUAddressMode,
            addressModeW?: GPUAddressMode,
            magFilter?: GPUFilterMode,
            minFilter?: GPUFilterMode,
            mipmapFilter?: GPUMipmapFilterMode,
            lodMinClamp?: number,
            lodMaxClamp?: number
            anisotropy?: number,
            samplerBindingType?: GPUSamplerBindingType,
        }
    ): TextureSampler => {
        const samplerID: number = uniqueID();
        const sampler: TextureSampler = new TextureSampler({
            id: samplerID,
            context: this.context,
            addressModeU: opts.addressModeU,
            addressModeV: opts.addressModeV,
            addressModeW: opts.addressModeW,
            magFilter: opts.magFilter,
            minFilter: opts.minFilter,
            mipmapFilter: opts.mipmapFilter,
            lodMinClamp: opts.lodMinClamp,
            lodMaxClamp: opts.lodMaxClamp,
            anisotropy: opts.anisotropy,
            samplerBindingType: opts.samplerBindingType,
        });
        SamplerState.SAMPLER_SET.set(samplerID, sampler);
        return SamplerState.SAMPLER_SET.get(samplerID) as TextureSampler;
    }

    /**
     * @param opts 
     * @returns 
     */
    createComparisonSampler = (
        opts: {
            compareFunction: GPUCompareFunction,
            addressModeU?: GPUAddressMode,
            addressModeV?: GPUAddressMode,
            addressModeW?: GPUAddressMode,
            magFilter?: GPUFilterMode,
            minFilter?: GPUFilterMode,
            mipmapFilter?: GPUMipmapFilterMode,
            lodMinClamp?: number,
            lodMaxClamp?: number
            anisotropy?: number,
            samplerBindingType?: GPUSamplerBindingType,
        }
    ): ComparisonSampler => {
        const samplerID: number = uniqueID();
        const sampler: ComparisonSampler = new ComparisonSampler({
            id: samplerID,
            context: this.context,
            compareFunction: opts.compareFunction,
            addressModeU: opts.addressModeU,
            addressModeV: opts.addressModeV,
            addressModeW: opts.addressModeW,
            magFilter: opts.magFilter,
            minFilter: opts.minFilter,
            mipmapFilter: opts.mipmapFilter,
            lodMinClamp: opts.lodMinClamp,
            lodMaxClamp: opts.lodMaxClamp,
            anisotropy: opts.anisotropy,
            samplerBindingType: opts.samplerBindingType,
        });
        SamplerState.SAMPLER_SET.set(samplerID, sampler);
        return SamplerState.SAMPLER_SET.get(samplerID) as ComparisonSampler;
    }
}

export {
    SamplerState
}