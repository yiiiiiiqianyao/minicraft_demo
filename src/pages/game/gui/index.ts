import GUI from "lil-gui";
import * as THREE from "three";
import { Player } from "../player/Player";
import { World } from "../world/World";
import { initStats } from "../dev";
import audioManager from "../audio/AudioManager";
import { oreConfig } from "../world/generate/resource";
import { debounce } from "lodash";
import { Physics } from "../physics/index.ts";
import { ChunkParams } from "../world/chunk/literal.ts";

export * from './toolbar.ts';

export function createUI(
  world: World,
  player: Player,
  physics: Physics,
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  sunSettings: { distance: number; cycleLength: number },
  sunHelper: THREE.DirectionalLightHelper,
  shadowHelper: THREE.CameraHelper
) {
  const gui = new GUI();
  const custom = { volume: 0.3 };

  const soundFolder = gui.addFolder("Sound");
  soundFolder
    .add(custom, "volume", 0, 1, 0.01)
    .name("Volume")
    .onChange((value: number) => {
      Howler.volume(value);
    });

  const playerFolder = gui.addFolder("Player");
  playerFolder.add(player.cameraHelper, "visible").name("Camera Helper");
  playerFolder.add(player.boundsHelper, "visible").name("Show Player Bounds");

  if(physics.helpers) {
    const physicsFolder = gui.addFolder("Physics");
    physicsFolder.add(physics.helpers, "visible").name("Visualize Collisions");
    physicsFolder
      .add(physics, "simulationRate", 10, 1000)
      .name("Simulation Rate");
  }


  const worldFolder = gui.addFolder("World");
  worldFolder.add(renderer.shadowMap, "enabled").name("Enable Shadows");
  worldFolder.add(sunHelper, "visible").name("Show Sun Helper");
  worldFolder.add(shadowHelper, "visible").name("Show Shadow Helper");
  worldFolder
    .add(sunSettings, "cycleLength", 0, 1000, 1)
    .name("Day Length (s)");
  worldFolder.add(world, "renderDistance", 1, 16, 1).name("Render Distance");
  if (scene.fog) {
    worldFolder.add(scene.fog, "near", 1, 200, 1).name("Fog Near");
    worldFolder.add(scene.fog, "far", 1, 200, 1).name("Fog Far");
  }

  const terrainFolder = gui.addFolder("Terrain");
  terrainFolder.add(ChunkParams, "width", 8, 128, 1).name("Width");
  terrainFolder.add(ChunkParams, "height", 8, 64, 1).name("Height");
  terrainFolder.add(world.params, "seed", 1, 10000, 1).name("Seed");
  terrainFolder.add(world.params.terrain, "scale", 10, 100, 1).name("Scale");
  terrainFolder.add(world.params.terrain, "magnitude", 0, 1).name("Magnitude");
  terrainFolder.add(world.params.terrain, "offset", 0, 1).name("Offset");

  if(world.params.trees) {
    const treesFolder = terrainFolder.addFolder("Trees");
    treesFolder.add(world.params.trees, "frequency", 0, 1, 0.1).name("Frequency");
    treesFolder
      .add(world.params.trees.trunkHeight, "min", 0, 10, 1)
      .name("Min Trunk Height");
    treesFolder
      .add(world.params.trees.trunkHeight, "max", 0, 10, 1)
      .name("Max Trunk Height");
    treesFolder
      .add(world.params.trees.canopy.size, "min", 0, 10, 1)
      .name("Min Canopy Size");
    treesFolder
      .add(world.params.trees.canopy.size, "max", 0, 10, 1)
      .name("Max Canopy Size");
  }
  if(world.params.tallGrass) {
    const grassFolder = terrainFolder.addFolder("Grass");
    grassFolder.add(world.params.tallGrass, "frequency", 0, 1, 0.1).name("Frequency");
    grassFolder
      .add(world.params.tallGrass, "patchSize", 1, 10, 1)
      .name("Grass Patch Size");
  }

  terrainFolder
    .add(world.params.flowers, "frequency", 0, 1, 0.1)
    .name("Frequency");

  const resourcesFolder = gui.addFolder("Resources");

  for (const resource of Object.keys(oreConfig)) {
    const resourceFolder = resourcesFolder.addFolder(resource);
    resourceFolder
      .add(oreConfig[resource as keyof typeof oreConfig], "scarcity", 0, 1)
      .name("Scarcity");

    const scaleFolder = resourceFolder.addFolder("Scale");
    scaleFolder
      .add(oreConfig[resource as keyof typeof oreConfig].scale, "x", 1, 100)
      .name("X Scale");
    scaleFolder
      .add(oreConfig[resource as keyof typeof oreConfig].scale, "y", 1, 100)
      .name("Y Scale");
    scaleFolder
      .add(oreConfig[resource as keyof typeof oreConfig].scale, "z", 1, 100)
      .name("Z Scale");
  }

  gui.add(world, "regenerate").name("Generate");
}

export function initMainMenu(onStart: () => void) {
  const mainMenu = document.getElementById("main-menu");
  const loadingScreen = document.getElementById("loading");
  const startGameButton = document.getElementById("start-game");
  const handleClick = debounce(() => {
    if (mainMenu) mainMenu.style.display = "none";
    if (loadingScreen) loadingScreen.style.display = "block";
    audioManager.play("gui.button.press");
    initStats();
    onStart();
  })
  startGameButton?.addEventListener("click", handleClick);

  const githubButton = document.getElementById("github");
  githubButton?.addEventListener("click", () => {
    audioManager.play("gui.button.press");
    window.open("https://github.com/0kzh/minicraft");
  });
}

export function swapMenuScreenGUI() {
  const menuScreen = document.getElementById("menu");
  const debugMenu = document.getElementById("debug");
  if (menuScreen) {
    menuScreen.style.display = "none";
    if (debugMenu) {
      debugMenu.style.display = "flex";
    }
  }
}

export function updatePositionGUI(position: THREE.Vector3) {
    const posX = document.getElementById("player-pos-x");
    if (posX) {
      const inner = `x: ${position.x.toFixed(3)}`;
      if(posX.innerHTML !== inner) {
        posX.innerHTML = inner;
      }
    }

    const posY = document.getElementById("player-pos-y");
    if (posY) {
      const inner = `y: ${position.y.toFixed(3)}`;
      if(posY.innerHTML !== inner) {
        posY.innerHTML = inner;
      }
    }

    const posZ = document.getElementById("player-pos-z");
    if (posZ) {
      const inner = `z: ${position.z.toFixed(3)}`;
      if(posZ.innerHTML !== inner) {
        posZ.innerHTML = inner;
      }
    }
}

export function updateProgressGUI(percentLoaded: number) {
  const progressBar = document.getElementById("loading-progress-bar");
  if (progressBar) {
    progressBar.style.width = `${percentLoaded}%`;
  }
}