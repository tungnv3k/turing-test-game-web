// ─────────────────────────────────────────────────────────
// Shared game types
// ─────────────────────────────────────────────────────────

export type PlayerRole = "human" | "bot";
export type RoomStatus = "lobby" | "in-game";

/**
 * Public player shape.
 * Role is NEVER included — sent privately via role-assigned event.
 * Position (x, y) is public — needed for map rendering.
 */
export type LobbyPlayer = {
  id:    string;
  name:  string;
  ready: boolean;
  alive: boolean;
  x:     number;
  y:     number;
};

export type RoomState = {
  roomCode: string;
  hostId:   string;
  status:   RoomStatus;
  players:  LobbyPlayer[];
};

export type RoleAssignedPayload = {
  role: PlayerRole;
};

export type ErrorPayload = {
  message: string;
};

/** Emitted by the local client when the player moves. */
export type PlayerMovePayload = {
  roomCode: string;
  x:        number;
  y:        number;
};

/** Broadcast by the server to all other players in the room. */
export type PlayerMovedPayload = {
  id: string;
  x:  number;
  y:  number;
};
