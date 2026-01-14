import { DevControl } from "../dev";

/***
 * 普通世界的参数
 * TODO 地形的多样性需要添加
*/
const terrain = {
  scale: 50,
  magnitude: 0.1,
  offset: 0.5,
}

// 平坦世界的参数
const flatTerrain = {
  scale: 50,
  magnitude: 0.0,
  offset: 0.5,
}
const surface = {
  offset: 4,
  magnitude: 4,
}
const bedrock = {
  offset: 1,
  magnitude: 2,
}
const trees = {
  frequency: 0.04,
  trunkHeight: {
    min: 5,
    max: 7,
  },
  canopy: {
    size: {
      min: 1,
      max: 3,
    },
  },
}

const tallGrass = {
  frequency: 0.02,
  patchSize: 5,
}
// 世界参数的默认值
export const getDefaultWorldParams = () => {
  const { worldType } = DevControl;
  return {
    seed: 0,
    terrain: worldType === 'flat' ? flatTerrain : terrain,
    surface: surface,
    bedrock: bedrock,
    trees: worldType === 'flat' ? null : trees,
    tallGrass: worldType === 'flat' ? null : tallGrass,
    flowers: {
      frequency: 0.0075,
    },
  }
};