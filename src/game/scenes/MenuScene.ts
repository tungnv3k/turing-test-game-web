import * as Phaser from "phaser";
import { BaseOverlay } from "@/game/ui/overlays/BaseOverlay";
import { getOrientation } from "@/game/utils/orientation";
import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from "@/game/utils/viewport";

export class MenuScene extends BaseOverlay {
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private orientationText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;

  constructor() {
    super("MenuScene");
  }

  create(): void {
    super.create(); // sets up HUD zones + resize listener

    this.buildBackground();
    this.buildUI();
    this.layoutUI();
  }

  private buildBackground(): void {
    // Dark gradient background using a graphics object
    const gfx = this.add.graphics();
    gfx.fillGradientStyle(0x0d0d1a, 0x0d0d1a, 0x1a1a3e, 0x1a1a3e, 1);
    gfx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
  }

  private buildUI(): void {
    this.titleText = this.add
      .text(0, 0, "TURING TEST", {
        fontSize: "42px",
        color: "#00ffcc",
        fontStyle: "bold",
        fontFamily: "monospace",
        stroke: "#003322",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.subtitleText = this.add
      .text(0, 0, "Are you human?", {
        fontSize: "20px",
        color: "#ffffff",
        fontFamily: "monospace",
        alpha: 0.85,
      })
      .setOrigin(0.5);

    this.hintText = this.add
      .text(0, 0, "[ Multiplayer coming in Step 4 ]", {
        fontSize: "12px",
        color: "#555577",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.orientationText = this.add
      .text(0, 0, "", {
        fontSize: "11px",
        color: "#334455",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    // Animate the title with a subtle pulse
    this.tweens.add({
      targets: this.titleText,
      alpha: { from: 1, to: 0.75 },
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private layoutUI(): void {
    const { center, bottomCenter, topRight } = this.hud;
    const orientation = getOrientation();

    // Title — always centered
    this.titleText.setPosition(center.x, center.y - 60);

    // Subtitle — just below title
    this.subtitleText.setPosition(center.x, center.y + 10);

    // Hint — below subtitle
    this.hintText.setPosition(center.x, center.y + 50);

    // Orientation debug label — top right
    this.orientationText.setPosition(topRight.x, topRight.y);
    this.orientationText.setText(`[ ${orientation} ]`);

    // Bottom hint — anchored to safe bottom
    if (!this.children.exists(this.orientationText)) return;
    this.orientationText.setPosition(bottomCenter.x, bottomCenter.y);
  }

  /** Called automatically by BaseOverlay on every resize / orientation change */
  protected override onResize(): void {
    this.layoutUI();
  }
}
