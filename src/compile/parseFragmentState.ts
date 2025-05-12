import type { FragmentShader } from "../res/shader/FragmentShader";

/**
 * 
 * @param fragmentShader 
 * @param colorTargetStates 
 * @returns 
 */
const parseFragmentState = (
    fragmentShader: FragmentShader,
    colorTargetStates: GPUColorTargetState[]
): GPUFragmentState => {
    const fragmentState: GPUFragmentState = {
        targets: colorTargetStates,
        module: fragmentShader.getGpuShader(),
        entryPoint: fragmentShader.getEntryPoint(),
    };
    return fragmentState;
}

export {
    parseFragmentState
}