import type { Context } from "../Context"

class BaseTexture {

    /**
     * 
     */
    private textureUsageFlags: GPUTextureUsageFlags;

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
        this.textureUsageFlags = opts.textureUsageFlags;
    }


}

export {
    BaseTexture
}