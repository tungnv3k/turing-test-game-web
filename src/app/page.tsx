"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useSocket } from "@/hooks/useSocket";
import type { RoomState } from "@/types/game";

export default function HomePage() {
  const router = useRouter();
  const { socketRef, connected } = useSocket();

  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("ALPHA");
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [error, setError] = useState("");

  const myId = socketRef.current?.id ?? "";
  const isHost = roomState?.hostId === myId;
  const myPlayer = roomState?.players.find((p) => p.id === myId);
  const nonHostPlayers = roomState?.players.filter(
    (p) => p.id !== roomState.hostId
  ) ?? [];
  const allNonHostReady =
    nonHostPlayers.length > 0 && nonHostPlayers.every((p) => p.ready);
  const canStart =
    isHost &&
    (roomState?.players.length ?? 0) >= 3 &&
    allNonHostReady;

  // ── Socket listeners ────────────────────────────────────
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onRoomState = (state: RoomState) => {
      setRoomState(state);
      setError("");
    };

    const onErrorMsg = (payload: { message: string }) => {
      setError(payload.message);
    };

    const onRoleAssigned = (payload: { role: string }) => {
      // Store role in sessionStorage and navigate to game
      sessionStorage.setItem("role", payload.role);
      sessionStorage.setItem("roomCode", roomState?.roomCode ?? "");
      sessionStorage.setItem("playerName", playerName);
      router.push("/game");
    };

    socket.on("room-state", onRoomState);
    socket.on("error-msg", onErrorMsg);
    socket.on("role-assigned", onRoleAssigned);

    return () => {
      socket.off("room-state", onRoomState);
      socket.off("error-msg", onErrorMsg);
      socket.off("role-assigned", onRoleAssigned);
    };
  }, [socketRef, roomState?.roomCode, playerName, router]);

  // ── Handlers ────────────────────────────────────────────
  function handleJoin() {
    setError("");
    if (!playerName.trim()) { setError("Enter your player name."); return; }
    if (!roomCode.trim()) { setError("Enter a room code."); return; }

    socketRef.current?.emit("join-room", {
      roomCode: roomCode.trim().toUpperCase(),
      playerName: playerName.trim(),
    });
  }

  function handleToggleReady() {
    socketRef.current?.emit("toggle-ready", {
      roomCode: roomState?.roomCode,
    });
  }

  function handleStartMatch() {
    socketRef.current?.emit("start-match", {
      roomCode: roomState?.roomCode,
    });
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-xl space-y-8">

        {/* Header */}
        <header>
          <h1 className="text-4xl font-bold tracking-tight">
            Turing Test Game 🎮
          </h1>
          <p className="mt-1 text-neutral-400">
            Humans vs AI Impostors · Multiplayer Social Deduction
          </p>
        </header>

        {/* Connection status */}
        <div className="flex items-center gap-2 text-sm">
          <span className={clsx(
            "h-2.5 w-2.5 rounded-full",
            connected ? "bg-green-400" : "bg-red-500"
          )} />
          <span className={connected ? "text-green-400" : "text-red-400"}>
            {connected ? "Server connected" : "Server disconnected"}
          </span>
        </div>

        {/* ── Join form (before joining) ── */}
        {!roomState && (
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Join a Lobby</h2>

            <div className="space-y-1">
              <label className="block text-sm text-neutral-400">Player name</label>
              <input
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                placeholder="e.g. HAL-9000"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm text-neutral-400">Room code</label>
              <input
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm uppercase outline-none focus:border-cyan-500"
                placeholder="e.g. ALPHA"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              onClick={handleJoin}
              className="w-full rounded-xl bg-cyan-500 py-2 text-sm font-semibold text-black hover:bg-cyan-400 transition-colors"
            >
              Join Lobby
            </button>
          </section>
        )}

        {/* ── Lobby (after joining) ── */}
        {roomState && (
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5">

            {/* Room header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lobby</h2>
              <span className="rounded-full border border-neutral-700 px-3 py-0.5 text-xs text-neutral-400">
                Room: {roomState.roomCode}
              </span>
            </div>

            {/* Player count + min notice */}
            <p className="text-sm text-neutral-400">
              {roomState.players.length} / ∞ players &nbsp;·&nbsp;
              {roomState.players.length < 3
                ? `Need ${3 - roomState.players.length} more to start`
                : "Enough players to start"}
            </p>

            {/* Player list */}
            <ul className="space-y-2">
              {roomState.players.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-sm"
                >
                  {/* Online dot */}
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />

                  {/* Name */}
                  <span className="flex-1">{p.name}</span>

                  {/* Host badge */}
                  {p.id === roomState.hostId && (
                    <span className="rounded-full bg-yellow-500/20 border border-yellow-500/40 px-2 py-0.5 text-xs text-yellow-400">
                      Host
                    </span>
                  )}

                  {/* Ready badge (non-host only) */}
                  {p.id !== roomState.hostId && (
                    <span className={clsx(
                      "rounded-full px-2 py-0.5 text-xs border",
                      p.ready
                        ? "bg-green-500/20 border-green-500/40 text-green-400"
                        : "bg-neutral-700/40 border-neutral-600 text-neutral-500"
                    )}>
                      {p.ready ? "Ready" : "Not ready"}
                    </span>
                  )}

                  {/* You label */}
                  {p.id === myId && (
                    <span className="text-xs text-neutral-500">you</span>
                  )}
                </li>
              ))}
            </ul>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3">
              {/* Non-host: ready toggle */}
              {!isHost && (
                <button
                  onClick={handleToggleReady}
                  className={clsx(
                    "flex-1 rounded-xl py-2 text-sm font-semibold transition-colors",
                    myPlayer?.ready
                      ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                      : "bg-green-500 hover:bg-green-400 text-black"
                  )}
                >
                  {myPlayer?.ready ? "Unready" : "Ready"}
                </button>
              )}

              {/* Host: start match */}
              {isHost && (
                <button
                  onClick={handleStartMatch}
                  disabled={!canStart}
                  className={clsx(
                    "flex-1 rounded-xl py-2 text-sm font-semibold transition-colors",
                    canStart
                      ? "bg-cyan-500 hover:bg-cyan-400 text-black"
                      : "bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700"
                  )}
                >
                  {canStart
                    ? "Start Match →"
                    : roomState.players.length < 3
                    ? "Waiting for players..."
                    : "Waiting for all to ready..."}
                </button>
              )}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}
