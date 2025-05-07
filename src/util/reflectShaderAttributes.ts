import { FunctionInfo, InputInfo, TypeInfo, WgslReflect } from "wgsl_reflect";

interface IReflectAttributes {
    attributeCount: number,
    attributeMap: Map<string, GPUVertexAttribute>,
    attributeOdered: Array<GPUVertexAttribute>,
    locationMap: Map<number, string>
}

/**
 * 
 * @param t 
 * @returns 
 */
const getVertexFormat = (t: TypeInfo): GPUVertexFormat => {
    switch (t.name) {
        // uint32
        case "u32":
            return "uint32";
        case "vec2u":
            return "uint32x2";
        case "vec3u":
            return "uint32x3";
        case "vec4u":
            return "uint32x4";

        // int32
        case "i32":
            return "sint32";
        case "vec2i":
            return "sint32x2";
        case "vec3i":
            return "sint32x3";
        case "vec4i":
            return "sint32x4";

        // float32
        case "f32":
            return "float32";
        case "vec2f":
            return "float32x2";
        case "vec3f":
            return "float32x3";
        case "vec4f":
            return "float32x4";
        default:
            console.log(`[E][reflectShaderAttributes] unsupported vertex format. type: ${t.name}`);
            return "uint8";
    }
}

const reflectShaderAttributes = (code: string, entryPoint: string): IReflectAttributes => {
    const reflect = new WgslReflect(code);

    let rawEntry: FunctionInfo | undefined = undefined;
    reflect.entry.vertex.forEach(e => {
        if (e.name === entryPoint) {
            rawEntry = e;
        }
    });

    if (!rawEntry) {
        throw new Error(`entry point "${entryPoint}" not found in the shader code.`);
    }

    let entry: FunctionInfo = rawEntry as FunctionInfo;
    let locationMap: Map<number, string> = new Map();
    let attributeMap: Map<string, GPUVertexAttribute> = new Map();
    let attributeOdered: Array<GPUVertexAttribute> = [];
    let attributeCount: number = entry.inputs.length;

    for (let k = 0; k < attributeCount; k++) {
        let variable: InputInfo = entry.inputs[k];
        let vertexFormat: GPUVertexFormat = getVertexFormat(variable.type as TypeInfo);
        let attr: GPUVertexAttribute = {
            format: vertexFormat,
            offset: 0,
            shaderLocation: variable.location as number
        };
        attributeMap.set(variable.name, attr);
        locationMap.set(attr.shaderLocation, variable.name);
        attributeOdered.push(attr);
    }

    // ensure attribute stored as acending
    attributeOdered.sort((a: GPUVertexAttribute, b: GPUVertexAttribute) => {
        return b.shaderLocation - a.shaderLocation;
    })

    let reflectAttributes: IReflectAttributes = {
        attributeCount: attributeCount,
        attributeMap: attributeMap,
        attributeOdered: attributeOdered,
        locationMap: locationMap
    };

    return reflectAttributes;
}

export {
    type IReflectAttributes,
    reflectShaderAttributes
}
