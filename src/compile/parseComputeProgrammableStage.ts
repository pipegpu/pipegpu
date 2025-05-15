import type { ComputeShader } from "../res/shader/ComputeShader";

/**
 * 
 */
const parseComputeProgrammableStage = (
    computeShader: ComputeShader
): GPUProgrammableStage => {
    const computeState: GPUProgrammableStage = {
        module: computeShader.getGpuShader(),
        entryPoint: computeShader.getEntryPoint(),

    };
    return computeState;
}

export {
    parseComputeProgrammableStage
}