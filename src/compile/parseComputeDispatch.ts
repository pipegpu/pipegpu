import type { ComputeProperty } from "../property/dispatch/ComputeProperty"
import type { ComputeHandle } from "../res/Handle"

const parseComputeDispatch = (
    dispatch: ComputeProperty
): ComputeHandle => {
    if (!dispatch) {
        throw new Error(`[E][parseComputeDispatch] missing compute 'dispatch' in 'ComputeHolderDesc'`)
    }
    const t = dispatch.getPropertyFormat();
    switch (t) {
        case 'computeDispatch':
            {
                return (encoder: GPUComputePassEncoder): void => {
                    encoder.dispatchWorkgroups(dispatch.getGroupX(), dispatch.getGroupY(), dispatch.getGroupZ());
                };
            }
        default:
            {
                throw new Error(`[E][parseComputeDispatch] unsupport render dispatch type:${t} in 'ComputeHolderDesc'`)
            }
    }
}

export {
    parseComputeDispatch
}