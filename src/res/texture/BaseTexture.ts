import type { Context } from "../Context"
import type { FrameStageFormat } from "../Format";

abstract class BaseTexture {
    /**
     * 
     */
    private id: number;

    /**
     * 
     */
    protected textureUsageFlags: GPUTextureUsageFlags;

    /**
     * 
     */
    protected ctx: Context;

    /**
     * 
     */
    protected texture: GPUTexture | undefined;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            textureUsageFlags: GPUTextureUsageFlags
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.textureUsageFlags = opts.textureUsageFlags;
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
    abstract getGpuTexture(encoder: GPUCommandEncoder, frameStage: FrameStageFormat): void;
}

export {
    BaseTexture
}