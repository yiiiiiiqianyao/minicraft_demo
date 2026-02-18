import * as THREE from "three";
import { Block, RenderGeometry } from "../../Block/base/Block";
import { jitterNumber } from "../../utils";
import { BlockID } from "../../Block";

/**@desc 向 InstancedMesh 中添加一个方块 */
export function InstanceMeshAdd(mesh: THREE.InstancedMesh, blockClass: Block, x: number, y: number, z: number) {
    switch (blockClass.geometry) {
        case RenderGeometry.Tree:
            return InstanceMeshAddTree(mesh, blockClass.id, x, y, z);
        case RenderGeometry.Cube:
        case RenderGeometry.GrassBlock:
            return InstanceMeshAddCube(mesh, blockClass.id, x, y, z);
        case RenderGeometry.Cross:
            return InstanceMeshAddCrossPlants(mesh, blockClass.id, x, y, z);
        default:
            console.warn(`Unknown geometry ${blockClass.geometry}`);
            return null;
    }
}

/**@desc 向 InstancedMesh 中添加一个树方块 */
function InstanceMeshAddTree(mesh: THREE.InstancedMesh, blockId: BlockID, x: number, y: number, z: number) {
    const instanceId = mesh.count++;
    const matrix = new THREE.Matrix4();
    matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);

    mesh.geometry.attributes.aTreeOffset.array[instanceId] = blockId === BlockID.OakLog ? 0 : 0.5;
    mesh.geometry.attributes.aTreeOffset.needsUpdate = true;
    mesh.setMatrixAt(instanceId, matrix);

    mesh.userData.blockId = blockId;

    return [instanceId];
}

/**@desc 向 InstancedMesh 中添加一个立方体方块 */
function InstanceMeshAddCube(mesh: THREE.InstancedMesh, blockId: BlockID, x: number, y: number, z: number) {
    const instanceId = mesh.count++;
    const matrix = new THREE.Matrix4();
    matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
    mesh.setMatrixAt(instanceId, matrix);

    mesh.userData.blockId = blockId;

    return [instanceId];
}

/**@desc 向 InstancedMesh 中添加一个十字植物方块 */
function InstanceMeshAddCrossPlants(mesh: THREE.InstancedMesh, blockId: BlockID, x: number, y: number, z: number) {
    const instanceId1 = mesh.count++;
    const instanceId2 = mesh.count++;
    const isFlower = blockId === BlockID.FlowerDandelion || blockId === BlockID.FlowerRose;
    if (blockId === BlockID.FlowerDandelion) {
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2] = 0.2;
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2 + 1] = 0.8;

        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2] = 0.2;
        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2 + 1] = 0.8;
    } else if (blockId === BlockID.FlowerRose) {
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2] = 0;
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2 + 1] = 0.8;

        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2] = 0;
        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2 + 1] = 0.8;
    } else if (blockId === BlockID.TallGrass) {
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2] = 0;
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2 + 1] = 0.6;

        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2] = 0;
        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2 + 1] = 0.6;
    } else if (blockId === BlockID.ShortGrass) {
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2] = 0.6;
        mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2 + 1] = 0.6;

        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2] = 0.6;
        mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2 + 1] = 0.6;
    }
    
    mesh.geometry.attributes.aCrossOffset.needsUpdate = true;

    // 在添加花实例的时候需要有一点偏移
    const xOffset = isFlower ? jitterNumber(0.5, 0.15) : 0.5;
    const zOffset = isFlower ? jitterNumber(0.5, 0.15) : 0.5;
    // 花的实例矩阵需要偏移0.2个单位，因为花的模型是0.6高
    const matrix1 = new THREE.Matrix4();
    matrix1.makeRotationY(Math.PI / 4);
    matrix1.setPosition(x + xOffset, y + 0.5, z + zOffset);
    mesh.setMatrixAt(instanceId1, matrix1);

    const matrix2 = new THREE.Matrix4();
    matrix2.makeRotationY(-Math.PI / 4);
    matrix2.setPosition(x + xOffset, y + 0.5, z + zOffset);
    mesh.setMatrixAt(instanceId2, matrix2);

    mesh.userData.blockId = blockId;
    return [instanceId1, instanceId2];
}