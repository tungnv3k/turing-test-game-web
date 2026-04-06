import Phaser from "phaser";
import type { Socket } from "socket.io-client";

// ─────────────────────────────────────────────────────────
// Internal types
// ─────────────────────────────────────────────────────────

interface PlayerData {
  id:    string;
  name:  string;
  role:  "human" | "bot";
  alive: boolean;
  x:     number;
  y:     number;
}

interface RemotePlayer {
  container: Phaser.GameObjects.Container;
  targetX:   number;
  targetY:   number;
}

// ─────────────────────────────────────────────────────────
// Map zones — AI themed
// ─────────────────────────────────────────────────────────

const MAP_ZONES = [
  { x: 80,  y: 60,  w: 160, h: 100, label: "DATA CENTER",      color: 0x1e3a5f },
  { x: 340, y: 60,  w: 160, h: 100, label: "CAPTCHA STATION",  color: 0x1a3a2a },
  { x: 600, y: 60,  w: 160, h: 100, label: "NEURAL CORE",      color: 0x3a1a2a },
  { x: 80,  y: 280, w: 160, h: 100, label: "BIAS LAB",         color: 0x2a2a1a },
  { x: 340, y: 280, w: 160, h: 100, label: "LOGIC CHAIN",      color: 0x1a2a3a },
  { x: 600, y: 280, w: 160, h: 100, label: "NETWORK HUB",      color: 0x2a1a3a },
  { x: 80,  y: 460, w: 160, h: 100, label: "TRAINING ROOM",    color: 0x1a3a3a },
  { x: 340, y: 460, w: 160, h: 100, label: "SORTING FACILITY", color: 0x3a2a1a },
  { x: 600, y: 460, w: 160, h: 100, label: "TERMINAL",         color: 0x2a3a1a },
];

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const WORLD_W       = 820;
const WORLD_H       = 620;
const MOVE_SPEED    = 160;    // px per second
const LERP          = 0.18;   // remote player interpolation
const EMIT_EVERY_MS = 50;     // throttle: emit position max 20/s
const MAP_READY_MS  = 800;    // delay before movement is enabled

// ─────────────────────────────────────────────────────────
// MainScene
// ─────────────────────────────────────────────────────────

export class MainScene extends Phaser.Scene {
  // Injected by BootedScene.init() in PhaserGame.tsx
  socket!:    Socket;
  myPlayer!:  PlayerData;
  allPlayers: PlayerData[] = [];  // default [] prevents .filter() crash
  roomCode!:  string;

  // Scene objects
  private localContainer!: Phaser.GameObjects.Container;
  private remotePlayers = new Map<string, RemotePlayer>();

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up:    Phaser.Input.Keyboard.Key;
    down:  Phaser.Input.Keyboard.Key;
    left:  Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  // State
  private lastEmit  = 0;
  private mapReady  = false;    // ← movement locked until delay completes

  // ─────────────────────────────────────────────────────
  constructor() {
    super({ key: "MainScene" });
  }

