import * as Phaser from "phaser";
import { gameConfig } from "./gameConfig";

export function createGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game(gameConfig(parent));
}
