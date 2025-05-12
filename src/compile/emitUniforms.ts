import { ResourceType, type VariableInfo } from "wgsl_reflect"
import type { Context } from "../res/Context"
import type { ComputeShader } from "../res/shader/ComputeShader"
import type { FragmentShader } from "../res/shader/FragmentShader"
import { VertexShader } from "../res/shader/VertexShader"
import { BufferState } from "../state/BufferState"
import type { SamplerState } from "../state/SamplerState"
import type { TextureState } from "../state/TextureState"
import type { IUniformRecord } from "./parseUniform"

const emitUniforms = (
    opts: {
        ctx: Context,
        vertexShader?: VertexShader,
        fragmentShader?: FragmentShader,
        computeShader?: ComputeShader,
        bufferState: BufferState,
        textureState: TextureState,
        samplerState: SamplerState,
        uniformRecordMap: Map<string, IUniformRecord>,
        bufferIDUniformRecordsMap: Map<number, Map<string, IUniformRecord>>,
        gourpIDWithBindGroupLayoutMap: Map<number, GPUBindGroupLayout>,
        gourpIDWithBindGroupLayoutDescriptorMap: Map<number, GPUBindGroupLayoutDescriptor>,
    },
    slotBindGroupMap: Map<number, GPUBindGroup>,
    mergedUniformResourceMap: Map<number, VariableInfo[]>
) => {

    const mergeBindGroupWithResourceBindingsMap = () => {
        const MAXBINDGROUPS = opts.ctx.getLimits().maxBindGroups;
        const vsMap: Map<number, VariableInfo[]> = opts.vertexShader?.getBindGroupWithResourceBindingsMap() || new Map();
        const fsMap: Map<number, VariableInfo[]> = opts.fragmentShader?.getBindGroupWithResourceBindingsMap() || new Map();
        const cpMap: Map<number, VariableInfo[]> = opts.computeShader?.getBindGroupWithResourceBindingsMap() || new Map();
        if (vsMap.size >= MAXBINDGROUPS || fsMap.size >= MAXBINDGROUPS || cpMap.size >= MAXBINDGROUPS) {
            console.log(`[E][emitUniforms][mergeBindGroupWithResourceBindingsMap] over limits: ${MAXBINDGROUPS}`);
            return;
        }
        for (let k = 0; k < MAXBINDGROUPS; k++) {
            const resourceBindings: VariableInfo[] = [];
            if (vsMap.has(k)) {
                const vsResourceBindings = vsMap.get(k) || [];
                resourceBindings.concat(vsResourceBindings);
            }
            if (fsMap.has(k)) {
                const fsResourceBindings = vsMap.get(k) || [];
                resourceBindings.concat(fsResourceBindings);
            }
            if (cpMap.has(k)) {
                const cpResourceBindings = vsMap.get(k) || [];
                resourceBindings.concat(cpResourceBindings);
            }
            // 
            if (resourceBindings.length) {
                mergedUniformResourceMap.set(k, resourceBindings);
            }
        }
    };

    mergeBindGroupWithResourceBindingsMap();

    mergedUniformResourceMap.forEach((resourceBindings, bindGroupID) => {
        const bindGroupEntries: GPUBindGroupEntry[] = [];
        resourceBindings.forEach(resourceBinding => {
            let offset: number = 0;
            const key: string = resourceBinding.name;
            if (!opts.uniformRecordMap.has(key)) {
                console.log(`[E][emitUniforms] uniforms ${key} not exists.`);
                return;
            }
            const record = opts.uniformRecordMap.get(key);
            if (!record) {
                return;
            }
            const t = resourceBinding.resourceType;
            switch (t) {
                case ResourceType.Storage:
                case ResourceType.Uniform:
                    {
                        const resourcID = record?.resourceID as number;
                        const buffer = opts.bufferState.getBuffer(resourcID);
                        if (!buffer) {
                            return;
                        }
                        const gpuBufferBinding: GPUBufferBinding = {
                            buffer: buffer.getGpuBuffer(null, 'FrameBegin'),
                            offset: offset,
                            size: buffer.getByteLength(),

                        };
                        const bindGroupEntry: GPUBindGroupEntry = {
                            binding: resourceBinding.binding,
                            resource: gpuBufferBinding
                        };
                        bindGroupEntries.push(bindGroupEntry);
                        offset += resourceBinding.size;
                        break;
                    }
                case ResourceType.Texture:
                case ResourceType.StorageTexture:
                    {
                        const resourcID = record?.resourceID as number;
                        const textureView = opts.textureState.getTexture(resourcID)?.getTextureView() as GPUTextureView;
                        if (!textureView) {
                            console.log(`[E][emitUniforms] missing texture view, id:${resourcID}`);
                            return;
                        }
                        const bindGroupEntry: GPUBindGroupEntry = {
                            binding: resourceBinding.binding,
                            resource: textureView
                        };
                        bindGroupEntries.push(bindGroupEntry);
                        break;
                    }
                case ResourceType.Sampler:
                    {
                        const resourcID = record?.resourceID as number;
                        const sampler = opts.samplerState.getSampler(resourcID)?.getGpuSampler(null, 'FrameBegin');
                        if (!sampler) {
                            console.log(`[E][emitUniforms] missing uniforms, id:${resourcID}`);
                            return;
                        }
                        const bindGroupEntry: GPUBindGroupEntry = {
                            binding: resourceBinding.binding,
                            resource: sampler
                        };
                        bindGroupEntries.push(bindGroupEntry);
                        break;
                    }
                default:
                    {
                        console.log(`[E][emitUniforms] missing uniforms, resourceBindings: ${resourceBindings}`);
                        break;
                    }
            }
            const bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = opts.gourpIDWithBindGroupLayoutDescriptorMap.get(bindGroupID) as GPUBindGroupLayoutDescriptor;
            if ((bindGroupLayoutDescriptor.entries as GPUBindGroupLayoutEntry[]).length !== bindGroupEntries.length) {
                console.log("[E][emitUniforms] analysis bind_group_entries error.");
                return;
            }
            const bindGroupDescriptor: GPUBindGroupDescriptor = {
                layout: opts.gourpIDWithBindGroupLayoutMap.get(bindGroupID) as GPUBindGroupLayout,
                entries: bindGroupEntries
            };
            const bindGroup = opts.ctx.getGpuDevice().createBindGroup(bindGroupDescriptor);
            slotBindGroupMap.set(bindGroupID, bindGroup);
        });
    });
}

export {
    emitUniforms
}