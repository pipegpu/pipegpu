import { WgslReflect } from "wgsl_reflect";

interface IReflectAttributes {
    attributeCount: number,
    attributeMap: Map<string, GPUVertexAttribute>,
    attributeOdered: Array<GPUVertexAttribute>,
    locationMap: Map<number, string>
}


const reflectShaderAttributes = (code: string, entryPoint: string): IReflectAttributes => {

    const reflect = new WgslReflect(code);






    let reflectAttributes: IReflectAttributes = {
        attributeCount: 0,
        attributeMap: undefined,
        attributeOdered: [],
        locationMap: undefined
    };
    return reflectAttributes;
}

export {
    reflectShaderAttributes
}
