import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";

interface Player {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "spike" | "platform";
}

const GRAVITY = 0.5;
const JUMP_STRENGTH = -11;
const GROUND_Y = 320;
const PLAYER_SIZE = 30;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;

export default function GravityDash() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const playerRef = useRef<Player>({
    x: 50,
    y: GROUND_Y - PLAYER_SIZE,
    velocityY: 0,
    isJumping: false,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const wasGroundedRef = useRef(false);
  const obstacleCounterRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "ArrowUp" || e.code === "KeyW") && gameActive && !gameOver) {
        e.preventDefault();
        const player = playerRef.current;
        if (!player.isJumping) {
          player.velocityY = JUMP_STRENGTH;
          player.isJumping = true;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameActive, gameOver]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    const container = document.querySelector("[data-fullscreen-container]") as HTMLElement;
    if (!container) return;

    if (!isFullscreen) {
      const request = container.requestFullscreen || (container as any).webkitRequestFullscreen;
      request?.call(container).catch(() => {});
    } else {
      const exit = document.exitFullscreen || (document as any).webkitExitFullscreen;
      exit?.call(document).catch(() => {});
    }
  };

  const updatePhysics = () => {
    const player = playerRef.current;
    const groundLevel = GROUND_Y;

    const isGrounded = player.y >= groundLevel - PLAYER_SIZE && player.velocityY >= 0;

    if (isGrounded) {
      player.y = groundLevel - PLAYER_SIZE;
      player.velocityY = 0;
      player.isJumping = false;
      wasGroundedRef.current = true;
    } else {
      player.velocityY += GRAVITY;
      player.y += player.velocityY;
      wasGroundedRef.current = false;
    }

    const obstacles = obstaclesRef.current;
    for (let obs of obstacles) {
      const isColliding =
        player.x < obs.x + obs.width &&
        player.x + PLAYER_SIZE > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + PLAYER_SIZE > obs.y;

      if (isColliding) {
        if (obs.type === "spike") {
          setGameOver(true);
          setGameActive(false);
          return;
        } else if (obs.type === "platform") {
          if (player.velocityY > 0) {
            player.y = obs.y - PLAYER_SIZE;
            player.velocityY = 0;
            player.isJumping = false;
            wasGroundedRef.current = true;
          }
        }
      }
    }

    if (obstacles.length > 0 && obstacles[0].x < -100) {
      obstacles.shift();
      scoreRef.current += 1;
      setScore(scoreRef.current);

      const lastObs = obstacles[obstacles.length - 1];
      const newX = lastObs.x + 180;
      const isSpike = Math.random() > 0.4;
      const newObs: Obstacle = {
        x: newX,
        y: isSpike ? GROUND_Y - 40 : GROUND_Y - 100,
        width: isSpike ? 50 : 70,
        height: isSpike ? 40 : 30,
        type: isSpike ? "spike" : "platform",
      };
      obstacles.push(newObs);
    }

    obstacles.forEach((obs) => {
      obs.x -= 6;
    });
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

    const player = playerRef.current;
    ctx.fillStyle = "#00D4FF";
    ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);

    const obstacles = obstaclesRef.current;
    obstacles.forEach((obs) => {
      if (obs.type === "spike") {
        ctx.fillStyle = "#FF3333";
        ctx.strokeStyle = "#990000";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.height);
        ctx.lineTo(obs.x + obs.width / 2, obs.y);
        ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      }
    });

    ctx.fillStyle = "#FFD700";
    ctx.font = "20px Orbitron";
    ctx.fillText(`Score: ${scoreRef.current}`, 20, 30);
  };

  const gameLoop = () => {
    if (!gameActive) return;
    updatePhysics();
    render();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (gameActive && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameActive, gameOver]);

  const startGame = () => {
    playerRef.current = {
      x: 50,
      y: GROUND_Y - PLAYER_SIZE,
      velocityY: 0,
      isJumping: false,
    };

    const initialObstacles: Obstacle[] = [
      { x: 300, y: GROUND_Y - 40, width: 50, height: 40, type: "spike" },
      { x: 500, y: GROUND_Y - 100, width: 70, height: 30, type: "platform" },
      { x: 750, y: GROUND_Y - 40, width: 50, height: 40, type: "spike" },
    ];

    obstaclesRef.current = initialObstacles;
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setGameActive(true);
    wasGroundedRef.current = false;
  };

  return (
    <div
      data-fullscreen-container
      className={`relative text-white flex flex-col user-select-none overflow-hidden ${
        isFullscreen ? "w-screen h-screen" : "w-full h-screen"
      }`}
    >
      <video
        autoPlay
        loop
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10">
        {!isFullscreen && (
          <div className="flex items-center justify-between p-4 bg-black/60">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            <h1 className="game-title text-lg font-bold">GRAVITY DASH</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                ⛶ Fullscreen
              </Button>
            </div>
          </div>
        )}

        {isFullscreen && (
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 bg-black/60"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 bg-black/60"
            >
              ✕ Exit
            </Button>
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="bg-black/80 border-4 border-yellow-400 rounded-lg p-4">
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            className="border-2 border-white/20 bg-black"
          />

          {!gameActive && !gameOver && (
            <div className="mt-4 text-center">
              <p className="mb-4 text-lg">Press SPACE to jump</p>
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-8 py-3"
              >
                🚀 START GAME
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="mt-4 text-center">
              <h2 className="text-3xl font-bold text-red-400 mb-2">GAME OVER!</h2>
              <p className="text-xl mb-4">Final Score: {score}</p>
              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-8 py-3"
              >
                🔄 TRY AGAIN
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
