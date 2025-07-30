import { ComputeProperty, Uniforms, type BaseHolder, type Compiler, type ComputeHolderDesc } from "../../src"
import { fetchKTX2AsBc7RGBA, type KTXDataPack } from "../util/fetchKTX";

const initTexelCopy = async (compiler: Compiler): Promise<BaseHolder> => {

    const ktxDataPack: KTXDataPack = await fetchKTX2AsBc7RGBA('/example/asset/ktx/1.ktx');
    const wx = ktxDataPack.width, wy = ktxDataPack.height, wz = 1;

    const texture_2d = compiler.createTexture2D({
        width: wx,
        height: wy,
        textureData: ktxDataPack.data,
        textureFormat: 'bc7-rgba-unorm',
        maxMipLevel: 1
    });
    const texture_storage_2d = compiler.createTextureStorage2D({
        width: wx,
        height: wy,
        textureFormat: 'r32float',
        maxMipLevel: 1,
    });

    const WGSLCode = `

requires readonly_and_readwrite_storage_textures;

@group(0) @binding(0) var texture_2d_src : texture_2d<f32>;

@group(0) @binding(1) var texture_storage_2d_dst : texture_storage_2d<r32float, read_write>;

@compute @workgroup_size(16, 16, 1)
fn cp_main(@builtin(global_invocation_id) global_id: vec3<u32>) 
{
    let rgba: vec4<f32> = textureLoad(texture_2d_src, global_id.xy, 0);
    let color4: vec4<f32> = vec4<f32>(rgba.a, 0.0, 0.0, 1.0);
    textureStore(texture_storage_2d_dst, global_id.xy, color4);
}

    `;

    const desc: ComputeHolderDesc = {
        label: "texel copy",
        computeShader: compiler.createComputeShader({
            code: WGSLCode,
            entryPoint: `cp_main`
        }),
        uniforms: new Uniforms(),
        dispatch: new ComputeProperty(wx / 16, wy / 16, wz),
    }
    desc.uniforms?.assign('texture_2d_src', texture_2d);
    desc.uniforms?.assign('texture_storage_2d_dst', texture_storage_2d);

    const holder = compiler.compileComputeHolder(desc);

    return holder;
}

export {
    initTexelCopy
}