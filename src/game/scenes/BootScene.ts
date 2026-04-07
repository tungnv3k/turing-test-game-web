import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    // TODO: preload assets in Step 2+
  }

  create(): void {
    this.scene.start("MenuScene");
  }
}
