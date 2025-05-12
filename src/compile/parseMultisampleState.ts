import type { MultiSampleFormat } from "../res/Format"

/**
 * 
 * @param multiSampleFormat 
 * @param multiSampleState 
 */
const parseMultisampleState = (multiSampleFormat: MultiSampleFormat): GPUMultisampleState => {
    const multiSampleState: GPUMultisampleState = {};
    multiSampleState.mask = ~0;
    multiSampleState.alphaToCoverageEnabled = false;
    switch (multiSampleFormat) {
        case '1x':
            multiSampleState.count = 1;
            break;
        case '2x':
            multiSampleState.count = 2;
            break;
        case '4x':
            multiSampleState.count = 4;
            break;
        case '8x':
            multiSampleState.count = 8;
            break;
        default:
            multiSampleState.count = 1;
            break;
    }
    return multiSampleState;
}

export {
    parseMultisampleState
}
