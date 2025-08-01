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
import { initTexelCopy, texelCopyDebugBuffer } from './tech/initTexelCopy.ts';

(async () => {

    const context: Context = new Context({
        selector: "sketchpad",
        width: 800,
        height: 600,
        devicePixelRatio: devicePixelRatio,
        requestFeatures: ['texture-compression-bc', 'chromium-experimental-multi-draw-indirect']
    });
    await context.init();
    const compiler: Compiler = new Compiler({ ctx: context });

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
        width: context.getViewportWidth(),
        height: context.getViewportHeight(),
        textureFormat: context.getPreferredDepthTexuteFormat(),
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
    const texelCopy: BaseHolder[] = await initTexelCopy(compiler, colorAttachments, depthStencilAttachment) as BaseHolder[];

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
    holderArray.push(texelCopy[0]);
    holderArray.push(texelCopy[1]);


    const renderLoop = async () => {
        context.refreshFrameResource();

        const encoder = context.getCommandEncoder();
        holderArray.forEach(element => {
            element.build(encoder);
        });

        context.submitFrameResource();
        // const rawDebugBuffer = await texelCopyDebugBuffer.PullDataAsync(0, 4);
        // const f32DebugBuffer = new Float32Array(rawDebugBuffer as ArrayBuffer);
        // console.log(f32DebugBuffer);
        requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);

})();


