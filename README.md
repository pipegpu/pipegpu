# pipegpu

> pipegpu is a functional webgpu library, written in typescript. helpes you quickly implement render/compute logic.

## unit test
> webgpu test dep chrome environment
``` shell
npx playwright install  
```

## modules
> descriptor of modules in pipegpu.
---
### compiler
- [x] Compiler
- [x] emitAttributes
- [x] emitRenderPipeline
- [x] emitUniforms
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
---
### holder
- [x] ComputeHolder
- [x] RenderHolder
---
### property
- [x] Properties
- [x] BaseProperty
#### attribute
- [x] VertexBufferProperty
#### dispatch
- [x] ComputeProperty
- [x] RenderProperty
#### uniform
- [x] StorageBufferProperty
- [x] TextureProperty
- [x] TextureSamplerProperty
- [x] UniformBufferProperty
---
### res
- [x] Format
- [x] Context
#### res texture
- [x] BaseTexture
- [x] SurfaceTexture2D
- [x] Texture2D
- [x] Texture2DArray
- [ ] TextureStorage2D
#### res shader
- [x] BaseShader 
- [x] ComputeShader
- [x] FragmentShader
- [x] VertexShader
#### res buffer
- [x] BaseBuffer 
- [x] Buffer1D
- [x] Buffer2D
- [x] IndexedBuffer
- [x] IndexedIndirectBuffer
- [x] IndexedStorageBuffer
- [x] IndirectBuffer
- [x] Mapbuffer
- [x] StorageBuffer
- [x] UniformBuffer
- [x] VertexBuffer
#### res attachment
- [x] BaseAttachment
- [x] ColorAttachment 
- [x] DepthStencilAttachment
#### res pipeline
- [x] BasePipeline 
- [x] ComputePipeline 
- [x] RenderPipeline 
#### res sampler
- [x] BaseSampler
- [x] TextureSampler
---
### state
- [x] AttachmentState
- [x] BufferState
- [x] PipelineState
- [x] SamplerState
- [x] ShaderState
- [x] TextureState
---
### util
- [x] hash32a
- [x] reflectShaderAttributes
- [x] reflectShaderUniforms
- [x] uniqueID
