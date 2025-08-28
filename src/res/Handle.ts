import type { BufferState } from "../state/BufferState";
import type { TextureState } from "../state/TextureState";
import type { FrameStageFormat, TypedArray1DFormat } from "./Format";

/**
 * 
 */
type UniformHandle = (frameStage: FrameStageFormat, encoder: GPUCommandEncoder, bufferState: BufferState, textureState: TextureState) => void;

/**
 * 
 */
type RenderHandle = (encoder: GPURenderPassEncoder) => void;

/**
 * 
 */
type ComputeHandle = (encoder: GPUComputePassEncoder) => void;

/**
 * 
 * hook handle
 * share gpu command encoder,
 * used as buffer copy etc.
 * 
 */
type HookHandle = { (encoder: GPUCommandEncoder): void };

/**
 * 
 */
type BufferDetailHandle = {
    /**
     * 
     * gpu buffer byte offset
     * 
     */
    offset: number,

    /**
     * 
     * cpu write buffer total byte length.
     * 
     */
    byteLength: number,

    /**
     * 
     * cpu write source data.
     * 
     */
    rawData: TypedArray1DFormat | ArrayBuffer
};

/**
 * 
 */
type TextureDetailHandle = {
    /**
     * the index of texture, also seen as offset.
     */
    depthOrArrayLayerIndex: number,

    /**
     * 
     */
    rawData: TypedArray1DFormat | ArrayBuffer
};

/**
 * e.g for vertex / index / unfiorm buffer.
 * rewrite buffer
 */
type BufferHandle = () => {
    rewrite: boolean,
    detail: BufferDetailHandle
};

/**
 * e.g for storage buffer.
 */
type BufferArrayHandle = () => {
    rewrite: boolean,
    details: Array<BufferDetailHandle>
};

/**
 * e.g for texture 2d array.
 */
type TextureArrayHandle = () => {
    rewrite: boolean,
    details: Array<TextureDetailHandle>
};

export {
    type UniformHandle,
    type RenderHandle,
    type ComputeHandle,
    type HookHandle,
    type BufferHandle,
    type BufferArrayHandle,
    type BufferDetailHandle,
    type TextureDetailHandle,
    type TextureArrayHandle,
}