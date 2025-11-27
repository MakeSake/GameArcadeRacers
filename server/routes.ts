import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";

interface Player {
  id: string;
  name: string;
  progress: number;
  finished: boolean;
  carIndex: number;
  ready?: boolean;
}

interface GameState {
  players: Player[];
  targetText: string;
  isStarted: boolean;
  winner: Player | null;
}

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog and runs through the forest.",
  "Practice makes perfect when you type with accuracy and speed every single day.",
  "Racing against time requires focus, determination, and lightning fast fingers.",
  "Champions are made through dedication, practice, and never giving up on dreams.",
  "Type like the wind and let your fingers dance across the keyboard smoothly."
];

let gameState: GameState = {
  players: [],
  targetText: "",
  isStarted: false,
  winner: null,
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    socket.on("joinGame", ({ name }: { name: string }) => {
      if (gameState.players.length >= 3) {
        socket.emit("error", { message: "Game is full" });
        return;
      }

      if (gameState.isStarted) {
        socket.emit("error", { message: "Game already started" });
        return;
      }

      const carIndex = gameState.players.length;
      const player: Player = {
        id: socket.id,
        name,
        progress: 0,
        finished: false,
        carIndex,
        ready: false,
      };

      gameState.players.push(player);
      socket.emit("joinedGame");
      io.emit("gameState", gameState);
      console.log(`${name} joined the game (${gameState.players.length}/3)`);
    });

    socket.on("playerReady", ({ ready }: { ready: boolean }) => {
      const player = gameState.players.find((p) => p.id === socket.id);
      if (player && !gameState.isStarted) {
        player.ready = ready;
        io.emit("gameState", gameState);
        console.log(`${player.name} is ${ready ? "ready" : "not ready"}`);

        // Auto-start if all players are ready and there are 2+ players
        if (gameState.players.length > 1 && gameState.players.every((p) => p.ready)) {
          const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
          gameState.targetText = randomText;
          gameState.isStarted = true;
          gameState.winner = null;
          gameState.players.forEach((p) => {
            p.progress = 0;
            p.finished = false;
            p.ready = false;
          });

          io.emit("gameStarted", gameState);
          console.log("Game started with", gameState.players.length, "players");
        }
      }
    });

    socket.on("startGame", () => {
      if (gameState.isStarted) {
        return;
      }

      const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
      gameState.targetText = randomText;
      gameState.isStarted = true;
      gameState.winner = null;
      gameState.players.forEach((p) => {
        p.progress = 0;
        p.finished = false;
        p.ready = false;
      });

      io.emit("gameStarted", gameState);
      console.log("Game started with", gameState.players.length, "players");
    });

    socket.on("updateProgress", ({ progress }: { progress: number }) => {
      const player = gameState.players.find((p) => p.id === socket.id);
      if (player && gameState.isStarted && !gameState.winner) {
        player.progress = Math.min(100, Math.max(0, progress));
        io.emit("playerProgress", { playerId: socket.id, progress: player.progress });
      }
    });

    socket.on("finishRace", () => {
      const player = gameState.players.find((p) => p.id === socket.id);
      if (player && gameState.isStarted && !gameState.winner && !player.finished) {
        player.finished = true;
        player.progress = 100;
        io.emit("playerFinished", { playerId: socket.id });

        if (!gameState.winner) {
          gameState.winner = player;
          io.emit("gameWon", { winner: player });
          console.log(`${player.name} won the race!`);
        }
      }
    });

    socket.on("resetGame", () => {
      gameState = {
        players: gameState.players.map((p) => ({
          ...p,
          progress: 0,
          finished: false,
          ready: false,
        })),
        targetText: "",
        isStarted: false,
        winner: null,
      };
      io.emit("gameState", gameState);
      console.log("Game reset");
    });

    socket.on("disconnect", () => {
      const playerIndex = gameState.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        const player = gameState.players[playerIndex];
        console.log(`${player.name} disconnected`);
        gameState.players.splice(playerIndex, 1);

        gameState.players.forEach((p, index) => {
          p.carIndex = index;
        });

        if (gameState.players.length === 0) {
          gameState = {
            players: [],
            targetText: "",
            isStarted: false,
            winner: null,
          };
        }

        io.emit("gameState", gameState);
      }
    });
  });

  return httpServer;
}
