import type { BaseProperty } from "../property/BaseProperty";
import type { Uniforms } from "../property/Properties"
import type { UniformBufferProperty } from "../property/uniform/UniformBufferProperty";
import type { FrameStageFormat, PropertyFormat } from "../res/Format";
import type { UniformHandle } from "../res/Handle";
import type { BufferState } from "../state/BufferState"
import type { TextureState } from "../state/TextureState"

interface IUniformRecord {
    name: string,
    type: PropertyFormat,
    resourceID: number
}

const parseUniform = (
    _handler: UniformHandle,
    uniforms: Uniforms,
    uniformRecordMap: Map<string, IUniformRecord>,
    bufferUniformRecordsMap: Map<number, Map<string, IUniformRecord>>
) => {
    if (uniforms.isEmpty()) {
        console.log(`[I][parseUniform] input 'uniforms' is empty.`);
        return;
    }

    const appendBufferIDWithAttributeRecords = (bufferID: number, record: IUniformRecord) => {
        if (!bufferUniformRecordsMap.has(bufferID)) {
            const records: Map<string, IUniformRecord> = new Map();
            bufferUniformRecordsMap.set(bufferID, records);
        }
        const records = bufferUniformRecordsMap.get(bufferID);
        records?.set(record.name, record);
    }

    const bc: number[] = [], tc: number[] = [];

    const propertyMap: Map<string, BaseProperty> = uniforms.getPropertyMap();
    propertyMap.forEach((propertyBase: BaseProperty, propertyName: string) => {
        const t: PropertyFormat = propertyBase.getPropertyFormat();
        switch (t) {
            case "UniformBuffer":
                {
                    const uniformBufferProperty: UniformBufferProperty = propertyBase as UniformBufferProperty;
                    const bufferID: number = uniformBufferProperty.getUniformBufferID();
                    let record: IUniformRecord = {
                        name: propertyName,
                        type: t,
                        resourceID: bufferID

                    };
                    appendBufferIDWithAttributeRecords(bufferID, record);
                    uniformRecordMap.set(propertyName, record);
                    bc.push(bufferID);
                    break;
                }
            default:
                console.log(`[E][parseUniform] unsupported property type: ${t}`);
                break;
        }
    });

    // support:
    // handler
    if (bc.length || tc.length) {
        _handler = (frameStage: FrameStageFormat, encoder: GPUCommandEncoder, bufferState: BufferState, textureState: TextureState) => {
            bc.forEach(bufferID => {
                bufferState.getBuffer(bufferID)?.getGpuBuffer(encoder, frameStage);
            });
            tc.forEach(textureID => {
                textureState.getTexture(textureID)?.getGpuTexture(encoder, frameStage);
            });
        }
    }

}

export {
    type IUniformRecord,
    type UniformHandle,
    parseUniform
}