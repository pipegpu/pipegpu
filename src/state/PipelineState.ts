import type { Context } from "../res/Context"
import type { BasePipeline } from "../res/pipeline/BasePipeline";
import { ComputePipeline } from "../res/pipeline/ComputePipeline";
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
    getPipeline = (pipelineID: number): BasePipeline | undefined => {
        if (!PipelineState.PIPELINE_SET.has(pipelineID)) {
            throw new Error(`[E][PipelineState][getPipeline] find pipeline failed, id: ${pipelineID}`);
        } else {
            return PipelineState.PIPELINE_SET.get(pipelineID);
        }
    }

    /**
     * 
     */
    createRenderPipeline = (renderPipelineDescriptor: GPURenderPipelineDescriptor): RenderPipeline => {
        const renderPipelineID: number = uniqueID();
        const pipeline = new RenderPipeline({
            id: renderPipelineID,
            ctx: this.ctx,
            renderPipelineDescriptor: renderPipelineDescriptor
        });
        PipelineState.PIPELINE_SET.set(renderPipelineID, pipeline);
        return this.getPipeline(renderPipelineID) as RenderPipeline;
    }

    /**
     * 
     * @param computePipelineDescriptor 
     */
    createComputePipeline = (computePipelineDescriptor: GPUComputePipelineDescriptor): ComputePipeline => {
        const computePipelineID: number = uniqueID();
        const pipeline = new ComputePipeline({
            id: computePipelineID,
            ctx: this.ctx,
            computePipelineDescriptor: computePipelineDescriptor
        });
        PipelineState.PIPELINE_SET.set(computePipelineID, pipeline);
        return this.getPipeline(computePipelineID) as ComputePipeline;
    }

}

export {
    PipelineState
}