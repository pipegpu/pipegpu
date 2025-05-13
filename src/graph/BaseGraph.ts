import { BaseHolder } from "../holder/BaseHolder";
import type { ComputeHolder } from "../holder/ComputeHolder";
import { RenderHolder } from "../holder/RenderHolder";
import type { Context } from "../res/Context";

/**
 * 
 */
class BaseGraph {

    /**
     * 
     */
    private holderMap: Map<number, BaseHolder>;

    /**
     * 
     */
    private ctx: Context;

    /**
     * 
     * @param ctx 
     */
    constructor(ctx: Context) {

    }

    append(baseHolder: BaseHolder): void;
    append(baseHolders: BaseHolder[]): void;
    append(renderHolder: RenderHolder): void;
    append(renderHolders: RenderHolder[]): void;
    append(computeHolder: ComputeHolder): void;
    append(computeHolders: ComputeHolder[]): void;
    append(a: BaseHolder | BaseHolder[] | RenderHolder | RenderHolder[] | ComputeHolder | ComputeHolder[]): void {
        if (a instanceof BaseHolder || a instanceof RenderHolder) {
            if (!this.holderMap.has(a.getID())) {
                this.holderMap.set(a.getID(), a);
            }
        }
    }
}

export {
    BaseGraph
}