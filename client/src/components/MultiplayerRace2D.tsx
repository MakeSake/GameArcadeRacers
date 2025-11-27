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
}

const TRACK_COLORS = {
  desert: { road: '#d4a574', center: '#ffffff', lane: '#ffaa00', barrier: '#c4915d' },
  'night-city': { road: '#0a0a0a', center: '#00ffff', lane: '#ff00ff', barrier: '#ff0080' },
  mountain: { road: '#5a5a5a', center: '#ffff00', lane: '#ffffff', barrier: '#888888' },
};

const CAR_COLORS = ['#ff0000', '#0066ff', '#ffff00', '#00ff00', '#ff00ff', '#00ffff'];

export default function MultiplayerRace2D({ players, trackType }: MultiplayerRace2DProps) {
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

    // Draw road
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

    // Draw finish line
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 80, TRACK_WIDTH, 10);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < Math.ceil(TRACK_WIDTH / 25); i++) {
      if (i % 2 === 0) {
        ctx.fillRect(i * 25, 80, 12, 10);
      }
    }

    // Draw start line
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(0, TRACK_HEIGHT - 80, TRACK_WIDTH, 8);

    // Draw cars
    players.forEach((player, laneIndex) => {
      const laneCenter = (laneIndex + 0.5) * laneWidth;
      const position = (player.progress / 100) * (TRACK_HEIGHT - 160) + 120;
      const color = CAR_COLORS[laneIndex % 6];

      // Car body - larger and more visible
      ctx.fillStyle = color;
      ctx.fillRect(laneCenter - 16, position - 24, 32, 48);

      // Car cabin
      ctx.fillStyle = '#333333';
      ctx.fillRect(laneCenter - 14, position - 18, 28, 24);

      // Windshield
      ctx.fillStyle = '#4a90e2';
      ctx.globalAlpha = 0.7;
      ctx.fillRect(laneCenter - 12, position - 14, 24, 10);
      ctx.globalAlpha = 1;

      // Wheels
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(laneCenter - 8, position - 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(laneCenter + 8, position - 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(laneCenter - 8, position + 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(laneCenter + 8, position + 18, 5, 0, Math.PI * 2);
      ctx.fill();

      // Player name label
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(player.name.substring(0, 3), laneCenter, position - 35);

      // Progress percentage
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(`${Math.round(player.progress)}%`, laneCenter, 35);
    });

    // Draw track name
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    const trackNames: Record<string, string> = {
      desert: '🏜️ DESERT',
      'night-city': '🌃 NIGHT CITY',
      mountain: '⛰️ MOUNTAIN',
    };
    ctx.fillText(trackNames[trackType], 10, TRACK_HEIGHT - 8);
  }, [players, trackType]);

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
