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
    protected context: Context;

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
            context: Context,
            poropertyFormat: PropertyFormat
        }
    ) {
        this.id = opts.id;
        this.context = opts.context;
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