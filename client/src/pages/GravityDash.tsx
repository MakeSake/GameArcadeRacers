import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isJumping: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "spike" | "platform";
  shapeId: number;
}

// Physics constants
const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const GAME_WIDTH = 540;
const GAME_HEIGHT = 405;
const PLAYER_SIZE = 25;
const GROUND_Y = 330; // Top of ground visual
const SPIKE_HEIGHT = 35;
const PLATFORM_HEIGHT = 25;
const SPIKE_WIDTH = 60;
const PLATFORM_WIDTH = 60;

export default function GravityDash() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const playerRef = useRef<Player>({
    x: 40,
    y: GROUND_Y - PLAYER_SIZE,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityY: 0,
    isJumping: false,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const scoreRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const wasGroundedRef = useRef(false);
  const obstacleIdRef = useRef(0);

  // Setup initial obstacles
  useEffect(() => {
    obstaclesRef.current = [
      { x: 250, y: GROUND_Y - SPIKE_HEIGHT, width: SPIKE_WIDTH, height: SPIKE_HEIGHT, type: "spike", shapeId: 0 },
      { x: 380, y: GROUND_Y - 80, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, type: "platform", shapeId: 1 },
      { x: 510, y: GROUND_Y - SPIKE_HEIGHT, width: SPIKE_WIDTH, height: SPIKE_HEIGHT, type: "spike", shapeId: 2 },
    ];
    obstacleIdRef.current = 3;
  }, []);

  // Video setup
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.8;
    }
  }, []);

  // Handle fullscreen changes from ESC key
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") && gameActive) {
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
  }, [gameActive]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0.8 : 0;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector("[data-fullscreen-container]") as HTMLElement;
    if (!container) return;

    if (!isFullscreen) {
      // Enter fullscreen
      const requestFullscreen = container.requestFullscreen || 
        (container as any).webkitRequestFullscreen || 
        (container as any).mozRequestFullScreen || 
        (container as any).msRequestFullscreen;
      
      if (requestFullscreen) {
        requestFullscreen.call(container).catch(() => {
          console.error("Fullscreen request failed");
        });
      }
    } else {
      // Exit fullscreen
      const exitFullscreen = document.exitFullscreen || 
        (document as any).webkitExitFullscreen || 
        (document as any).mozCancelFullScreen || 
        (document as any).msExitFullscreen;
      
      if (exitFullscreen) {
        exitFullscreen.call(document).catch(() => {
          console.error("Exit fullscreen failed");
        });
      }
    }
  };

  // Physics update
  const updatePhysics = () => {
    const player = playerRef.current;
    const groundLevel = GROUND_Y;
    const groundCollisionY = groundLevel - player.height;

    // Check if grounded
    const isGrounded = player.y >= groundCollisionY && player.velocityY >= 0;

    if (isGrounded) {
      player.y = groundCollisionY;

      if (!wasGroundedRef.current) {
        player.velocityY = 0;
      } else {
        player.velocityY = 0;
      }

      player.isJumping = false;
      wasGroundedRef.current = true;
    } else {
      player.velocityY += GRAVITY;
      player.y += player.velocityY;
      wasGroundedRef.current = false;
    }

    // Check obstacle collisions
    const obstacles = obstaclesRef.current;
    for (let obs of obstacles) {
      const isColliding =
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y;

      if (isColliding) {
        if (obs.type === "spike") {
          setGameOver(true);
          setGameActive(false);
          return;
        } else if (obs.type === "platform") {
          const platformTop = obs.y;
          const platformBottom = obs.y + obs.height;

          if (player.velocityY > 0) {
            player.y = platformTop - player.height;
            player.velocityY = 0;
            player.isJumping = false;
            wasGroundedRef.current = true;
          } else if (player.velocityY < 0) {
            player.velocityY = 0;
            player.y = platformBottom;
          }
        }
      }
    }

    // Spawn new obstacles and remove old ones
    if (obstacles.length > 0 && obstacles[0].x < -100) {
      obstacles.shift();
      scoreRef.current += 1;
      setScore(scoreRef.current);

      const lastObstacle = obstacles[obstacles.length - 1];
      const newX = lastObstacle.x + 150;
      const randomType = Math.random() > 0.5 ? "spike" : "platform";
      const newHeight = randomType === "spike" ? SPIKE_HEIGHT : PLATFORM_HEIGHT;
      const newY = randomType === "spike" ? GROUND_Y - newHeight : GROUND_Y - 80;

      obstacles.push({
        x: newX,
        y: newY,
        width: randomType === "spike" ? SPIKE_WIDTH : PLATFORM_WIDTH,
        height: newHeight,
        type: randomType,
        shapeId: obstacleIdRef.current++,
      });
    }

    // Scroll obstacles
    obstacles.forEach((obs) => {
      obs.x -= 5;
    });
  };

  // Draw simple spike shapes
  const drawSpike = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, shapeId: number) => {
    const shapeType = shapeId % 10;

    ctx.fillStyle = "#FF1744";
    ctx.strokeStyle = "#C51827";
    ctx.lineWidth = 2;

    switch (shapeType) {
      case 0:
        // Triangle spike pointing up
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 1:
        // Double triangle
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 4, y + h / 2);
        ctx.lineTo(x + w / 2, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + h);
        ctx.lineTo(x + (3 * w) / 4, y + h / 2);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 2:
        // Zigzag
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 3, y + h / 2);
        ctx.lineTo(x + (2 * w) / 3, y);
        ctx.lineTo(x + w, y + h / 2);
        ctx.lineTo(x + w - 2, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 3:
        // Diamond
        const cx = x + w / 2;
        const cy = y + h / 2;
        ctx.beginPath();
        ctx.moveTo(cx, y);
        ctx.lineTo(x + w, cy);
        ctx.lineTo(cx, y + h);
        ctx.lineTo(x, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 4:
        // Saw teeth
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(x + (i * w) / 4, y + h);
          ctx.lineTo(x + (i * w) / 4 + w / 8, y);
          ctx.lineTo(x + ((i + 1) * w) / 4, y + h);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        break;
      case 5:
        // Large peak
        ctx.beginPath();
        ctx.moveTo(x - 5, y + h);
        ctx.lineTo(x + w / 2, y - 5);
        ctx.lineTo(x + w + 5, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 6:
        // Wave
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        for (let i = 0; i <= w; i += 4) {
          ctx.lineTo(x + i, y + (i % 8 === 0 ? 0 : h / 2));
        }
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 7:
        // Thick triangle
        ctx.beginPath();
        ctx.moveTo(x + 5, y + h);
        ctx.lineTo(x + w / 2, y - 3);
        ctx.lineTo(x + w - 5, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 8:
        // Split spike
        ctx.beginPath();
        ctx.moveTo(x + w / 4, y + h);
        ctx.lineTo(x + w / 3, y);
        ctx.lineTo(x + w / 2 - 3, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + w / 2 + 3, y + h);
        ctx.lineTo(x + (2 * w) / 3, y);
        ctx.lineTo(x + (3 * w) / 4, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 9:
        // Triple wave
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const px = x + (i * w) / 3;
          ctx.moveTo(px + w / 6, y + h);
          ctx.lineTo(px + w / 6, y);
          ctx.lineTo(px + (w * 2) / 6, y + h);
        }
        ctx.stroke();
        ctx.fillRect(x, y + h - 3, w, 3);
        break;
      default:
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
    }
  };

  // Render
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#0f0f1e";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw ground
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

    // Draw player
    const player = playerRef.current;
    ctx.fillStyle = "#00D4FF";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    const obstacles = obstaclesRef.current;
    obstacles.forEach((obs) => {
      if (obs.type === "spike") {
        drawSpike(ctx, obs.x, obs.y, obs.width, obs.height, obs.shapeId);
      } else {
        // Platform
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      }
    });

    // Draw score
    ctx.fillStyle = "#FFD700";
    ctx.font = "14px Orbitron";
    ctx.fillText(`Score: ${scoreRef.current}`, 20, GAME_HEIGHT - 15);
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
      x: 40,
      y: GROUND_Y - PLAYER_SIZE,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityY: 0,
      isJumping: false,
    };

    obstaclesRef.current = [
      { x: 250, y: GROUND_Y - SPIKE_HEIGHT, width: SPIKE_WIDTH, height: SPIKE_HEIGHT, type: "spike", shapeId: 0 },
      { x: 380, y: GROUND_Y - 80, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, type: "platform", shapeId: 1 },
      { x: 510, y: GROUND_Y - SPIKE_HEIGHT, width: SPIKE_WIDTH, height: SPIKE_HEIGHT, type: "spike", shapeId: 2 },
    ];

    obstacleIdRef.current = 3;
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
        ref={videoRef}
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
            <h1 className="game-title" style={{ fontSize: "8px" }}>
              GRAVITY DASH
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={toggleMute}
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
              onClick={toggleMute}
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

      <div className="relative z-10 flex-1 flex items-center justify-center gap-6 p-4">
        <div className="bg-black/80 border-4 border-cyan-400 rounded-lg p-4 text-sm w-48">
          <h3 className="text-cyan-400 font-bold mb-3 text-center">HOW TO PLAY</h3>
          <ul className="space-y-2 text-xs text-gray-200">
            <li>🎮 Press SPACE to jump</li>
            <li>⬆️ Press UP ARROW to jump</li>
            <li>🟢 Land on green to bounce</li>
            <li>🔴 Avoid red spikes</li>
            <li>📈 Survive for score</li>
            <li className="pt-2 text-center font-bold text-yellow-300">Good Luck!</li>
          </ul>
        </div>

        <div className="bg-black/80 border-4 border-yellow-400 rounded-lg p-4">
          <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} className="border-2 border-white/20" />

          {!gameActive && !gameOver && (
            <div className="mt-4 text-center">
              <p className="mb-4 text-lg">Press SPACE or UP ARROW to jump</p>
              <Button
                onClick={startGame}
                className="game-button bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-8 py-3"
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
                className="game-button bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-bold text-lg px-8 py-3"
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
