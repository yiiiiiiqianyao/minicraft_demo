import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "..";
import { DirtBlockMaterial } from "../../engine/material";
import { ItemImage } from "../../gui/items";

/**@desc Dirt block */
export class DirtBlock extends Block {
  id = BlockID.Dirt;
  material = DirtBlockMaterial;
  uiTexture = ItemImage.dirt;
  geometry = RenderGeometry.Cube;
  transparent = false;
  canPassThrough = false;
  canDrop = true;
  breakCount = 1;
}

export const EmptyDirtBlockData = {
  blockId: BlockID.Dirt,
  instanceIds: [],
  blockData: {},
}