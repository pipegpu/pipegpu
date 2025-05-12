import type { Context } from "../res/Context";

/**
 * 
 * @param ctx 
 * @param bindGroupLayouts 
 * @returns 
 */
const parsePipelineLayout = (
    ctx: Context,
    bindGroupLayouts: GPUBindGroupLayout[]
): GPUPipelineLayout => {
    const pipeLineLayoutDescriptor: GPUPipelineLayoutDescriptor = {
        bindGroupLayouts: bindGroupLayouts,
    };

    const pipelineLayout: GPUPipelineLayout = ctx.getGpuDevice().createPipelineLayout(pipeLineLayoutDescriptor);
    return pipelineLayout;
}

export {
    parsePipelineLayout
}