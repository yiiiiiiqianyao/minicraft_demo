// 世界参数的默认值
export const DefaultWorldParams = {
    seed: 0,
    terrain: {
      scale: 50,
      magnitude: 0.1,
      offset: 0.5,
    },
    surface: {
      offset: 4,
      magnitude: 4,
    },
    bedrock: {
      offset: 1,
      magnitude: 2,
    },
    trees: {
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
    },
    grass: {
      frequency: 0.02,
      patchSize: 5,
    },
    flowers: {
      frequency: 0.0075,
    },
}