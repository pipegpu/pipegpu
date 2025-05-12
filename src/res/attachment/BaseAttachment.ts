import type { Context } from "../Context"

/**
 * 
 */
abstract class BaseAttachment {
    /**
     * 
     */
    protected ctx: Context;

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

}

export {
    BaseAttachment
}