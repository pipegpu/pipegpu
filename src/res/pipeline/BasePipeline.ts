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
    protected context: Context;

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
            context: Context,
            propertyFormat: PropertyFormat
        }
    ) {
        this.id = opts.id;
        this.context = opts.context;
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