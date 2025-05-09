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

export {
    type UniformHandle,
    type RenderHandle
}