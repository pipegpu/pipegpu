import { Context } from "../Context.ts"
import type { FrameStageFormat } from "../Format.ts";

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
    protected context: Context | undefined;

    /**
     * 
     */
    protected bufferUsageFlags: GPUBufferUsageFlags;

    /**
     * 
     */
    protected buffer!: GPUBuffer;

    /**
    * 
    */
    protected totalByteLength: number = 0;

    /**
     * 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            bufferUsageFlags: GPUBufferUsageFlags,
            totalByteLength: number,
        }
    ) {
        this.id = opts.id;
        this.context = opts.context;
        this.bufferUsageFlags = opts.bufferUsageFlags;
        this.totalByteLength = opts.totalByteLength;
        if (!this.totalByteLength) {
            throw new Error(`[E][BaseBuffer][constructor] create buffer error, opts.totalByteLength value invalid.`);
        }
    }

    /**
     * 
     * @returns 
     */
    getID = (): number => {
        return this.id;
    }

    /**
     * @returns {number} buffer total byte length.
     */
    getByteLength = (): number => {
        return this.totalByteLength;
    }

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    abstract getGpuBuffer(encoder: GPUCommandEncoder | null, frameStage: FrameStageFormat): GPUBuffer;

}

export {
    BaseBuffer
}