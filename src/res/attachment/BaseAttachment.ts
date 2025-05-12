import type { Context } from "../Context"

/**
 * 
 */
abstract class BaseAttachment {
    /**
     * 
     */
    private id: number;

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
            id: number,
            ctx: Context
        }
    ) {
        this.ctx = opts.ctx;
        this.id = opts.id;
    }

}

export {
    BaseAttachment
}