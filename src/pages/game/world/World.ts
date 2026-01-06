import * as THREE from "three";
import { BlockID } from "../Block";
import { BlockFactory } from "../Block/BlockFactory";
import { LightSourceBlock } from "../Block/LightSourceBlock";
import { DataStore } from "./DataStore";
import { Player } from "../player/Player";
import { WorldChunk } from "./WorldChunk";
import { IWorldParams, IWorldSize } from "./interface";
import { DefaultWorldParams } from "./literal";
import { PlayerInitPosition } from "../player/literal";
import { swapMenuScreenGUI, updateProgressGUI } from "../gui";
import { RNG } from "../RNG";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
// import { DropManager } from "./drop";

export class World extends THREE.Group {
  static rng: RNG;
  static simplex: SimplexNoise;
  scene: THREE.Scene;
  seed: number;
  renderDistance = 8;
  asyncLoading = true;
  chunkSize: IWorldSize = {
    width: 16,
    height: 32,
  };
  chunkQueue: { x: number; z: number }[];
  // minChunkLoadTimeout = 200;
  // lastChunkLoadTime = 0;

  params: IWorldParams = DefaultWorldParams;

  // Used for persisting changes to the world
  dataStore = new DataStore();
  pointLights = new Map<string, THREE.PointLight>();

  wireframeMode = false;
  // dropManager = new DropManager();
  private initialLoadComplete = false;

  constructor(seed = 0, scene: THREE.Scene) {
    super();
    this.seed = seed;
    World.rng = new RNG(seed);
    World.simplex = new SimplexNoise(World.rng);
    this.scene = scene;
    this.chunkQueue = [];
    
    setTimeout(() => {
      // this.dropManager.drop(BlockID.Dirt, new THREE.Vector3(32, 72, 32));  
    }, 5000);
  }

  /**
   * Clears existing world data and re-generates everything
   */
  regenerate(player: Player) {
    this.children.forEach((chunk) => {
      if (chunk instanceof WorldChunk) {
        chunk.disposeChildren();
      }
    });
    this.clear();
    this.update(player);
  }

  getBlockKey(x: number, y: number, z: number) {
    return `${x},${y},${z}`;
  }

  getChunkKey(x: number, z: number) {
    return `${x},${z}`;
  }

  /**
   * Updates the visible portions of the world based on the current player position
   */
  update(player: Player) {
    const visibleChunks = this.getVisibleChunks(player);
    const chunksToAdd = this.getChunksToAdd(visibleChunks);
    this.removeUnusedChunks(visibleChunks);

    // 有需要添加的 chunk 时，加入 chunk queue
    if (chunksToAdd.length > 0) {
      // console.log("Chunks to add", chunksToAdd);
      this.chunkQueue = [...chunksToAdd, ...this.chunkQueue];

      // trim duplicates from chunkQueue
      const chunkQueueSet = new Set();
      this.chunkQueue = this.chunkQueue.filter((chunk) => {
        const key = this.getChunkKey(chunk.x, chunk.z);
        if (chunkQueueSet.has(key)) {
          return false;
        } else {
          chunkQueueSet.add(key);
          return true;
        }
      });
    }

    // process top from chunk queue
    if (this.chunkQueue.length) {
      const chunk = this.chunkQueue.shift();
      if (chunk) {
        // console.log("Generating chunk", chunk.x, chunk.z);
        this.generateChunk(chunk.x, chunk.z);
        // this.lastChunkLoadTime = performance.now();
      }
    } else {
      // 当 chunk queue 为空时，如果是初始化的场景 则进行初始化操作
      if (!this.initialLoadComplete) {
        this.initialLoadComplete = true;
        swapMenuScreenGUI();

        const startingPlayerPosition = new THREE.Vector3().copy(PlayerInitPosition);
        const startX = PlayerInitPosition.x;
        const startZ = PlayerInitPosition.z;
        const currentChunkHeight = this.chunkSize.height;
        for (let y = currentChunkHeight; y > 0; y--) {
          // TODO: 角色初始位置 y 轴坐标需要根据当前 chunk 高度进行调整
          if (this.getBlock( startX, y,startZ)?.block === BlockID.Grass) {
            startingPlayerPosition.y = y;
            break;
          }
        }
        // 角色从离地面 10 个单位的位置开始
        player.position.set(startX,startingPlayerPosition.y + 10,startZ);
        // 角色 PointerLockControls 控制器解锁
        player.controls.lock();
      }
    }

    // 在初始加载未完成前更新加载进度条
    if (!this.initialLoadComplete) {
      const totalChunks = (this.renderDistance * 2 + 1) ** 2;
      const loadedChunks = this.children.length;
      const percentLoaded = Math.round((loadedChunks / totalChunks) * 100);
      updateProgressGUI(percentLoaded);
    }
  }

