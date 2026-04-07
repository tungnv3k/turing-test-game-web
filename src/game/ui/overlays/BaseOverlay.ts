import * as Phaser from "phaser";
import { getHudZones } from "@/game/utils/viewport";

/**
 * BaseOverlay — extend this for any in-game menu or overlay scene.
 *
 * Provides:
 * - HUD zone references (topLeft, center, bottomCenter, etc.)
 * - Orientation change handling via Phaser's built-in scale resize event
 * - A hook `onOrientationChange(orientation)` subclasses can override
 */
export abstract class BaseOverlay extends Phaser.Scene {
  protected hud!: ReturnType<typeof getHudZones>;

  create(): void {
    this.refreshHud();

    // Re-layout whenever the game resizes (orientation change, browser resize)
    this.scale.on(
      Phaser.Scale.Events.RESIZE,
      () => {
        this.refreshHud();
        this.onResize();
      },
      this
    );
  }

  private refreshHud(): void {
    this.hud = getHudZones();
  }

  /**
   * Override in subclasses to re-layout UI elements when screen resizes.
   */
  protected onResize(): void {
    // no-op by default — subclasses implement this
  }

  shutdown(): void {
    this.scale.off(Phaser.Scale.Events.RESIZE, undefined, this);
  }
}
