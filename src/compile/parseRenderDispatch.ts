import type { RenderProperty } from "../property/dispatch/RenderProperty"
import type { IndexBuffer } from "../res/buffer/IndexBuffer";
import type { PropertyFormat } from "../res/Format";
import type { RenderHandle } from "../res/Handle";
import type { BufferState } from "../state/BufferState";

/**
 * 
 * @param bufferState 
 * @param dispatch 
 * @param _handler 
 */
const parseRenderDispatch = (
    bufferState: BufferState,
    dispatch: RenderProperty,
    _handler: RenderHandle
): void => {
    if (!dispatch) {
        console.log(`[E][parseRenderDispatch] missing render 'dispatch' in 'RenderHolderDesc'`);
    }

    const t: PropertyFormat = dispatch.getPropertyFormat();
    switch (t) {
        case 'DrawCount':
            {
                _handler = (encoder: GPURenderPassEncoder): void => {
                    const maxDrawCount: number = dispatch.getMaxDrawCount();
                    const instanceCount: number = dispatch.getInstanceCount();
                    encoder.draw(maxDrawCount, instanceCount);
                };
                break;
            }
        case 'DrawIndexed':
            {
                _handler = (encoder: GPURenderPassEncoder): void => {
                    const indexBufferID: number = dispatch.getIndexBufferID();
                    const indexBuffer: IndexBuffer = bufferState.getBuffer(indexBufferID) as IndexBuffer;
                    const instanceCount: number = dispatch.getInstanceCount();
                    encoder.setIndexBuffer(indexBuffer.getGpuBuffer(), 'uint32');
                    encoder.drawIndexed(indexBuffer.getIndexCount(), instanceCount, 0, 0, 0);
                };
                break;
            }
        default:
            break;
    }
}

export {
    parseRenderDispatch
}