import type { Context } from "../Context";
import type { DepthCompareFormat, DepthLoadStoreFormat } from "../Format";
import type { BaseTexture } from "../texture/BaseTexture";
import type { Texture2D } from "../texture/Texture2D";
import { BaseAttachment } from "./BaseAttachment";

/**
 * 
 */
class DepthStencilAttachment extends BaseAttachment {
    /**
     * 
     */
    private depthStencilState: GPUDepthStencilState;

    /**
     * 
     */
    private depthStencilAttachment: GPURenderPassDepthStencilAttachment;

    /**
     * 
     */
    private texture: Texture2D;

    /**
     * 
     */
    private depthLoadStoreFormat: DepthLoadStoreFormat;

    /**
     * 
     */
    private depthCompareFormat: DepthCompareFormat;

    /**
     * 
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            texture: Texture2D,
            depthLoadStoreFormat?: DepthLoadStoreFormat,
            depthCompareFormat?: DepthCompareFormat,
        }
    ) {
        super(
            {
                id: opts.id,
                ctx: opts.ctx
            }
        );
        this.texture = opts.texture;
        this.depthLoadStoreFormat = opts.depthLoadStoreFormat || 'loadStore';
        this.depthCompareFormat = opts.depthCompareFormat || 'lessEqual';
    }

    /**
     * 
     */
    getDepthStencilState = () => {
        return this.depthStencilState;
    }
}

export {
    DepthStencilAttachment
}