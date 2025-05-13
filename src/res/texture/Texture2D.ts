import type { Context } from "../Context";
import type { FrameStageFormat, TypedArray1DFormat } from "../Format";
import { BaseTexture } from "./BaseTexture";

/**
 * 
 */
class Texture2D extends BaseTexture {
    /**
     * 
     */
    private textureData: TypedArray1DFormat;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            width: number,
            height: number,
            textureData?: TypedArray1DFormat,
            textureFormat?: GPUTextureFormat,
            maxMipLevel?: number
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx,
            textureUsageFlags: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            width: opts.width,
            height: opts.height,
            depthOrArrayLayers: 1,
            textureFormat: opts.textureFormat,
            maxMipLevel: opts.maxMipLevel
        });
        this.textureData = opts.textureData || new Float32Array();
    }

    /**
     * 
     */
    protected override createGpuTexture(): void {
        const desc: GPUTextureDescriptor = {
            size: this.extent3d,
            format: this.textureFormat,
            usage: this.textureUsageFlags
        };
        // write texture
        this.texture = this.ctx.getGpuDevice().createTexture(desc);
        const destination: GPUTexelCopyTextureInfo = {
            texture: this.texture
        };
        const dataLayout: GPUTexelCopyBufferLayout = {};
        this.ctx.getGpuQueue().writeTexture(destination, this.textureData, dataLayout, this.extent3d);
    }

    /**
     * 
     * @param encoder 
     * @param frameStage 
     */
    override getGpuTexture = (_encoder: GPUCommandEncoder, _frameStage: FrameStageFormat): GPUTexture => {
        if (!this.texture) {
            this.createGpuTexture();
        }
        return this.texture as GPUTexture;
    }

    /**
     * 
     */
    override getGpuTextureView(): GPUTextureView {
        throw new Error("Method not implemented.");
    }
}

export {
    Texture2D
}