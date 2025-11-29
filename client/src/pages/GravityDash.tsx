import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Player extends GameObject {
  velocityY: number;
  isJumping: boolean;
}

interface Obstacle extends GameObject {
  type: "spike" | "platform";
}

const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const GROUND_LEVEL = 450;
const PLAYER_SIZE = 30;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export default function GravityDash() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerRef = useRef<Player>({
    x: 50,
    y: GROUND_LEVEL,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityY: 0,
    isJumping: false,
  });

  const obstaclesRef = useRef<Obstacle[]>([
    { x: 300, y: GROUND_LEVEL, width: 60, height: 20, type: "spike" },
    { x: 500, y: GROUND_LEVEL - 60, width: 60, height: 20, type: "platform" },
    { x: 700, y: GROUND_LEVEL, width: 60, height: 20, type: "spike" },
  ]);

  const scoreRef = useRef<number>(0);
  const gameLoopRef = useRef<number | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;

      if ((e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") && gameActive) {
        e.preventDefault();
        const player = playerRef.current;
        if (!player.isJumping) {
          player.velocityY = JUMP_STRENGTH;
          player.isJumping = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameActive]);

  // Physics and collision detection
  const updatePhysics = () => {
    const player = playerRef.current;

    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Ground collision
    if (player.y + player.height >= GROUND_LEVEL + 30) {
      player.y = GROUND_LEVEL;
      player.velocityY = 0;
      player.isJumping = false;
    }

    // Check obstacle collisions with stricter detection
    const obstacles = obstaclesRef.current;
    for (let obstacle of obstacles) {
      const isColliding = 
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y;

      if (isColliding) {
        if (obstacle.type === "spike") {
          // Spike collision - game over
          setGameOver(true);
          setGameActive(false);
          return;
        }
        // Platform: bounce if landing from above with positive velocity
        if (obstacle.type === "platform" && player.velocityY > 0) {
          player.velocityY = JUMP_STRENGTH;
          player.y = obstacle.y - player.height;
        } else if (obstacle.type === "platform" && player.velocityY <= 0) {
          // Hit from below - game over
          setGameOver(true);
          setGameActive(false);
          return;
        }
      }
    }

    // Remove obstacles that passed and spawn new ones
    if (obstacles.length > 0 && obstacles[0].x < -100) {
      obstacles.shift();
      scoreRef.current += 1;
      setScore(scoreRef.current);

      const lastObstacle = obstacles[obstacles.length - 1];
      const newX = lastObstacle.x + 200;
      const randomType = Math.random() > 0.5 ? "spike" : "platform";
      const randomY = randomType === "spike" ? GROUND_LEVEL : GROUND_LEVEL - 60;

      obstacles.push({
        x: newX,
        y: randomY,
        width: 60,
        height: 20,
        type: randomType,
      });
    }

    // Scroll obstacles left (game movement)
    obstacles.forEach((obs) => {
      obs.x -= 5;
    });
  };

  // Render game
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw ground
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(0, GROUND_LEVEL + 30, GAME_WIDTH, 50);

    // Draw player
    const player = playerRef.current;
    ctx.fillStyle = "#00d4ff";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    const obstacles = obstaclesRef.current;
    obstacles.forEach((obs) => {
      ctx.fillStyle = obs.type === "spike" ? "#ff4444" : "#00ff00";
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Draw score (positioned lower to avoid overlap)
    ctx.fillStyle = "#ffd700";
    ctx.font = "18px Orbitron";
    ctx.fillText(`Score: ${scoreRef.current}`, 20, GAME_HEIGHT - 20);
  };

  // Game loop
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
      y: GROUND_LEVEL,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityY: 0,
      isJumping: false,
    };
    obstaclesRef.current = [
      { x: 300, y: GROUND_LEVEL, width: 60, height: 20, type: "spike" },
      { x: 500, y: GROUND_LEVEL - 60, width: 60, height: 20, type: "platform" },
      { x: 700, y: GROUND_LEVEL, width: 60, height: 20, type: "spike" },
    ];
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setGameActive(true);
  };

  const toggleFullscreen = () => {
    const container = document.querySelector("[data-fullscreen-container]");
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div 
      data-fullscreen-container
      className={`${isFullscreen ? 'w-screen h-screen' : 'w-full h-screen'} bg-gradient-to-b from-blue-900 via-purple-900 to-slate-900 text-white flex flex-col user-select-none`}
    >
      {!isFullscreen && (
        <div className="flex items-center justify-between p-4 bg-black/50 user-select-none">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 user-select-none"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Home
          </Button>
          <h1 className="game-title text-xs">GRAVITY DASH</h1>
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 user-select-none"
          >
            ⛶ Fullscreen
          </Button>
        </div>
      )}

      {isFullscreen && (
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 bg-black/50 user-select-none"
          >
            ✕ Exit
          </Button>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 user-select-none">
        <div className="bg-black/80 border-4 border-yellow-400 rounded-lg p-4 user-select-none">
          <canvas
            ref={canvasRef}
            width={GAME_WIDTH}
            height={GAME_HEIGHT}
            className="border-2 border-white/20"
          />

          {!gameActive && !gameOver && (
            <div className="mt-4 text-center user-select-none">
              <p className="mb-4 text-lg user-select-none">Press SPACE or UP ARROW to jump</p>
              <Button
                onClick={startGame}
                className="game-button bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-8 py-3 user-select-none"
              >
                🚀 START GAME
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="mt-4 text-center user-select-none">
              <h2 className="text-3xl font-bold text-red-400 mb-2 user-select-none">GAME OVER!</h2>
              <p className="text-xl mb-4 user-select-none">Final Score: {score}</p>
              <Button
                onClick={startGame}
                className="game-button bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-8 py-3 user-select-none"
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
