import type { Context } from "../Context";
import type { FrameStageFormat } from "../Format";
import { BaseBuffer } from "./BaseBuffer";

/**
 * 
 */
class StorageBuffer extends BaseBuffer {
    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            bufferUsageFlags: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
    }

    /**
     * 
     */
    getByteLength(): number {
        throw new Error("Method not implemented.");
    }

    /**
     * 
     * @param _encoder 
     * @param _frameStage 
     */
    override getGpuBuffer = (_encoder: GPUCommandEncoder, _frameStage: FrameStageFormat): GPUBuffer => {
        throw new Error("Method not implemented.");
    }
}

export {
    StorageBuffer
}