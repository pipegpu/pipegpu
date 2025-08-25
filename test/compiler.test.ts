import { assert, beforeAll, expect, test } from 'vitest'
import { Compiler, Context } from '../src/index'

const width: number = 400, height: number = 400;
let context: Context;
let compiler: Compiler;

beforeAll(async () => {
    context = new Context({
        selector: "canvas",
        width: width,
        height: height,
        devicePixelRatio: window.devicePixelRatio,
        requestFeatures: []
    });
    await context.init()
    compiler = new Compiler({
        context: context
    });
});

test('compiler vaild.', async () => {
    expect(compiler != undefined).toBe(true);
});

test('compiler create vertex buffer.', async () => {
    let seed = 0;
    const vertexBuffer = compiler.createVertexBuffer({
        totalByteLength: 12 * 4,
        handler: () => {
            const arrayData = new Float32Array([-0.15 + Math.sin((seed++) * 0.01), -0.5, 0.5, -0.5, 0.0, 0.5, -0.55, -0.5, -0.05, 0.5, -0.55, 0.5]);
            return {
                rewrite: true,
                detail: {
                    offset: 0,
                    byteLength: arrayData.byteLength,
                    rawData: arrayData
                }
            };
        }
    });
    assert(vertexBuffer !== undefined, `vertex buffer vaild.`);
    assert(vertexBuffer.getByteLength() == 12 * 4, `vertex buffer byteLength.`);
    assert(vertexBuffer.getID() > 0, `vaild vertex buffer id`);
});
