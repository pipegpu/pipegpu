import { ColorAttachment } from "../res/attachment/ColorAttachment"

/**
 * 
 * @param colorAttachments 
 * @returns 
 */
const parseColorAttachments = (
    colorAttachments: ColorAttachment[]
): GPUColorTargetState[] => {
    const colorTargetStates: GPUColorTargetState[] = [];
    if (colorAttachments.length === 0) {
        console.log(`[E][parseColorAttachments] 'RenderHolderDesc' missing color attachments.`);
        return colorTargetStates;
    }
    colorAttachments.forEach(colorAttachment => {
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