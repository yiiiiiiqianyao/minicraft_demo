import * as THREE from "three";
import { AudioManager } from "../audio/AudioManager";
import { BlockID, blockIDValues } from "../Block";
import { BlockFactory } from "../Block/base/BlockFactory";
import { DataStore } from "./DataStore";
import { generateChunk } from "./generate";
import { DropGroup } from "./drop/drop";
import { ChunkParams } from "./chunk/literal";
import { initChunkHelper } from "../helper/chunkHelper";
import { DevControl } from "../dev";
import { InstanceMeshAdd } from "./chunk/instance";
import type { IInstanceData, IWorldParams } from "./interface";
import { getBlockClass, inBounds, initChunkMesh } from "./chunk/utils";
export class WorldChunk extends THREE.Group {
  /**@desc chunk 中的 block 数据 */
  private data: IInstanceData[][][] = [];
  params: IWorldParams;
  loaded: boolean;
  dataStore: DataStore;
  dropGroup: DropGroup;
  // for dev test
  helper: THREE.Mesh | null = null;
  helperColor: THREE.Color | null = null;

  constructor(params: IWorldParams, dataStore: DataStore) {
    super();
    this.params = params;
    this.dataStore = dataStore;
    this.dropGroup = new DropGroup(this.position, this);
    this.loaded = false;
    if(DevControl.chunkHelperVisible) {
      this.helperColor = new THREE.Color(Math.random(), Math.random(), Math.random())
      this.helper = initChunkHelper()
      this.helper.visible = true;
    }
  }

  async generate() {
    // const start = performance.now();
    // 初始化 chunk 数据
    const { x, z } = this.position;
    const data: BlockID[][][] = await generateChunk(this.params, x, z);

    // 空闲时间的 callback
    requestIdleCallback(() => {
        // 设置初始化的 chunk 数据
        this.initializeTerrain(data);
        // 从 data store 中加载玩家变更
        this.loadGameChanges(data);
        // 生成 chunk 的 mesh
        this.generateMeshes(data);
        this.loaded = true;
        // console.log(`Loaded chunk in ${performance.now() - start}ms`);
      },
      { timeout: 1000 }
    );
  }

  /**
   * Initializes the terrain data
   */
  private initializeTerrain(data: BlockID[][][]) {
    const { width, height } = ChunkParams;
    this.data = [];
    for (let x = 0; x < width; x++) {
      const slice: IInstanceData[][] = [];
      for (let y = 0; y < height; y++) {
        const row: IInstanceData[] = [];
        for (let z = 0; z < width; z++) {
          row.push({
            blockId: data[x][y][z],
            instanceIds: [],
            blockData: {},
          });
        }
        slice.push(row);
      }
      this.data.push(slice);
    }
  }

