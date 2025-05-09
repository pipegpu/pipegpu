import type { Context } from "../res/Context"
import type { BaseTexture } from "../res/texture/BaseTexture";


/**
 * 
 */
class TextureState {
    /**
     * 
     */
    private static TEXTURE_SET: Map<number, BaseTexture> = new Map();

    /**
     * 
     */
    private ctx: Context;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            ctx: Context
        }
    ) {
        this.ctx = opts.ctx;
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    getTexture = (id: number): BaseTexture | undefined => {
        if (!TextureState.TEXTURE_SET.has(id)) {
            console.log(`[E][TextureState][getTexture] find texture failed, id: ${id}`);
        } else {
            return TextureState.TEXTURE_SET.get(id);
        }
    }

}

export {
    TextureState
}