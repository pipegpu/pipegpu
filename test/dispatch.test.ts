import { assert, beforeAll, expect, test } from 'vitest'

import { ComputeProperty } from '../src/property/dispatch/ComputeProperty'
import { RenderProperty } from '../src/property/dispatch/RenderProperty'
import { Context, IndexedBuffer, IndexedIndirectBuffer, IndexedStorageBuffer, IndirectBuffer, StorageBuffer } from '../src/index'


const width: number = 400, height: number = 400;
let context: Context;

beforeAll(async () => {
    context = new Context({
        selector: "canvas",
        width: width,
        height: height,
        devicePixelRatio: window.devicePixelRatio,
        requestFeatures: []
    });
    await context.init()
});

test('dispatch: render property.', async () => {

    const indexedBuffer: IndexedBuffer = new IndexedBuffer({
        id: 1,
        context: context,
        totalByteLength: 4 * 3,
        typedArrayData1D: new Uint32Array([1, 2, 3]),
    });

    const indexedStorageBuffer: IndexedStorageBuffer = new IndexedStorageBuffer({
        id: 2,
        context: context,
        totalByteLength: 4 * 3,
        typedArrayData2D: [new Uint32Array([1, 2, 3])]
    });

    const indirectBuffer: IndirectBuffer = new IndirectBuffer({
        id: 3,
        context: context,
        totalByteLength: 16,
    });

    const indexedIndirectBuffer: IndexedIndirectBuffer = new IndexedIndirectBuffer({
        id: 4,
        context: context,
        totalByteLength: 20,
    });

    const indirectDrawCountBuffer: StorageBuffer = new StorageBuffer({
        id: 5,
        context: context,
        totalByteLength: 4,
        bufferUsageFlags: GPUBufferUsage.INDIRECT,
    });

    const renderProperty1: RenderProperty = new RenderProperty(1);
    const renderProperty2: RenderProperty = new RenderProperty(1, 1);
    const renderProperty3: RenderProperty = new RenderProperty(indexedBuffer);
    const renderProperty4: RenderProperty = new RenderProperty(indexedBuffer, 1);
    const renderProperty5: RenderProperty = new RenderProperty(indexedStorageBuffer, 1);
    const renderProperty6: RenderProperty = new RenderProperty(indexedStorageBuffer, indexedIndirectBuffer);
    const renderProperty7: RenderProperty = new RenderProperty(indexedStorageBuffer, indexedIndirectBuffer, indirectDrawCountBuffer, 1);
    const renderProperty8: RenderProperty = new RenderProperty(indexedStorageBuffer, indexedIndirectBuffer, indirectDrawCountBuffer, () => 1);
    const renderProperty9: RenderProperty = new RenderProperty(indirectBuffer);
    const renderProperty10: RenderProperty = new RenderProperty(indirectBuffer, indirectDrawCountBuffer, 1);
    const renderProperty11: RenderProperty = new RenderProperty(indirectBuffer, indirectDrawCountBuffer, () => 1);

    assert(renderProperty1.getPropertyFormat() === 'drawCount', `drawcount render property.`);
    assert(renderProperty2.getPropertyFormat() === 'drawCount', `drawcount render property.`);
    assert(renderProperty3.getPropertyFormat() === 'drawIndexed', `drawIndexed render property.`);
    assert(renderProperty4.getPropertyFormat() === 'drawIndexed', `drawIndexed render property.`);
    assert(renderProperty5.getPropertyFormat() === 'drawIndexedStorage', `drawIndexedStorage render property.`);
    assert(renderProperty6.getPropertyFormat() === 'drawIndexedIndirect', `drawIndexedIndirect render property.`);
    assert(renderProperty7.getPropertyFormat() === 'multiDrawIndexedIndirect', `multiDrawIndexedIndirect render property.`);
    assert(renderProperty8.getPropertyFormat() === 'multiDrawIndexedIndirect', `multiDrawIndexedIndirect render property.`);
    assert(renderProperty9.getPropertyFormat() === 'drawIndirect', `drawIndirect render property.`);
    assert(renderProperty10.getPropertyFormat() === 'multiDrawIndirect', `multiDrawIndirect render property.`);
    assert(renderProperty11.getPropertyFormat() === 'multiDrawIndirect', `multiDrawIndirect render property.`);
});