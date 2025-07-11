/**
 * 
 */
type MaterialType =
    | 'kMaterialPBR'
    | 'kMaterialPBR1'
    | 'kMaterialPBR2'
    | 'kMaterialPBR3'
    | 'kMaterialPhong'
    | 'kMaterialPhong1'
    | 'kMaterialPhong2'
    | 'kMaterialPhong3'
    | 'kMaterialPhong4'
    | 'kMaterialPhong5'
    | 'kMaterialPhong6'
    | 'kMaterialPhong7'
    | 'kMaterialPhong8'
    ;

type Material = {
    uuid: string,
    material_type: MaterialType,
}

type MaterialPBR = Material & {
    albedo_texture: string,
    metal_roughness_texture: string,
    normal_texture: string,
    emissive_texture: string,
    ambient_occlusion_texture: string,
}

type MaterialPBR1 = Material & {
    albedo_texture: string,
    metal_roughness_texture: string,
    normal_texture: string,
    ambient_occlusion_texture: string,
};

type MaterialPBR2 = Material & {
    albedo_texture: string,
    metal_roughness_texture: string,
    normal_texture: string,
};

type MaterialPBR3 = Material & {
    albedo_texture: string,
    metal_roughness_texture: string,
};

type MaterialPhong = Material & {
    ambient_texture: string,
    diffuse_texture: string,
    specular_texture: string,
    emissive_texture: string,
    shininess: number
};

type MaterialPhong1 = Material & {
    diffuse_texture: string,
    specular_texture: string,
    emissive_texture: string,
    shininess: number
};

type MaterialPhong2 = Material & {
    diffuse_texture: string,
    specular_texture: string,
    shininess: number
};

type MaterialPhong3 = Material & {
    diffuse_texture: string,
    specular_texture: string,
};

type MaterialPhong4 = Material & {
    diffuse_texture: string,
    shininess: number
};

type MaterialPhong5 = Material & {
    shininess: number
};

type MaterialPhong6 = Material & {
    diffuse_texture: string,
    normal_texture: string,
};

type MaterialPhong7 = Material & {
    diffuse_texture: string,
};

type MaterialPhong8 = Material & {
    diffuse: number[]
};

const MATERIAL_TYPE_MAP: Map<number, MaterialType> = new Map();
MATERIAL_TYPE_MAP.set(1 << 8 | 0, `kMaterialPBR`);
MATERIAL_TYPE_MAP.set(1 << 8 | 1, `kMaterialPBR1`);
MATERIAL_TYPE_MAP.set(1 << 8 | 2, `kMaterialPBR2`);
MATERIAL_TYPE_MAP.set(1 << 8 | 3, `kMaterialPBR3`);
MATERIAL_TYPE_MAP.set(2 << 8 | 0, `kMaterialPhong`);
MATERIAL_TYPE_MAP.set(2 << 8 | 1, `kMaterialPhong1`);
MATERIAL_TYPE_MAP.set(2 << 8 | 2, `kMaterialPhong2`);
MATERIAL_TYPE_MAP.set(2 << 8 | 3, `kMaterialPhong3`);
MATERIAL_TYPE_MAP.set(2 << 8 | 4, `kMaterialPhong4`);
MATERIAL_TYPE_MAP.set(2 << 8 | 5, `kMaterialPhong5`);
MATERIAL_TYPE_MAP.set(2 << 8 | 6, `kMaterialPhong6`);
MATERIAL_TYPE_MAP.set(2 << 8 | 7, `kMaterialPhong7`);
MATERIAL_TYPE_MAP.set(2 << 8 | 8, `kMaterialPhong8`);

type Meshlet = {
    selfParentBounds: Float32Array,
    indices: Uint32Array,
};

/**
 * 
 */
type MeshDataPack = {
    key: string,
    vertices: Float32Array,
    meshlets: Array<Meshlet>,
    material:
    undefined |
    MaterialPBR |
    MaterialPBR1 |
    MaterialPBR2 |
    MaterialPBR3 |
    MaterialPhong |
    MaterialPhong1 |
    MaterialPhong2 |
    MaterialPhong3 |
    MaterialPhong4 |
    MaterialPhong5 |
    MaterialPhong6 |
    MaterialPhong7 |
    MaterialPhong8
}

/**
 * 
 * @param uri 
 * @param _key 
 */
