import type { VariableInfo } from "wgsl_reflect";
import { hash32a } from "../../util/hash32a";
import type { IReflectUniforms } from "../../util/reflectShaderUniforms";
import type { Context } from "../Context"

/**
 * 
 */
abstract class BaseShader {
    /**
     * 
     */
    private id: number;

    /**
     * 
     */
    private ctx: Context | null | undefined;

    /**
     * 
     */
    protected shaderStage: GPUFlagsConstant;

    /**
     * 
     */
    protected code: string;

    /**
     * 
     */
    protected entryPoint: string;

    /**
     * 
     */
    protected shader: GPUShaderModule | undefined;

    /**
    * 
    */
    protected reflectedUniforms: IReflectUniforms | undefined;

    /**
     * @param opts.id a combined of string with hash value
     * 
     */
    constructor(
        opts: {
            ctx: Context,
            shaderStage: GPUFlagsConstant,
            code: string,
            entryPoint: string
        }
    ) {
        this.id = hash32a(`${opts.code}-${opts.entryPoint}`);
        this.ctx = opts.ctx;
        this.shaderStage = opts.shaderStage;
        this.code = opts.code;
        this.entryPoint = opts.entryPoint;
    }

    /**
     * 
     * @returns 
     */
    getID = (): number => {
        return this.id;
    }

    /**
     * 
     * @returns 
     */
    getEntryPoint = (): string => {
        return this.entryPoint;
    }

    /**
     * get gpu-side shader
     */
    getGpuShader(): GPUShaderModule | undefined {
        if (!this.shader) {
            this.reflect();
        }
        return this.shader;
    }

    /**
     * 
     */
    protected createGpuShader = (label: string): void => {
        if (!this.shader) {
            const desc: GPUShaderModuleDescriptor = {
                label: label,
                code: this.code,
            };
            this.shader = this.ctx?.getGpuDevice().createShaderModule(desc);
        }
    }

    /**
     * 
     * @returns 
     */
    getBindGroupWithGroupLayoutEntriesMap = (): Map<number, Array<GPUBindGroupLayoutEntry>> | undefined => {
        if (!this.shader) {
            this.reflect();
        }
        return this.reflectedUniforms?.groupIDwithBindGroupLayoutEntriesMap;
    }

    /**
     * 
     * @returns 
     */
    getBindGroupWithResourceBindingsMap = (): Map<number, Array<VariableInfo>> | undefined => {
        if (!this.shader) {
            this.reflect();
        }
        return this.reflectedUniforms?.groupIDwithResourceBindingsMap;
    }

    protected abstract reflect(): void;
}

export {
    BaseShader
}