import type { Context } from "../Context";
import { BasePipeline } from "./BasePipeline";

/**
 * 
 */
class RenderPipeline extends BasePipeline {
    /**
    * 
    */
    private renderPipelineDescriptor: GPURenderPipelineDescriptor

    /**
     * 
     */
    private renderPipeline: GPURenderPipeline | undefined;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            renderPipelineDescriptor: GPURenderPipelineDescriptor
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            propertyFormat: 'renderPipeline'
        });
        this.renderPipelineDescriptor = opts.renderPipelineDescriptor;
    }

    /**
     * 
     */
    private createGpuRenderPipeline = (): void => {
        this.renderPipeline = this.ctx.getGpuDevice().createRenderPipeline(this.renderPipelineDescriptor);
    }

    /**
     * 
     */
    getGpuRenderPipeline = (): GPURenderPipeline => {
        if (!this.renderPipeline) {
            this.createGpuRenderPipeline();
        }
        return this.renderPipeline as GPURenderPipeline;
    }
}

export {
    RenderPipeline
}