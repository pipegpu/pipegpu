import type { Context } from "../Context"

/**
 * 
 */
abstract class BaseAttachment {
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

}

export {
    BaseAttachment
}