
type TypedArrayFormat = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

type ShapedArrayFormat = number[][][] | number[][] | number[] | TypedArrayFormat;

type GPUShaderStageFormat = keyof {
    [key in keyof typeof GPUShaderStage]: string
}

export type {
    GPUShaderStageFormat,
    TypedArrayFormat,
    ShapedArrayFormat
}