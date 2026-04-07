// Fixed virtual resolution — all game coordinates use this space.
// Phaser FIT mode scales this to fill any real screen.
export const VIRTUAL_WIDTH = 480;
export const VIRTUAL_HEIGHT = 854;

// HUD safe padding (px in virtual space) — keeps UI away from edges/notches
export const HUD_PADDING = 24;

export interface SafeArea {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Reads CSS custom properties set by globals.css from env(safe-area-inset-*).
 * Falls back to 0 in SSR / environments without safe areas.
 */
export function getSafeArea(): SafeArea {
  if (typeof window === "undefined") {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const style = getComputedStyle(document.documentElement);

  const parse = (prop: string): number => {
    const raw = style.getPropertyValue(prop).trim();
    const val = parseFloat(raw);
    return isNaN(val) ? 0 : val;
  };

  return {
    top: parse("--sat"),
    bottom: parse("--sab"),
    left: parse("--sal"),
    right: parse("--sar"),
  };
}

/**
 * Returns the HUD anchor zones in virtual coordinates.
 * All UI elements should be placed inside these bounds.
 */
export function getHudZones(safeArea?: SafeArea) {
  const safe = safeArea ?? getSafeArea();

  // Scale safe area from real pixels to virtual pixels
  const scaleX = VIRTUAL_WIDTH / (window?.innerWidth ?? VIRTUAL_WIDTH);
  const scaleY = VIRTUAL_HEIGHT / (window?.innerHeight ?? VIRTUAL_HEIGHT);

  const safeTop = safe.top * scaleY + HUD_PADDING;
  const safeBottom = safe.bottom * scaleY + HUD_PADDING;
  const safeLeft = safe.left * scaleX + HUD_PADDING;
  const safeRight = safe.right * scaleX + HUD_PADDING;

  return {
    // Anchor points (virtual px)
    topLeft:     { x: safeLeft,                      y: safeTop },
    topCenter:   { x: VIRTUAL_WIDTH / 2,             y: safeTop },
    topRight:    { x: VIRTUAL_WIDTH - safeRight,      y: safeTop },
    center:      { x: VIRTUAL_WIDTH / 2,             y: VIRTUAL_HEIGHT / 2 },
    bottomLeft:  { x: safeLeft,                      y: VIRTUAL_HEIGHT - safeBottom },
    bottomCenter:{ x: VIRTUAL_WIDTH / 2,             y: VIRTUAL_HEIGHT - safeBottom },
    bottomRight: { x: VIRTUAL_WIDTH - safeRight,      y: VIRTUAL_HEIGHT - safeBottom },
    // Bounds
    minX: safeLeft,
    maxX: VIRTUAL_WIDTH - safeRight,
    minY: safeTop,
    maxY: VIRTUAL_HEIGHT - safeBottom,
  };
}

export function getViewportSize(): { width: number; height: number } {
  if (typeof window === "undefined") {
    return { width: VIRTUAL_WIDTH, height: VIRTUAL_HEIGHT };
  }
  return { width: window.innerWidth, height: window.innerHeight };
}
