import type { BaseAttachment } from "../res/attachment/BaseAttachment";
import { ColorAttachment } from "../res/attachment/ColorAttachment";
import type { DepthStencilAttachment } from "../res/attachment/DepthStencilAttachment";
import type { Context } from "../res/Context";
import type { BlendFormat, ColorLoadStoreFormat } from "../res/Format";
import type { BaseTexture } from "../res/texture/BaseTexture";
import type { Texture2D } from "../res/texture/Texture2D";
import { uniqueID } from "../util/uniqueID";



/**
 * 
 */
class AttachmentState {
    /**
     * 
     */
    private static ATTACHMENT_SET: Map<number, BaseAttachment> = new Map();

    /**
     * 
     */
    private ctx: Context;

    /**
     * 
     * @param ctx 
     */
    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    /**
     * 
     * @param id 
     */
    getAttachment = (id: number): BaseAttachment | undefined => {
        if (!AttachmentState.ATTACHMENT_SET.has(id)) {
            console.log(`[E]][AttachmentState][getAttachment] find attachment id: ${id} failed.`);
            return;
        }
        return AttachmentState.ATTACHMENT_SET.get(id);
    }

    /**
     * 
     */
    createColorAttachment = (
        opts: {
            texture: BaseTexture,
            blendFormat?: BlendFormat,
            colorLoadStoreFormat?: ColorLoadStoreFormat,
            clearColor?: number[]
        },
        id: number = 0
    ): ColorAttachment | undefined => {
        if (!AttachmentState.ATTACHMENT_SET.has(id)) {
            id = uniqueID();
            const colorAttachment: ColorAttachment = new ColorAttachment({
                id: id,
                ctx: this.ctx,
                texture: opts.texture,
                blendFormat: opts.blendFormat,
                colorLoadStoreFormat: opts.colorLoadStoreFormat,
                clearColor: opts.clearColor
            });
            AttachmentState.ATTACHMENT_SET.set(id, colorAttachment);
        }
        return AttachmentState.ATTACHMENT_SET.get(id) as ColorAttachment;
    }

    /**
     * 
     * @param opts 
     * @param id 
     */
    createDepthStencilAttachment = (
        opts: {

        },
        id: number = 0
    ): DepthStencilAttachment | undefined => {
        if (!AttachmentState.ATTACHMENT_SET.has(id)) {
            id = uniqueID();
            const depthStencilAttachment: DepthStencilAttachment = new DepthStencilAttachment({
                id: id,
                ctx: this.ctx,
                texture: opts.texture,
                blendFormat: opts.blendFormat,
                colorLoadStoreFormat: opts.colorLoadStoreFormat,
                clearColor: opts.clearColor
            });
            AttachmentState.ATTACHMENT_SET.set(id, depthStencilAttachment);
        }
        return AttachmentState.ATTACHMENT_SET.get(id) as DepthStencilAttachment;
    }
}

export {
    AttachmentState
}