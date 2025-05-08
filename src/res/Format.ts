
/**
 * 
 */
type TypedArray1DFormat = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

/**
 * 
 */
type TypedArray2DFormat = Array<TypedArray1DFormat>;

/**
 * 
 */
type FrameStageFormat = keyof { FrameBegin: "FrameBegin", FrameFinish: "FrameFinish" };

/**
 * 
 */
type PropertyFormat = keyof { DrawCount: "DrawCount", DrawIndexed: "DrawIndexed" };

export type {
    PropertyFormat,
    FrameStageFormat,
    TypedArray1DFormat,
    TypedArray2DFormat
}