  /**
   * 获取角色当前位置下方的方块
   * @param position 
   * @param playerHeight 
   * @returns 
   */
  getBlockUnderneath(position: THREE.Vector3, playerHeight: number) {
    return this.getBlock(
      Math.floor(position.x),
      Math.floor(position.y - playerHeight / 2 - 1),
      Math.floor(position.z)
    );
  }

  /**
   * Returns an array containing the coordinates of the chunks
   * that are currently visible to the player, starting from the center
   */
  getVisibleChunks(player: Player): { x: number; z: number }[] {
    // get coordinates of the chunk the player is currently on
    const coords = this.worldToChunkCoords(
      player.position.x,
      player.position.y,
      player.position.z
    );

    const visibleChunks: { x: number; z: number }[] = [];
    const range = Array.from(
      { length: this.renderDistance * 2 + 1 },
      (_, i) => i - this.renderDistance
    );
    range.sort((a, b) => Math.abs(a) - Math.abs(b));

    for (const dx of range) {
      for (const dz of range) {
        visibleChunks.push({ x: coords.chunk.x + dx, z: coords.chunk.z + dz });
      }
    }

    // sort chunks by distance from player
    visibleChunks.sort((a, b) => {
      const distA = Math.sqrt(
        (a.x - coords.chunk.x) ** 2 + (a.z - coords.chunk.z) ** 2
      );
      const distB = Math.sqrt(
        (b.x - coords.chunk.x) ** 2 + (b.z - coords.chunk.z) ** 2
      );

      return distA - distB;
    });

    return visibleChunks;
  }

  /**
   * Returns an array containing the coordinates of the chunks that
   * are not yet loaded and need to be added to the scene
   */
  getChunksToAdd(
    visibleChunks: { x: number; z: number }[]
  ): { x: number; z: number }[] {
    return visibleChunks.filter((chunk) => {
      const chunkExists = this.children
        .map((obj) => obj.userData)
        .find(({ x, z }) => {
          return chunk.x === x && chunk.z == z;
        });

      return !chunkExists;
    });
  }

  /**
   * Removes current loaded chunks that are no longer visible
   */
  removeUnusedChunks(visibleChunks: { x: number; z: number }[]) {
    const chunksToRemove = this.children.filter((obj) => {
      const { x, z } = obj.userData;
      const chunkExists = visibleChunks.find((visibleChunk) => {
        return visibleChunk.x === x && visibleChunk.z === z;
      });

      return !chunkExists;
    });

    chunksToRemove.forEach((chunk) => {
      if (chunk instanceof WorldChunk) {
        chunk.disposeChildren();
      }

      this.remove(chunk);
      // console.log(
      //   `Removed chunk at X: ${chunk.userData.x} Z: ${chunk.userData.z}`
      // );
    });
  }

  /**
   * Generates the chunk at (x, z) coordinates
   */
  async generateChunk(x: number, z: number) {
    const chunk = new WorldChunk(
      this.chunkSize,
      this.params,
      this.dataStore,
      this.wireframeMode
    );
    chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
    chunk.userData = { x, z };

    chunk.generate();

    this.add(chunk);
  }

