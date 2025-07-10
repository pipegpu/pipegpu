import { LoadLIBKTX } from '../plugin/libktx/libktx_wrapper'

/**
 * 
 */
type TextureType = 'BC7_RGBA';

/**
 * 
 */
type KTXDataPack = {
    key: string,
    data: Uint8Array,
    width: number,
    height: number,
    t: TextureType,
}

/**
 *
 * ref:
 * https://github.khronos.org/KTX-Software/ktxjswrappers/libktx_js.html
 * @param uri
 * @param key
 * @returns Promise<KTX2Container>
 *
 */
const fetchKTX2AsBc7RGBA = async (uri: string, key: string = ""): Promise<KTXDataPack> => {
    try {
        const ktx = await LoadLIBKTX();
        const response = await fetch(uri);
        if (!response.ok) {
            throw new Error(`[E][fetchKTX ] ktx2 load failed, response code: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const ktxdata = new Uint8Array(arrayBuffer);
        const ktexture = new ktx.texture(ktxdata);
        if (ktexture.transcodeBasis(ktx.transcode_fmt.BC7_RGBA, 0) === ktx.error_code.SUCCESS) {
            const bufferView = ktexture.getImage(0, 0, 0);
            const u8arr = new Uint8Array(bufferView);
            return {
                key: key,
                data: u8arr,
                width: ktexture.baseWidth,
                height: ktexture.baseHeight,
                t: 'BC7_RGBA'
            };
        } else {
            throw new Error(`[E][fetchKTX ] ktx2 load failed, transcodeBasis error.`);
        }
    } catch (error) {
        throw new Error(`[E][fetchKTX ] ktx2 load failed, response code: ${error}`);
    }
};

export {
    type TextureType,
    type KTXDataPack,
    fetchKTX2AsBc7RGBA
}