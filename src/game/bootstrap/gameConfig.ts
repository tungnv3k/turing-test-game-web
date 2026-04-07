import * as Phaser from "phaser";
import { BootScene } from "@/game/scenes/BootScene";
import { MenuScene } from "@/game/scenes/MenuScene";
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from "@/game/utils/viewport";

export function gameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#1a1a2e",
    scene: [BootScene, MenuScene],
    scale: {
      mode: Phaser.Scale.FIT,       // Scale to fit — no cropping, no distortion
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: VIRTUAL_WIDTH,         // 480 virtual px
      height: VIRTUAL_HEIGHT,       // 854 virtual px
      parent,
      expandParent: false,          // Never let Phaser resize the parent
    },
    input: {
      activePointers: 3,            // Support multi-touch
    },
  };
}
