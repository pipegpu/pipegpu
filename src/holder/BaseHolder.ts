import type { Context } from "../res/Context"
import type { PropertyFormat } from "../res/Format"

/**
 * 
 */
abstract class BaseHolder {
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
     */
    private poropertyFormat: PropertyFormat;

    /**
     * 
     */
    protected debugLabel: string;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            debugLabel: string,
            id: number,
            ctx: Context,
            poropertyFormat: PropertyFormat
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.poropertyFormat = opts.poropertyFormat;
        this.debugLabel = opts.debugLabel;
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