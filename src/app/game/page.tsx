"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { PlayerRole } from "@/types/game";

const ROLE_CONFIG = {
  human: {
    label: "Human Operator",
    emoji: "🧠",
    color: "text-cyan-400",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
    description:
      "You are a verified biological operator. Complete AI verification tasks to stabilize the system. Identify and decommission the AI Bots before they take control.",
    objective: [
      "Complete all assigned tasks",
      "Report terminated players",
      "Vote out AI Bots in discussions",
      "Fix sabotages before system failure",
    ],
    warning: null,
  },
  bot: {
    label: "AI Bot",
    emoji: "🤖",
    color: "text-red-400",
    border: "border-red-500/40",
    bg: "bg-red-500/10",
    description:
      "You are an infiltrating AI process disguised as a human operator. Sabotage the system, eliminate humans, and manipulate discussions. Do NOT let them find out.",
    objective: [
      "Fake task completion — do not contribute to stability",
      "Trigger sabotage events",
      "Mislead players during discussions",
      "Reduce humans until you reach parity",
    ],
    warning: "Keep your role secret. Act human.",
  },
};

export default function GamePage() {
  const router = useRouter();
  const [role, setRole] = useState<PlayerRole | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") as PlayerRole | null;
    const storedRoom = sessionStorage.getItem("roomCode");
    const storedName = sessionStorage.getItem("playerName");

    // Guard: if no role, send back to lobby
    if (!storedRole || !storedRoom) {
      router.replace("/");
      return;
    }

    setRole(storedRole);
    setRoomCode(storedRoom ?? "");
    setPlayerName(storedName ?? "");
  }, [router]);

  if (!role) return null;

  const config = ROLE_CONFIG[role];

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-xl space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold tracking-tight">
            Turing Test Game 🎮
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
            <span>Room: {roomCode}</span>
            <span>·</span>
            <span>{playerName}</span>
          </div>
        </header>

        {/* Role card */}
        <section className={clsx(
          "rounded-2xl border p-6 space-y-5",
          config.border,
          config.bg
        )}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-200">
              Your Role
            </h2>
            <span className="text-xs text-neutral-500">Private — only you can see this</span>
          </div>

          {/* Reveal toggle */}
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 py-6 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
            >
              👁 Tap to reveal your role
            </button>
          ) : (
            <div className="space-y-4">
              {/* Role identity */}
              <div className="text-center space-y-1">
                <div className="text-6xl">{config.emoji}</div>
                <div className={clsx("text-2xl font-bold", config.color)}>
                  {config.label}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-300 leading-relaxed">
                {config.description}
              </p>

              {/* Warning (bots only) */}
              {config.warning && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  ⚠️ {config.warning}
                </div>
              )}

              {/* Objectives */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Objectives
                </p>
                <ul className="space-y-1">
                  {config.objective.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                      <span className={clsx("mt-0.5 shrink-0", config.color)}>▸</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* Game shell placeholder */}
        {revealed && (
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-3">
            <h2 className="text-lg font-semibold">System Status</h2>
            <p className="text-sm text-neutral-400">
              Match is starting. Game map loads in Step 3.
            </p>
            <div className="rounded-lg border border-neutral-800 bg-neutral-800/60 px-4 py-3 text-xs text-neutral-500 font-mono">
              [ Awaiting game state sync... ]
            </div>
          </section>
        )}

        {/* Back to lobby (dev only) */}
        <button
          onClick={() => {
            sessionStorage.clear();
            router.push("/");
          }}
          className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          ← Back to lobby (dev only)
        </button>

      </div>
    </main>
  );
}
