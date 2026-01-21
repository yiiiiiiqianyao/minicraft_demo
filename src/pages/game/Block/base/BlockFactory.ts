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

// Flyweight pattern to avoid creating new block instances
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
  };

  private static blockInstances: { [id: number]: Block } = {};

  static getBlock(id: BlockID): Block {
    if (!this.blockInstances[id]) {
      const BlockType = this.blockTypes[id];
      if (BlockType) {
        this.blockInstances[id] = new BlockType();
      } else {
        throw new Error(`No block type registered for ID ${id}`);
      }
    }
    return this.blockInstances[id];
  }

  static getAllBlocks(): Block[] {
    return Object.keys(this.blockTypes).map((id) => this.getBlock(+id));
  }
}
