import { ColorAttachment } from "../res/attachment/ColorAttachment"

/**
 * 
 * @param colorAttachments 
 * @returns 
 */
const parseColorAttachments = (
    opts: {
        debugLabel: string,
        colorAttachments: ColorAttachment[],
    }
): GPUColorTargetState[] => {
    const colorTargetStates: GPUColorTargetState[] = [];
    if (opts.colorAttachments.length === 0) {
        console.log(`[E][parseColorAttachments] ${opts.debugLabel} 'RenderHolderDesc' missing color attachments.`);
        return colorTargetStates;
    }
    opts.colorAttachments.forEach(colorAttachment => {
        const colorTargetState: GPUColorTargetState = {
            format: colorAttachment.getTextureFormat()
        };
        // blend
        colorTargetState.blend = colorAttachment.getGpuBlendState();
        colorTargetState.writeMask = GPUColorWrite.ALL;
        colorTargetStates.push(colorTargetState);
    });
    return colorTargetStates;
}

export {
    parseColorAttachments
}