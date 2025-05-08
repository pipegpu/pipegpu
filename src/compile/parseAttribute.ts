import type { VertexBuffer } from "../res/buffer/VertexBuffer"
import type { ShapedArrayFormat } from "../res/Format"
import type { Props, TProps } from "../res/Props"

interface IAttributeRecord {
    name: string,
    offset: number,
    stride: number,
    normalized: boolean
}

/**
 * 
 * @param buffer, support vertex buffer(gpu warpped buffer) or shaped array format(raw value).
 * @param [offset]
 * @param [stride]
 * @param [vertexFormat]
 * 
 */
interface IAttributeBuffer {
    buffer: VertexBuffer | ShapedArrayFormat,
    offset?: number,
    stride?: number,
    vertexFormat?: GPUVertexFormat
}

type TAttribute = {
    [propName in string | number]: ShapedArrayFormat | IAttributeBuffer | Props<TProps>;
}

/**
 * 
 * @param opts 
 */
const parseAttribute = <TA extends TAttribute>(opts: {}): Map<string, IAttributeRecord> => {
    let attributeMap: Map<string, IAttributeRecord> = new Map();

    return attributeMap;
}

export {
    parseAttribute
}