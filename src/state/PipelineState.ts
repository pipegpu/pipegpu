import type { Context } from "../res/Context"
import type { BasePipeline } from "../res/pipeline/BasePipeline";
import { RenderPipeline } from "../res/pipeline/RenderPipeline";
import { uniqueID } from "../util/uniqueID";

/**
 * 
 */
class PipelineState {
    /**
     * 
     */
    private static PIPELINE_SET: Map<number, BasePipeline> = new Map();

    /**
     * 
     */
    private ctx: Context;

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
    getPipeline = (id: number): BasePipeline | undefined => {
        if (!PipelineState.PIPELINE_SET.has(id)) {
            console.log(`[E][PipelineState][getPipeline] find pipeline failed, id: ${id}`);
        } else {
            return PipelineState.PIPELINE_SET.get(id);
        }
    }

    /**
     * 
     */
    createRenderPipeline = (renderPipelineDescriptor: GPURenderPipelineDescriptor, id: number = -1): RenderPipeline => {
        if (!PipelineState.PIPELINE_SET.has(id)) {
            id = uniqueID();
            const pipeline = new RenderPipeline({
                id: id,
                ctx: this.ctx,
                renderPipelineDescriptor: renderPipelineDescriptor
            });
            PipelineState.PIPELINE_SET.set(id, pipeline);

        }
        return this.getPipeline(id) as RenderPipeline;
    }

}

export {
    PipelineState
}