"use client";

/**
 * app/game/page.tsx
 *
 * Game screen: role reveal → map.
 *
 * Fix: PhaserGame is only mounted AFTER:
 *   - socket is connected (mySocketId is set)
 *   - room-state received (players array is non-empty)
 *   - user has clicked "reveal role" (gameReady = true)
 *
 * This guarantees the canvas gets focus at the correct time
 * and allPlayers is always a populated array when Phaser boots.
 */

import { useEffect, useRef, useState } from "react";
import { useRouter }                   from "next/navigation";
import dynamic                         from "next/dynamic";
import clsx                            from "clsx";
import { io, Socket }                  from "socket.io-client";
import type { PlayerRole, RoomState }  from "@/types/game";

// Disable SSR — Phaser requires the browser DOM
const PhaserGame = dynamic(() => import("@/game/PhaserGame"), { ssr: false });

// ─────────────────────────────────────────────────────────
// Role display config
// ─────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<
  PlayerRole,
  {
    label:       string;
    emoji:       string;
    colorText:   string;
    colorBorder: string;
    colorBg:     string;
    description: string;
    objectives:  string[];
    warning:     string | null;
  }
> = {
  human: {
    label:       "Human Operator",
    emoji:       "🧠",
    colorText:   "text-cyan-400",
    colorBorder: "border-cyan-500/40",
    colorBg:     "bg-cyan-500/10",
    description:
      "You are a verified biological operator. Complete AI verification tasks to stabilize the system, fix sabotages, and vote out the AI Bots before they take control.",
    objectives: [
      "Complete all assigned AI verification tasks",
      "Maintain System Stability above zero",
      "Report terminated players immediately",
      "Vote out AI Bots during System Audits",
      "Repair sabotages before system failure",
    ],
    warning: null,
  },
  bot: {
    label:       "AI Bot",
    emoji:       "🤖",
    colorText:   "text-red-400",
    colorBorder: "border-red-500/40",
    colorBg:     "bg-red-500/10",
    description:
      "You are an infiltrating AI process. Blend in, fake tasks, sabotage systems, and mislead discussions. Reduce humans until bots gain parity.",
    objectives: [
      "Pretend to complete tasks — do NOT contribute to stability",
      "Trigger sabotage events at strategic moments",
      "Use robotic/statistical responses to mislead discussions",
      "Reduce human count until bots equal humans",
      "Avoid detection during System Audits",
    ],
    warning: "⚠️ Your role is secret. Act human at all times.",
  },
};

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export default function GamePage() {
  const router = useRouter();

  // ── Session data (from sessionStorage) ───────────────
  const [role,       setRole]       = useState<PlayerRole | null>(null);
  const [roomCode,   setRoomCode]   = useState("");
  const [playerName, setPlayerName] = useState("");

  // ── Socket ────────────────────────────────────────────
  const socketRef                   = useRef<Socket | null>(null);
  const [mySocketId,  setMySocketId]  = useState("");
  const [roomState,   setRoomState]   = useState<RoomState | null>(null);
  const [socketReady, setSocketReady] = useState(false);

  // ── UI ────────────────────────────────────────────────
  const [revealed,  setRevealed]  = useState(false);
  const [gameReady, setGameReady] = useState(false);

  // ── 1. Read session storage ───────────────────────────
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") as PlayerRole | null;
    const storedRoom = sessionStorage.getItem("roomCode");
    const storedName = sessionStorage.getItem("playerName");

    if (!storedRole || !storedRoom) {
      router.replace("/");
      return;
    }

    setRole(storedRole);
    setRoomCode(storedRoom);
    setPlayerName(storedName ?? "Unknown");
  }, [router]);

  // ── 2. Connect socket after session data is ready ─────
  useEffect(() => {
    if (!roomCode || !playerName) return;

    const url    = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";
    const socket = io(url, {
      transports:      ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setMySocketId(socket.id ?? "");

      // Re-join to receive room-state with player positions
      socket.emit("join-room", { roomCode, playerName });
    });

    socket.on("room-state", (state: RoomState) => {
      setRoomState(state);
      // Mark socket layer ready once we have at least our own player
      if (state.players.length > 0) {
        setSocketReady(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode, playerName]);

  // ── Derived: can we show the map? ─────────────────────
  // All three must be true before PhaserGame mounts:
  //   gameReady   — user clicked reveal
  //   socketReady — room-state received with players
  //   mySocketId  — our own socket id is known
  const canShowMap =
    gameReady &&
    socketReady &&
    mySocketId !== "" &&
    (roomState?.players.length ?? 0) > 0;

  // ── Loading screen ────────────────────────────────────
  if (!role) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse font-mono text-sm text-neutral-500">
          Loading match data...
        </p>
      </main>
    );
  }

  const cfg     = ROLE_CONFIG[role];
  const players = roomState?.players ?? [];

  // ─── Render ───────────────────────────────────────────
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* ── Header ─────────────────────────────────── */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Turing Test Game 🎮
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500">
              <span className="font-mono tracking-widest">{roomCode}</span>
              <span>·</span>
              <span>{playerName}</span>
              {revealed && (
                <>
                  <span>·</span>
                  <span className={cfg.colorText}>{cfg.label}</span>
                </>
              )}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm text-neutral-400">
              {players.length} player{players.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-neutral-600">in match</p>
          </div>
        </header>

        {/* ── Role reveal (before tap) ─────────────────── */}
        {!revealed && (
          <section className={clsx(
            "rounded-2xl border p-6 space-y-4",
            cfg.colorBorder,
            cfg.colorBg
          )}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Role</h2>
              <span className="text-xs text-neutral-500">🔒 Only visible to you</span>
            </div>

            <button
              onClick={() => {
                setRevealed(true);
                setGameReady(true);
              }}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/60 py-10 hover:bg-neutral-800 hover:border-neutral-500 transition-all"
            >
              <div className="space-y-2 text-center">
                <div className="text-3xl">👁</div>
                <p className="text-sm font-medium text-neutral-300">
                  Tap to reveal your role
                </p>
                <p className="text-xs text-neutral-600">
                  Make sure no one is watching your screen
                </p>
              </div>
            </button>
          </section>
        )}

        {/* ── Role card (after reveal) ──────────────────── */}
        {revealed && (
          <section className={clsx(
            "rounded-2xl border p-5 space-y-4",
            cfg.colorBorder,
            cfg.colorBg
          )}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{cfg.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={clsx("text-lg font-bold", cfg.colorText)}>
                  {cfg.label}
                </p>
                <p className="mt-0.5 text-sm text-neutral-400 leading-snug">
                  {cfg.description}
                </p>
              </div>
            </div>

            {cfg.warning && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {cfg.warning}
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
                Objectives
              </p>
              <ul className="space-y-1">
                {cfg.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                    <span className={clsx("mt-0.5 shrink-0", cfg.colorText)}>▸</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Waiting for server (after reveal, before map) ── */}
        {revealed && !canShowMap && (
          <section className="flex h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900">
            <p className="animate-pulse font-mono text-sm text-neutral-600">
              Syncing system state...
            </p>
          </section>
        )}

        {/* ── Phaser map (only mounts when ALL conditions met) ── */}
        {canShowMap && (
          <section className="space-y-3">

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                System Map
              </h2>
              {/* Click hint — shown until player moves */}
              <span className="text-xs text-neutral-600 font-mono">
                Click map then WASD / ↑↓←→ to move
              </span>
            </div>

            {/*
              PhaserGame only mounts here — after:
                - gameReady (reveal clicked)
                - socketReady (room-state received)
                - mySocketId known
              This means allPlayers is always populated
              and the canvas receives focus at the right time.
            */}
            <PhaserGame
              socket={socketRef.current!}
              myId={mySocketId}
              myName={playerName}
              myRole={role}
              roomCode={roomCode}
              players={players}
            />

            {/* Player list below map */}
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
                    p.id === mySocketId
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                      : "border-neutral-700 bg-neutral-800 text-neutral-400"
                  )}
                >
                  <span className={clsx(
                    "h-1.5 w-1.5 rounded-full",
                    p.alive ? "bg-green-400" : "bg-red-500"
                  )} />
                  <span>{p.name}</span>
                  {p.id === mySocketId && (
                    <span className="text-neutral-600">(you)</span>
                  )}
                </div>
              ))}
            </div>

          </section>
        )}

        {/* ── Dev: back to lobby ───────────────────────── */}
        <button
          onClick={() => {
            sessionStorage.clear();
            router.push("/");
          }}
          className="text-xs text-neutral-700 hover:text-neutral-500 transition-colors"
        >
          ← Back to lobby (dev only)
        </button>

      </div>
    </main>
  );
}
