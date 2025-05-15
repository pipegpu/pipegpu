import type { Context } from "../res/Context"
import type { ComputeShader } from "../res/shader/ComputeShader"
import { parseBindGroupLayout } from "./parseBindGroupLayout";

/**
 * 
 */
const parseComputeBindGroupLayout = (
    ctx: Context,
    computeShader: ComputeShader,
    bindGroupLayouts: GPUBindGroupLayout[],
    gourpIDWithBindGroupLayoutMap: Map<number, GPUBindGroupLayout>,
    gourpIDWithBindGroupLayoutDescriptorMap: Map<number, GPUBindGroupLayoutDescriptor>
) => {
    const collectedBindgroupLayoutEntriesMap: Map<number, GPUBindGroupLayoutEntry[]> = new Map();

    const maxBindGroups: number = ctx.getLimits().maxBindGroups;
    const cpMap = computeShader.getBindGroupWithGroupLayoutEntriesMap();
    if (cpMap?.size >= maxBindGroups) {
        throw new Error(`[E][parseComputeBindGroupLayout] bindgroup over size. maxBindGroup :${maxBindGroups}`);
    }

    for (let bindGroupID = 0; bindGroupID < ctx.getLimits().maxBindGroups; bindGroupID++) {
        const resourceBindings: GPUBindGroupLayoutEntry[] = [];
        if (cpMap.has(bindGroupID)) {
            const bindings: GPUBindGroupLayoutEntry[] = cpMap.get(bindGroupID) as GPUBindGroupLayoutEntry[];
            resourceBindings.push(...bindings);
        }
        if (resourceBindings.length) {
            collectedBindgroupLayoutEntriesMap.set(bindGroupID, resourceBindings);
            if (collectedBindgroupLayoutEntriesMap.size != bindGroupID + 1) {
                console.log(`[E][parseRenderBindGroupLayout] binding group should use in order from start [0 to ${maxBindGroups}], please check shader binding group index.`);
                collectedBindgroupLayoutEntriesMap.clear();
                return;
            }
        }
    }

    parseBindGroupLayout(
        ctx,
        collectedBindgroupLayoutEntriesMap,
        bindGroupLayouts,
        gourpIDWithBindGroupLayoutMap,
        gourpIDWithBindGroupLayoutDescriptorMap
    );
}

export {
    parseComputeBindGroupLayout
}