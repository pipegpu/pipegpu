import type { ComputePipeline } from "../res/pipeline/ComputePipeline";
import type { PipelineState } from "../state/PipelineState";

/**
 * 
 */
const emitComputePipeline = (
    opts: {
        debugLabel: string,
        computeProgrammableStage: GPUProgrammableStage,
        pipelineLayout: GPUPipelineLayout,
        pipelineState: PipelineState,
    }
): ComputePipeline => {
    const desc: GPUComputePipelineDescriptor = {
        compute: opts.computeProgrammableStage,
        layout: opts.pipelineLayout
    };
    return opts.pipelineState.createComputePipeline(desc);
}

export {
    emitComputePipeline
}