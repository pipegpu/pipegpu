import { WgslReflect } from "wgsl_reflect";


interface IResourceBinding {

}

interface IReflectUniforms {
    bindGroupCount: number,
    groupIDwithBindGroupLayoutEntryMap: Map<number, GPUBindGroupLayoutEntry>,
    groupIDwithResourceBindingMap: Map<number, IResourceBinding>
}

const reflectShaderUniforms = (code: string, entryPoint: string, shaderStage: GPUShaderStage): IReflectUniforms => {


    let reflectUniforms: IReflectUniforms = {
        bindGroupCount: 0,
        groupIDwithBindGroupLayoutEntryMap: undefined,
        groupIDwithResourceBindingMap: undefined
    };
    return reflectUniforms;
}