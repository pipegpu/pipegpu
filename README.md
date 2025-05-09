# pipegpu

> pipegpu is a functional webgpu library, written in typescript. helpes you quickly implement render/compute logic.

## modules
> descriptor of modules in pipegpu.

### compiler
- [ ] Compiler
- [ ] emitAttributes
- [ ] emitRenderPipeline
- [ ] emitUniforms
- [x] parseAttribute
- [x] parseBindGroupLayout
- [ ] parseColorAttachments
- [ ] parseContextDesc
- [ ] parseFragmentState
- [x] parseMultisampleState
- [ ] parsePipelineLayout
- [ ] parsePrimitiveState
- [x] parseRenderBindGroupLayout
- [ ] parseRenderDispatch
- [ ] parseUniform


### graph
- [ ] BaseGraph
- [ ] DirectedAcycilicGraph
- [ ] OrderedGraph

### holder
- [ ] ComputeHolder
- [ ] RenderHolder

### property
- [x] Properties
- [x] BaseProperty
- [ ] StorageBufferProperty (uniforms)
- [ ] TextureProperty (uniforms)
- [ ] TextureSamplerProperty (uniforms)
- [x] UniformBufferProperty (uniforms)
- [x] VertexBufferProperty (attribute)
- [ ] ComputeProperty (dispatch)
- [ ] RenderProperty (dispatch)

### res
- [ ] Pool
- [ ] Format
- [ ] Context
- [ ] BaseTexture (texture)
- [ ] SurfaceTexture2D (texture)
- [ ] Texture2D (texture)
- [ ] TextureStorage2D (texture)
- [x] BaseShader (shader)
- [x] ComputeShader (shader)
- [x] FragmentShader (shader)
- [x] VertexShader (shader)
- [ ] BaseBuffer (buffer)
- [ ] IndexBuffer (buffer)
- [ ] StorageBuffer (buffer)
- [x] UniformBuffer (buffer)
- [x] VertexBuffer (buffer)
- [ ] BaseAttachment (attachment)
- [ ] ColorAttachment (attachment)
- [ ] DepthStencilAttachment (attachment)

### state
- [ ] AttachmentState
- [ ] BufferState
- [ ] PipelineState
- [ ] SamplerState
- [ ] ShaderState
- [ ] StringState
- [ ] TextureState

### util
- [ ] hash32a
- [ ] reflectShaderAttributes
- [ ] reflectShaderUniforms
- [ ] uniqueID
