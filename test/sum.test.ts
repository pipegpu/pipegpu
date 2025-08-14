import { expect, test } from 'vitest'
import { Context } from '../src/index'

test('webgpu context init.', async () => {
    const context: Context = new Context({
        selector: "canvas",
        width: 400,
        height: 400,
        devicePixelRatio: window.devicePixelRatio
    });
    expect(context != undefined).toBe(true);

    await context.init();

    console.log(context.getLimits());
});

test('adds 1 + 2 to equal 3', () => {
    expect(3).toBe(3)
})
