import { useEffect, useRef } from 'react';

interface Player {
  id: string;
  name: string;
  progress: number;
  carIndex: number;
}

interface MultiplayerRace2DProps {
  players: Player[];
  trackType: 'desert' | 'night-city' | 'mountain';
  trackShape?: 'straight' | 'curved' | 'circle';
}

const TRACK_COLORS = {
  desert: { road: '#d4a574', center: '#ffffff', lane: '#ffaa00', barrier: '#c4915d' },
  'night-city': { road: '#0a0a0a', center: '#00ffff', lane: '#ff00ff', barrier: '#ff0080' },
  mountain: { road: '#5a5a5a', center: '#ffff00', lane: '#ffffff', barrier: '#888888' },
};

const CAR_COLORS = ['#ff0000', '#0066ff', '#ffff00', '#00ff00', '#ff00ff', '#00ffff'];
const CAR_NAMES = ['YOU', 'P2', 'P3', 'P4', 'P5', 'P6'];

export default function MultiplayerRace2D({ players, trackType, trackShape = 'curved' }: MultiplayerRace2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = TRACK_COLORS[trackType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || players.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TRACK_WIDTH = 400;
    const TRACK_HEIGHT = 600;
    const laneCount = Math.min(players.length, 6);
    const laneWidth = TRACK_WIDTH / laneCount;

    // Clear canvas
    ctx.fillStyle = trackType === 'night-city' ? '#0a0a2e' : '#87ceeb';
    ctx.fillRect(0, 0, TRACK_WIDTH, TRACK_HEIGHT);

    // Draw road background
    ctx.fillStyle = colors.road;
    ctx.fillRect(0, 0, TRACK_WIDTH, TRACK_HEIGHT);

    // Draw lane dividers
    ctx.strokeStyle = colors.lane;
    ctx.lineWidth = 2;
    for (let i = 1; i < laneCount; i++) {
      ctx.setLineDash([15, 25]);
      ctx.lineDashOffset = -players[0].progress * 2;
      ctx.beginPath();
      ctx.moveTo(i * laneWidth, 0);
      ctx.lineTo(i * laneWidth, TRACK_HEIGHT);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw center line (animated)
    ctx.strokeStyle = colors.center;
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 30]);
    ctx.lineDashOffset = -players[0].progress * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, TRACK_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw barriers
    ctx.fillStyle = colors.barrier;
    ctx.fillRect(0, 0, 5, TRACK_HEIGHT); // Left
    ctx.fillRect(TRACK_WIDTH - 5, 0, 5, TRACK_HEIGHT); // Right

    // Draw finish line
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 100, TRACK_WIDTH, 8);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < Math.ceil(TRACK_WIDTH / 25); i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * 25, 100, 12, 8);
      }
    }

    // Draw start line
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(0, TRACK_HEIGHT - 100, TRACK_WIDTH, 6);

    // Draw cars
    const drawCar = (progress: number, laneIndex: number, color: string, name: string) => {
      const laneCenter = (laneIndex + 0.5) * laneWidth;
      const position = (progress / 100) * (TRACK_HEIGHT - 200) + 150;

      // Car body
      ctx.fillStyle = color;
      ctx.fillRect(laneCenter - 12, position - 18, 24, 36);

      // Car cabin
      ctx.fillStyle = '#333333';
      ctx.fillRect(laneCenter - 10, position - 14, 20, 18);

      // Windshield
      ctx.fillStyle = '#4a90e2';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(laneCenter - 8, position - 11, 16, 7);
      ctx.globalAlpha = 1;

      // Wheels
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(laneCenter - 6, position - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(laneCenter + 6, position - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(laneCenter - 6, position + 13, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(laneCenter + 6, position + 13, 3, 0, Math.PI * 2);
      ctx.fill();

      // Headlights
      ctx.fillStyle = '#ffff99';
      ctx.beginPath();
      ctx.arc(laneCenter - 4, position - 20, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(laneCenter + 4, position - 20, 2, 0, Math.PI * 2);
      ctx.fill();

      // Speed glow
      if (progress > 30) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(laneCenter, position + 22, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Car label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name, laneCenter, position - 30);

      // Progress percentage
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${Math.round(progress)}%`, laneCenter, 30);
    };

    // Draw all players
    players.forEach((player, index) => {
      drawCar(player.progress, index, CAR_COLORS[index % 6], player.name.substring(0, 4).toUpperCase());
    });

    // Draw track name
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    const trackNames: Record<string, string> = {
      desert: '🏜️ DESERT',
      'night-city': '🌃 NIGHT CITY',
      mountain: '⛰️ MOUNTAIN',
    };
    ctx.fillText(trackNames[trackType], 10, TRACK_HEIGHT - 10);
  }, [players, trackType, trackShape]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900">
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
