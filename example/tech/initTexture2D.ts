import { Attributes, ColorAttachment, DepthStencilAttachment, RenderHolder, RenderProperty, Uniforms, type BaseHolder, type Compiler, type RenderHolderDesc } from "../../src";

import { LoadLIBKTX } from '../plugin/libktx/libktx_wrapper'
import { fetchKTX2AsBc7RGBA, type KTXDataPack } from "../util/fetchKTX";

const initTexture2D = async (compiler: Compiler, colorAttachments: ColorAttachment[], depthStencilAttachment: DepthStencilAttachment): Promise<BaseHolder> => {

    const ktx = LoadLIBKTX();

    let dispatch: RenderProperty;
    {
        const indexData = new Int16Array([0, 1, 2, 0, 2, 3]);
        const indexBuffer = compiler.createIndexBuffer({
            rawData: indexData
        });
        dispatch = new RenderProperty(indexBuffer);
    }


    let desc: RenderHolderDesc = {
        label: '[DEMO][render]',
        vertexShader: compiler.createVertexShader({
            code: `

struct VertexOutput
{
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@location(0) in_position: vec2<f32>, @location(1) in_uv: vec2<f32>) -> VertexOutput {
    var out: VertexOutput;
    out.position = vec4<f32>(in_position, 0.0, 1.0);
    out.uv = in_uv;
    return out;
}

    `,
            entryPoint: "vs_main"
        }),
        fragmentShader: compiler.createFragmentShader({
            code: `

struct VertexOutput
{
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@group(0) @binding(0) var texture: texture_2d<f32>;
@group(0) @binding(1) var textureSampler: sampler;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4f {
    let color = textureSample(texture, textureSampler, in.uv);
    return color;
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

    // position
    {
        const positionData = new Float32Array([
            -0.5, 0.5,
            -0.5, -0.5,
            0.5, -0.5,
            0.5, 0.5,
        ]);
        const vertexBuffer = compiler.createVertexBuffer({
            totalByteLength: positionData.byteLength,
            rawData: positionData,
        });
        desc.attributes?.assign("in_position", vertexBuffer);
    }

    // uv
    {
        const uvData = new Float32Array([
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0
        ]);
        const uvBuffer = compiler.createVertexBuffer({
            totalByteLength: uvData.byteLength,
            rawData: uvData,
        });
        desc.attributes?.assign('in_uv', uvBuffer);
    }

    // sampler
    {
        const textureSampler = compiler.createTextureSampler({});
        desc.uniforms?.assign('textureSampler', textureSampler);
    }

    // texture2d (.ktx support)
    {
        const ktxDataPack: KTXDataPack = await fetchKTX2AsBc7RGBA('/example/asset/container.ktx');
        const texture = compiler.createTexture2D(
            {
                width: ktxDataPack.width,
                height: ktxDataPack.height,
                textureData: ktxDataPack.data,
                textureFormat: 'bc7-rgba-unorm-srgb'
            }
        );
        desc.uniforms?.assign('texture', texture);
    }

    const holder: RenderHolder | undefined = compiler.compileRenderHolder(desc);
    return holder;
}

export {
    initTexture2D
}