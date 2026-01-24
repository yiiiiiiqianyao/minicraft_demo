import { Howl } from "howler";
import { sample } from "lodash";
import soundData from "./sounds.json";
import spriteData from "./sprite.json";
import { BlockID } from "../Block";
import SpriteWebm from "../../../assets/audio/sprite.webm";
import SpriteMp3 from "../../../assets/audio/sprite.mp3";
import AmbientBGM from "../../../assets/audio/ambient.mp3";

export class AudioManager {
  static sprite = new Howl({
      src: [
        SpriteWebm, 
        SpriteMp3
      ],
      sprite: spriteData.sprite as any,
      volume: 0.6,
    });

  static play(name: string) {
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

  static playBGM() {
     const sound = new Howl({
      src: [AmbientBGM],
      loop: true,
      volume: 2.5,
    });
    sound.play();
  }

  static playWalkSound(blockUnderneath: BlockID) {
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

  static async playBlockSound(blockId: BlockID) {
    switch (blockId) {
      case BlockID.Grass:
      case BlockID.Dirt:
      case BlockID.Leaves:
      case BlockID.TallGrass:
      case BlockID.FlowerDandelion:
      case BlockID.FlowerRose:
        AudioManager.play("dig.grass");
        break;
      case BlockID.OakLog:
        AudioManager.play("dig.wood");
        break;
      default:
        AudioManager.play("dig.stone");
        break;
    }
  }
}
