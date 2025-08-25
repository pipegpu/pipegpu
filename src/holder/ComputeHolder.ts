import type { Context } from "../res/Context";
import type { ComputeHandle, HookHandle, UniformHandle } from "../res/Handle";
import type { ComputePipeline } from "../res/pipeline/ComputePipeline";
import type { BufferState } from "../state/BufferState";
import type { TextureState } from "../state/TextureState";
import { BaseHolder } from "./BaseHolder";

/**
 * 
 */
class ComputeHolder extends BaseHolder {
    /**
     * 
     */
    private computePipeline: ComputePipeline;

    /**
     * 
     */
    private bufferState: BufferState;

    /**
     * 
     */
    private textureState: TextureState;

    /**
     * 
     */
    private computeHandler: ComputeHandle;

    /**
     * 
     */
    private uniformHandler: UniformHandle;

    /**
     * 
     */
    private hookHandler?: HookHandle;

    /**
     * 
     */
    private slotBindGroupMap: Map<number, GPUBindGroup>;

    /**
     * 
     * @param opts 
     * 
     */
    constructor(
        opts: {
            debugLabel: string,
            id: number,
            context: Context,
            computePipeline: ComputePipeline,
            bufferState: BufferState,
            textureState: TextureState,
            computeHandler: ComputeHandle,
            uniformHandler: UniformHandle,
            hookHandler?: HookHandle,
            slotBindGroupMap: Map<number, GPUBindGroup>,
        }
    ) {
        super({
            debugLabel: opts.debugLabel,
            id: opts.id,
            context: opts.context,
            poropertyFormat: 'computeHolder'
        });
        this.computePipeline = opts.computePipeline;
        this.bufferState = opts.bufferState;
        this.textureState = opts.textureState;
        this.computeHandler = opts.computeHandler;
        this.uniformHandler = opts.uniformHandler;
        this.hookHandler = opts.hookHandler;
        this.slotBindGroupMap = opts.slotBindGroupMap;
    }

    /**
     * 
     * @param encoder 
     */
    override build(encoder: GPUCommandEncoder): void {
        // uniform update support:
        // - uniform buffer update
        // - texture update
        this.uniformHandler('frameBegin', encoder, this.bufferState, this.textureState);

        const desc: GPUComputePassDescriptor = {
            label: `compute holder`
        };
        const computePass = encoder.beginComputePass(desc);
        computePass.setPipeline(this.computePipeline.getGpuComputePipeline());

        // uniform slot assign
        this.slotBindGroupMap.forEach((bindGroup, slot) => {
            computePass.setBindGroup(slot, bindGroup);
        });

        this.computeHandler(computePass);
        computePass.end();

        // uniform copy buffer should recrod whild any pass encoder end
        this.uniformHandler('frameFinish', encoder, this.bufferState, this.textureState);

        // do hook event at frame end.
        this.hookHandler ? this.hookHandler(encoder) : null;
    }
}

export {
    ComputeHolder
}