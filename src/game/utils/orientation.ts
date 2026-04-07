export type OrientationType = "portrait" | "landscape";

/** Returns the current orientation based on window dimensions. */
export function getOrientation(): OrientationType {
  if (typeof window === "undefined") return "portrait";
  return window.innerWidth <= window.innerHeight ? "portrait" : "landscape";
}

/**
 * Registers a callback for orientation / resize changes.
 * Returns a cleanup function — call it on scene shutdown or component unmount.
 */
export function onOrientationChange(
  callback: (orientation: OrientationType) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  let debounceTimer: ReturnType<typeof setTimeout>;

  const handler = () => {
    clearTimeout(debounceTimer);
    // Debounce: browser may fire multiple resize events during rotation
    debounceTimer = setTimeout(() => {
      callback(getOrientation());
    }, 100);
  };

  window.addEventListener("resize", handler);

  // Modern API — more reliable than orientationchange on iOS
  if (typeof screen !== "undefined" && "orientation" in screen) {
    screen.orientation.addEventListener("change", handler);
  }

  return () => {
    clearTimeout(debounceTimer);
    window.removeEventListener("resize", handler);
    if (typeof screen !== "undefined" && "orientation" in screen) {
      screen.orientation.removeEventListener("change", handler);
    }
  };
}
