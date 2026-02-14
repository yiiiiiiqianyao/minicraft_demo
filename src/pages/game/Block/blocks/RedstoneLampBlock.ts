import * as THREE from "three";

import { RenderGeometry } from "../base/Block";
import { LightSourceBlock } from "../base/LightSourceBlock";
import { textures } from "../textures";

import { BlockID } from "..";
import { ItemImage } from "../../gui/items";
import { DropLimit } from "../../world/drop/literal";

const redstoneLampMaterial = new THREE.MeshBasicMaterial({
  map: textures.redstoneLamp,
});

/**@desc 红石灯方块 */
export class RedstoneLampBlock extends LightSourceBlock {
  id = BlockID.RedstoneLamp;
  material = redstoneLampMaterial;
  uiTexture = ItemImage.redstoneLamp;
  geometry = RenderGeometry.Cube;
  transparent = true;
  canPassThrough = false;
  canDrop = true;

  // Light properties
  color = 0xdfa658;
  intensity = 15;
  distance = 10;
  decay = 1;
  breakCount = 5;
  /**@desc 红石灯方块被破坏后掉落的红石灯方块 */
  dropBlockId = BlockID.RedstoneLamp;
  dropLimit = DropLimit;
  /**@desc 当前方块是否可交互 */
  interactive = true;
}

export const getEmptyRedstoneLampBlockData = () => {
  return {
    blockId: BlockID.RedstoneLamp,
    instanceIds: [],
    blockData: {
      breakCount: 5,
    },
  }
}