# pipegpu
> pipegpu is a WebGPU API wrapper library designed to divide the rendering process into the following parts:

- Resources: This includes input vertex data, material information, texture maps, etc. Graphics rendering commands consume these resources as needed to complete rendering tasks. Most of these resources are processed on the CPU before being handed over to the GPU for consumption.

- Commands: This refers to the data consumption process, which receives data submitted by the CPU and processes it according to established goals (computation, shading), ultimately rendering it on the page.

> pipegpu rewraps native WebGPU objects such as Indirect Buffers, Index Buffers, Textures, etc. The purpose of this encapsulation is to help developers focus on 'data' within a 'data-driven' philosophy, eliminating the need to consider the extensive organization of the rendering process, such as pipeline layouts and bind group layouts. It retains flexibility by allowing for the original GPU object creation and free shader implementation.

> After collecting the input data and commands, pipegpu pre-compiles them into rendering nodes/computational nodes. During subsequent frame updates, if a node still needs to participate, it can simply execute a build to record the commands, which are then submitted to the GPU for execution. This process is more flexible than bundling, supporting CPU update requirements between frames and dynamically organizing the number of rendering/computational nodes based on data status.

> pipegpu serves as a foundational library for WebGPU, and on top of this, we offer a graph concept to construct rendering with a data-driven approach.