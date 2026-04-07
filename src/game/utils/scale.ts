import { VIRTUAL_WIDTH, VIRTUAL_HEIGHT } from "./viewport";

export interface ScaleInfo {
  scale: number;
  offsetX: number;
  offsetY: number;
  displayWidth: number;
  displayHeight: number;
}

/**
 * Calculates how the virtual canvas maps onto the real screen.
 * Uses FIT (letterbox) strategy — no cropping, no distortion.
 */
export function calculateScale(
  screenWidth: number,
  screenHeight: number
): ScaleInfo {
  const scaleX = screenWidth / VIRTUAL_WIDTH;
  const scaleY = screenHeight / VIRTUAL_HEIGHT;
  const scale = Math.min(scaleX, scaleY); // FIT — shrink to smaller axis

  const displayWidth = VIRTUAL_WIDTH * scale;
  const displayHeight = VIRTUAL_HEIGHT * scale;

  const offsetX = (screenWidth - displayWidth) / 2;
  const offsetY = (screenHeight - displayHeight) / 2;

  return { scale, offsetX, offsetY, displayWidth, displayHeight };
}

/** Convert a virtual-space coordinate to real screen pixels. */
export function virtualToScreen(
  vx: number,
  vy: number,
  info: ScaleInfo
): { x: number; y: number } {
  return {
    x: info.offsetX + vx * info.scale,
    y: info.offsetY + vy * info.scale,
  };
}

/** Convert a real screen pixel coordinate to virtual space. */
export function screenToVirtual(
  sx: number,
  sy: number,
  info: ScaleInfo
): { x: number; y: number } {
  return {
    x: (sx - info.offsetX) / info.scale,
    y: (sy - info.offsetY) / info.scale,
  };
}
