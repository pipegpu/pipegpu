import type { RenderProperty } from "../property/dispatch/RenderProperty"
import type { IndexedBuffer } from "../res/buffer/IndexedBuffer";
import type { IndirectBuffer } from "../res/buffer/IndirectBuffer";
import type { StorageBuffer } from "../res/buffer/StorageBuffer";
import type { PropertyFormat } from "../res/Format";
import type { RenderHandle } from "../res/Handle";
import type { BufferState } from "../state/BufferState";

/**
 * 
 * @param bufferState 
 * @param dispatch 
 * @param _handler 
 */
const parseRenderDispatch = (dispatch: RenderProperty): RenderHandle => {
    if (!dispatch) {
        throw new Error(`[E][parseRenderDispatch] missing render 'dispatch' in 'RenderHolderDesc'`)
    }
    const t: PropertyFormat = dispatch.getPropertyFormat();
    switch (t) {
        case 'drawCount':
            {
                return (encoder: GPURenderPassEncoder): void => {
                    const maxDrawCount: number = dispatch.getMaxDrawCount()!;
                    const instanceCount: number = dispatch.getInstanceCount()!;
                    encoder.draw(maxDrawCount, instanceCount);
                };
            }
        case 'drawIndexed':
            {
                return (encoder: GPURenderPassEncoder): void => {
                    const indexBuffer: IndexedBuffer = dispatch.getIndexBuffer()!;
                    const instanceCount: number = dispatch.getInstanceCount()!;
                    encoder.setIndexBuffer(indexBuffer.getGpuBuffer(), indexBuffer.getIndexFormat());
                    encoder.drawIndexed(indexBuffer.getDrawCount(), instanceCount, 0, 0, 0);
                };
            }
        case 'drawIndirect':
            {
                return (encoder: GPURenderPassEncoder): void => {
                    const indirectBuffer: IndirectBuffer = dispatch.getIndirectBuffer()!;
                    encoder.drawIndirect(indirectBuffer.getGpuBuffer(), 0);
                };
            }
        case 'multiDrawIndirect':
            {
                /**
                 * 
                 * needs:
                 * chromium-experimental-multi-draw-indirect
                 * 
                 */
                return (encoder: GPURenderPassEncoder): void => {
                    const indirectBuffer: IndirectBuffer = dispatch.getIndirectBuffer()!;
                    const indirectCountBuffer: StorageBuffer = dispatch.getIndirectCountBuffer()!;
                    const maxDrawCount: number = dispatch.getMaxDrawCount()!;
                    (encoder as any).multiDrawIndirect(indirectBuffer.getGpuBuffer(), 0, maxDrawCount, indirectCountBuffer.getGpuBuffer(), 0);
                };
            }
        default:
            {
                throw new Error(`[E][parseRenderDispatch] unsupport render dispatch type:${t} in render 'RenderHolderDesc'`)
            }
    }
}

export {
    parseRenderDispatch
}