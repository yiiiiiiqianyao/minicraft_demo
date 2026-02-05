import { AirBlock } from "../blocks/AirBlock";
import { BedrockBlock } from "../blocks/BedrockBlock";
import { Block } from "./Block";
import { CoalOreBlock } from "../blocks/CoalOreBlock";
import { DirtBlock } from "../blocks/DirtBlock";
import { FlowerDandelionBlock } from "../blocks/FlowerDandelionBlock";
import { FlowerRoseBlock } from "../blocks/FlowerRoseBlock";
import { GrassBlock } from "../blocks/GrassBlock";
import { IronOreBlock } from "../blocks/IronOreBlock";
import { LeavesBlock } from "../blocks/LeavesBlock";
import { OakLogBlock } from "../blocks/OakLogBlock";
import { RedstoneLampBlock } from "../blocks/RedstoneLampBlock";
import { StoneBlock } from "../blocks/StoneBlock";
import { StoneBrickBlock } from "../blocks/StoneBrickBlock";
import { TallGrassBlock } from "../blocks/TallGrassBlock";

import { BlockID } from "..";
import { CraftBlock } from "../objects/CraftingBlock";

/** @desc 方块工厂类，用于创建方块实例 Flyweight pattern to avoid creating new block instances */
export class BlockFactory {
  private static blockTypes: { [id: number]: any } = {
    [BlockID.Air]: AirBlock,
    [BlockID.Grass]: GrassBlock,
    [BlockID.Stone]: StoneBlock,
    [BlockID.Dirt]: DirtBlock,
    [BlockID.Bedrock]: BedrockBlock,
    [BlockID.CoalOre]: CoalOreBlock,
    [BlockID.IronOre]: IronOreBlock,
    [BlockID.OakLog]: OakLogBlock,
    [BlockID.Leaves]: LeavesBlock,
    [BlockID.TallGrass]: TallGrassBlock,
    [BlockID.FlowerRose]: FlowerRoseBlock,
    [BlockID.FlowerDandelion]: FlowerDandelionBlock,
    [BlockID.RedstoneLamp]: RedstoneLampBlock,
    [BlockID.StoneBrick]: StoneBrickBlock,
    [BlockID.CraftingTable]: CraftBlock,
  };

  private static blockInstances: { [id: number]: Block } = {};

  static getBlock(id: BlockID): Block {
    if (!this.blockInstances[id]) {
      const BlockType = this.blockTypes[id];
      if (BlockType) {
        this.blockInstances[id] = new BlockType();
      } else {
        // throw new Error(`No block type registered for ID ${id}`);
        this.blockInstances[id] = new AirBlock();
        console.warn(`No block type registered for ID ${id}, using AirBlock instead`);
      }
    }
    return this.blockInstances[id];
  }

  /**@desc 获取方块的 UI 贴图 */
  static getBlockUIImg(id: BlockID) {
    const blockClass = BlockFactory.getBlock(id);
    return blockClass.uiTexture;
  }

  static getAllBlocks(): Block[] {
    return Object.keys(this.blockTypes).map((id) => this.getBlock(+id));
  }
}
