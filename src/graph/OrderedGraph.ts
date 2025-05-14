import { BaseHolder } from "../holder/BaseHolder";
import type { Context } from "../res/Context";
import { BaseGraph } from "./BaseGraph";

/**
 * 
 */
class OrderedGraph extends BaseGraph {
    constructor(ctx: Context) {
        super(ctx);
    }

    /**
     * 
     */
    protected getSortedHolders = (): BaseHolder[] => {
        let holdrs: BaseHolder[] = Array.from(this.holderMap.values());
        holdrs.sort((a, b) => a.getID() - b.getID());
        return holdrs;
    }

    /**
     * 
     */
    override build(): void {
        // new frame resource
        this.ctx.refreshFrameResource();
        // sort 
        const holders: BaseHolder[] = this.getSortedHolders();
        holders.forEach(holder => {
            holder.build(this.ctx.getCommandEncoder());
        });
        // clear resource
        this.holderMap.clear();
        holders.length = 0;
        this.ctx.submitFrameResource();
    }
}

export {
    OrderedGraph
}