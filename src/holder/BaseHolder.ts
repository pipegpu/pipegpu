import type { Context } from "../res/Context"
import type { PropertyFormat } from "../res/Format"

/**
 * 
 */
abstract class BaseHolder {
    /**
     * 
     */
    private ctx: Context;

    /**
     * 
     */
    private poropertyFormat: PropertyFormat;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            ctx: Context,
            poropertyFormat: PropertyFormat
        }
    ) {
        this.ctx = opts.ctx;
        this.poropertyFormat = opts.poropertyFormat;
    }

    /**
     * 
     * @returns 
     */
    getPropertyFormat = (): PropertyFormat => {
        return this.poropertyFormat;
    }

    /**
     * 
     * @param encoder 
     */
    abstract build(encoder: GPUCommandEncoder): void;
}

export {
    BaseHolder
}