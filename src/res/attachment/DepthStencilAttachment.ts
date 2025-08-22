import type { Context } from "../Context";
import type { DepthLoadStoreFormat, StencilLoadStoreFormat, StencilStateFormat } from "../Format";
import type { Texture2D } from "../texture/Texture2D";
import { BaseAttachment } from "./BaseAttachment";

/**
 * 
 */
class DepthStencilAttachment extends BaseAttachment {
    /**
     * 
     */
    private depthStencilState: GPUDepthStencilState | undefined;

    /**
     * 
     */
    private depthStencilAttachment: GPURenderPassDepthStencilAttachment | undefined;

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
    private depthCompareFunction: GPUCompareFunction;

    /**
     * 
     */
    private stencilStateFormat: StencilStateFormat;

    /**
     * 
     */
    private stencilLoadStoreFormat: StencilLoadStoreFormat;

    /**
     * 
     */
    private depthReadOnly: boolean;

    /**
     * 
     * support depth clear value.
     * default as 1.0.
     * 
     */
    private depthClearValue: number;

    /**
     * 
     */
    private stencilReadOnly: boolean;

    /**
     * 
     * support stencil clear value.
     * default as 1.0.
     * 
     */
    private stencilClearValue: number;

    /**
     * 
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            context: Context,
            texture: Texture2D,
            depthLoadStoreFormat?: DepthLoadStoreFormat,
            depthCompareFunction?: GPUCompareFunction,
            stencilFunctionFormat?: StencilStateFormat,
            stencilLoadStoreFormat?: StencilLoadStoreFormat,
            depthReadOnly?: boolean,
            depthClearValue?: number,
            stencilReadOnly?: boolean,
            stencilClearValue?: number,
        }
    ) {
        super({
            id: opts.id,
            context: opts.context
        });
        this.texture = opts.texture;
        this.depthLoadStoreFormat = opts.depthLoadStoreFormat || 'loadStore';
        this.depthCompareFunction = opts.depthCompareFunction || 'less-equal';
        this.stencilStateFormat = opts.stencilFunctionFormat || 'alwaysKeep';
        this.stencilLoadStoreFormat = opts.stencilLoadStoreFormat || 'loadStore';
        this.depthReadOnly = opts.depthReadOnly || false;
        this.depthClearValue = opts.depthClearValue || 1.0;
        this.stencilReadOnly = opts.stencilReadOnly || false;
        this.stencilClearValue = opts.stencilClearValue || 1.0;
    }

    /**
     * 
     */
    protected override updateState = (): void => {
        // depthStencilState
        this.depthStencilState = this.depthStencilState || {
            format: this.texture.getTextureFormat()
        };
        switch (this.depthCompareFunction) {
            case 'never':
                {
                    this.depthStencilState.depthWriteEnabled = false;
                    this.depthStencilState.depthCompare = this.depthCompareFunction;
                    break;
                }
            case 'equal':
            case 'greater':
            case 'greater-equal':
            case 'less':
            case 'not-equal':
            case 'always':
            case 'less-equal':
                {
                    this.depthStencilState.depthWriteEnabled = true;
                    this.depthStencilState.depthCompare = this.depthCompareFunction;
                    break;
                }
            default:
                {
                    console.log(`[E][DepthStencilAttachment][updateDepthStencilState] unsupported depth compare function, type:${this.depthCompareFunction}`);
                    break;
                }
        }
        // stencil
        switch (this.stencilStateFormat) {
            case 'alwaysKeep':
                {
                    const stencilFraceState: GPUStencilFaceState = {};
                    stencilFraceState.compare = 'always';
                    stencilFraceState.passOp = 'keep';
                    stencilFraceState.failOp = 'keep';
                    stencilFraceState.depthFailOp = 'keep';
                    this.depthStencilState.stencilFront = stencilFraceState;
                    this.depthStencilState.stencilBack = stencilFraceState;
                    this.depthStencilState.stencilReadMask = 0;
                    this.depthStencilState.stencilWriteMask = 0;
                    break;
                }
            default:
                {
                    console.log(`[E][DepthStencilAttachment][updateDepthStencilState] unsupported depth stencil state format function, type:${this.stencilStateFormat}`);
                    break;
                }
        }
    }

    /**
     * 
     */
    protected override updateAttachment = () => {
        // depthStencilAttachment
        this.depthStencilAttachment = {
            view: this.texture.getGpuTextureView()
        };
        // depth attachment state
        if (this.texture.isDetphTexture()) {
            switch (this.depthLoadStoreFormat) {
                case 'clearStore':
                    {
                        this.depthStencilAttachment.depthClearValue = this.depthClearValue || 1.0;
                        this.depthStencilAttachment.depthLoadOp = 'clear';
                        this.depthStencilAttachment.depthStoreOp = 'store';
                        this.depthStencilAttachment.depthReadOnly = this.depthReadOnly;
                        break;
                    }
                case 'loadStore':
                    {
                        this.depthStencilAttachment.depthClearValue = this.depthClearValue || 1.0;
                        this.depthStencilAttachment.depthLoadOp = 'load';
                        this.depthStencilAttachment.depthStoreOp = 'store';
                        this.depthStencilAttachment.depthReadOnly = this.depthReadOnly;
                        break;
                    }
                default:
                    {
                        throw new Error(`[E][DepthStencilAttachment][updateRenderPassDepthStencilAttachment] unsupported depthLoadStoreFormat: ${this.depthLoadStoreFormat}`);
                    }
            }
        }

        // stencil attachment state
        if (this.texture.isStencilTexture()) {
            switch (this.stencilLoadStoreFormat) {
                case 'clearStore':
                    {
                        this.depthStencilAttachment.stencilClearValue = this.stencilClearValue || 1.0;
                        this.depthStencilAttachment.stencilLoadOp = 'clear';
                        this.depthStencilAttachment.stencilStoreOp = 'store';
                        this.depthStencilAttachment.stencilReadOnly = this.stencilReadOnly;
                        break;
                    }
                case 'loadStore':
                    {
                        this.depthStencilAttachment.stencilClearValue = this.stencilClearValue || 1.0;
                        this.depthStencilAttachment.stencilLoadOp = 'load';
                        this.depthStencilAttachment.stencilStoreOp = 'discard';
                        this.depthStencilAttachment.stencilReadOnly = this.stencilReadOnly;
                        break;
                    }
                default:
                    {
                        throw new Error(`[E][DepthStencilAttachment][updateRenderPassDepthStencilAttachment] unsupported stencilLoadStoreFormat: ${this.stencilLoadStoreFormat}`);
                    }
            }
        }
    }

    /**
     * 
     */
    getGpuRenderPassDepthStencilAttachment = (): GPURenderPassDepthStencilAttachment => {
        this.updateAttachment();
        return this.depthStencilAttachment as GPURenderPassDepthStencilAttachment;
    };

    /**
     * 
     */
    getDepthStencilState = (): GPUDepthStencilState => {
        this.updateState();
        return this.depthStencilState as GPUDepthStencilState;
    }

    /**
     * 
     * @returns {Texture2D}
     */
    getTexture = (): Texture2D => {
        return this.texture;
    }
}

export {
    DepthStencilAttachment
}