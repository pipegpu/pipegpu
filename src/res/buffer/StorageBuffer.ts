import type { Context } from "../Context";
import type { FrameStageFormat } from "../Format";
import { BaseBuffer } from "./BaseBuffer";

class StorageBuffer extends BaseBuffer {
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