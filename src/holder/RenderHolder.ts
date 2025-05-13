import type { ColorAttachment } from "../res/attachment/ColorAttachment"
import type { DepthStencilAttachment } from "../res/attachment/DepthStencilAttachment"
import type { Context } from "../res/Context"
import type { RenderHandle, UniformHandle } from "../res/Handle"
import type { RenderPipeline } from "../res/pipeline/RenderPipeline"
import type { BufferState } from "../state/BufferState"
import type { TextureState } from "../state/TextureState"
import { BaseHolder } from "./BaseHolder"

/**
 * 
 */
class RenderHolder extends BaseHolder {
    /**
     * 
     */
    private renderPipeline: RenderPipeline;

    /**
     * 
     */
    private bufferState: BufferState;

    /**
     * 
     */
    private texturteState: TextureState;

    /**
     * 
     */
    private renderHandler: RenderHandle;

    /**
     * 
     */
    private uniformHandler: UniformHandle;

    /**
     * 
     */
    private slotAttributeBufferIDMap: Map<number, number>;

    /**
     * 
     */
    private slotBindGroupMap: Map<number, GPUBindGroup>;

    /**
     * 
     */
    private colorAttachments: ColorAttachment[];

    /**
     * 
     */
    private depthStencilAttachment?: DepthStencilAttachment;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            renderPipeline: RenderPipeline,
            bufferState: BufferState,
            texturteState: TextureState,
            renderHandler: RenderHandle,
            uniformHandler: UniformHandle,
            slotAttributeBufferIDMap: Map<number, number>,
            slotBindGroupMap: Map<number, GPUBindGroup>,
            colorAttachments: ColorAttachment[],
            depthStencilAttachment?: DepthStencilAttachment,
        }
    ) {
        super({ id: opts.id, ctx: opts.ctx, poropertyFormat: 'renderHolder' });
        this.renderPipeline = opts.renderPipeline;
        this.bufferState = opts.bufferState;
        this.texturteState = opts.texturteState;
        this.renderHandler = opts.renderHandler;
        this.uniformHandler = opts.uniformHandler;
        this.slotAttributeBufferIDMap = opts.slotAttributeBufferIDMap;
        this.slotBindGroupMap = opts.slotBindGroupMap;
        this.colorAttachments = opts.colorAttachments;
        this.depthStencilAttachment = opts.depthStencilAttachment;
    }

    /**
     * 
     * @param encoder 
     */
    override build(encoder: GPUCommandEncoder): void {
        throw new Error("Method not implemented.")
    }

}

export {
    RenderHolder
}