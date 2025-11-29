import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";

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
const GROUND_LEVEL = 338;
const PLAYER_SIZE = 25;
const GAME_WIDTH = 540;
const GAME_HEIGHT = 405;

export default function GravityDash() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.8;
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0.8 : 0;
      setIsMuted(!isMuted);
    }
  };

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
  const wasGroundedRef = useRef<boolean>(false);

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
    
    // Check if currently grounded
    const isGrounded = player.y >= GROUND_LEVEL && player.velocityY >= 0;
    
    if (isGrounded) {
      // Keep player at exact ground level
      player.y = GROUND_LEVEL;
      
      // Only bounce once when just landing (transition from air to ground)
      if (!wasGroundedRef.current) {
        player.velocityY = -0.8;  // Small bounce for smoothness
      } else {
        player.velocityY = 0;  // Stay grounded
      }
      
      player.isJumping = false;
      wasGroundedRef.current = true;
    } else {
      // In the air - apply gravity
      player.velocityY += GRAVITY;
      player.y += player.velocityY;
      wasGroundedRef.current = false;
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
          // Spike collision - clamp player and game over
          player.y = Math.max(0, Math.min(player.y, obstacle.y - player.height));
          setGameOver(true);
          setGameActive(false);
          return;
        }
        // Platform collision detection
        if (obstacle.type === "platform") {
          const platformTop = obstacle.y;
          const platformBottom = obstacle.y + obstacle.height;
          
          // Landing from above (falling down)
          if (player.velocityY > 0) {
            player.y = platformTop - player.height;
            player.velocityY = -0.8;  // Small bounce
            player.isJumping = false;
            wasGroundedRef.current = true;
          } 
          // Hitting from below (jumping up)
          else if (player.velocityY < 0) {
            player.velocityY = 0;
            player.y = platformBottom;
          }
        }
      }
    }

    // Remove obstacles that passed and spawn new ones
    if (obstacles.length > 0 && obstacles[0].x < -100) {
      obstacles.shift();
      scoreRef.current += 1;
      setScore(scoreRef.current);

      const lastObstacle = obstacles[obstacles.length - 1];
      const newX = lastObstacle.x + 150;
      const randomType = Math.random() > 0.5 ? "spike" : "platform";
      const randomY = randomType === "spike" ? GROUND_LEVEL : GROUND_LEVEL - 45;

      obstacles.push({
        x: newX,
        y: randomY,
        width: 50,
        height: 15,
        type: randomType,
      });
    }

    // Scroll obstacles left (game movement)
    obstacles.forEach((obs) => {
      obs.x -= 5;
    });
  };

  // Draw spike shapes
  const drawSpike = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, type: number) => {
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    
    ctx.fillStyle = "#ff4444";
    ctx.strokeStyle = "#cc0000";
    ctx.lineWidth = 1;
    
    switch(type % 10) {
      case 0: // Tall spike
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(centerX, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 1: // Double spike
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w/2 - 2, y + h/3);
        ctx.lineTo(x + w/2, y + h);
        ctx.lineTo(x + w/2 + 2, y + h/3);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 2: // Zigzag spikes
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w/4, y);
        ctx.lineTo(x + w/2, y + h/2);
        ctx.lineTo(x + 3*w/4, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 3: // Sharp diamond
        ctx.beginPath();
        ctx.moveTo(centerX, y);
        ctx.lineTo(x + w, centerY);
        ctx.lineTo(centerX, y + h);
        ctx.lineTo(x, centerY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 4: // Saw blade
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(x + (i * w/4), y + h);
          ctx.lineTo(x + (i * w/4) + w/8, y + h/3);
          ctx.lineTo(x + ((i+1) * w/4), y + h);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        break;
      case 5: // Triangle pointing right
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, centerY);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 6: // Curved spikes
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.quadraticCurveTo(x + w/4, y, centerX, y + h/2);
        ctx.quadraticCurveTo(x + 3*w/4, y, x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 7: // Star shape
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5;
          const radius = i % 2 === 0 ? h/2 : h/4;
          const px = centerX + Math.cos(angle) * radius;
          const py = centerY + Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 8: // Spiky circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, h/3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const spikeX = centerX + Math.cos(angle) * h/2;
          const spikeY = centerY + Math.sin(angle) * h/2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(spikeX, spikeY);
          ctx.stroke();
        }
        break;
      case 9: // Jagged rectangle
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        for (let i = 0; i < w; i += 4) {
          ctx.beginPath();
          ctx.moveTo(x + i, y);
          ctx.lineTo(x + i + 2, y - 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + i, y + h);
          ctx.lineTo(x + i + 2, y + h + 2);
          ctx.stroke();
        }
        break;
      default:
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
    }
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
    
    // Draw black border on player
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    const obstacles = obstaclesRef.current;
    obstacles.forEach((obs, idx) => {
      if (obs.type === "spike") {
        drawSpike(ctx, obs.x, obs.y, obs.width, obs.height, idx);
      } else {
        // Platform - green rectangle
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      }
    });
    
    // Draw black line on top of ground for visual connection
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_LEVEL + 30);
    ctx.lineTo(GAME_WIDTH, GROUND_LEVEL + 30);
    ctx.stroke();

    // Draw score (positioned lower to avoid overlap)
    ctx.fillStyle = "#ffd700";
    ctx.font = "12px Orbitron";
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
      x: 40,
      y: GROUND_LEVEL,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityY: 0,
      isJumping: false,
    };
    obstaclesRef.current = [
      { x: 220, y: GROUND_LEVEL, width: 50, height: 15, type: "spike" },
      { x: 350, y: GROUND_LEVEL - 45, width: 50, height: 15, type: "platform" },
      { x: 480, y: GROUND_LEVEL, width: 50, height: 15, type: "spike" },
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
      className={`relative ${isFullscreen ? 'w-screen h-screen' : 'w-full h-screen'} text-white flex flex-col user-select-none overflow-hidden`}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10">
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
            <div className="flex gap-2">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 user-select-none"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 user-select-none"
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
              className="text-white hover:bg-white/20 bg-black/50 user-select-none"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
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
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center gap-6 p-4 user-select-none">
        {/* Instructions Panel */}
        <div className="bg-black/80 border-4 border-cyan-400 rounded-lg p-4 text-sm user-select-none w-48">
          <h3 className="text-cyan-400 font-bold mb-3 text-center">HOW TO PLAY</h3>
          <ul className="space-y-2 text-xs text-gray-200">
            <li>🎮 <span className="text-yellow-300">SPACE</span> to jump</li>
            <li>⬆️ <span className="text-yellow-300">UP ARROW</span> to jump</li>
            <li>🟢 Land on <span className="text-green-400">green</span> to bounce</li>
            <li>🔴 Avoid <span className="text-red-400">red spikes</span></li>
            <li>📈 Survive longer for higher scores</li>
            <li className="pt-2 text-center font-bold text-yellow-300">Good Luck!</li>
          </ul>
        </div>

        {/* Game Container */}
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
