import { Context } from "../Context.ts"
import type { FrameStageFormat, TypedArray1DFormat, TypedArray2DFormat } from "../Format.ts";

/**
 * e.g for vertex / index / unfiorm buffer.
 */
type Handle1D = () => TypedArray1DFormat;

/**
 * e.g for storage buffer.
 */
type Handle2D = () => TypedArray2DFormat;

/**
 * 
 */
abstract class BaseBuffer {
    /**
    *
    */
    private id: number;

    /**
     * 
     */
    protected ctx: Context | undefined;

    /**
     * 
     */
    protected bufferUsageFlags: GPUBufferUsageFlags | undefined;

    /**
     * 
     */
    protected buffer: GPUBuffer | undefined;

    /**
     * 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            bufferUsageFlags: GPUBufferUsageFlags
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.bufferUsageFlags = opts.bufferUsageFlags;
    }

    /**
     * 
     * @returns 
     */
    getId = (): number => {
        return this.id;
    }

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    abstract getGpuBuffer(encoder: GPUCommandEncoder, frameStage: FrameStageFormat): void;
}

export {
    type Handle1D,
    type Handle2D,
    BaseBuffer
}