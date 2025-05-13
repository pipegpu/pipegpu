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
     */
    private stencilReadOnly: boolean;

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
            depthCompareFunction?: GPUCompareFunction,
            stencilFunctionFormat?: StencilStateFormat,
            stencilLoadStoreFormat?: StencilLoadStoreFormat,
            depthReadOnly?: boolean,
            stencilReadOnly?: boolean
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
        this.depthCompareFunction = opts.depthCompareFunction || 'less-equal';
        this.stencilStateFormat = opts.stencilFunctionFormat || 'alwaysKeep';
        this.stencilLoadStoreFormat = opts.stencilLoadStoreFormat || 'loadStore';
        this.depthReadOnly = opts.depthReadOnly || true;
        this.stencilReadOnly = opts.stencilReadOnly || true;
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
        // depth 
        switch (this.depthLoadStoreFormat) {
            case 'clearStore':
                {
                    this.depthStencilAttachment.depthClearValue = 1.0;
                    this.depthStencilAttachment.depthLoadOp = 'clear';
                    this.depthStencilAttachment.depthStoreOp = 'store';
                    this.depthStencilAttachment.depthReadOnly = this.depthReadOnly;
                    break;
                }
            case 'loadStore':
                {
                    this.depthStencilAttachment.depthClearValue = 1.0;
                    this.depthStencilAttachment.depthLoadOp = 'load';
                    this.depthStencilAttachment.depthStoreOp = 'store';
                    this.depthStencilAttachment.depthReadOnly = this.depthReadOnly;
                    break;
                }
            default:
                {
                    console.log(`[E][DepthStencilAttachment][updateRenderPassDepthStencilAttachment] unsupported depthLoadStoreFormat: ${this.depthLoadStoreFormat}`);
                    break;
                }
        }
        // stencil
        switch (this.stencilLoadStoreFormat) {
            case 'clearStore':
                {
                    this.depthStencilAttachment.stencilClearValue = 1.0;
                    this.depthStencilAttachment.stencilLoadOp = 'clear';
                    this.depthStencilAttachment.stencilStoreOp = 'store';
                    this.depthStencilAttachment.stencilReadOnly = this.stencilReadOnly;
                    break;
                }
            case 'loadStore':
                {
                    this.depthStencilAttachment.stencilClearValue = 1.0;
                    this.depthStencilAttachment.stencilLoadOp = 'load';
                    this.depthStencilAttachment.stencilStoreOp = 'store';
                    this.depthStencilAttachment.stencilReadOnly = this.stencilReadOnly;
                    break;
                }
            default:
                {
                    console.log(`[E][DepthStencilAttachment][updateRenderPassDepthStencilAttachment] unsupported stencilLoadStoreFormat: ${this.stencilLoadStoreFormat}`);
                    break;
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
}

export {
    DepthStencilAttachment
}