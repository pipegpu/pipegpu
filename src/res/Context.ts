import { type IContextOpts, type ContextDesc, parseContextDesc } from "../compile/parseContextDesc.ts";



class Context
{

    private contextDesc: ContextDesc;

    private gpuContext: GPUCanvasContext | null;

    private device: GPUDevice | null | undefined;

    private adapter: GPUAdapter | null | undefined;

    constructor(opts: IContextOpts = {
        selector: "",
        width: 0,
        height: 0,
        devicePixelRatio: 0
    })
    {
        this.contextDesc = parseContextDesc(opts);
        this.gpuContext = this.contextDesc.canvas.getContext("webgpu");
    }

    async init() {
        this.adapter = await navigator.gpu.requestAdapter();
        this.device = await this.adapter?.requestDevice();
        this.gpuContext?.configure({
            device: this.device as GPUDevice,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "premultiplied",
        });
    }

    

}

export {
    Context
}