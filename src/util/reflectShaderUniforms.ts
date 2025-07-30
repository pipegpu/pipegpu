import { CallExpr, FunctionInfo, ResourceType, VariableInfo, WgslReflect } from "wgsl_reflect";

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
const getSamplerBindingType = (binding: VariableInfo): GPUSamplerBindingType => {
    if (binding.resourceType === ResourceType.Sampler) {
        return "filtering";
    }
    throw new Error(`[E][reflectShaderUniforms][getSamplerBindingType] unsupported buffer binding type: ${binding.resourceType}`);
}

/**
 * 
 * @param binding 
 * @returns 
 * 
 */
const getBufferBindingType = (binding: VariableInfo): GPUBufferBindingType => {
    if (binding.resourceType === ResourceType.Uniform) {
        return "uniform";
    } else if (binding.resourceType === ResourceType.Storage && binding.access === "read") {
        return "read-only-storage"
    } else if (binding.resourceType === ResourceType.Storage && binding.access === "read_write") {
        return "storage";
    } else {
        throw new Error(`[E][reflectShaderUniforms][getBufferBindingType] unsupported buffer binding type: ${binding.resourceType}`);
    }
}

/**
 * 
 * ref:
 * https://www.w3.org/TR/webgpu/#gputexture
 * @param binding 
 * @returns 
 * 
 */
const getTextureViewDimension = (binding: VariableInfo): GPUTextureViewDimension => {
    switch (binding.type.name) {
        case 'texture_1d':
        case 'texture_storage_1d':
            return '1d';
        case 'texture_2d':
        case 'texture_storage_2d':
        case 'texture_multisampled_2d':
        case 'texture_depth_2d':
        case 'texture_depth_multisampled_2d':
            return '2d';
        case 'texture_2d_array':
        case 'texture_storage_2d_array':
        case 'texture_depth_2d_array':
            return '2d-array';
        case 'texture_cube':
        case 'texture_depth_cube':
            return 'cube';
        case 'texture_cube_array':
        case 'texture_depth_cube_array':
            return 'cube-array';
        case 'texture_3d':
        case 'texture_storage_3d':
            return '3d';
        default: {
            throw new Error(`[E][reflectShaderUniforms][getTextureViewDimension] unsupported binding texture type name: ${binding.type.name}`);
        }
    }
};

const getTextureFormatByTexelType = (binding: VariableInfo): GPUTextureFormat => {
    const t: string = (binding as any).type.format.name;
    switch (t) {
        case 'r32float':
            return 'r32float';
        default:
            {
                throw new Error(`[E][getTextureFormatByTexelType] unsupported texel type: ${t}`);
            }
    }
}

/**
 * ref: https://www.w3.org/TR/WGSL/#memory-access-mode
 * @param binding 
 */
const getStorageTextureAccess = (binding: VariableInfo): GPUStorageTextureAccess => {
    const t: string = (binding as any).type.access;
    switch (t) {
        case 'read':
            return 'read-only';
        case 'write':
            return 'write-only';
        case 'read_write':
            return 'read-write';
        default: {
            throw new Error(`[E][getStorageTextureAccess] unspported texture acecessor type in valid storage texture access. type: ${t}`);
        }
    }
};

/**
 * 
 * @param binding 
 * @returns 
 * 
 */
const getTextureSampleType = (binding: VariableInfo): GPUTextureSampleType => {
    const typeName: string = binding.type.getTypeName();
    if (typeName.includes('texture_depth_cube') || typeName.includes('texture_depth_cube_array')) {
        return 'depth';
    } else if (typeName.includes('f32') || typeName.includes('f16')) {
        return 'float';
    } else if (typeName.includes('u32') || typeName.includes('u16')) {
        return 'uint';
    } else if (typeName.includes('i32') || typeName.includes('i16')) {
        return 'sint';
    }
    throw new Error(`[E][reflectShaderUniforms][getTextureSampleType] unsupported binding texture type name: ${binding.type.name}`);
};

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
                {
                    bindGroupLayoutEntry.texture = {};
                    bindGroupLayoutEntry.texture.viewDimension = getTextureViewDimension(binding);
                    // TODO, texture format show texture value itself
                    bindGroupLayoutEntry.texture.sampleType = getTextureSampleType(binding);
                    groups.push(bindGroupLayoutEntry);
                    resourceBindings.push(binding);
                    break;
                }
            case ResourceType.StorageTexture:
                {
                    bindGroupLayoutEntry.storageTexture = { format: getTextureFormatByTexelType(binding) };
                    bindGroupLayoutEntry.storageTexture.access = getStorageTextureAccess(binding);
                    bindGroupLayoutEntry.storageTexture.viewDimension = getTextureViewDimension(binding);
                    groups.push(bindGroupLayoutEntry);
                    resourceBindings.push(binding);
                    break;
                }
            case ResourceType.Sampler:
                {
                    bindGroupLayoutEntry.sampler = {};
                    bindGroupLayoutEntry.sampler.type = getSamplerBindingType(binding);
                    groups.push(bindGroupLayoutEntry);
                    resourceBindings.push(binding);
                    break;
                }

            default:
                {
                    throw new Error(`[E][reflectShaderUniforms] unsupported resource binding resource type: ${binding.resourceType}`);
                }
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