  /**
   * Loads player changes from the data store
   */
  private loadGameChanges(data: BlockID[][][]) {
    const { width, height } = ChunkParams;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < width; z++) {
          // Overwrite with value in data store if it exists
          if (
            this.dataStore.contains(this.position.x, this.position.z, x, y, z)
          ) {
            const blockId = this.dataStore.get(
              this.position.x,
              this.position.z,
              x,
              y,
              z
            );
            // 如果数据 store 中的值与当前 chunk 中的值相同，则无需更新
            if(blockId === this.getBlock(x, y, z)?.blockId) return;
            // Tip: 更新/覆盖数据
            this.setBlockId(x, y, z, blockId);
            data[x][y][z] = blockId;
          }
        }
      }
    }
  }

  /**@desc 生成 chunk 中的 block 对应的 mesh */
  private generateMeshes(data: BlockID[][][]) {
    const { width, height } = ChunkParams;
    this.clear();

    // Create lookup table where key is block id
    const meshes: Partial<Record<BlockID, THREE.InstancedMesh>> = {};

    // 生产 InstanceMesh：每个 chunk 中, 每种 block 类型都会生成一个 instanced mesh
    for (const blockId of blockIDValues) {
      const blockEntity = BlockFactory.getBlock(blockId);
      const mesh = initChunkMesh(blockEntity, this.helperColor as THREE.Color);
      mesh.name = blockEntity.constructor.name;
      mesh.count = 0;
      mesh.castShadow = !blockEntity.canPassThrough;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      meshes[blockEntity.id] = mesh;
    }
    // 根据类型为每个 block 类型创建 Mesh
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < width; z++) {
          const block = data[x][y][z];
          const blockClass = BlockFactory.getBlock(block);
          // 空气块不生成 mesh
          if (block === BlockID.Air) continue;
          // 当前 block 对应的 InstanceMesh
          const mesh = meshes[block];
          
          if (!mesh) {
            console.warn(`No mesh found for block ${block}`);
            continue;
          }
          // 过滤掉被遮挡的方块 过滤 chunk 的边界方块（边界的上表面，其上方的方块可以通过 其也不算边界）
          if (block && !this.isBlockObscured(x, y, z) && !this.isBorderBlock(x, y, z)) {
            const ids = InstanceMeshAdd(mesh, blockClass, x, y, z);
            ids && this.setBlockInstanceIds(x, y, z, ids);
          }
        }
      }
    }

    // Add meshes to group
    for (const mesh of Object.values(meshes)) {
      // mesh 在 add 的时候会自动更新矩阵
      mesh && this.add(mesh);
    }
    // 添加掉落物品组
    this.add(this.dropGroup);
    // add chunk helper for dev test
    this.helper && this.add(this.helper);
  }

  /**@desc 设置 chunk 中 (x, y, z) 位置的 block id */
  private setBlockId(x: number, y: number, z: number, blockId: BlockID) {
    if (inBounds(x, y, z)) {
      this.data[x][y][z].blockId = blockId;
      return true;
    }
    return false;
  }

  /**
   * Gets the block data at (x, y, z) for this chunk
   */
  getBlock(x: number, y: number, z: number): IInstanceData | null {
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
    if (this.getBlock(x, y, z)?.blockId === BlockID.Air) {
      this.setBlockId(x, y, z, blockId);
      this.addBlockInstance(x, y, z);
      // 更新全局的数据存储
      this.dataStore.set(this.position.x, this.position.z, x, y, z, blockId);
      return true;
    } else {
      return false;
    }
  }

  /**
   * @desc Removes the block at (x, y, z => chunk coords)
   */
  removeBlock(x: number, y: number, z: number) {
    // console.log(`Removing block at ${x}, ${y}, ${z}`);
    const block = this.getBlock(x, y, z);
    // console.log('chunk', x, y, z, this.getBlock(x, y - 1, z));
    if(!block || block.blockId === BlockID.Air || block.blockId === BlockID.Bedrock) return;
    const blockId = block.blockId;
    AudioManager.playBlockSound(blockId);
    this.deleteBlockInstance(x, y, z, block);
    
    // TODO 暂时简单 canDrop 判断是否可以掉落物品，后续需要精细化处理如 掉落物品的数量和概率
    const blockEntity = BlockFactory.getBlock(blockId);
    if(blockEntity.canDrop) {
      // 触发掉落物品
      this.dropGroup.drop(block.blockId, x, y, z);
    }    

    this.setBlockId(x, y, z, BlockID.Air);
    // 更新数据存储 设置方块为Air
    this.dataStore.set(
      this.position.x,
      this.position.z,
      x,
      y,
      z,
      BlockID.Air
    );
  }

  /**
   * @desc Creates a new instance for the block at (x, y, z)
   */
  addBlockInstance(x: number, y: number, z: number) {
    const block = this.getBlock(x, y, z);
    // TODO 在增加 block instance 的同时 需要更新 block data 的数据
    // If the block is not air and doesn't have an instance id, create a new instance
    if (
      block &&
      block.blockId !== BlockID.Air &&
      block.instanceIds.length === 0
    ) {
      const blockClass = BlockFactory.getBlock(block.blockId);
      const mesh = this.children.find(
        (instanceMesh) => instanceMesh.name === blockClass.constructor.name
      ) as THREE.InstancedMesh;
      if (mesh) {
        // 放置方块的时候播放对应的音效
        AudioManager.playBlockSound(block.blockId);
        const ids = InstanceMeshAdd(mesh, blockClass, x, y, z);
        if(ids) {
          this.setBlockInstanceIds(x, y, z, ids);
          mesh.instanceMatrix.needsUpdate = true;
          // 重新计算实例化网格的边界，确保相机正常渲染 or 射线碰撞检测正常工作
          mesh.computeBoundingSphere();
        } else {
          console.warn(`Failed to add instance for block ${block.blockId}`);
        }
      }
    }
  }

  /**
   * Removes the mesh instance associated with `block` by swapping it with the last instance and decrementing instance count
   */
  deleteBlockInstance(x: number, y: number, z: number, deleteBlock?: IInstanceData) {
    const block = deleteBlock ? deleteBlock : this.getBlock(x, y, z);
    if (block?.blockId === BlockID.Air || !block?.instanceIds.length) return;

    // Get the mesh of the block
    const mesh = this.children.find(
      (instanceMesh) =>
        instanceMesh.name ===
        BlockFactory.getBlock(block.blockId).constructor.name
    ) as THREE.InstancedMesh;

    /** 使用覆盖式删除 不保留 instance 的顺序：用最后一个实例覆盖要删除的实例
     *  desc img: https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/desc/delete_block.jpeg
     * instanceMesh 保留了所有 instance id 的列表，一个普通的 block 可能包含一个 or 多个 instance id
     * 覆盖式删除就是交换对应要删除的 instance id 和 instanceMesh instance id 列表的最后一个的位置，然后
     * 通过 mesh.count-- 来删除 instance id 列表后序的实例
     */
    // We can't remove instances directly, so we need to swap each with the last instance and decrement count by 1
    const lastBlockInstanceIds: number[] = [];
    const lastBlockCoords = new THREE.Vector3();
    block.instanceIds.forEach((instanceId) => {
      // 获取 instanceMesh 中最后一个 instance id 的矩阵
      const lastMatrix = new THREE.Matrix4();
      mesh.getMatrixAt(mesh.count - 1, lastMatrix);

      // Also need to get block coords of instance to update instance id of the block
      // const lastBlockCoords = new THREE.Vector3();
      // 获取instanceMesh 中最后一个 instance 的 block 位置
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
     * 在使用覆盖删除之后，更新原本 mesh 最后一个 instance 对应 block 的 instanceIds
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
      if(this.data[x][y][z].blockId === BlockID.TallGrass && instanceIds.length === 1) {
        // console.log('setBlockInstanceIds:', x, y, z,instanceIds);
      }
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
    const up = this.getBlock(x, y + 1, z);
    const down = this.getBlock(x, y - 1, z);
    const left = this.getBlock(x - 1, y, z);
    const right = this.getBlock(x + 1, y, z);
    const front = this.getBlock(x, y, z + 1);
    const back = this.getBlock(x, y, z - 1);

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
    const up = this.getBlock(x, y + 1, z);
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