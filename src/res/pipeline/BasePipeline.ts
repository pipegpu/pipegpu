import type { Context } from "../Context"
import type { PropertyFormat } from "../Format"

/**
 * 
 */
class BasePipeline {
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
    private propertyFormat: PropertyFormat;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            propertyFormat: PropertyFormat
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.propertyFormat = opts.propertyFormat;
    }

    /**
     * 
     * @returns 
     */
    getID = () => {
        return this.id;
    }

    /**
     * 
     * @returns 
     */
    getPropertyFormat = () => {
        return this.propertyFormat;
    }
}


export {
    BasePipeline
}