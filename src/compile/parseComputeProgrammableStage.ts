import type { ComputeShader } from "../res/shader/ComputeShader";

/**
 * 
 */
const parseComputeProgrammableStage = (
    opts: {
        debugLabel: string,
        computeShader: ComputeShader
    }
): GPUProgrammableStage => {
    const computeState: GPUProgrammableStage = {
        module: opts.computeShader.getGpuShader(),
        entryPoint: opts.computeShader.getEntryPoint(),
    };
    return computeState;
}

export {
    parseComputeProgrammableStage
}