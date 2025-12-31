import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

function loadTexture(path: string) {
  // TODO: make async
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.NearestMipmapNearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = true;
  return texture;
}

// https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/bedrock_block.png
export const textures = {
  grassSide: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/grass_side.png"),
  grassTop: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/grass.png"),
  dirt: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/dirt.png"),
  stone: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/stone.png"),
  coal: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/coal_ore.png"),
  iron: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/iron_ore.png"),
  bedrock: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/bedrock.png"),
  oakLogSide: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/oak_log_side.png"),
  oakLogTop: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/oak_log_top.png"),
  leaves: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/leaves.png"),
  tallGrass: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/tall_grass.png"),
  flowerRose: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/flower_rose.png"),
  flowerDandelion: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/flower_dandelion.png"),
  redstoneLamp: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/redstone_lamp.png"),
  stoneBrick: loadTexture("https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/stonebrick.png"),
};

export const uiTextures = {
  grass: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/grass_block.png",
  dirt: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/dirt_block.png",
  stone: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/stone_block.png",
  coal: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/coal_block.png",
  iron: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/iron_block.png",
  bedrock: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/bedrock_block.png",
  oakLog: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/oak_log_block.png",
  leaves: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/leaves_block.png",
  tallGrass: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/tall_grass_block.png",
  flowerRose: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/flower_rose.png",
  flowerDandelion: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/flower_dandelion.png",
  redstoneLamp: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/redstone_lamp_block.png",
  stoneBrick: "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/imgs/textures/stonebrick_block.png",
};
