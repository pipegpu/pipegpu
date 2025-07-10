import { Attributes, ColorAttachment, DepthStencilAttachment, RenderHolder, RenderProperty, Uniforms, type BaseHolder, type Compiler, type RenderHolderDesc } from "../../src";

const initDrawInstance = (compiler: Compiler, colorAttachments: ColorAttachment[], depthStencilAttachment: DepthStencilAttachment): BaseHolder => {

    let dispatch: RenderProperty;
    {
        const indexData = new Int32Array([0, 1, 2]);
        const indexBuffer = compiler.createIndexBuffer({
            rawData: indexData
        });
        dispatch = new RenderProperty(indexBuffer, 4);
    }

    let desc: RenderHolderDesc = {
        label: '[DEMO][render]',
        vertexShader: compiler.createVertexShader({
            code: `

        struct VSOutput
        {
            @builtin(position) position:vec4f,
            @location(0) color:vec4f,
        }

        @group(0) @binding(0)
        var<storage, read> ssbo_offset:array<vec2f>;

        @group(0) @binding(1)
        var<storage, read> ssbo_color:array<vec4f>;

        @vertex
        fn vs_main( @location(0) position:vec3f, @builtin(instance_index) idx:u32)->VSOutput
        {
            var out:VSOutput;
            let i:u32 = idx % 4;
            let offset = ssbo_offset[idx];
            let color = ssbo_color[i];
            out.position = vec4f(position, 1.0) + vec4f(offset, 0.0, 0.0);
            out.color = color;
            return out;
        }

    `,
            entryPoint: "vs_main"
        }),
        fragmentShader: compiler.createFragmentShader({
            code: `

        struct VSOutput
        {
            @builtin(position) position:vec4f,
            @location(0) color:vec4f,
        }

        @fragment
        fn fs_main(in:VSOutput) -> @location(0) vec4f {
            return in.color;
        }

    `,
            entryPoint: "fs_main"
        }),
        attributes: new Attributes(),
        uniforms: new Uniforms(),
        colorAttachments: colorAttachments,
        depthStencilAttachment: depthStencilAttachment,
        dispatch: dispatch,
    };

    {
        const positionData = new Float32Array([-0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.0, 0.5, 0.0]);
        const positionBuffer = compiler.createVertexBuffer({
            totalByteLength: positionData.byteLength,
            rawData: positionData
        });
        desc.attributes?.assign("position", positionBuffer);
    }

    {
        const colorDataArray: Float32Array[] = [];
        colorDataArray.push(new Float32Array([1.0, 0.0, 0.0, 1.0]));
        colorDataArray.push(new Float32Array([0.0, 1.0, 0.0, 1.0]));
        colorDataArray.push(new Float32Array([0.0, 0.0, 1.0, 1.0]));
        colorDataArray.push(new Float32Array([1.0, 1.0, 1.0, 1.0]));
        const colorBuffer = compiler.createStorageBuffer({
            totalByteLength: 4 * 4 * 4,
            rawData: colorDataArray
        });
        desc.uniforms?.assign("ssbo_color", colorBuffer);
    }

    {
        const offsetBufferDataArray: Float32Array[] = [];
        offsetBufferDataArray.push(new Float32Array([0.15, 0.0]));
        offsetBufferDataArray.push(new Float32Array([0.0, 0.15]));
        offsetBufferDataArray.push(new Float32Array([0.15, 0.15]));
        offsetBufferDataArray.push(new Float32Array([-0.15, 0.3]));
        const offsetBuffer = compiler.createStorageBuffer({
            totalByteLength: 4 * 2 * 4,
            rawData: offsetBufferDataArray
        });
        desc.uniforms?.assign("ssbo_offset", offsetBuffer);
    }

    const holder: RenderHolder | undefined = compiler.compileRenderHolder(desc);
    return holder;
}

export {
    initDrawInstance
}