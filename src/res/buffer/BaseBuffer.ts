import { Context } from "../Context.ts"
import type { FrameStageFormat, TypedArray1DFormat } from "../Format.ts";

type HandleBufferDetail = {
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

type HandleTextureDetail = {
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
type Handle1DBffer = () => {
    rewrite: boolean,
    detail: HandleBufferDetail
};

/**
 * e.g for storage buffer.
 */
type Handle2DBuffer = () => {
    rewrite: boolean,
    details: Array<HandleBufferDetail>
};

/**
 * e.g for texture 2d array.
 */
type HandleTextureArray = ()=>{
    rewrite:boolean,
    details: Array<HandleTextureDetail>
};

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
    type Handle1DBffer, 
    type Handle2DBuffer, 
    type HandleBufferDetail,
    type HandleTextureDetail,
    type HandleTextureArray,
    BaseBuffer
}