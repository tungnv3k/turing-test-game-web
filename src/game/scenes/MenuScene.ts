import * as Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 40, "TURING TEST", {
        fontSize: "40px",
        color: "#00ffcc",
        fontStyle: "bold",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, "Are you human?", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 70, "[ Multiplayer coming soon ]", {
        fontSize: "13px",
        color: "#666666",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);
  }
}
