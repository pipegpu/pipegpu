import { WgslReflect } from "wgsl_reflect";
import type { GPUShaderStageFormat } from "../res/Format";


interface IResourceBinding {

}

interface IReflectUniforms {
    bindGroupCount: number,
    groupIDwithBindGroupLayoutEntryMap: Map<number, GPUBindGroupLayoutEntry>,
    groupIDwithResourceBindingMap: Map<number, IResourceBinding>
}

const reflectShaderUniforms = (code: string, entryPoint: string, shaderStage: GPUShaderStageFormat): IReflectUniforms => {
    let reflectUniforms: IReflectUniforms = {
        bindGroupCount: 0,
        groupIDwithBindGroupLayoutEntryMap: undefined,
        groupIDwithResourceBindingMap: undefined
    };
    return reflectUniforms;
}

export {
    type IResourceBinding,
    type IReflectUniforms,
    reflectShaderUniforms
}