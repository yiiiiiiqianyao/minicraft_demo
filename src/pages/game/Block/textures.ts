import { loadTexture } from "../engine/utils";
import GrassSide from '@/assets/textures/grass_side.png';
import GrassTop from '@/assets/textures/grass.png';
import Dirt from '@/assets/textures/dirt.png';
import Stone from '@/assets/textures/stone.png';
import CoalOre from '@/assets/textures/coal_ore.png';
import IronOre from '@/assets/textures/iron_ore.png';
import BedRock from '@/assets/textures/bedrock.png';

import OakLogSide from '@/assets/textures/oak_log_side.png';
import OakLogTop from '@/assets/textures/oak_log_top.png';
import Leaves from '@/assets/textures/leaves.png';
import TallGrass from '@/assets/textures/tall_grass.png';
import FlowerRose from '@/assets/textures/flower_rose.png';
import FlowerDandelion from '@/assets/textures/flower_dandelion.png';

import RedStoneLamp from '@/assets/textures/redstone_lamp.png';
import StoneBrick from '@/assets/textures/stonebrick.png';

/**@desc for block texture */
export const textures = {
  grassSide: loadTexture(GrassSide),
  grassTop: loadTexture(GrassTop),
  dirt: loadTexture(Dirt),
  stone: loadTexture(Stone),
  coal: loadTexture(CoalOre),
  iron: loadTexture(IronOre),
  bedrock: loadTexture(BedRock),
  oakLogSide: loadTexture(OakLogSide),
  oakLogTop: loadTexture(OakLogTop),
  leaves: loadTexture(Leaves),
  tallGrass: loadTexture(TallGrass),
  flowerRose: loadTexture(FlowerRose),
  flowerDandelion: loadTexture(FlowerDandelion),
  redstoneLamp: loadTexture(RedStoneLamp),
  stoneBrick: loadTexture(StoneBrick),
};

import GrassBlock from '@/assets/textures/grass_block.png';
import DirtBlock from '@/assets/textures/dirt_block.png';
import StoneBlock from '@/assets/textures/stone_block.png';
import CoalOreBlock from '@/assets/textures/coal_block.png';
import IronOreBlock from '@/assets/textures/iron_block.png';
import BedRockBlock from '@/assets/textures/bedrock_block.png';
import OakLogBlock from '@/assets/textures/oak_log_block.png';

import LeavesBlock from '@/assets/textures/leaves_block.png';
import TallGrassBlock from '@/assets/textures/tall_grass_block.png';
import FlowerRoseBlock from '@/assets/textures/flower_rose.png';
import FlowerDandelionBlock from '@/assets/textures/flower_dandelion.png';

import RedStoneLampBlock from '@/assets/textures/redstone_lamp_block.png';
import StoneBrickBlock from '@/assets/textures/stonebrick_block.png';
/**@desc for ui */
export const uiTextures = {
  grass: GrassBlock,
  dirt: DirtBlock,
  stone: StoneBlock,
  coal: CoalOreBlock,
  iron: IronOreBlock,
  bedrock: BedRockBlock,
  oakLog: OakLogBlock,
  leaves: LeavesBlock,
  tallGrass: TallGrassBlock,
  flowerRose: FlowerRoseBlock,
  flowerDandelion: FlowerDandelionBlock,
  redstoneLamp: RedStoneLampBlock,
  stoneBrick: StoneBrickBlock,
};
