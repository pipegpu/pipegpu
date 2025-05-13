import type { RenderProperty } from "../property/dispatch/RenderProperty"
import type { CullFormat, PropertyFormat } from "../res/Format"

/**
 * 
 */
interface PrimitiveDesc {
    cullFormat: CullFormat,
    primitiveTopology: GPUPrimitiveTopology,
}

/**
 * 
 * @param primitiveDesc 
 * @param dispatch 
 * @returns 
 */
const parsePrimitiveState = (
    primitiveDesc: PrimitiveDesc,
    dispatch: RenderProperty,
) => {
    const primitiveState: GPUPrimitiveState = {};
    primitiveState.topology = primitiveDesc.primitiveTopology;

    const t: PropertyFormat = dispatch.getPropertyFormat();
    switch (t) {
        case 'drawIndexed':
            {
                primitiveState.stripIndexFormat = dispatch.getIndexFormat();
                break;
            }
        default:
            break;
    }

    switch (primitiveDesc.cullFormat) {
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