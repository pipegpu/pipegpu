import type { BaseProperty } from "../property/BaseProperty";
import type { Uniforms } from "../property/Properties"
import type { UniformBufferProperty } from "../property/uniform/UniformBufferProperty";
import type { FrameStageFormat, PropertyFormat } from "../res/Format";
import type { UniformHandle } from "../res/Handle";
import type { BufferState } from "../state/BufferState"
import type { TextureState } from "../state/TextureState"

/**
 * 
 * @param _frameStage 
 * @param _encoder 
 * @param _bufferState 
 * @param _textureState 
 */
const emptyUniformHandler: UniformHandle = (_frameStage: FrameStageFormat, _encoder: GPUCommandEncoder, _bufferState: BufferState, _textureState: TextureState): void => { }

/**
 * 
 */
interface IUniformRecord {
    name: string,
    type: PropertyFormat,
    resourceID: number
}

/**
 * 
 * @param _handler 
 * @param uniforms 
 * @param uniformRecordMap 
 * @param bufferUniformRecordsMap 
 * @returns 
 */
const parseUniform = (
    opts: {
        uniforms?: Uniforms,
        uniformRecordMap: Map<string, IUniformRecord>,
        bufferUniformRecordsMap: Map<number, Map<string, IUniformRecord>>
    }
): UniformHandle => {
    if (opts.uniforms?.isEmpty()) {
        console.log(`[I][parseUniform] input 'uniforms' is empty.`);
        return emptyUniformHandler;
    }

    const appendBufferIDWithAttributeRecords = (bufferID: number, record: IUniformRecord) => {
        if (!opts.bufferUniformRecordsMap.has(bufferID)) {
            const records: Map<string, IUniformRecord> = new Map();
            opts.bufferUniformRecordsMap.set(bufferID, records);
        }
        const records = opts.bufferUniformRecordsMap.get(bufferID);
        records?.set(record.name, record);
    }

    const bc: number[] = [], tc: number[] = [];

    const propertyMap: Map<string, BaseProperty> | undefined = opts.uniforms?.getPropertyMap();
    propertyMap?.forEach((propertyBase: BaseProperty, propertyName: string) => {
        const t: PropertyFormat = propertyBase.getPropertyFormat();
        switch (t) {
            case "uniformBuffer":
                {
                    const uniformBufferProperty: UniformBufferProperty = propertyBase as UniformBufferProperty;
                    const bufferID: number = uniformBufferProperty.getUniformBufferID();
                    let record: IUniformRecord = {
                        name: propertyName,
                        type: t,
                        resourceID: bufferID

                    };
                    appendBufferIDWithAttributeRecords(bufferID, record);
                    opts.uniformRecordMap.set(propertyName, record);
                    bc.push(bufferID);
                    break;
                }
            default:
                {
                    throw new Error(`[E][parseUniform] unsupported property type: ${t}`);
                }
        }
    });

    // support cpu-side update:
    // - buffer update
    // - texture update
    if (bc.length || tc.length) {
        return (frameStage: FrameStageFormat, encoder: GPUCommandEncoder, bufferState: BufferState, textureState: TextureState) => {
            bc.forEach(bufferID => {
                bufferState.getBuffer(bufferID)?.getGpuBuffer(encoder, frameStage);
            });
            tc.forEach(textureID => {
                textureState.getTexture(textureID)?.getGpuTexture(encoder, frameStage);
            });
        }
    } else {
        return emptyUniformHandler;
    }
}

export {
    type IUniformRecord,
    type UniformHandle,
    parseUniform
}