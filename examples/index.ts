import { Context } from '../src/res/Context.ts';
import { reflectShaderAttributes, type IReflectAttributes } from '../src/util/reflectShaderAttributes.ts';
import { reflectShaderUniforms, type IReflectUniforms } from '../src/util/reflectShaderUniforms.ts';

(async () => {
    const ctx = new Context();
    await ctx.init();

    const vertex_code = `

    @vertex
    fn vs_main(@location(0) in_vertex_position: vec2f) -> @builtin(position) vec4<f32> {
        return vec4f(in_vertex_position, 0.0, 1.0);
    }

    `;

    const fragment_code = `

    @group(1) @binding(0) var<uniform> uColorR:f32;

    @group(1) @binding(1) var<uniform> uColorG:f32;

    @group(1) @binding(2) var<uniform> uColorB:f32;

    @fragment
    fn fs_main() -> @location(0) vec4f {
        return vec4f(uColorR, uColorG, uColorB, 1.0);
    }

    `;

    const rfas: IReflectAttributes = reflectShaderAttributes(vertex_code, "vs_main");
    console.log(rfas);

    const rfus: IReflectUniforms = reflectShaderUniforms(fragment_code, "fs_main", GPUShaderStage.FRAGMENT);
    console.log(rfus);

})();


