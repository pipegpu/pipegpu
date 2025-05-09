import type { VertexBuffer } from "../res/buffer/VertexBuffer"
import type { Context } from "../res/Context"
import type { FragmentShader } from "../res/shader/FragmentShader"
import type { VertexShader } from "../res/shader/VertexShader"



const parseRenderBindGroupLayout = (
    ctx: Context,
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    bindGroupLayouts: GPUBindGroupLayout[],
    gourpIDWithBindGroupLayoutMap: Map<number, GPUBindGroupLayout>,
    gourpIDWithBindGroupLayoutDescriptorMap: Map<number, GPUBindGroupLayoutDescriptor>
) => {




}

export {
    parseRenderBindGroupLayout
}