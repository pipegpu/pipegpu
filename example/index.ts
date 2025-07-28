import {
    type RenderHolderDesc, type RenderHolder, type ColorAttachment,
    Context, Compiler, RenderProperty, Attributes, Uniforms,
    BaseHolder
} from '../src/index';
import { initDrawCount } from './tech/initDrawCount';
import { initDrawIndexed } from './tech/initDrawIndexed';
import { initDrawInstance } from './tech/initDrawInstance';
import { initKTXTexture2D } from './tech/initKTXTexture2D';
import { initKTXTexture2DArray } from './tech/initKTXTexture2DArray';
import { initDrawIndriect } from './tech/initDrawIndirect';
import { initMultiDrawIndirect } from './tech/initMultiDrawIndirect';
import { initDrawIndexedIndirect } from './tech/initDrawIndexedIndirect.ts'
import { initMultiDrawIndexedIndirect } from './tech/initMultiDrawIndexedIndirect.ts'
import { initMultiDrawIndirectWithStorageVertex } from './tech/initMultiDrawIndirectWithStorageVertex.ts';

(async () => {

    const ctx: Context = new Context({
        selector: "sketchpad",
        width: 800,
        height: 600,
        devicePixelRatio: devicePixelRatio,
        requestFeatures: ['texture-compression-bc', 'chromium-experimental-multi-draw-indirect']
    });
    await ctx.init();
    const compiler: Compiler = new Compiler({ ctx: ctx });

    // color attachment
    const surfaceTexture = compiler.createSurfaceTexture2D();
    const surfaceColorAttachment = compiler.createColorAttachment({
        texture: surfaceTexture,
        blendFormat: 'opaque',
        colorLoadStoreFormat: 'loadStore',
        clearColor: [0.0, 0.0, 0.0, 1.0]
    });
    const colorAttachments: ColorAttachment[] = [surfaceColorAttachment];

    // depth stencil attachment
    const depthTexture = compiler.createTexture2D({
        width: ctx.getViewportWidth(),
        height: ctx.getViewportHeight(),
        textureFormat: ctx.getPreferredDepthTexuteFormat(),
    });
    const depthStencilAttachment = compiler.createDepthStencilAttachment({
        texture: depthTexture
    });

    const drawCountHolder = initDrawCount(compiler, colorAttachments, depthStencilAttachment);
    const drawIndexedHolder = initDrawIndexed(compiler, colorAttachments, depthStencilAttachment);
    const drawInstanceHolder = initDrawInstance(compiler, colorAttachments, depthStencilAttachment);
    const texture2DHolder = await initKTXTexture2D(compiler, colorAttachments, depthStencilAttachment);
    const texture2DArrayHolder = await initKTXTexture2DArray(compiler, colorAttachments, depthStencilAttachment);
    const drawIndirect = await initDrawIndriect(compiler, colorAttachments, depthStencilAttachment);
    const multiDrawIndirect = await initMultiDrawIndirect(compiler, colorAttachments, depthStencilAttachment);
    const drawIndexedIndirect = await initDrawIndexedIndirect(compiler, colorAttachments, depthStencilAttachment);
    const multiDrawIndexedIndirect = await initMultiDrawIndexedIndirect(compiler, colorAttachments, depthStencilAttachment);
    const drawIndexedStorage = await initMultiDrawIndirectWithStorageVertex(compiler, colorAttachments, depthStencilAttachment);

    // const graph: OrderedGraph = new OrderedGraph(ctx);
    // const renderLoop = () => {
    //     graph.append(holder);
    //     graph.build();
    //     requestAnimationFrame(renderLoop);
    // };
    // requestAnimationFrame(renderLoop);

    const holderArray: BaseHolder[] = [];
    holderArray.push(drawIndexedStorage);
    holderArray.push(texture2DHolder);
    holderArray.push(drawCountHolder);
    holderArray.push(drawIndexedHolder);
    holderArray.push(drawInstanceHolder);
    holderArray.push(texture2DArrayHolder);
    holderArray.push(drawIndirect);
    holderArray.push(multiDrawIndirect);
    holderArray.push(drawIndexedIndirect);
    holderArray.push(multiDrawIndexedIndirect);


    const renderLoop = () => {
        ctx.refreshFrameResource();
        const encoder = ctx.getCommandEncoder();
        holderArray.forEach(element => {
            element.build(encoder);
        });
        ctx.submitFrameResource();
        requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);

})();


