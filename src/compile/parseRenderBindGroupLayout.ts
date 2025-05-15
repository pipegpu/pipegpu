import type { Context } from "../res/Context"
import type { FragmentShader } from "../res/shader/FragmentShader"
import type { VertexShader } from "../res/shader/VertexShader"
import { parseBindGroupLayout } from "./parseBindGroupLayout";

/**
 * 
 * @param ctx 
 * @param vertexShader 
 * @param fragmentShader 
 * @param bindGroupLayouts 
 * @param gourpIDWithBindGroupLayoutMap 
 * @param gourpIDWithBindGroupLayoutDescriptorMap 
 * @returns 
 */
const parseRenderBindGroupLayout = (
    ctx: Context,
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    bindGroupLayouts: GPUBindGroupLayout[],
    gourpIDWithBindGroupLayoutMap: Map<number, GPUBindGroupLayout>,
    gourpIDWithBindGroupLayoutDescriptorMap: Map<number, GPUBindGroupLayoutDescriptor>
) => {
    const collectedBindGroupLayoutEntriesMap: Map<number, GPUBindGroupLayoutEntry[]> = new Map();

    const maxBindGroups: number = ctx.getLimits().maxBindGroups;
    const vsMap = vertexShader.getBindGroupWithGroupLayoutEntriesMap(), fsMap = fragmentShader.getBindGroupWithGroupLayoutEntriesMap();
    if (vsMap?.size + fsMap?.size >= maxBindGroups * 2) {
        console.log(`[E][parseRenderBindGroupLayout] bindgroup over size.`);
        return;
    }

    for (let bindGroupID = 0; bindGroupID < ctx.getLimits().maxBindGroups; bindGroupID++) {
        const resourceBindings: GPUBindGroupLayoutEntry[] = [];
        if (vsMap.has(bindGroupID)) {
            const bindings: GPUBindGroupLayoutEntry[] = vsMap.get(bindGroupID) as GPUBindGroupLayoutEntry[];
            resourceBindings.push(...bindings);
        }
        if (fsMap.has(bindGroupID)) {
            const bindings: GPUBindGroupLayoutEntry[] = fsMap.get(bindGroupID) as GPUBindGroupLayoutEntry[];
            resourceBindings.push(...bindings);
        }
        if (resourceBindings.length) {
            collectedBindGroupLayoutEntriesMap.set(bindGroupID, resourceBindings);
            if (collectedBindGroupLayoutEntriesMap.size != bindGroupID + 1) {
                console.log(`[E][parseRenderBindGroupLayout] binding group should use in order from start [0 to ${maxBindGroups}], please check shader binding group index.`);
                collectedBindGroupLayoutEntriesMap.clear();
                return;
            }
        }
    }

    parseBindGroupLayout(
        ctx,
        collectedBindGroupLayoutEntriesMap,
        bindGroupLayouts,
        gourpIDWithBindGroupLayoutMap,
        gourpIDWithBindGroupLayoutDescriptorMap
    );
}

export {
    parseRenderBindGroupLayout
}