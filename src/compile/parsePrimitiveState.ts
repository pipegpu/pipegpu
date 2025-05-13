import type { RenderProperty } from "../property/dispatch/RenderProperty"
import type { CullFormat, PropertyFormat } from "../res/Format"

/**
 * 
 */
interface PrimitiveDesc {
    /**
     * 
     */
    cullFormat: CullFormat;

    /**
     * 
     */
    primitiveTopology: GPUPrimitiveTopology;
}

/**
 * 
 * @param primitiveDesc 
 * @param dispatch 
 * @returns 
 */
const parsePrimitiveState = (
    opts: {
        primitiveDesc?: PrimitiveDesc,
        dispatch: RenderProperty,
    }
) => {
    const primitiveState: GPUPrimitiveState = {};
    primitiveState.topology = opts.primitiveDesc?.primitiveTopology || 'triangle-list';

    const t: PropertyFormat = opts.dispatch.getPropertyFormat();
    switch (t) {
        case 'drawIndexed':
            {
                primitiveState.stripIndexFormat = opts.dispatch.getIndexFormat();
                break;
            }
        default:
            break;
    }

    const cullFormat = opts.primitiveDesc?.cullFormat || 'none';
    switch (cullFormat) {
        case 'none':
            {
                primitiveState.cullMode = 'none';
                break;
            }
        case 'frontCCW':
            {
                primitiveState.frontFace = 'ccw';
                primitiveState.cullMode = 'front';
                break;
            }
        case 'frontCW':
            {
                primitiveState.frontFace = 'cw';
                primitiveState.cullMode = 'front';
                break;
            }
        case 'backCCW':
            {
                primitiveState.frontFace = 'cw';
                primitiveState.cullMode = 'back';
                break;
            }
        case 'backCW':
            {
                primitiveState.frontFace = 'ccw';
                primitiveState.cullMode = 'back';
                break;
            }
        default:
            {
                console.log(`[E][parsePrimitiveState] unsupported cullFormat: ${cullFormat}`);
                primitiveState.cullMode = 'none';
                break;
            }
    }
    return primitiveState;
}

export {
    type PrimitiveDesc,
    parsePrimitiveState
}