
/**
 * ref:
 * https://github.com/KIWI-ST/pipegl/blob/master/src/core/Props.ts
 */

import type { StorageBuffer } from "./buffer/StorageBuffer";
import type { VertexBuffer } from "./buffer/VertexBuffer";
import type { SurfaceTexture2D } from "./texture/SurfaceTexture2D";
import type { Texture2D } from "./texture/Texture2D";
import type { TextureStorage2D } from "./texture/TextureStorage2D";

// TODO:: support all res types
type TProps = {
    [propName in string]: number | number[] | number[][] | VertexBuffer | StorageBuffer | Texture2D | SurfaceTexture2D | TextureStorage2D
}

/**
 * @author axmand
 * @example
 * interface IPorps extends TProps{
 *      offset:number[]
 * }
 * // offset 作为IProps属性列中一个，指定后续使用该属性列如何取batch中输入的类型
 * const prop = new Porps<IPorps, 'offset'>('offset');
 * //指示使用
 * prop.KEY作为读取batch内数据的索引属性
 */
class Props<T extends TProps> {
    /**
     * 存储 prop 索引属性
     */
    private key: string;

    /**
     * 公开索引，使用时例如 p0[0]['offset']获取batchDraw内的offeset值
     */
    get KEY(): string {
        return this.key;
    }

    constructor(key: keyof { [key in keyof T]: string }) {
        this.key = `['${String(key)}']`;
    }
}

export {
    type TProps,
    Props
}