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
    private bufferUsageFlags: GPUBufferUsageFlags | null | undefined;

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
            bufferUsageFlags: GPUBufferUsageFlags
        }
    ) {
        this.id = opts.id;
        this.ctx = opts.ctx;
        this.bufferUsageFlags = opts.bufferUsageFlags;
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