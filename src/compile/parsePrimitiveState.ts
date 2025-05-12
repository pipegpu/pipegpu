import type { RenderProperty } from "../property/dispatch/RenderProperty"
import type { CullFormat, PropertyFormat } from "../res/Format"

interface PrimitiveDesc {
    cullFormat: CullFormat,
    primitiveTopology: GPUPrimitiveTopology,
}

const parsePrimitiveState = (
    primitiveDesc: PrimitiveDesc,
    dispatch: RenderProperty,
) => {
    const primitiveState: GPUPrimitiveState = {};
    primitiveState.topology = primitiveDesc.primitiveTopology;

    const t: PropertyFormat = dispatch.getPropertyFormat();
    switch (t) {
        case 'DrawIndexed':
            {
                primitiveState.stripIndexFormat = dispatch.getIndexFormat();
                break;
            }
        default:
            break;
    }

    switch (primitiveDesc.cullFormat) {
        case 'FrontCCW':
            {
                primitiveState.frontFace = 'ccw';
                primitiveState.cullMode = 'front';
                break;
            }
        case 'FrontCW':
            {
                primitiveState.frontFace = 'cw';
                primitiveState.cullMode = 'front';
                break;
            }
        case 'BackCCW':
            {
                primitiveState.frontFace = 'cw';
                primitiveState.cullMode = 'back';
                break;
            }
        case 'BackCW':
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