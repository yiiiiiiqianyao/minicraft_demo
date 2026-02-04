import * as THREE from 'three';

import { loadTexture } from "../engine/utils";
// import GrassSide from '../../../assets/textures/blocks/grass_side.png';
// import GrassTop from '../../../assets/textures/blocks/grass.png';
import GrassBlock from '../../../assets/textures/blocks/grass_block.png';
import Dirt from '../../../assets/textures/blocks/dirt.png';
import Stone from '../../../assets/textures/blocks/stone.png';
import CoalOre from '../../../assets/textures/blocks/coal_ore.png';
import IronOre from '../../../assets/textures/blocks/iron_ore.png';
import BedRock from '../../../assets/textures/blocks/bedrock.png';
// import OakLogSide from '../../../assets/textures/blocks/oak_log_side.png';
// import OakLogTop from '../../../assets/textures/blocks/oak_log_top.png';
import Oka from '../../../assets/textures/blocks/oka.png';
import Leaves from '../../../assets/textures/blocks/leaves.png';
import TallGrass from '../../../assets/textures/plants/tall_grass.png';
import FlowerRose from '../../../assets/textures/flowers/flower_rose.png';
import FlowerDandelion from '../../../assets/textures/flowers/flower_dandelion.png';

import RedStoneLamp from '../../../assets/textures/blocks/redstone_lamp.png';
import StoneBrick from '../../../assets/textures/blocks/stonebrick.png';

/**@desc 工作台方块 正面纹理 */
import CraftingTableFront from '../../../assets/textures/crafting_table/crafting_table_front.png';
import CraftingTableSide from '../../../assets/textures/crafting_table/crafting_table_side.png';
import CraftingTableTop from '../../../assets/textures/crafting_table/crafting_table_top.png';

/**@desc atlas 合图 */
import Combine from '../../../assets/textures/combine.png';
/**@desc 挖掘进度效果  Crack  Crack  Crack */
import Break from '../../../assets/textures/blocks/block_crack.png';

/**@desc for block texture */
export const textures = {
  // grassSide: loadTexture(GrassSide),
  // grassTop: loadTexture(GrassTop),
  grassBlock: loadTexture(GrassBlock),
  dirt: loadTexture(Dirt),
  stone: loadTexture(Stone),
  coal: loadTexture(CoalOre),
  iron: loadTexture(IronOre),
  bedrock: loadTexture(BedRock),
  // oakLogSide: loadTexture(OakLogSide),
  // oakLogTop: loadTexture(OakLogTop),
  oka: loadTexture(Oka),
  leaves: loadTexture(Leaves),
  tallGrass: loadTexture(TallGrass),
  flowerRose: loadTexture(FlowerRose),
  flowerDandelion: loadTexture(FlowerDandelion),
  redstoneLamp: loadTexture(RedStoneLamp),
  stoneBrick: loadTexture(StoneBrick),
  craftingTableFront: loadTexture(CraftingTableFront),
  CraftingTableSide: loadTexture(CraftingTableSide),
  craftingTableTop: loadTexture(CraftingTableTop),
  // 裂开的方块
  breakBlock: loadTexture(Break),
  combine: loadTexture(Combine),
};

textures.combine.wrapS = THREE.ClampToEdgeWrapping;
textures.combine.wrapT = THREE.ClampToEdgeWrapping;
