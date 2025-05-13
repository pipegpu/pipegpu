import type { Context } from "../Context";
import type { BlendFormat, ColorLoadStoreFormat } from "../Format";
import type { BaseTexture } from "../texture/BaseTexture";
import { BaseAttachment } from "./BaseAttachment";

/**
 * 
 */
class ColorAttachment extends BaseAttachment {
    /**
     * 
     */
    private texture: BaseTexture;

    /**
     * 
     */
    private clearColor: GPUColorDict = {
        r: 0,
        g: 0,
        b: 0,
        a: 1.0
    };

    /**
     * 
     */
    private colorLoadStoreFormat: ColorLoadStoreFormat;

    /**
     * 
     */
    private blendFormat: BlendFormat;

    /**
     * 
     */
    private blendState: GPUBlendState | undefined;

    /**
     * 
     */
    private renderPassColorAttachment: GPURenderPassColorAttachment | undefined;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            texture: BaseTexture,
            blendFormat?: BlendFormat,
            colorLoadStoreFormat?: ColorLoadStoreFormat
            clearColor?: number[]
        }
    ) {
        super({
            id: opts.id,
            ctx: opts.ctx
        });
        this.clearColor.r = opts.clearColor ? opts.clearColor[0] : this.clearColor.r;
        this.clearColor.g = opts.clearColor ? opts.clearColor[1] : this.clearColor.g;
        this.clearColor.b = opts.clearColor ? opts.clearColor[2] : this.clearColor.b;
        this.clearColor.a = opts.clearColor ? opts.clearColor[3] : this.clearColor.a;
        this.colorLoadStoreFormat = opts.colorLoadStoreFormat ? opts.colorLoadStoreFormat : 'clearStore';
        this.blendFormat = opts.blendFormat ? opts.blendFormat : 'opaque';
        this.texture = opts.texture;
    }

    /**
     * 
     */
    protected override updateAttachment = (): void => {
        this.renderPassColorAttachment = {
            view: this.texture.getGpuTextureView(),
            loadOp: 'clear',
            storeOp: 'store'
        };
        switch (this.colorLoadStoreFormat) {
            case 'clearStore':
                {
                    this.renderPassColorAttachment.loadOp = 'clear';
                    this.renderPassColorAttachment.storeOp = 'store';
                    break;
                }
            case 'loadStore':
                {
                    this.renderPassColorAttachment.loadOp = 'load';
                    this.renderPassColorAttachment.storeOp = 'store';
                    break;
                }
            default:
                {
                    this.renderPassColorAttachment.loadOp = 'clear';
                    this.renderPassColorAttachment.storeOp = 'store';
                    break;
                }
        }
    }

    /**
     * 
     */
    protected override updateState = (): void => {
        this.blendState = {
            color: {},
            alpha: {},
        };
        switch (this.blendFormat) {
            case 'addAlphaSrcOneDst':
                {
                    this.blendState.color.srcFactor = 'src-alpha';
                    this.blendState.color.dstFactor = 'one-minus-src-alpha';
                    this.blendState.color.operation = 'add';
                    this.blendState.alpha.srcFactor = 'zero';
                    this.blendState.alpha.dstFactor = 'one';
                    this.blendState.alpha.operation = 'add';
                    break;
                }
            case 'opaque':
                {
                    this.blendState.color.srcFactor = 'one';
                    this.blendState.color.dstFactor = 'zero';
                    this.blendState.color.operation = 'add';
                    this.blendState.alpha.srcFactor = 'one';
                    this.blendState.alpha.dstFactor = 'zero';
                    this.blendState.alpha.operation = 'add';
                    break;
                }
            default:
                {
                    console.log(`[E][ColorAttachment][getBlendState] unsupport blend format: ${this.blendFormat}`);
                    break;
                }
        }
    }

    /**
     * 
     */
    getGpuColorAttachment = (): GPURenderPassColorAttachment => {
        // surface texture view need refresh in each frame
        // call GetTextureView at frame start
        this.updateAttachment();
        return this.renderPassColorAttachment as GPURenderPassColorAttachment;
    }

    /**
     * 
     * @returns 
     */
    getGpuBlendState = (): GPUBlendState => {
        this.updateState();
        return this.blendState as GPUBlendState;
    }

    /**
     * 
     * @returns 
     */
    getTextureFormat = (): GPUTextureFormat => {
        return this.texture?.getTextureFormat() || this.ctx.getPreferredTextureFormat();
    }
}

export {
    ColorAttachment
}