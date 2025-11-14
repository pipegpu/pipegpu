import {
    type BaseHolder,
    type BufferHandleDetail,
    type RenderHolderDesc,
    Attributes,
    ColorAttachment,
    Compiler,
    DepthStencilAttachment,
    RenderHolder,
    RenderProperty,
    Uniforms,
} from "../../src"

import {
    GLMatrix,
    Mat4,
    Vec3
} from 'pipegpu.matrix'

/**
 * reversedZ
 * ref: https://webgpu.github.io/webgpu-samples/?sample=reversedZ#main.ts
 * ref: https://github.com/greggman/wgpu-matrix
 */
const initReversedZ = async (compiler: Compiler, colorAttachments: ColorAttachment[], depthStencilAttachment: DepthStencilAttachment, aspect: number, near: number, far: number): Promise<BaseHolder> => {

    const d = 0.0001;   // half distance between two planes
    const o = 0.5;      // half x offset to shift planes so they are only partially overlaping

    // float4 position, float4 color
    const vertexData = new Float32Array([
        -1 - o, -1, d, 1, 1, 0, 0, 1, 1 - o, -1, d, 1, 1, 0, 0, 1, -1 - o, 1, d, 1, 1, 0, 0, 1, 1 - o, -1, d, 1, 1, 0, 0, 1, 1 - o, 1, d, 1, 1, 0, 0, 1, -1 - o, 1, d, 1, 1, 0, 0, 1,
        -1 + o, -1, -d, 1, 0, 1, 0, 1, 1 + o, -1, -d, 1, 0, 1, 0, 1, -1 + o, 1, -d, 1, 0, 1, 0, 1, 1 + o, -1, -d, 1, 0, 1, 0, 1, 1 + o, 1, -d, 1, 0, 1, 0, 1, -1 + o, 1, -d, 1, 0, 1, 0, 1,
    ]);

    const vertexBuffer = compiler.createVertexBuffer({
        totalByteLength: vertexData.byteLength,
        rawData: vertexData
    });

    const WGSLCode = `

struct FRAGMENT
{
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
}

struct Camera
{
    view: mat4x4f,
    projection: mat4x4f,
}

@group(0) @binding(0) var<uniform> model_matrix: mat4x4f;
@group(0) @binding(1) var<uniform> camera: Camera;

@vertex
fn vs_main(@location(0) position: vec4f, @location(1) color: vec4f) -> FRAGMENT
{
    var f: FRAGMENT;
    // f.position = vec4<f32>(position.xy, 0.0, 1.0);
    // camera.view  * camera.projection
    f.position = camera.projection * camera.view * model_matrix * position;
    f.color = color;
    return f;
}

@fragment
fn fs_main(f: FRAGMENT) -> @location(0) vec4f {
    return f.color;
}

        `;

    const desc: RenderHolderDesc = {
        label: `reversedZ`,
        vertexShader: compiler.createVertexShader({
            code: WGSLCode,
            entryPoint: `vs_main`
        }),
        fragmentShader: compiler.createFragmentShader({
            code: WGSLCode,
            entryPoint: `fs_main`
        }),
        attributes: new Attributes(),
        uniforms: new Uniforms(),
        colorAttachments: colorAttachments,
        depthStencilAttachment: depthStencilAttachment,

        primitiveDesc: {
            cullFormat: 'none'
        },
        dispatch: new RenderProperty(12),
    };

    // attributes assign
    {
        desc.attributes.assign('position', vertexBuffer);
        desc.attributes.assign('color', vertexBuffer);
    }

    // uniforms assign
    {
        let modelMatrix = new Mat4().identity();
        desc.uniforms?.assign('model_matrix', compiler.createUniformBuffer({
            totalByteLength: 16 * 4,
            handler: () => {
                modelMatrix.rotateY(0.03);
                const modelData = new Float32Array(modelMatrix.value);
                const detail: BufferHandleDetail = {
                    offset: 0,
                    byteLength: 16 * 4,
                    rawData: modelData
                };
                return {
                    rewrite: true,
                    detail: detail
                }
            }
        }));
        desc.uniforms?.assign('camera', compiler.createUniformBuffer({
            totalByteLength: 16 * 4 * 2,
            handler: () => {
                const block = new ArrayBuffer(128);
                const cameraViews = {
                    view: new Float32Array(block, 0, 16),
                    projection: new Float32Array(block, 64, 16),
                };
                // const viewData = new Mat4().lookAt(new Vec3().set(-1.0, 1.0, 1.0), new Vec3().set(0, 0, 0), new Vec3().set(0, 1.0, 0)).invert()!.value;
                const viewData = new Mat4().translate(new Vec3().set(0.0, 0.0, -12.0)).value;
                cameraViews.view.set(viewData);
                const projectionData = Mat4.perspective01(GLMatrix.toRadian(60.0), aspect, near, far).value;
                cameraViews.projection.set(projectionData);
                const detail: BufferHandleDetail = {
                    offset: 0,
                    byteLength: 16 * 4 * 2,
                    rawData: block
                };
                return {
                    rewrite: true,
                    detail: detail
                }
            }
        }));
    }

    const renderHolder: RenderHolder = compiler.compileRenderHolder(desc);
    return renderHolder;
}

export {
    initReversedZ,
}