  /**
   * init() — base no-op.
   * Overridden by BootedScene in PhaserGame.tsx to inject
   * socket, myPlayer, allPlayers, roomCode BEFORE create().
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  override init(): void {}

  // ─────────────────────────────────────────────────────
  create(): void {
    if (!this.myPlayer || !this.socket) {
      console.error("[MainScene] Data not injected. Check PhaserGame.tsx.");
      return;
    }

    // World bounds
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    // ── Background ──────────────────────────────────
    this.add.rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, 0x0a0a0f);

    // ── Grid + zones + border ────────────────────────
    this.drawGrid();
    this.drawZones();

    const border = this.add.graphics();
    border.lineStyle(2, 0x334155, 1);
    border.strokeRect(1, 1, WORLD_W - 2, WORLD_H - 2);

    // ── Spawn remote players ─────────────────────────
    this.allPlayers
      .filter((p) => p.id !== this.myPlayer.id)
      .forEach((p) => this.addRemotePlayer(p));

    // ── Spawn local player ───────────────────────────
    this.addLocalPlayer();

    // ── Camera ───────────────────────────────────────
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.localContainer, true, 0.1, 0.1);

    // ── Keyboard input ───────────────────────────────
    const kb     = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.wasd    = {
      up:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // ── Loading overlay ──────────────────────────────
    // Shown for MAP_READY_MS then removed — prevents movement
    // before the canvas has browser focus.
    const overlay = this.add
      .rectangle(WORLD_W / 2, WORLD_H / 2, WORLD_W, WORLD_H, 0x000000, 0.75)
      .setDepth(100);

    const loadText = this.add
      .text(WORLD_W / 2, WORLD_H / 2, "INITIALIZING SYSTEM...", {
        fontSize:   "14px",
        fontFamily: "monospace",
        color:      "#22d3ee",
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Unlock movement after delay
    this.time.delayedCall(MAP_READY_MS, () => {
      overlay.destroy();
      loadText.destroy();
      this.mapReady = true;

      // Force canvas focus so keyboard events are captured by Phaser
      const canvas = this.game.canvas;
      canvas.setAttribute("tabindex", "0");
      canvas.focus();
    });

    // ── Socket: other player moved ───────────────────
    this.socket.on(
      "player-moved",
      (data: { id: string; x: number; y: number }) => {
        const r = this.remotePlayers.get(data.id);
        if (r) {
          r.targetX = data.x;
          r.targetY = data.y;
        }
      }
    );

    // ── Socket: room-state (join/leave sync) ─────────
    this.socket.on(
      "room-state",
      (state: {
        players: Array<{
          id: string; name: string; alive: boolean; x: number; y: number;
        }>;
      }) => {
        const incoming = new Set(state.players.map((p) => p.id));

        // Remove players who left
        for (const [id, remote] of this.remotePlayers) {
          if (!incoming.has(id)) {
            remote.container.destroy();
            this.remotePlayers.delete(id);
          }
        }

        // Add new players
        for (const p of state.players) {
          if (p.id === this.myPlayer.id)   continue;
          if (this.remotePlayers.has(p.id)) continue;
          this.addRemotePlayer({
            id:    p.id,
            name:  p.name,
            role:  "human",
            alive: p.alive,
            x:     p.x ?? 300,
            y:     p.y ?? 300,
          });
        }
      }
    );
  }

  // ─────────────────────────────────────────────────────
  update(_time: number, delta: number): void {
    if (!this.localContainer) return;
    if (!this.cursors)        return;
    if (!this.mapReady)       return;  // ← locked until delay fires

    this.moveLocal(delta);
    this.lerpRemotes();
  }

  // ─────────────────────────────────────────────────────
  override shutdown(): void {
    this.socket?.off("player-moved");
    this.socket?.off("room-state");
  }

  // ─────────────────────────────────────────────────────
  // Drawing
  // ─────────────────────────────────────────────────────

  private drawGrid(): void {
    const g = this.add.graphics();
    g.lineStyle(1, 0x1e293b, 0.4);
    for (let x = 0; x <= WORLD_W; x += 40) g.lineBetween(x, 0, x, WORLD_H);
    for (let y = 0; y <= WORLD_H; y += 40) g.lineBetween(0, y, WORLD_W, y);
  }

  private drawZones(): void {
    for (const z of MAP_ZONES) {
      const g = this.add.graphics();
      g.fillStyle(z.color, 0.55);
      g.fillRoundedRect(z.x, z.y, z.w, z.h, 8);
      g.lineStyle(1, 0x334155, 0.9);
      g.strokeRoundedRect(z.x, z.y, z.w, z.h, 8);

      this.add
        .text(z.x + z.w / 2, z.y + z.h / 2, z.label, {
          fontSize:   "9px",
          fontFamily: "monospace",
          color:      "#64748b",
          align:      "center",
        })
        .setOrigin(0.5);
    }
  }

  // ─────────────────────────────────────────────────────
  // Player helpers
  // ─────────────────────────────────────────────────────

  /**
   * Builds: circle sprite + role icon + name label → container.
   * isLocal = true  → coloured sprite, white ring, your role icon.
   * isLocal = false → grey sprite, dim ring, ❓ icon (role hidden).
   */
  private makeContainer(
    x: number,
    y: number,
    name: string,
    role: "human" | "bot",
    isLocal: boolean
  ): Phaser.GameObjects.Container {
    const fill  = isLocal
      ? role === "human" ? 0x22d3ee : 0xf87171
      : 0x94a3b8;
    const ring  = isLocal ? 0xffffff : 0x475569;
    const tint  = isLocal ? "#e2e8f0" : "#94a3b8";
    const icon  = isLocal
      ? role === "human" ? "🧠" : "🤖"
      : "❓";

    const circle = this.add.circle(0, 0, 14, fill);
    circle.setStrokeStyle(2, ring);

    const roleIcon = this.add
      .text(0, 0, icon, { fontSize: "12px" })
      .setOrigin(0.5);

    const label = this.add
      .text(0, -26, name, {
        fontSize:        "10px",
        fontFamily:      "monospace",
        color:           tint,
        backgroundColor: "#0f172a",
        padding:         { x: 4, y: 2 },
      })
      .setOrigin(0.5);

    const container = this.add.container(x, y, [circle, roleIcon, label]);
    container.setDepth(isLocal ? 10 : 5);
    return container;
  }

  private addLocalPlayer(): void {
    this.localContainer = this.makeContainer(
      this.myPlayer.x,
      this.myPlayer.y,
      this.myPlayer.name,
      this.myPlayer.role,
      true
    );
  }

  private addRemotePlayer(p: PlayerData): void {
    const container = this.makeContainer(p.x, p.y, p.name, p.role, false);
    this.remotePlayers.set(p.id, {
      container,
      targetX: p.x,
      targetY: p.y,
    });
  }

  // ─────────────────────────────────────────────────────
  // Movement
  // ─────────────────────────────────────────────────────

  private moveLocal(delta: number): void {
    const speed = MOVE_SPEED * (delta / 1000);
    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  dx -= speed;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx += speed;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    dy -= speed;
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  dy += speed;

    // Normalise diagonal movement
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    if (dx === 0 && dy === 0) return;

    this.localContainer.x = Phaser.Math.Clamp(
      this.localContainer.x + dx, 14, WORLD_W - 14
    );
    this.localContainer.y = Phaser.Math.Clamp(
      this.localContainer.y + dy, 14, WORLD_H - 14
    );

    // Throttled emit — max 20 times per second
    const now = Date.now();
    if (now - this.lastEmit >= EMIT_EVERY_MS) {
      this.lastEmit = now;
      this.socket.emit("player-move", {
        roomCode: this.roomCode,
        x:        Math.round(this.localContainer.x),
        y:        Math.round(this.localContainer.y),
      });
    }
  }

  private lerpRemotes(): void {
    for (const remote of this.remotePlayers.values()) {
      remote.container.x = Phaser.Math.Linear(
        remote.container.x, remote.targetX, LERP
      );
      remote.container.y = Phaser.Math.Linear(
        remote.container.y, remote.targetY, LERP
      );
    }
  }
}
