import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Race2DProps {
  playerProgress: number;
  opponent1Progress: number;
  opponent2Progress: number;
  trackType: 'asphalt' | 'desert' | 'night-city' | 'mountain';
  trackShape?: 'straight' | 'curved' | 'circle';
  playerCount?: number;
}

const TRACK_COLORS = {
  asphalt: { road: '#1a1a1a', center: '#ffff00', lane: '#ffffff', barrier: '#ff0000', background: '#87ceeb' },
  desert: { road: '#c4915d', center: '#ffffff', lane: '#ffaa00', barrier: '#ff0000', background: '#f4e4c1' },
  'night-city': { road: '#0a0a2e', center: '#00ffff', lane: '#ff00ff', barrier: '#ff0080', background: '#1a1a3e' },
  mountain: { road: '#4a4a4a', center: '#ffff00', lane: '#ffffff', barrier: '#ff0000', background: '#8b7d9e' },
};

function drawInfinityLoop(ctx: CanvasRenderingContext2D, width: number, height: number, playerCount: number = 3) {
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Determine lane width and count based on player count
  const laneCount = Math.max(3, Math.min(playerCount, 6));
  const roadWidth = Math.min(280, 80 + laneCount * 20);
  const laneWidth = roadWidth / laneCount;
  
  // Draw infinity loop path - figure-8 shape
  const amplitude = height * 0.35;
  const frequency = 0.01;
  
  // Create path for outer border
  const outerPath = new Path2D();
  const innerPath = new Path2D();
  
  // Draw two connected circles for infinity loop
  const leftCircleX = centerX - 80;
  const rightCircleX = centerX + 80;
  const radius = 100;
  
  // Outer track (wider)
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(leftCircleX, centerY, radius + roadWidth/2, 0, Math.PI * 2);
  ctx.arc(rightCircleX, centerY, radius + roadWidth/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner track
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(leftCircleX, centerY, radius - roadWidth/2, 0, Math.PI * 2);
  ctx.arc(rightCircleX, centerY, radius - roadWidth/2, 0, Math.PI * 2);
  ctx.fill();
}

function drawRedWhiteBarrier(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const leftCircleX = centerX - 80;
  const rightCircleX = centerX + 80;
  const radius = 100;
  const barWidth = 140;
  
  // Red and white striped outer barriers
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 8;
  
  // Draw striped pattern for outer barriers
  for (let i = 0; i < 2; i++) {
    const x = (i === 0 ? leftCircleX : rightCircleX);
    const outerRadius = radius + barWidth / 2 + 5;
    
    // Dashed circle for outer barrier
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(x, centerY, outerRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.setLineDash([]);
}

function drawLaneMarkers(ctx: CanvasRenderingContext2D, width: number, height: number, playerCount: number = 3, progress: number = 0) {
  const centerX = width / 2;
  const centerY = height / 2;
  const leftCircleX = centerX - 80;
  const rightCircleX = centerX + 80;
  const radius = 100;
  
  const laneCount = Math.max(3, Math.min(playerCount, 6));
  const roadWidth = Math.min(280, 80 + laneCount * 20);
  
  // Draw lane dividers as dashed lines
  for (let i = 1; i < laneCount; i++) {
    const offsetX = roadWidth / 2 - (roadWidth / laneCount) * i;
    
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 15]);
    ctx.lineDashOffset = -progress;
    
    // Draw lane dividers on both circles
    for (let circleIdx = 0; circleIdx < 2; circleIdx++) {
      const x = circleIdx === 0 ? leftCircleX : rightCircleX;
      
      // Vertical lane dividers
      ctx.beginPath();
      ctx.moveTo(x + offsetX, centerY - radius);
      ctx.lineTo(x + offsetX, centerY + radius);
      ctx.stroke();
    }
  }
  
  ctx.setLineDash([]);
}

function drawCheckeredFinishLine(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const checkSize = 8;
  
  for (let i = 0; i < width / checkSize; i++) {
    for (let j = 0; j < height / checkSize; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.fillRect(x + i * checkSize, y + j * checkSize, checkSize, checkSize);
    }
  }
}

export default function Race2D({ playerProgress, opponent1Progress, opponent2Progress, trackType, trackShape = 'curved', playerCount = 3 }: Race2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = TRACK_COLORS[trackType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with background color
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Draw infinity loop track
    drawInfinityLoop(ctx, width, height, playerCount);
    drawRedWhiteBarrier(ctx, width, height);
    drawLaneMarkers(ctx, width, height, playerCount, playerProgress * 2);

    // Draw finish line at top
    ctx.fillStyle = '#00dd00';
    ctx.fillRect(width / 2 - 60, 15, 120, 15);
    drawCheckeredFinishLine(ctx, width / 2 - 60, 15, 120, 15);

    // Draw start line at bottom
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(width / 2 - 60, height - 30, 120, 15);

    // Draw time/score display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('RE B', 20, 25);
    ctx.font = 'bold 20px Arial';
    ctx.fillText('0:00', 20, 50);

    // Draw progress percentage for each player
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#ffff00';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(playerProgress)}%`, width / 2 - 80, 30);
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`${Math.round(opponent1Progress)}%`, width / 2, 30);
    ctx.fillStyle = '#00ff00';
    ctx.fillText(`${Math.round(opponent2Progress)}%`, width / 2 + 80, 30);

    // Draw cars on the track as colored squares
    const drawCar = (progress: number, laneIndex: number, color: string) => {
      const centerX = width / 2;
      const centerY = height / 2;
      const leftCircleX = centerX - 80;
      const radius = 100;
      
      // Calculate position along the circular path
      const angle = (progress / 100) * Math.PI * 2;
      const x = leftCircleX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw car as colored square
      const carSize = 18;
      ctx.fillStyle = color;
      ctx.fillRect(x - carSize / 2, y - carSize / 2, carSize, carSize);
      
      // Add border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - carSize / 2, y - carSize / 2, carSize, carSize);
    };

    // Draw cars
    drawCar(playerProgress, 0, '#ffff00');
    drawCar(opponent1Progress, 1, '#ff0000');
    drawCar(opponent2Progress, 2, '#00ff00');

  }, [playerProgress, opponent1Progress, opponent2Progress, trackType, colors, playerCount]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        className="border-4 border-yellow-400 rounded-lg shadow-2xl"
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}
