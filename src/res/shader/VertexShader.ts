import { reflectShaderAttributes, type IReflectAttributes } from "../../util/reflectShaderAttributes";
import { reflectShaderUniforms, type IReflectUniforms } from "../../util/reflectShaderUniforms";
import type { Context } from "../Context";
import { BaseShader } from "./BaseShader";

class VertexShader extends BaseShader {
    /**
     * 
     */
    private reflectedAttributes: IReflectAttributes | undefined;

    /**
     * 
     * @param opts 
     */
    constructor(
        opts: {
            ctx: Context,
            code: string,
            entryPoint: string
        }
    ) {
        super({
            ctx: opts.ctx,
            code: opts.code,
            entryPoint: opts.entryPoint,
            shaderStage: GPUShaderStage.VERTEX
        });
    }

    /**
     * 
     */
    protected override reflect = (): void => {
        this.createGpuShader(`[VertexShader][ID][${this.getID()}]`);
        this.reflectedAttributes = reflectShaderAttributes(this.code, this.entryPoint);
        this.reflectedUniforms = reflectShaderUniforms(this.code, this.entryPoint, this.shaderStage);
    }

    /**
     * 
     * @returns 
     */
    getVertexAttributeMap = (): Map<string, GPUVertexAttribute> | undefined => {
        if (!this.shader) {
            this.reflect();
        }
        return this.reflectedAttributes?.attributeMap;
    }

    /**
     * 
     * @returns 
     */
    getOrderedAttribute = (): GPUVertexAttribute[] | undefined => {
        if (!this.shader) {
            this.reflect();
        }
        return this.reflectedAttributes?.attributeOdered;
    }

    getAttributeNameByLocation = (location: number): string | undefined => {
        if (!this.shader) {
            this.reflect();
        }
        return this.reflectedAttributes?.locationMap.get(location);
    }

    getAttributeCount = (): number | undefined => {
        if (!this.shader) {
            this.reflect();
        }
        return this.reflectedAttributes?.attributeCount;
    }
}

export {
    VertexShader
}