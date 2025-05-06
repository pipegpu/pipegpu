import type { Context } from "../Context"

/**
 * 
 */
class BaseShader {

    /**
     * 
     */
    private ctx: Context | null | undefined;

    /**
     * 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context
        }
    ) {
        this.ctx = opts.ctx;

    }

}

export {
    BaseShader
}