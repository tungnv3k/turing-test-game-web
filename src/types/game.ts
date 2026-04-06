export type PlayerRole = "human" | "bot";

export type LobbyPlayer = {
  id: string;
  name: string;
  ready: boolean;
  alive: boolean;
};

export type RoomState = {
  roomCode: string;
  hostId: string;
  status: "lobby" | "starting" | "in-game";
  players: LobbyPlayer[];
};
