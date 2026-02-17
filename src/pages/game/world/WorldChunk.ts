import * as THREE from "three";
import { AudioManager } from "../audio/AudioManager";
import { BlockID } from "../Block";
import { BlockFactory } from "../Block/base/BlockFactory";
import { DataStore } from "./DataStore";
import { generateChunk } from "./generate";
import { DropGroup } from "./drop/drop";
import { ChunkParams } from "./chunk/literal";
import { initChunkHelper } from "../helper/chunkHelper";
import { DevControl } from "../dev";
import { InstanceMeshAdd } from "./chunk/instance";
import type { IInstanceData } from "./interface";
import { getBlockClass, inBounds, initChunkMesh } from "./chunk/utils";

/** @desc chunk 区块对象 */
export class WorldChunk extends THREE.Group {
  /**@desc chunk 中的 block 数据 */
  private data: IInstanceData[][][] = [];
  private meshes: Partial<Record<BlockID, THREE.InstancedMesh>> = {};
  private dataStore: DataStore;
  loaded: boolean;
  
  dropGroup: DropGroup | null = null;
  // for dev test
  helper: THREE.Mesh | null = null;
  helperColor: THREE.Color | null = null;
  
  constructor(dataStore: DataStore) {
    super();
    this.dataStore = dataStore;
    this.loaded = false;
    if(DevControl.chunkHelperVisible) {
      this.helperColor = new THREE.Color(Math.random(), Math.random(), Math.random())
      this.helper = initChunkHelper()
      this.helper.visible = true;
    }
  }

  /**@desc 生成 chunk: 数据 + mesh */
  async generate() {
    // const start = performance.now();
    // 初始化 chunk 数据
    const { x, z } = this.position;
    // TODO 把生成 chunk 数据的任务放到 web worker 中
    const data: IInstanceData[][][] = await generateChunk(x, z, this.dataStore);
    // console.log(`Loaded chunk in ${performance.now() - start}ms`);
    // 空闲时间的 callback
    requestIdleCallback(() => {
        // 设置初始化的 chunk 数据（不包含 mesh 内容）
        this.initializeTerrain(data);
        // 生成 chunk 的 mesh
        this.generateMeshes(data);
        this.loaded = true;
        this.dataStore.setChunkLoaded(x, z, true);
      },
      { timeout: 1000 }
    );
  }

  /**@desc 初始化 chunk 中的掉落物品组 */
  initDropGroup() {
    if (this.dropGroup === null) {
      this.dropGroup = new DropGroup(this.position, this);
      this.add(this.dropGroup);
    }
  }

  getInteractiveMeshes() {
    return Object.values(this.meshes).filter(mesh => Boolean(mesh.userData.interactive));
  }

  // /**@desc 设置 chunk 中的 block 是否渲染阴影 */
  // setShadowRender(enable: boolean) {
  //   Object.values(this.meshes).forEach(mesh => {
  //     if (!enable) {
  //       mesh.castShadow = false;
  //       mesh.receiveShadow = false;
  //     } else {
  //       mesh.castShadow = mesh.userData.castShadow;
  //       mesh.receiveShadow = true;
  //     }
  //   })
  // }