  /**
   * Adds a new block at (x, y, z)
   */
  addBlock(x: number, y: number, z: number, block: BlockID) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk && chunk.loaded) {
      chunk.addBlock(coords.block.x, coords.block.y, coords.block.z, block);

      // if adding a light, convert to point light
      if (block === BlockID.RedstoneLamp) {
        const blockClass = BlockFactory.getBlock(block) as LightSourceBlock;
        const light = new THREE.PointLight(
          blockClass.color,
          blockClass.intensity,
          blockClass.distance,
          blockClass.decay
        );
        light.position.set(x + 0.5, y + 0.5, z + 0.5);
        light.castShadow = true;
        this.pointLights.set(this.getBlockKey(x, y, z), light);
        this.scene.add(light);
      }

      // Hide any blocks that may be totally obscured
      this.hideBlockIfNeeded(x - 1, y, z);
      this.hideBlockIfNeeded(x + 1, y, z);
      this.hideBlockIfNeeded(x, y - 1, z);
      this.hideBlockIfNeeded(x, y + 1, z);
      this.hideBlockIfNeeded(x, y, z - 1);
      this.hideBlockIfNeeded(x, y, z + 1);
    }
  }

  // TODO 破坏 & 移除方块
  removeBlock(x: number, y: number, z: number) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);
    const blockToRemove = this.getBlock(x, y, z);

    // 不能破坏 基岩 bedrock
    if (blockToRemove?.block === BlockID.Bedrock) return;

    if (chunk && chunk.loaded) {
      // console.log(`Removing block at ${x}, ${y}, ${z} for chunk ${chunk.uuid}`);

      chunk.removeBlock(coords.block.x, coords.block.y, coords.block.z);
      if (this.pointLights.has(this.getBlockKey(x, y, z))) {
        const light = this.pointLights.get(this.getBlockKey(x, y, z));
        if (light) {
          this.scene.remove(light);
          this.pointLights.delete(this.getBlockKey(x, y, z));
        }
      }

      // Reveal any adjacent blocks that may have been exposed after the block at (x,y,z) was removed
      this.revealBlock(x - 1, y, z);
      this.revealBlock(x + 1, y, z);
      this.revealBlock(x, y - 1, z);
      this.revealBlock(x, y + 1, z);
      this.revealBlock(x, y, z - 1);
      this.revealBlock(x, y, z + 1);

      // if above block is passthrough, remove it as well
      // 检查被破坏的方块上方的方块是否需要同时移除 目前只有 草和花方块需要移除 canPassThrough 为 true
      const aboveBlock = this.getBlock(x, y + 1, z);
      if (
        aboveBlock &&
        // TODO 需要调整策略，而不是简单通过 canPassThrough 是否为可通过方块来判断
        BlockFactory.getBlock(aboveBlock.block).canPassThrough &&
        aboveBlock.block !== BlockID.Air
      ) {
        this.removeBlock(x, y + 1, z);
      }
    }
  }

  /**
   * Gets the block data at (x, y, z)
   */
  getBlock(x: number, y: number, z: number) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk && chunk.loaded) {
      return chunk.getBlock(coords.block.x, y, coords.block.z);
    }
  }

  /**
   * Returns the chunk and world coordinates of the block at (x, y, z)
   *  - `chunk` is the coordinates of the chunk containing the block
   *  - `block` is the world coordinates of the block
   */
  worldToChunkCoords(
    x: number,
    y: number,
    z: number
  ): {
    chunk: { x: number; z: number };
    block: { x: number; y: number; z: number };
  } {
    const chunkX = Math.floor(x / this.chunkSize.width);
    const chunkZ = Math.floor(z / this.chunkSize.width);

    const blockX = x - chunkX * this.chunkSize.width;
    const blockZ = z - chunkZ * this.chunkSize.width;

    return {
      chunk: { x: chunkX, z: chunkZ },
      block: { x: blockX, y, z: blockZ },
    };
  }

  /**
   * Returns the WorldChunk object that contains the specified coordinates
   */
  getChunk(x: number, z: number): WorldChunk | undefined {
    return this.children.find((obj) => {
      return obj.userData.x === x && obj.userData.z === z;
    }) as WorldChunk | undefined;
  }

  /**
   * Reveals block at (x, y, z) by adding new mesh instance
   */
  revealBlock(x: number, y: number, z: number) {
    // console.log(`Revealing block at ${x}, ${y}, ${z}`);
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (chunk && chunk.loaded) {
      chunk.addBlockInstance(coords.block.x, coords.block.y, coords.block.z);
    }
  }

  /**
   * Hides block at (x, y, z) by removing mesh instance
   */
  hideBlockIfNeeded(x: number, y: number, z: number) {
    const coords = this.worldToChunkCoords(x, y, z);
    const chunk = this.getChunk(coords.chunk.x, coords.chunk.z);

    if (
      chunk &&
      chunk.loaded &&
      chunk.isBlockObscured(coords.block.x, coords.block.y, coords.block.z)
    ) {
      // console.log(`Hiding block at ${x}, ${y}, ${z}`);
      chunk.deleteBlockInstance(coords.block.x, coords.block.y, coords.block.z);
    }
  }
}
