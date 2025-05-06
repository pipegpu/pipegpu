import { FunctionInfo, InputInfo, WgslReflect } from "wgsl_reflect";

interface IReflectAttributes {
    attributeCount: number,
    attributeMap: Map<string, GPUVertexAttribute>,
    attributeOdered: Array<GPUVertexAttribute>,
    locationMap: Map<number, string>
}


const reflectShaderAttributes = (code: string, entryPoint: string): IReflectAttributes => {

    const reflect = new WgslReflect(code);

    let vertexEntry: FunctionInfo | undefined = undefined;
    reflect.entry.vertex.forEach(e => {
        if (e.name === entryPoint) {
            vertexEntry = e;
        }
    });

    if (!vertexEntry) {
        throw new Error(`Entry point "${entryPoint}" not found in the shader code.`);
    }

    for (let k = 0, entry = vertexEntry as FunctionInfo; k < entry.inputs.length; k++) {
        let variable: InputInfo = entry.inputs[k];
        console.log(variable);
    }





    let reflectAttributes: IReflectAttributes = {
        attributeCount: 0,
        attributeMap: undefined,
        attributeOdered: [],
        locationMap: undefined
    };
    return reflectAttributes;
}

export {
    type IReflectAttributes,
    reflectShaderAttributes
}
