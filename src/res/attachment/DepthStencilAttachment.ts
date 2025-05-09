import type { DepthCompareFormat, DepthLoadStoreFormat } from "../Format";
import type { Texture2D } from "../texture/Texture2D";
import { BaseAttachment } from "./BaseAttachment";

class DepthStencilAttachment extends BaseAttachment {

    constructor(
        opts: {
            id: number,
            texture: Texture2D,
            depthLoadStoreFormat?: DepthLoadStoreFormat,
            depthCompareFormat?: DepthCompareFormat,
        }
    ) {

    }

}

export {
    DepthStencilAttachment
}