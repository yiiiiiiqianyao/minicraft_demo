import { Howl, Howler } from "howler";
import { sample } from "lodash";
import soundData from "./sounds.json";
import spriteData from "./sprite.json";
import { BlockID } from "../Block";

// TODO: remove this, add volume slider
Howler.volume(0.3);

class AudioManager {
  sprite: Howl;

  constructor() {
    this.sprite = this.loadSounds();
  }

  loadSounds() {
    return new Howl({
      src: [
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/audio/sprite.webm", 
        "https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/audio/sprite.mp3"
      ],
      sprite: spriteData.sprite as any,
    });
  }

  play(name: string) {
    if (!(name in soundData)) {
      console.warn(`Unknown sound: ${name}`);
      return;
    }

    // dig and step sounds have same names and need to be differentiated
    const prefix = name.split(".")[0] === "dig" ? "dig_" : "";

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const options = soundData[name]["sounds"];
    const soundName = prefix + sample<string>(options).split("/").pop();
    this.sprite.play(soundName);
  }

  playBtm() {
     const sound = new Howl({
      src: ["https://lf3-static.bytednsdoc.com/obj/eden-cn/vhfuhpxpf/three/minicraft/audio/ambient.mp3"],
      loop: true,
    });
    sound.play();
  }

  playWalkSound(blockUnderneath: BlockID) {
    switch (blockUnderneath) {
      case BlockID.Grass:
      case BlockID.Dirt:
      case BlockID.Leaves:
        this.play("step.grass");
        break;
      case BlockID.OakLog:
        this.play("step.wood");
        break;
      case BlockID.Stone:
      case BlockID.CoalOre:
      case BlockID.IronOre:
      case BlockID.Bedrock:
        this.play("step.stone");
        break;
    }
  }
}

const audioManager = new AudioManager();
export default audioManager;
