import type { Uniforms } from "../../property/Properties";
import { reflectShaderAttributes, type IReflectAttributes } from "../../util/reflectShaderAttributes";
import { reflectShaderUniforms } from "../../util/reflectShaderUniforms";
import type { Context } from "../Context";
import { BaseShader } from "./BaseShader";

/**
 * 
 */
class VertexShader extends BaseShader {

    /**
     * 
     */
    private reflectedAttributes: IReflectAttributes | undefined;

    /**
     * 
     * @param opts 
     * 
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
     * 
     */
    public override reflect = (uniforms?: Uniforms, debugLabel?: string): void => {
        this.createGpuShader(`[VertexShader] holder name:${debugLabel}, shader id: ${this.getID()}.`);
        this.reflectedAttributes = reflectShaderAttributes(this.code, this.entryPoint);
        this.reflectedUniforms = reflectShaderUniforms(this.code, this.entryPoint, this.shaderStage, uniforms);
    }

    /**
     * 
     * @returns 
     * 
     */
    getVertexAttributeMap = (): Map<string, GPUVertexAttribute> | undefined => {
        // if (!this.shader) {
        //     this.reflect();
        // }
        return this.reflectedAttributes?.attributeMap;
    }

    /**
     * 
     * @returns 
     * 
     */
    getOrderedAttribute = (): GPUVertexAttribute[] | undefined => {
        // if (!this.shader) {
        //     this.reflect();
        // }
        return this.reflectedAttributes?.attributeOdered;
    }

    /**
     * 
     * @param location 
     * @returns 
     * 
     */
    getAttributeNameByLocation = (location: number): string | undefined => {
        // if (!this.shader) {
        //     this.reflect();
        // }
        return this.reflectedAttributes?.locationMap.get(location);
    }

    /**
     * 
     * @returns 
     * 
     */
    getAttributeCount = (): number | undefined => {
        // if (!this.shader) {
        //     this.reflect();
        // }
        return this.reflectedAttributes?.attributeCount;
    }

}

export {
    VertexShader
}