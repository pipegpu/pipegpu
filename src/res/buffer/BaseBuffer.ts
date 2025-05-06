import { Context } from "../Context.ts"


/**
 * 
 */
class BaseBuffer {

    /**
     * 
     */
    private ctx: Context | null | undefined;

    /**
     * 
     */
    private usageFlags: GPUBufferUsageFlags | null | undefined;

    /**
     *
     */
    private id: number;

    /**
     * 
     */
    constructor(
        opts: {
            id: number,
            ctx: Context,
            usageFlags: GPUBufferUsageFlags
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.usageFlags = opts.usageFlags;
    }

    /**
     * 
     * @returns 
     */
    getId = (): number => {
        return this.id;
    }

}

export {
    BaseBuffer
}