import { BaseHolder } from "../holder/BaseHolder";
import { ComputeHolder } from "../holder/ComputeHolder";
import { RenderHolder } from "../holder/RenderHolder";
import type { Context } from "../res/Context";

/**
 * 
 */
abstract class BaseGraph {
    /**
     * 
     */
    protected holderMap: Map<number, BaseHolder> = new Map();

    /**
     * 
     */
    protected ctx: Context;

    /**
     * 
     * @param ctx 
     */
    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    /**
     * 
     * @param baseHolder BaseHolder | BaseHolder[] | RenderHolder | RenderHolder[] | ComputeHolder | ComputeHolder[]
     */
    append(holder: BaseHolder | undefined): void;
    append(holders: BaseHolder[] | undefined): void;
    append(holder: RenderHolder | undefined): void;
    append(holders: RenderHolder[] | undefined): void;
    append(holder: ComputeHolder | undefined): void;
    append(holders: ComputeHolder[] | undefined): void;
    append(a: BaseHolder | BaseHolder[] | RenderHolder | RenderHolder[] | ComputeHolder | ComputeHolder[] | undefined): void {
        if (a instanceof BaseHolder || a instanceof RenderHolder || a instanceof ComputeHolder) {
            if (!this.holderMap.has(a.getID())) {
                this.holderMap.set(a.getID(), a);
            } else {
                console.log(`[I][BaseGraph][append] holder has already exist, id: ${a.getID()}`);
            }
        } else if (!a) {
            console.log(`[I][BaseGraph][append] undefined holder`);
        } else {
            a.forEach(e => {
                this.append(e);
            });
        }
    }

    /**
     * 
     */
    abstract build(): void;
}

export {
    BaseGraph
}