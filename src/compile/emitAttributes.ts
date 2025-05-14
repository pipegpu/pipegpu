import type { PropertyFormat } from "../res/Format";
import type { VertexShader } from "../res/shader/VertexShader"
import type { IAttributeRecord } from "./parseAttribute"

/**
 * 
 * @param vertexFormat 
 */
const getVertexFormatStride = (vertexFormat: GPUVertexFormat): number => {
    switch (vertexFormat) {
        case 'float32':
            return 4;
        case 'sint32':
            return 4;
        case 'uint32':
            return 4;
        case 'float32x2':
            return 8;
        case 'float32x3':
            return 12;
        case 'float32x4':
            return 16;
        case 'uint32x2':
            return 8;
        case 'uint32x3':
            return 12;
        case 'uint32x4':
            return 16;
        case 'sint32x2':
            return 8;
        case 'sint32x3':
            return 12;
        case 'sint32x4':
            return 16;
        default:
            console.log(`[E][getVertexFormatStride] unsupported vertex format type: ${vertexFormat}`);
            return 0;
    }
}

/**
 * 
 * @param vertexShader 
 * @param attributeRecordMap 
 * @param bufferAttributeRecordsMap 
 * @param vertexBufferLayouts 
 * @param vertexBufferIDAttributesMap 
 * @param vertexState 
 * @param slotBufferIDMap 
 */
const emitAttributes = (
    vertexShader: VertexShader,
    bufferAttributeRecordsMap: Map<number, Map<string, IAttributeRecord>>,
    vertexBufferLayouts: GPUVertexBufferLayout[],
    vertexBufferIDAttributesMap: Map<number, GPUVertexAttribute[]>,
    slotBufferIDMap: Map<number, number>
) => {
    const orderedAttributes: GPUVertexAttribute[] | undefined = vertexShader.getOrderedAttribute();

    const appendAttributeByBufferID = (bufferID: number, att: GPUVertexAttribute): void => {
        if (!vertexBufferIDAttributesMap.has(bufferID)) {
            let attrs: GPUVertexAttribute[] = [];
            vertexBufferIDAttributesMap.set(bufferID, attrs);
        }
        vertexBufferIDAttributesMap.get(bufferID)?.push(att);
    };


    // order by shader location, spilit and group by buffer
    // slot only mapping one buffer, a buffer can mapping multi-slots.
    bufferAttributeRecordsMap.forEach((attributeRecrods: Map<string, IAttributeRecord>, bufferID: number) => {
        let offset: number = 0;

        orderedAttributes?.forEach((att: GPUVertexAttribute) => {
            const key: string | undefined = vertexShader.getAttributeNameByLocation(att.shaderLocation);
            if (!key) {
                return;
            }
            const r = attributeRecrods.get(key);
            if (!r) {
                return;
            }
            const stride: number = getVertexFormatStride(att.format);
            const t: PropertyFormat = r.type;
            switch (t) {
                case 'vertexBuffer':
                    {
                        att.offset = offset;
                        offset += stride;
                        appendAttributeByBufferID(bufferID, att);
                        break;
                    }
                default:
                    {
                        console.log(`[E][emitAttributes] unsupport emit property type: ${t}.`);
                        break;
                    }
            }
        });

        // only vertex buffer has attributes, set in slot binding layout.
        if (vertexBufferIDAttributesMap.size) {
            const attributes = vertexBufferIDAttributesMap.get(bufferID);
            if (!attributes) {
                return;
            }
            const vertexBufferLayout: GPUVertexBufferLayout = {
                arrayStride: offset,
                attributes: attributes,
                stepMode: 'vertex'
            };
            vertexBufferLayouts.push(vertexBufferLayout);
        }
    });

    // TODO:: 
    // vertexBufferLayouts.sort((a, b) => {
    // return a.attributes.
    // });

    orderedAttributes?.forEach(att => {
        const key: string | undefined = vertexShader.getAttributeNameByLocation(att.shaderLocation);
        if (!key) {
            return;
        }
        bufferAttributeRecordsMap.forEach((records, bufferID) => {
            if (records.has(key)) {
                slotBufferIDMap.set(att.shaderLocation, bufferID);
            }
            if (slotBufferIDMap.size != orderedAttributes.length) {
                console.log(`[E][emitter][emitAttributes] bufer attributes count not equal slot count, please check.`)
                return;
            }
        });
    });

    const vertexState: GPUVertexState = {
        module: vertexShader.getGpuShader(),
        entryPoint: vertexShader.getEntryPoint(),
        buffers: vertexBufferLayouts
    };

    return vertexState;
}

export {
    emitAttributes
}