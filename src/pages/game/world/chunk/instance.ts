import * as THREE from "three";
import { Block, RenderGeometry } from "../../Block/base/Block";
import { jitterNumber } from "../../utils";
import { BlockID } from "../../Block";

export function InstanceMeshAdd(mesh: THREE.InstancedMesh, blockClass: Block, x: number, y: number, z: number) {
    switch (blockClass.geometry) {
        case RenderGeometry.Tree:
            return InstanceMeshAddTree(mesh, blockClass.id, x, y, z);
        case RenderGeometry.Cube:
        case RenderGeometry.GrassBlock:
            return InstanceMeshAddCube(mesh, x, y, z);
        case RenderGeometry.Cross:
            return InstanceMeshAddCross(mesh, x, y, z);
        case RenderGeometry.Flower:
            return InstanceMeshAddFlower(mesh, blockClass.id, x, y, z);
        default:
            console.warn(`Unknown geometry ${blockClass.geometry}`);
            return null;
    }
}

function InstanceMeshAddTree(mesh: THREE.InstancedMesh, blockId: BlockID, x: number, y: number, z: number) {
    const instanceId = mesh.count++;
    const matrix = new THREE.Matrix4();
    matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);

    mesh.geometry.attributes.aTreeOffset.array[instanceId] = blockId === BlockID.OakLog ? 0 : 0.5;
    mesh.geometry.attributes.aTreeOffset.needsUpdate = true;
    mesh.setMatrixAt(instanceId, matrix);

    mesh.userData.renderGeometry = RenderGeometry.Tree;
    // 树的 uv 范围
    mesh.userData.uvRange = {
        x: [0, 0.5],
        y: [0, 1],
    }

    return [instanceId];
}

function InstanceMeshAddCube(mesh: THREE.InstancedMesh, x: number, y: number, z: number) {
    const instanceId = mesh.count++;
    const matrix = new THREE.Matrix4();
    matrix.setPosition(x + 0.5, y + 0.5, z + 0.5);
    mesh.setMatrixAt(instanceId, matrix);

    mesh.userData.renderGeometry = RenderGeometry.Cube;

    return [instanceId];
}


function InstanceMeshAddCross(mesh: THREE.InstancedMesh, x: number, y: number, z: number) {
    const instanceId1 = mesh.count++;
    const instanceId2 = mesh.count++;

    mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2] = 0;
    mesh.geometry.attributes.aCrossOffset.array[instanceId1 * 2 + 1] = 0.6;

    mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2] = 0;
    mesh.geometry.attributes.aCrossOffset.array[instanceId2 * 2 + 1] = 0.6;
    mesh.geometry.attributes.aCrossOffset.needsUpdate = true;

    const matrix1 = new THREE.Matrix4();
    matrix1.makeRotationY(Math.PI / 4);
    matrix1.setPosition(x + 0.5, y + 0.5, z + 0.5);
    mesh.setMatrixAt(instanceId1, matrix1);

    const matrix2 = new THREE.Matrix4();
    matrix2.makeRotationY(-Math.PI / 4);
    matrix2.setPosition(x + 0.5, y + 0.5, z + 0.5);
    mesh.setMatrixAt(instanceId2, matrix2);

    mesh.userData.renderGeometry = RenderGeometry.Cross;

    return [instanceId1, instanceId2];
}

function InstanceMeshAddFlower(mesh: THREE.InstancedMesh, blockId: BlockID, x: number, y: number, z: number) {
    const instanceId1 = mesh.count++;
    const instanceId2 = mesh.count++;
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
    }
    
    mesh.geometry.attributes.aCrossOffset.needsUpdate = true;

    // 在添加花实例的时候需要有一点偏移
    const xOffset = jitterNumber(0.5, 0.15);
    const zOffset = jitterNumber(0.5, 0.15);
    // 花的实例矩阵需要偏移0.2个单位，因为花的模型是0.6高
    const matrix1 = new THREE.Matrix4();
    matrix1.makeRotationY(Math.PI / 4);
    matrix1.setPosition(x + xOffset, y + 0.5, z + zOffset);
    mesh.setMatrixAt(instanceId1, matrix1);

    const matrix2 = new THREE.Matrix4();
    matrix2.makeRotationY(-Math.PI / 4);
    matrix2.setPosition(x + xOffset, y + 0.5, z + zOffset);
    mesh.setMatrixAt(instanceId2, matrix2);

    mesh.userData.renderGeometry = RenderGeometry.Flower;

    mesh.userData.uvRange = {
        x: [0.3, 0.6],
        y: [0, 0.5],
    }

    return [instanceId1, instanceId2];
}