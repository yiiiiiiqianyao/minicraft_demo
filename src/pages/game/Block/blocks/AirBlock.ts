import { Block, RenderGeometry } from "../base/Block";
import { BlockID } from "../constant";

export class AirBlock extends Block {
  id = BlockID.Air;
  material = [];
  uiTexture = "";
  geometry = RenderGeometry.Cube;
  transparent = true;
  canPassThrough = true;
  canDrop = false;
  breakCount = -1;
  dropBlockId = undefined;
  dropLimit = undefined;
}

export const getEmptyAirBlockData = () => {
  return {
    blockId: BlockID.Air,
    instanceIds: [],
    blockData: {},
  }
}
