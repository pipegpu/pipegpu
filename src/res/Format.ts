
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
type BlendFormat =
    | 'opaque'
    | 'addAlphaSrcOneDst'   // color = src * k + dst * ( 1- k);
    ;

/**
 * 
 */
type ColorLoadStoreFormat =
    | 'clearStore' // load clear, store store
    | 'loadStore'   // load: load, store store
    ;

/**
 * 
 */
type MultiSampleFormat =
    | '1x'
    | '2x'
    | '4x'
    | '8x'
    ;

/**
 * 
 */
type FrameStageFormat =
    | 'FrameBegin'
    | 'FrameFinish'
    ;

/**
 * 
 */
type PropertyFormat =
    | 'None'
    | 'ComputeDispatch'
    | 'DrawCount'
    | 'DrawIndexed'
    | 'DrawIndirect'
    | 'VertexBuffer'
    | 'UniformBuffer'
    | 'IndexBuffer'
    | 'StorageBuffer'
    | 'Texutre2D'
    | 'SurfaceTexture2D'
    | 'TextureStorage2D'
    ;

/**
 * 
 */
type DepthCompareFormat =
    | 'lessEqual'
    ;

/**
 * 
 */
type DepthLoadStoreFormat =
    | 'loadStore'
    | 'clearStore'
    ;

type CullFormat =
    | 'None'
    | 'FrontCW'
    | 'FrontCCW'
    | 'BackCW'
    | 'BackCCW'
    ;

export type {
    CullFormat,
    ColorLoadStoreFormat,
    DepthLoadStoreFormat,
    DepthCompareFormat,
    BlendFormat,
    MultiSampleFormat,
    PropertyFormat,
    FrameStageFormat,
    TypedArray1DFormat,
    TypedArray2DFormat
}