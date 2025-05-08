import { Compiler, type RenderHolderDesc } from '../src/compile/Compiler.ts';
import type { RenderHolder } from '../src/holder/RenderHolder.ts';
import { RenderProperty } from '../src/property/dispatch/RenderProperty.ts';
import { Attributes, Uniforms } from '../src/property/Properties.ts';
import { VertexBuffer } from '../src/res/buffer/VertexBuffer.ts';
import { Context } from '../src/res/Context.ts';
import { VertexShader } from '../src/res/shader/VertexShader.ts';
import { reflectShaderAttributes, type IReflectAttributes } from '../src/util/reflectShaderAttributes.ts';
import { reflectShaderUniforms, type IReflectUniforms } from '../src/util/reflectShaderUniforms.ts';

(async () => {

    const ctx = new Context();
    await ctx.init();
    const compiler: Compiler = new Compiler({ ctx: ctx });

    let desc: RenderHolderDesc = {
        label: '[DEMO][render]',
        vertexShader: compiler.createVertexShader({
            code: `
    @vertex
    fn vs_main(@location(0) in_vertex_position: vec2f) -> @builtin(position) vec4<f32> {
        return vec4f(in_vertex_position, 0.0, 1.0);
    }
    `,
            entryPoint: "vs_main"
        }),
        fragmentShader: compiler.createFragmentShader({
            code: `
    @group(1) @binding(0) var<uniform> uColorR:f32;
    @group(1) @binding(1) var<uniform> uColorG:f32;
    @group(1) @binding(2) var<uniform> uColorB:f32;

    @fragment
    fn fs_main() -> @location(0) vec4f {
        return vec4f(uColorR, uColorG, uColorB, 1.0);
    }
    `,
            entryPoint: "fs_main"
        }),
        attributes: new Attributes(),
        uniforms: new Uniforms(),
        dispatch: new RenderProperty(6, 1)
    };

    const vertexArr = new Float32Array([-0.15, -0.5, 0.5, -0.5, 0.0, 0.5, -0.55, -0.5, -0.05, 0.5, -0.55, 0.5]);
    const vertexBuffer = compiler.createVertexBuffer({
        rawData: vertexArr
    });
    desc.attributes.assign("in_vertex_position", vertexBuffer);

    const uniformBufferR = compiler.createUniformBuffer({ rawData: new Float32Array([1.0]) });
    const uniformBufferG = compiler.createUniformBuffer({ rawData: new Float32Array([0.2]) });
    const uniformBufferB = compiler.createUniformBuffer({ rawData: new Float32Array([0.0]) });

    desc.uniforms.assign("uColorR", uniformBufferR);
    desc.uniforms.assign("uColorG", uniformBufferG);
    desc.uniforms.assign("uColorB", uniformBufferB);

    const holder: RenderHolder | undefined = compiler.compileRenderHolder(desc);
})();


