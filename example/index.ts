import {
    type RenderHolderDesc, type RenderHolder, type ColorAttachment,
    Context, Compiler, RenderProperty, Attributes, Uniforms,
    BaseHolder
} from '../src/index';
import { initDrawCount } from './tech/initDrawCount';
import { initDrawIndexed } from './tech/initDrawIndexed';

(async () => {

    const ctx: Context = new Context({
        selector: "sketchpad",
        width: 800,
        height: 600,
        devicePixelRatio: devicePixelRatio
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

    // const graph: OrderedGraph = new OrderedGraph(ctx);
    // const renderLoop = () => {
    //     graph.append(holder);
    //     graph.build();
    //     requestAnimationFrame(renderLoop);
    // };
    // requestAnimationFrame(renderLoop);
    const holderArray: BaseHolder[] = [];
    holderArray.push(drawCountHolder);
    holderArray.push(drawIndexedHolder);

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


