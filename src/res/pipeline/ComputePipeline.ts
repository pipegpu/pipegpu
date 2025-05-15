import type { Context } from "../Context";
import { BasePipeline } from "./BasePipeline";

/**
 * 
 */
class ComputePipeline extends BasePipeline {
    /**
     * 
     */
    private computePipelineDescriptor: GPUComputePipelineDescriptor;

    /**
     * 
     */
    private computePipeline: GPUComputePipeline | undefined;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            computePipelineDescriptor: GPUComputePipelineDescriptor
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            propertyFormat: 'computePipeline'
        });
        this.computePipelineDescriptor = opts.computePipelineDescriptor;
    }

    /**
     * 
     */
    private createGpuComputePipeline = (): void => {
        this.computePipeline = this.ctx.getGpuDevice().createComputePipeline(this.computePipelineDescriptor);
    }

    /**
     * 
     * @returns 
     */
    getGpuComputePipeline = (): GPUComputePipeline => {
        if (!this.computePipeline) {
            this.createGpuComputePipeline();
        }
        return this.computePipeline as GPUComputePipeline;
    }
}

export {
    ComputePipeline
}