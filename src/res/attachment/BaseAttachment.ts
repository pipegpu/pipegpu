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
    protected context: Context;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            context: Context
        }
    ) {
        this.context = opts.context;
        this.id = opts.id;
    }

    /**
     * 
     * @returns 
     */
    getID = (): number => {
        return this.id;
    }

    /**
     * 
     */
    protected abstract updateState(): void;

    /**
     * 
     */
    protected abstract updateAttachment(): void;
}

export {
    BaseAttachment
}