const fetchHDMF = async (uri: string, key: string = ""): Promise<MeshDataPack> => {
    const response = await fetch(uri);
    if (!response.ok) {
        throw new Error(`[E][fetchHDMF ] .hdmf load failed, response code: ${response.status}`);
    }
    const json = await response.json();
    if (json.buffers.length != 1) {
        throw new Error(`[E][fetchHDMF] invalid .hdmf format, please check.`);
    }
    const str: string = json.buffers[0].uri;
    const base64Str = str.replace('data:application/octet-stream;base64,', '');
    const binaryString = atob(base64Str);
    const length = binaryString.length;
    const uint8Array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
    }
    const meshletBoundLength = 5 * 4 * 2;

    // meshlet array data
    const meshlets: Array<Meshlet> = [];
    // bufferview [0] must vertices.
    const vertices: Float32Array = new Float32Array(uint8Array.buffer, 0, json.bufferViews[0].byteLength / 4);
    // bufferview [1] - [length] must meshlet pack array.
    for (let k = 1; k < json.bufferViews.length; k++) {
        const bufferView = json.bufferViews[k];
        const offset = bufferView.byteOffset || 0;
        // meshlet bounds, order:
        // - self meshlet bound center x/y/z, radius, error
        // - parent meshlet bound center x/y/z, radius, error
        // [x, y, z, radius, error, x, y, z, radius, error]
        const meshletBounds: Float32Array = new Float32Array(uint8Array.buffer, offset, meshletBoundLength / 4);    // float
        const meshletIndex: Uint32Array = new Uint32Array(uint8Array.buffer, offset + meshletBoundLength, (bufferView.byteLength - meshletBoundLength) / 4);    // uint32
        const meshlet: Meshlet = {
            selfParentBounds: meshletBounds,
            indices: meshletIndex
        };
        meshlets.push(meshlet);
    }

    const meshDataPack: MeshDataPack = {
        key: key,
        vertices: vertices,
        meshlets: meshlets,
        material: undefined,
    };

    // check material
    if (!json.materials || json.materials.length !== 1) {
        throw new Error('[E][fetchHDMF ] .hdmf load failed, materials error.')
    }
    const materialTypeKey = json.materials[0].extensions.material_type;
    if (!MATERIAL_TYPE_MAP.has(materialTypeKey)) {
        throw new Error('[E][fetchHDMF ] .hdmf load failed, materials error. unsupport material type.')
    }
    const materialType = MATERIAL_TYPE_MAP.get(materialTypeKey);
    switch (materialType) {
        case 'kMaterialPBR':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                albedo_texture: json.materials[0].albedo_texture,
                metal_roughness_texture: json.materials[0].metal_roughness_texture,
                normal_texture: json.materials[0].normal_texture,
                emissive_texture: json.materials[0].emissive_texture,
                ambient_occlusion_texture: json.materials[0].ambient_occlusion_texture,
            }
            break;
        case 'kMaterialPBR1':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                albedo_texture: json.materials[0].albedo_texture,
                metal_roughness_texture: json.materials[0].metal_roughness_texture,
                normal_texture: json.materials[0].normal_texture,
                ambient_occlusion_texture: json.materials[0].ambient_occlusion_texture,
            }
            break;
        case 'kMaterialPBR2':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                albedo_texture: json.materials[0].albedo_texture,
                metal_roughness_texture: json.materials[0].metal_roughness_texture,
                normal_texture: json.materials[0].normal_texture,
            }
            break;
        case 'kMaterialPBR3':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                albedo_texture: json.materials[0].albedo_texture,
                metal_roughness_texture: json.materials[0].metal_roughness_texture,
            }
            break;
        case 'kMaterialPhong':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                ambient_texture: json.materials[0].extensions.ambient_texture,
                diffuse_texture: json.materials[0].extensions.diffuse_texture,
                specular_texture: json.materials[0].extensions.specular_texture,
                emissive_texture: json.materials[0].extensions.emissive_texture,
                shininess: json.materials[0].extensions.shininess,
            }
            break;
        case 'kMaterialPhong1':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                diffuse_texture: json.materials[0].extensions.diffuse_texture,
                specular_texture: json.materials[0].extensions.specular_texture,
                emissive_texture: json.materials[0].extensions.emissive_texture,
                shininess: json.materials[0].extensions.shininess,
            }
            break;
        case 'kMaterialPhong2':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                diffuse_texture: json.materials[0].extensions.diffuse_texture,
                specular_texture: json.materials[0].extensions.specular_texture,
                shininess: json.materials[0].extensions.shininess,
            }
            break;
        case 'kMaterialPhong3':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                diffuse_texture: json.materials[0].extensions.diffuse_texture,
                specular_texture: json.materials[0].extensions.specular_texture,
            }
            break;
        case 'kMaterialPhong4':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                diffuse_texture: json.materials[0].extensions.diffuse_texture,
                shininess: json.materials[0].extensions.shininess,
            }
            break;
        case 'kMaterialPhong5':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                shininess: json.materials[0].extensions.shininess,
            }
            break;
        case 'kMaterialPhong6':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                diffuse_texture: json.materials[0].extensions.diffuse_texture,
                normal_texture: json.materials[0].extensions.normal_texture,
            }
            break;
        case 'kMaterialPhong7':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                diffuse_texture: json.materials[0].extensions.diffuse_texture,
            }
            break;
        case 'kMaterialPhong8':
            meshDataPack.material = {
                uuid: json.materials[0].extensions.material_uuid,
                material_type: materialType,
                diffuse: json.materials[0].extensions.diffuse,
            }
            break;
        default:
            throw new Error(`[E][fetchHDMF] missing support type. please check .hdmf materials.`);
    }

    // (meshDataPack.material as MaterialPBR).
    return meshDataPack;
}

export {
    type MaterialType,
    type MaterialPBR, type MaterialPBR1, type MaterialPBR2, type MaterialPBR3,
    type MaterialPhong, type MaterialPhong1, type MaterialPhong2, type MaterialPhong3, type MaterialPhong4, type MaterialPhong5, type MaterialPhong6, type MaterialPhong7, type MaterialPhong8,
    type MeshDataPack,
    fetchHDMF
}