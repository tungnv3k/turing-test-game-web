"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// ─── Types ────────────────────────────────────────────────
type Player = {
  id: string;
  name: string;
};

// ─── Page ────────────────────────────────────────────────
export default function HomePage() {
  const socketRef = useRef<Socket | null>(null);

  const [connected, setConnected] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("ALPHA");
  const [currentRoom, setCurrentRoom] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);

  // ── Connect socket on mount ──────────────────────────────
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

    const socket = io(url, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => {
      setConnected(false);
      setJoined(false);
    });

    socket.on("join-error", (payload: { message: string }) => {
      setError(payload.message);
    });

    socket.on("room-state", (payload: { roomCode: string; players: Player[] }) => {
      setCurrentRoom(payload.roomCode);
      setPlayers(payload.players ?? []);
      setJoined(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Join room handler ────────────────────────────────────
  function handleJoin() {
    setError("");

    if (!playerName.trim()) {
      setError("Enter your player name.");
      return;
    }
    if (!roomCode.trim()) {
      setError("Enter a room code.");
      return;
    }

    socketRef.current?.emit("join-room", {
      roomCode: roomCode.trim().toUpperCase(),
      playerName: playerName.trim(),
    });
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-xl space-y-8">

        {/* ── Header ── */}
        <header>
          <h1 className="text-4xl font-bold tracking-tight">
            Turing Test Game 🎮
          </h1>
          <p className="mt-1 text-neutral-400">
            Humans vs AI Impostors · Multiplayer Social Deduction
          </p>
        </header>

        {/* ── Status ── */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
          />
          <span className={connected ? "text-green-400" : "text-red-400"}>
            {connected ? "Server connected" : "Server disconnected"}
          </span>
        </div>

        {/* ── Join Form ── */}
        {!joined && (
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Join a Lobby</h2>

            <div className="space-y-1">
              <label className="block text-sm text-neutral-400">
                Player name
              </label>
              <input
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm outline-none focus:border-cyan-500"
                placeholder="e.g. HAL-9000"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm text-neutral-400">
                Room code
              </label>
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

        {/* ── Lobby ── */}
        {joined && (
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Lobby</h2>
              <span className="rounded-full border border-neutral-700 px-3 py-0.5 text-xs text-neutral-400">
                Room: {currentRoom}
              </span>
            </div>

            <p className="text-sm text-neutral-400">
              {players.length} player{players.length !== 1 ? "s" : ""} connected
            </p>

            <ul className="space-y-2">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-800 px-4 py-2 text-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>{p.name}</span>
                  {p.id === socketRef.current?.id && (
                    <span className="ml-auto text-xs text-neutral-500">you</span>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setJoined(false);
                setPlayers([]);
                setCurrentRoom("");
              }}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              ← Leave room
            </button>
          </section>
        )}

      </div>
    </main>
  );
}
