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
- [x] RenderProperty (dispatch)

### res
- [x] Format
- [x] Context
#### res texture
- [x] BaseTexture
- [x] SurfaceTexture2D
- [x] Texture2D
- [ ] TextureStorage2D
- [ ] TextureArray2D
- [ ] TextureArray
#### res shader
- [x] BaseShader 
- [x] ComputeShader
- [x] FragmentShader
- [x] VertexShader
#### res buffer
- [ ] BaseBuffer 
- [ ] IndexBuffer
- [x] StorageBuffer
- [x] UniformBuffer
- [x] VertexBuffer
- [x] Mapbuffer
#### res attachment
- [x] BaseAttachment
- [x] ColorAttachment 
- [x] DepthStencilAttachment
#### res pipeline
- [x] BasePipeline 
- [x] ComputePipeline 
- [x] RenderPipeline 
#### res sampler
- [x] BaseSampler (sampler)
- [x] TextureSampler (sampler)

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
