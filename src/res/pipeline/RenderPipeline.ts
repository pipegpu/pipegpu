import type { Context } from "../Context";
import { BasePipeline } from "./BasePipeline";

/**
 * 
 * @class RenderPipeline
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
            context: Context,
            renderPipelineDescriptor: GPURenderPipelineDescriptor
        }
    ) {
        super({
            id: opts.id,
            context: opts.context,
            propertyFormat: 'renderPipeline'
        });
        this.renderPipelineDescriptor = opts.renderPipelineDescriptor;
    }

    /**
     * 
     */
    private createGpuRenderPipeline = (): void => {
        this.renderPipeline = this.context.getGpuDevice().createRenderPipeline(this.renderPipelineDescriptor);
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