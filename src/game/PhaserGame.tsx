"use client";

/**
 * PhaserGame.tsx
 *
 * Mounts a Phaser.Game instance into a div ref.
 * Destroys cleanly on React unmount.
 *
 * Fix — "cannot move" root causes addressed here:
 *
 * 1. BootedScene.init() injects data BEFORE create() runs.
 *    No scene.start() or game.events.once("ready") race condition.
 *
 * 2. canvas.focus() + tabindex="0" called after Phaser boots
 *    so the browser routes keyboard events to the canvas,
 *    not the React DOM overlay above it.
 *
 * 3. canvas.style.outline = "none" removes the focus ring
 *    so the UX is clean after click-to-focus.
 */

import { useEffect, useRef } from "react";
import type { Socket }       from "socket.io-client";
import type { LobbyPlayer }  from "@/types/game";

// ─────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────

interface PhaserGameProps {
  socket:   Socket;
  myId:     string;
  myName:   string;
  myRole:   "human" | "bot";
  roomCode: string;
  players:  LobbyPlayer[];
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export default function PhaserGame({
  socket,
  myId,
  myName,
  myRole,
  roomCode,
  players,
}: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<import("phaser").Game | null>(null);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;
    if (!containerRef.current)         return;

    // Destroy stale instance (React StrictMode double-invoke)
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    // ── Resolve local player spawn position ───────────
    const spawnX = players.find((p) => p.id === myId)?.x ?? 300;
    const spawnY = players.find((p) => p.id === myId)?.y ?? 300;

    const myPlayer = {
      id:    myId,
      name:  myName,
      role:  myRole,
      alive: true,
      x:     spawnX,
      y:     spawnY,
    };

    // Remote players: role shown as "human" — roles are always private
    const allPlayers = players.map((p) => ({
      id:    p.id,
      name:  p.name,
      role:  "human" as const,
      alive: p.alive ?? true,
      x:     p.x    ?? 300,
      y:     p.y    ?? 300,
    }));

    // ── Dynamic import: Phaser + MainScene ────────────
    // Both imported together to avoid a second async gap
    // between scene class and Phaser.Game instantiation.
    Promise.all([
      import("phaser"),
      import("@/game/scenes/MainScene"),
    ]).then(([PhaserModule, { MainScene }]) => {
      const Phaser = PhaserModule.default;

      /**
       * BootedScene — injects all data fields into the scene
       * instance by overriding init(), which Phaser calls
       * BEFORE create(). This is the correct lifecycle position.
       *
       * Captured variables (socket, myPlayer, allPlayers, roomCode)
       * come from the useEffect closure — always fresh on mount.
       */
      class BootedScene extends MainScene {
        override init(): void {
          this.socket     = socket;
          this.myPlayer   = myPlayer;
          this.allPlayers = allPlayers;
          this.roomCode   = roomCode;
        }
      }

      const game = new Phaser.Game({
        type:            Phaser.AUTO,
        width:           820,
        height:          620,
        backgroundColor: "#0a0a0f",
        parent:          containerRef.current!,
        scene:           BootedScene,
        physics: {
          default: "arcade",
          arcade:  { debug: false },
        },
        scale: {
          mode:       Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });

      // ── Canvas focus fix ──────────────────────────
      // Phaser adds a <canvas> as a child of containerRef.
      // We must set tabindex + focus it so the browser sends
      // keydown events to Phaser instead of the React page.
      // Done after a short tick to ensure canvas is in the DOM.
      setTimeout(() => {
        const canvas = containerRef.current?.querySelector("canvas");
        if (canvas) {
          canvas.setAttribute("tabindex", "0");
          canvas.style.outline = "none";   // remove browser focus ring
          canvas.focus();
        }
      }, 100);

      gameRef.current = game;
    });

    // ── Cleanup on unmount ────────────────────────────
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  // Props are captured in closure on first mount — intentional.
  // Re-mounting Phaser on every prop change would reset the game.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      // onClick re-focuses canvas if player clicks elsewhere then returns
      onClick={() => {
        const canvas = containerRef.current?.querySelector("canvas");
        if (canvas) canvas.focus();
      }}
      className="w-full cursor-pointer rounded-xl overflow-hidden border border-neutral-800"
      style={{ aspectRatio: "820 / 620" }}
    />
  );
}
