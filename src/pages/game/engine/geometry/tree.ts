import * as THREE from "three";
import { ChunkParams } from "../../world/chunk/literal";
import { BlockID } from "../../Block";

/**@desc 创建树木方块 顶面、侧面 uv 不同 init tree geometry with custom uv mapping */
export function initTreeGeometry(size = 1, blockId = BlockID.OakLog) {
    const geometry = new THREE.BoxGeometry(size, size, size);
    // This is important to ensure we can map UVs per face
    // Although BoxGeometry is non-indexed by default since r125, explicitly calling can prevent issues
    // and makes the intent clear.
    const nonIndexedGeom = geometry.toNonIndexed(); 
    
    // A single group for a single draw call
    nonIndexedGeom.clearGroups();

    const aTreeOffsetArray = new Float32Array(ChunkParams.maxCount);
    if (blockId === BlockID.OakLog) {
        aTreeOffsetArray.fill(0);
    } else {
        aTreeOffsetArray.fill(0.5);    
    }
    
    nonIndexedGeom.attributes.aTreeOffset = new THREE.InstancedBufferAttribute(aTreeOffsetArray, 1, true);

    const uvAttribute = nonIndexedGeom.attributes.uv;
    const uvs = uvAttribute.array;

    // UV mapping for a 2x1 atlas
    // [0.0, 0.5] for side, [0.5, 1.0] for top/bottom
    const sideU_min = 0.0, sideU_max = 0.5;
    const topU_min = 0.5, topU_max = 1.0;
    const v_min = 0.0, v_max = 1.0;

    // BoxGeometry face order: +X, -X, +Y, -Y, +Z, -Z
    const faces = {
        px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5
    };

    const setFaceUVs = (faceIndex: number, uMin: number, uMax: number) => {
        // Each face has 2 triangles (6 vertices), each vertex has 2 UV coords
        const vertexOffset = faceIndex * 6;
        
        // Triangle 1
        uvs[(vertexOffset + 0) * 2 + 0] = uMin; uvs[(vertexOffset + 0) * 2 + 1] = v_max;
        uvs[(vertexOffset + 1) * 2 + 0] = uMin; uvs[(vertexOffset + 1) * 2 + 1] = v_min;
        uvs[(vertexOffset + 2) * 2 + 0] = uMax; uvs[(vertexOffset + 2) * 2 + 1] = v_max;
        
        // Triangle 2
        uvs[(vertexOffset + 3) * 2 + 0] = uMin; uvs[(vertexOffset + 3) * 2 + 1] = v_min;
        uvs[(vertexOffset + 4) * 2 + 0] = uMax; uvs[(vertexOffset + 4) * 2 + 1] = v_min;
        uvs[(vertexOffset + 5) * 2 + 0] = uMax; uvs[(vertexOffset + 5) * 2 + 1] = v_max;
    };

    // Sides (+X, -X, +Z, -Z)
    setFaceUVs(faces.px, sideU_min, sideU_max);
    setFaceUVs(faces.nx, sideU_min, sideU_max);
    setFaceUVs(faces.pz, sideU_min, sideU_max);
    setFaceUVs(faces.nz, sideU_min, sideU_max);
    
    // Top and Bottom (+Y, -Y)
    setFaceUVs(faces.py, topU_min, topU_max);
    setFaceUVs(faces.ny, topU_min, topU_max);
    
    uvAttribute.needsUpdate = true;
    return nonIndexedGeom;
}