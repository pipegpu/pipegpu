import { assert, beforeAll, expect, test } from 'vitest'

import { ComputeProperty } from '../src/property/dispatch/ComputeProperty'
import { RenderProperty } from '../src/property/dispatch/RenderProperty'
import { Context, IndexedBuffer } from '../src/index'


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
        id: 4 * 3,
        context: context,
        totalByteLength: 4 * 3,
        typedArrayData1D: new Int32Array([1, 2, 3]),
    });
    const renderProperty1: RenderProperty = new RenderProperty(1);
    const renderProperty2: RenderProperty = new RenderProperty(1, 1);
    const renderProperty3: RenderProperty = new RenderProperty(indexedBuffer);

    assert(renderProperty1.getPropertyFormat() === 'drawCount', `drawcount render property.`);
    assert(renderProperty2.getPropertyFormat() === 'drawCount', `drawcount render property.`);
    assert(renderProperty3.getPropertyFormat() === 'drawIndexed', `drawcount render property.`);
});