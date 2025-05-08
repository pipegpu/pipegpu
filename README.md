# pipegpu

> pipegpu is a functional webgpu library, written in typescript. helpes you quickly implement render/compute logic.

## modules
> descriptor of modules in pipegpu.

### compiler
- [ ] Compiler
- [ ] parseAttribute
- [ ] parseContextDesc

### graph
- [b] BaseGraph
- [ ] DirectedAcycilicGraph
- [ ] OrderedGraph

### holder
- [ ] ComputeHolder
- [ ] RenderHolder

### property
- [ ] Properties
- [ ] BaseProperty
- [ ] StorageBufferProperty (uniforms)
- [ ] TextureProperty (uniforms)
- [ ] TextureSamplerProperty (uniforms)
- [ ] UniformBufferProperty (uniforms)
- [ ] VertexBufferProperty (attribute)
- [ ] ComputeProperty (dispatch)
- [ ] RenderProperty (dispatch)

### res
- [] Pool
- [] Format
- [] Context
- [] BaseTexture (texture)
- [] SurfaceTexture2D (texture)
- [] Texture2D (texture)
- [] TextureStorage2D (texture)
- [] BaseShader (shader)
- [] ComputeShader (shader)
- [] FragmentShader (shader)
- [] VertexShader (shader)
- [] BaseBuffer (buffer)
- [] IndexBuffer (buffer)
- [] StorageBuffer (buffer)
- [x] UniformBuffer (buffer)
- [x] VertexBuffer (buffer)
- [] BaseAttachment (attachment)
- [] ColorAttachment (attachment)
- [] DepthStencilAttachment (attachment)

### state
- [] AttachmentState
- [] BufferState
- [] PipelineState
- [] SamplerState
- [] ShaderState
- [] StringState
- [] TextureState

### util
- [] hash32a
- [] reflectShaderAttributes
- [] reflectShaderUniforms
- [] uniqueID
