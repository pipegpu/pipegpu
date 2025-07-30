import type { BufferState } from "../state/BufferState";
import type { TextureState } from "../state/TextureState";
import type { FrameStageFormat } from "./Format";

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

export {
    type UniformHandle,
    type RenderHandle,
    type ComputeHandle,
    type HookHandle,
}