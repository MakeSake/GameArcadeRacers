import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Race2DProps {
  playerProgress: number;
  opponent1Progress: number;
  opponent2Progress: number;
  trackType: 'asphalt' | 'desert' | 'night-city' | 'mountain';
}

const TRACK_WIDTH = 400;
const TRACK_HEIGHT = 600;

const TRACK_COLORS = {
  asphalt: { road: '#0a0a0a', center: '#ffff00', lane: '#ffffff', barrier: '#ff0000' },
  desert: { road: '#d4a574', center: '#ffffff', lane: '#ffaa00', barrier: '#c4915d' },
  'night-city': { road: '#0a0a0a', center: '#00ffff', lane: '#ff00ff', barrier: '#ff0080' },
  mountain: { road: '#5a5a5a', center: '#ffff00', lane: '#ffffff', barrier: '#888888' },
};

export default function Race2D({ playerProgress, opponent1Progress, opponent2Progress, trackType }: Race2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = TRACK_COLORS[trackType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = trackType === 'night-city' ? '#0a0a2e' : '#87ceeb';
    ctx.fillRect(0, 0, TRACK_WIDTH, TRACK_HEIGHT);

    // Draw road
    ctx.fillStyle = colors.road;
    ctx.fillRect(50, 0, 300, TRACK_HEIGHT);

    // Draw lane dividers (animated)
    ctx.strokeStyle = colors.center;
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 30]);
    ctx.lineDashOffset = -playerProgress * 2;
    ctx.beginPath();
    ctx.moveTo(TRACK_WIDTH / 2, 0);
    ctx.lineTo(TRACK_WIDTH / 2, TRACK_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw left lane marker
    ctx.strokeStyle = colors.lane;
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 25]);
    ctx.lineDashOffset = -playerProgress * 2;
    ctx.beginPath();
    ctx.moveTo(120, 0);
    ctx.lineTo(120, TRACK_HEIGHT);
    ctx.stroke();

    // Draw right lane marker
    ctx.beginPath();
    ctx.moveTo(280, 0);
    ctx.lineTo(280, TRACK_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw barriers
    ctx.fillStyle = colors.barrier;
    ctx.fillRect(40, 0, 10, TRACK_HEIGHT); // Left
    ctx.fillRect(350, 0, 10, TRACK_HEIGHT); // Right

    // Draw finish line
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(50, 100, 300, 8);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 12; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(50 + i * 25, 100, 12, 8);
      }
    }

    // Draw start line
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(50, TRACK_HEIGHT - 100, 300, 6);

    // Draw cars as attractive 2D sprites
    const drawCar = (progress: number, lane: number, color: string, name: string) => {
      const position = (progress / 100) * (TRACK_HEIGHT - 200) + 150;
      
      // Car body
      ctx.fillStyle = color;
      ctx.fillRect(lane - 15, position - 20, 30, 40);
      
      // Car cabin
      ctx.fillStyle = '#333333';
      ctx.fillRect(lane - 12, position - 15, 24, 20);
      
      // Windshield
      ctx.fillStyle = '#4a90e2';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(lane - 10, position - 12, 20, 8);
      ctx.globalAlpha = 1;
      
      // Wheels
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(lane - 8, position - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lane + 8, position - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lane - 8, position + 15, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lane + 8, position + 15, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Headlights
      ctx.fillStyle = '#ffff99';
      ctx.beginPath();
      ctx.arc(lane - 6, position - 22, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lane + 6, position - 22, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Speed effect glow
      if (progress > 30) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(lane, position + 25, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Car label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name, lane, position - 35);
    };

    // Draw player car (center lane)
    drawCar(playerProgress, TRACK_WIDTH / 2, '#ff0000', 'YOU');

    // Draw opponent 1 (left lane)
    drawCar(opponent1Progress, 120, '#0066ff', 'OPP1');

    // Draw opponent 2 (right lane)
    drawCar(opponent2Progress, 280, '#ffff00', 'OPP2');

    // Draw progress percentage above cars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(playerProgress)}%`, TRACK_WIDTH / 2, 30);
    ctx.fillText(`${Math.round(opponent1Progress)}%`, 120, 30);
    ctx.fillText(`${Math.round(opponent2Progress)}%`, 280, 30);

    // Draw track name in corner
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    const trackNames: Record<string, string> = {
      asphalt: '🏁 ASPHALT',
      desert: '🏜️ DESERT',
      'night-city': '🌃 NIGHT CITY',
      mountain: '⛰️ MOUNTAIN',
    };
    ctx.fillText(trackNames[trackType], 55, TRACK_HEIGHT - 10);
  }, [playerProgress, opponent1Progress, opponent2Progress, trackType, colors]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900">
      <canvas
        ref={canvasRef}
        width={TRACK_WIDTH}
        height={TRACK_HEIGHT}
        className="border-4 border-yellow-400 rounded-lg shadow-2xl"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}