  /**
   * @desc Initializes the terrain data 为每个 chunk 存储一个单独的数据集
   */
  private initializeTerrain(data: IInstanceData[][][]) {
    const { width, height } = ChunkParams;
    this.data = [];
    for (let x = 0; x < width; x++) {
      const slice: IInstanceData[][] = [];
      for (let y = 0; y < height; y++) {
        const row: IInstanceData[] = [];
        for (let z = 0; z < width; z++) {
          row.push({
            blockId: data[x][y][z].blockId,
            // Tip: mesh 会重新生成 所以 instanceIds 会为空
            instanceIds: [],
            blockData: data[x][y][z].blockData,
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  /**@desc 生成 chunk 中的 block 对应的 mesh */
  private generateMeshes(data: IInstanceData[][][]) {
    const { width, height } = ChunkParams;
    // this.clear();
    // 根据类型为每个 block 类型创建 Mesh
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < width; z++) {
          const blockData = data[x][y][z];
          const blockClass = BlockFactory.getBlock(blockData.blockId);
          
          // 空气块不生成 mesh
          if (blockData.blockId === BlockID.Air) continue;
          // 过滤掉被遮挡的方块 过滤 chunk 的边界方块（边界的上表面，其上方的方块可以通过 其也不算边界）
          if (blockData && !this.isBlockObscured(x, y, z) && !this.isBorderBlock(x, y, z)) {
            // 当前 block 对应的 InstanceMesh
            const mesh = this.initInstanceMesh(blockData.blockId);
            const ids = InstanceMeshAdd(mesh, blockClass, x, y, z);
            ids && this.setBlockInstanceIds(x, y, z, ids);
          }
        }
      }
    }
    // 添加掉落物品组
    // this.add(this.dropGroup);
    // add chunk helper for dev test
    this.helper && this.add(this.helper);
  }

  private initInstanceMesh(blockId: BlockID) {
    if (this.meshes[blockId]) return this.meshes[blockId];
    const blockClass = BlockFactory.getBlock(blockId);
    const mesh = initChunkMesh(blockClass, this.helperColor as THREE.Color);
    mesh.name = blockClass.constructor.name;
    mesh.count = 0;
    mesh.castShadow = !blockClass.canPassThrough;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.userData.blockId = blockId;
    mesh.userData.castShadow = !blockClass.canPassThrough;
    mesh.userData.interactive = blockClass.interactive;
    this.add(mesh);
    this.meshes[blockId] = mesh;
    return mesh;
  }

  /**@desc 设置 chunk 中 (x, y, z) 位置的 block id */
  private setBlockData(x: number, y: number, z: number, blockData: IInstanceData) {
    if (inBounds(x, y, z)) {
      this.data[x][y][z] = blockData;
      return true;
    }
    return false;
  }

  /**
   * Gets the block data at (x, y, z) for this chunk
   */
  getBlockData(x: number, y: number, z: number): IInstanceData | null {
    if (inBounds(x, y, z)) {
      if(this.data[x] !== undefined && this.data[x][y] !== undefined && this.data[x][y][z] !== undefined) {
        return this.data[x][y][z];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   *@desc Adds a new block at (x, y, z) for this chunk 返回是否添加成功
   */
  addBlock(x: number, y: number, z: number, blockId: BlockID) {
    // Safety check that we aren't adding a block for one that already exists
    const cacheBlockData = this.getBlockData(x, y, z);
    if (cacheBlockData?.blockId === BlockID.Air) {
      const addBlockClass = BlockFactory.getBlock(blockId);
      this.setBlockData(x, y, z, {
        blockId,
        instanceIds: [],
        blockData: {
          breakCount: addBlockClass.breakCount,
        },
      });
      const addBlockData = this.addBlockInstance(x, y, z);
      if (addBlockData) {
        // 添加 block 成功 更新全局的数据存储
        this.dataStore.set(
          this.position.x, 
          this.position.z, 
          x, y, z, 
          addBlockData);
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * @desc Removes the block at (x, y, z => chunk coords)
   */
  removeBlock(x: number, y: number, z: number, emitDrop = true) {
    // console.log(`Removing block at ${x}, ${y}, ${z}`);
    const block = this.getBlockData(x, y, z);
    // console.log('chunk', x, y, z, this.getBlock(x, y - 1, z));
    if(!block || block.blockId === BlockID.Air || block.blockId === BlockID.Bedrock) return;
    const blockId = block.blockId;
    AudioManager.playBlockSound(blockId);
    this.deleteBlockInstance(x, y, z, block);
    
    // TODO 暂时简单 canDrop 判断是否可以掉落物品，后续需要精细化处理如 掉落物品的数量和概率
    const removeBlockClass = BlockFactory.getBlock(blockId);
    if(emitDrop && removeBlockClass.canDrop && removeBlockClass.dropBlockId) {
      if (!this.dropGroup) this.initDropGroup();
      // 触发掉落物品
      this.dropGroup!.drop(removeBlockClass.dropBlockId, x, y, z, true);
    }    

    this.setBlockData(x, y, z, {
      blockId: BlockID.Air,
      instanceIds: [],
      blockData: {},
    });
    // 更新数据存储 设置方块为Air
    this.dataStore.set(
      this.position.x,
      this.position.z,
      x,
      y,
      z,
      {
      blockId: BlockID.Air,
      instanceIds: [],
      blockData: {},
    }
    );
  }

  /**
   * @desc Creates a new instance for the block at (x, y, z)
   */
  addBlockInstance(x: number, y: number, z: number) {
    const blockData = this.getBlockData(x, y, z);
    // TODO 在增加 block instance 的同时 需要更新 block data 的数据
    // If the block is not air and doesn't have an instance id, create a new instance
    if (
      blockData &&
      blockData.blockId !== BlockID.Air &&
      blockData.instanceIds.length === 0
    ) {
      const blockId = blockData.blockId;
      if (!this.meshes[blockId]) this.initInstanceMesh(blockId);
      const mesh = this.meshes[blockId];
      const blockClass = BlockFactory.getBlock(blockId);
      if (mesh) {
        // 放置方块的时候播放对应的音效
        AudioManager.playBlockSound(blockId);
        const ids = InstanceMeshAdd(mesh, blockClass, x, y, z);
        if(ids) {
          this.setBlockInstanceIds(x, y, z, ids);
          mesh.instanceMatrix.needsUpdate = true;
          // 重新计算实例化网格的边界，确保相机正常渲染 or 射线碰撞检测正常工作
          mesh.computeBoundingSphere();
          return blockData;
        } else {
          console.warn(`Failed to add instance for block ${blockId}`);
        }
      }
    }
  }

  /**
   * @desc 覆盖式删除
   * Removes the mesh instance associated with `block` by swapping it with the last instance and decrementing instance count
   */
  deleteBlockInstance(x: number, y: number, z: number, deleteBlockData?: IInstanceData) {
    const blockData = deleteBlockData ? deleteBlockData : this.getBlockData(x, y, z);
    if (blockData?.blockId === BlockID.Air || !blockData?.instanceIds.length) return;

    const blockId = blockData.blockId;
    const mesh = this.meshes[blockId] as THREE.InstancedMesh;

    /** 使用覆盖式删除 不保留 instance 的顺序：用最后一个实例覆盖要删除的实例
       *  desc img: https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/desc/delete_block.jpeg
       * instanceMesh 保留了所有 instance id 的列表，一个普通的 block 可能包含一个 or 多个 instance id
       * 覆盖式删除就是交换对应要删除的 instance id 和 instanceMesh instance id 列表的最后一个的位置，然后
       * 通过 mesh.count-- 来删除 instance id 列表后序的实例
       */
      // We can't remove instances directly, so we need to swap each with the last instance and decrement count by 1
      const lastBlockInstanceIds: number[] = [];
      const lastBlockCoords = new THREE.Vector3();
      // 一个 block 可能由多个 instance 组成 如 flower 就是由两个 instance plane 组成的
      blockData.instanceIds.forEach((instanceId) => {
        // 获取 instanceMesh 中最后一个 instance id 的矩阵
        const lastMatrix = new THREE.Matrix4();
        mesh.getMatrixAt(mesh.count - 1, lastMatrix);

        // Also need to get block coords of instance to update instance id of the block
        // const lastBlockCoords = new THREE.Vector3();
        // 获取 instanceMesh 中最后一个 instance 的 block 位置
        lastBlockCoords.setFromMatrixPosition(lastMatrix);
        // this.setBlockInstanceIds(
        //   Math.floor(lastBlockCoords.x),
        //   Math.floor(lastBlockCoords.y),
        //   Math.floor(lastBlockCoords.z),
        //   [instanceId]
        // );
        // 最后一个 instance 实例
        lastBlockInstanceIds.push(instanceId);

        // Swap transformation matrices
        // 用 mesh 中最后一个 instance 的矩阵替换当前 instance 的矩阵，
        // 用当前 instance 渲染原本 mesh 列表中最后一个的 instance 对应的 block
        mesh.setMatrixAt(instanceId, lastMatrix);

        // Decrement instance count
        mesh.count--;

        // Notify the instanced mesh we updated the instance matrix
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
      });
      /**
       * 在使用覆盖删除之后，更新原本 mesh 最后一个 instance 对应 block data 中的 instanceIds 数据（删除）
       */
      this.setBlockInstanceIds(
          Math.floor(lastBlockCoords.x),
          Math.floor(lastBlockCoords.y),
          Math.floor(lastBlockCoords.z),
          lastBlockInstanceIds,
        );

      this.setBlockInstanceIds(x, y, z, []);
   
  }

  /**
   * Sets the block instance data at (x, y, z) for this chunk
   */
  setBlockInstanceIds(x: number, y: number, z: number, instanceIds: number[]) {
    if (inBounds(x, y, z)) {
      this.data[x][y][z].instanceIds = instanceIds;
    }
  }

  /**
   * 判断一个方块是否被其他方块遮挡
   * @param x 
   * @param y 
   * @param z 
   * @returns 是否被其他方块遮挡
   */
  isBlockObscured(x: number, y: number, z: number): boolean {
    const up = this.getBlockData(x, y + 1, z);
    const down = this.getBlockData(x, y - 1, z);
    const left = this.getBlockData(x - 1, y, z);
    const right = this.getBlockData(x + 1, y, z);
    const front = this.getBlockData(x, y, z + 1);
    const back = this.getBlockData(x, y, z - 1);

    // If any of the block's sides are exposed, it's not obscured
    if (
      !up ||
      !down ||
      !left ||
      !right ||
      !front ||
      !back ||
      getBlockClass(up.blockId).transparent ||
      getBlockClass(down.blockId).transparent ||
      getBlockClass(left.blockId).transparent ||
      getBlockClass(right.blockId).transparent ||
      getBlockClass(front.blockId).transparent ||
      getBlockClass(back.blockId).transparent
    ) {
      return false;
    }

    return true;
  }

  /**
   * 判断一个方块是否在 chunk 的边界上
   * 边界的表面，其上方的方块可以通过 其也不算边界
   * @param x 
   * @param y 
   * @param z 
   * @returns 
   */
  private isBorderBlock(x: number, y: number, z: number): boolean {
    const { width, height } = ChunkParams;
    // TODO 看上去是一个优化判断 暂时待理解
    const up = this.getBlockData(x, y + 1, z);
    const upBlockClass = up ? BlockFactory.getBlock(up.blockId) : null;
    // Need when regenerate chunk 如果上方的方块不是空气，那么它不是边界
    if (up?.blockId !== BlockID.Air) {
      return false;
    }
    if (upBlockClass?.canPassThrough) {
      return false;
    }
    
    return (
      x === 0 ||
      x === width - 1 ||
      y === 0 ||
      y === height - 1 ||
      z === 0 ||
      z === width - 1
    );
  }

  disposeChildren() {
    this.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    });
    this.clear();
  }
}