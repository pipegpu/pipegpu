import type { ComputeProperty } from "../property/dispatch/ComputeProperty"
import type { ComputeHandle } from "../res/Handle"

/**
 * 
 * @param opts 
 * @returns 
 * 
 */
const parseComputeDispatch = (
    opts: {
        debugLabel: string,
        dispatch: ComputeProperty
    }
): ComputeHandle => {
    if (!opts.dispatch) {
        throw new Error(`[E][parseComputeDispatch] missing compute 'dispatch' in 'ComputeHolderDesc'`)
    }
    const t = opts.dispatch.getPropertyFormat();
    switch (t) {
        case 'computeDispatch':
            {
                return (encoder: GPUComputePassEncoder): void => {
                    encoder.dispatchWorkgroups(opts.dispatch.getGroupX(), opts.dispatch.getGroupY(), opts.dispatch.getGroupZ());
                };
            }
        default:
            {
                throw new Error(`[E][parseComputeDispatch] ${opts.debugLabel} unsupport render dispatch type:${t} in 'ComputeHolderDesc'`)
            }
    }
}

export {
    parseComputeDispatch
}