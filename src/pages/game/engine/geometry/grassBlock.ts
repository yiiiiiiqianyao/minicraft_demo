import * as THREE from "three";

/**@desc 初始化草方块的几何体，用于实例化渲染 顶面、侧面、底面 uv 取不同值 */
export function initGrassBlockGeometry(size = 1) {
    const geometry = new THREE.BoxGeometry(size, size, size)
    const uvAttribute = geometry.getAttribute('uv') as THREE.BufferAttribute

    const setFaceSlice = (faceIndex: number, sliceStart: number) => {
        const sliceWidth = 1 / 3

        for (let i = 0; i < 4; i += 1) {
        const vertexIndex = faceIndex * 4 + i
        const u = uvAttribute.getX(vertexIndex)
        const v = uvAttribute.getY(vertexIndex)

        const mappedU = sliceStart + u * sliceWidth
        const mappedV = v // 保持 V 不变，确保草带等垂直细节不会上下颠倒

        uvAttribute.setXY(vertexIndex, mappedU, mappedV)
        }
    }

    // 顶面 (+Y, faceIndex: 2) 使用左侧 1/3
    setFaceSlice(2, 0.0)

    // 四个侧面 (+X/-X/+Z/-Z) 使用中间 1/3
    ;[0, 1, 4, 5].forEach((faceIndex) => {
        setFaceSlice(faceIndex, 1 / 3)
    })

    // 底面 (-Y, faceIndex: 3) 使用右侧 1/3
    setFaceSlice(3, 2 / 3)

    uvAttribute.needsUpdate = true;
    return geometry;
}