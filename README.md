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
- [x] parseColorAttachments
- [x] parseContextDesc
- [x] parseFragmentState
- [x] parseMultisampleState
- [x] parsePipelineLayout
- [x] parsePrimitiveState
- [x] parseRenderBindGroupLayout
- [x] parseRenderDispatch
- [x] parseUniform

### holder
- [x] ComputeHolder
- [x] RenderHolder

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
- [x] StorageBuffer (buffer)
- [x] UniformBuffer (buffer)
- [x] VertexBuffer (buffer)
- [x] Mapbuffer (buffer)
- [x] BaseAttachment (attachment)
- [x] ColorAttachment (attachment)
- [ ] DepthStencilAttachment (attachment)
- [ ] BasePipeline (pipeline)
- [ ] ComputePipeline (pipeline)
- [ ] RenderPipeline (pipeline)
- [ ] BaseSampler (sampler)
- [ ] TextureSampler (sampler)


### state
- [x] AttachmentState
- [x] BufferState
- [x] PipelineState
- [x] SamplerState
- [x] ShaderState
- [x] TextureState

### util
- [x] hash32a
- [x] reflectShaderAttributes
- [x] reflectShaderUniforms
- [x] uniqueID
