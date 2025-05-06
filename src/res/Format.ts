
type TypedArrayFormat = Int8Array | Uint8Array | Uint8ClampedArray| Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

type ShapedArrayFormat = number[][][] | number[][] | number[] | TypedArrayFormat;

export type {
    TypedArrayFormat,
    ShapedArrayFormat
}