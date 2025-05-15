import { FunctionInfo, ResourceType, VariableInfo, WgslReflect } from "wgsl_reflect";

/**
 * 
 */
interface IReflectUniforms {
    bindGroupCount: number,
    groupIDwithBindGroupLayoutEntriesMap: Map<number, Array<GPUBindGroupLayoutEntry>>,
    groupIDwithResourceBindingsMap: Map<number, Array<VariableInfo>>
}

/**
 * 
 * @param t 
 */
const getSamplerBindingType = (binding: VariableInfo): GPUSamplerBindingType | undefined => {
    if (binding.resourceType === ResourceType.Sampler) {
        return "filtering";
    }
}

/**
 * 
 * @param binding 
 * @returns 
 */
const getBufferBindingType = (binding: VariableInfo): GPUBufferBindingType | undefined => {
    if (binding.resourceType === ResourceType.Uniform) {
        return "uniform";
    } else if (binding.resourceType === ResourceType.Storage && binding.access === "read") {
        return "read-only-storage"
    } else if (binding.resourceType === ResourceType.Storage && binding.access === "read_write") {
        return "storage";
    } else {
        console.log(`[E][getBufferBindingType] unsupported buffer binding type: ${binding.resourceType}`);
        return undefined;
    }
}

/**
 * 
 * @param code 
 * @param entryPoint 
 * @param shaderStage  GPUShaderStage.
 * @returns 
 */
const reflectShaderUniforms = (code: string, entryPoint: string, shaderStage: GPUFlagsConstant): IReflectUniforms => {
    const reflect = new WgslReflect(code);

    let rawEntry: FunctionInfo | undefined = undefined;
    switch (shaderStage) {
        case GPUShaderStage.VERTEX:
            reflect.entry.vertex.forEach(e => {
                if (e.name === entryPoint) {
                    rawEntry = e;
                }
            });
            break;
        case GPUShaderStage.FRAGMENT:
            reflect.entry.fragment.forEach(e => {
                if (e.name === entryPoint) {
                    rawEntry = e;
                }
            });
            break;
        case GPUShaderStage.COMPUTE:
            reflect.entry.compute.forEach(e => {
                if (e.name === entryPoint) {
                    rawEntry = e;
                }
            });
            break;
        default:
            {
                throw new Error(`[E][reflectShaderUniforms] unsupported shader stage ${shaderStage}`);
            }

    }
    if (rawEntry === undefined) {
        throw new Error(`entry point "${entryPoint}" not found in the shader code.`);
    }

    let groupIDwithBindGroupLayoutEntriesMap: Map<number, Array<GPUBindGroupLayoutEntry>> = new Map();
    let groupIDwithResourceBindingsMap: Map<number, Array<VariableInfo>> = new Map();

    const getBindGroupLayoutEntries = (group: number): Array<GPUBindGroupLayoutEntry> => {
        if (!groupIDwithBindGroupLayoutEntriesMap.has(group)) {
            let bindGroupEntries: Array<GPUBindGroupLayoutEntry> = [];
            groupIDwithBindGroupLayoutEntriesMap.set(group, bindGroupEntries);
        }
        return groupIDwithBindGroupLayoutEntriesMap.get(group) as Array<GPUBindGroupLayoutEntry>;
    }

    const getResourceBindingsByGroupID = (binding: number): Array<VariableInfo> => {
        if (!groupIDwithResourceBindingsMap.has(binding)) {
            let resourceBindings: Array<VariableInfo> = [];
            groupIDwithResourceBindingsMap.set(binding, resourceBindings);
        }
        return groupIDwithResourceBindingsMap.get(binding) as Array<VariableInfo>;
    }

    let entry: FunctionInfo = rawEntry as FunctionInfo;
    entry.resources.forEach(binding => {
        let bindGroupLayoutEntry: GPUBindGroupLayoutEntry = {
            binding: binding.binding,
            visibility: shaderStage
        };
        const groupID: number = binding.group;
        let groups = getBindGroupLayoutEntries(groupID);
        let resourceBindings = getResourceBindingsByGroupID(groupID);
        switch (binding.resourceType) {
            case ResourceType.Uniform:
            case ResourceType.Storage:
                {
                    bindGroupLayoutEntry.buffer = {};
                    bindGroupLayoutEntry.buffer.type = getBufferBindingType(binding);
                    bindGroupLayoutEntry.buffer.minBindingSize = binding.size;
                    groups.push(bindGroupLayoutEntry);
                    resourceBindings.push(binding);
                    break;
                }
            case ResourceType.Texture:
                if (bindGroupLayoutEntry.texture) {

                }
                break;
            case ResourceType.StorageTexture:
                if (bindGroupLayoutEntry.storageTexture) {
                    // bindGroupLayoutEntry.storageTexture.access
                }
                break;
            case ResourceType.Sampler:
                if (bindGroupLayoutEntry.sampler) {
                    bindGroupLayoutEntry.sampler.type = getSamplerBindingType(binding);
                }
                break;
            default:
                console.log(`[E][reflectShaderUniforms] unsupported resource binding resource type: ${binding.resourceType}`);
                break;
        }

    });

    let reflectUniforms: IReflectUniforms = {
        bindGroupCount: groupIDwithBindGroupLayoutEntriesMap.size,
        groupIDwithBindGroupLayoutEntriesMap: groupIDwithBindGroupLayoutEntriesMap,
        groupIDwithResourceBindingsMap: groupIDwithResourceBindingsMap,
    };

    return reflectUniforms;
}

export {
    type IReflectUniforms,
    reflectShaderUniforms
}