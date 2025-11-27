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
  desert: { bg: '#c9a96a', road: '#8b7355', grass: '#a4a050' },
  'night-city': { bg: '#1a1a2e', road: '#16213e', grass: '#0f3460' },
  mountain: { bg: '#8b8680', road: '#5a5a5a', grass: '#6b7a6b' },
};

const CAR_EMOJIS = ['🏎️', '🚗', '🚕', '🚙', '🏍️', '🚓'];

export default function MultiplayerRace2D({ players, trackType }: MultiplayerRace2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colors = TRACK_COLORS[trackType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || players.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const WIDTH = 500;
    const HEIGHT = 350;

    // Clear canvas with background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw grass areas
    ctx.fillStyle = colors.grass;
    ctx.fillRect(0, 0, 60, HEIGHT);
    ctx.fillRect(WIDTH - 60, 0, 60, HEIGHT);

    // Draw winding road path (S-curve)
    const roadWidth = 80;
    ctx.fillStyle = colors.road;
    
    // Top straight section
    ctx.fillRect(60, 0, roadWidth, 80);
    
    // First curve
    ctx.beginPath();
    ctx.arc(60 + roadWidth / 2, 100, roadWidth / 2, -Math.PI / 2, 0, false);
    ctx.fill();
    
    // Middle section
    ctx.fillRect(120, 80, 50, 80);
    ctx.fillRect(60, 160, 50, 80);
    
    // Second curve back
    ctx.beginPath();
    ctx.arc(60 + roadWidth / 2, 180, roadWidth / 2, 0, Math.PI / 2, false);
    ctx.fill();
    
    // Bottom straight
    ctx.fillRect(60, 240, roadWidth, HEIGHT - 240);

    // Draw road markings (dashed center line)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    
    // Draw marking along the path
    for (let i = 0; i < HEIGHT; i += 30) {
      ctx.beginPath();
      ctx.moveTo(100, i);
      ctx.lineTo(100, i + 15);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw start line
    ctx.fillStyle = '#ffaa00';
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(60 + (i * 8), 0, 8, 15);
      }
    }

    // Draw finish line
    ctx.fillStyle = '#00ff00';
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        ctx.fillRect(60 + (i * 8), HEIGHT - 15, 8, 15);
      }
    }

    // Draw players along the path
    players.forEach((player, idx) => {
      const progressPercent = player.progress / 100;
      
      // Calculate position along the winding path
      let x, y;
      if (progressPercent < 0.25) {
        // Top straight
        x = 100;
        y = progressPercent * 4 * 80;
      } else if (progressPercent < 0.5) {
        // First curve
        const curveProgress = (progressPercent - 0.25) * 4;
        x = 100 + (roadWidth / 2) * Math.sin(curveProgress * Math.PI / 2);
        y = 80 + (roadWidth / 2) * (1 - Math.cos(curveProgress * Math.PI / 2));
      } else if (progressPercent < 0.75) {
        // Middle section
        x = 85 - (progressPercent - 0.5) * 4 * 25;
        y = 160 + (progressPercent - 0.5) * 4 * 80;
      } else {
        // Bottom straight
        x = 85;
        y = 240 + (progressPercent - 0.75) * 4 * (HEIGHT - 240);
      }

      // Draw car emoji
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(CAR_EMOJIS[idx % 6], x, y);

      // Draw player name with background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x - 30, y + 20, 60, 18);
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 11px Arial';
      ctx.fillText(player.name.substring(0, 6), x, y + 30);

      // Draw progress percentage
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(`${Math.round(player.progress)}%`, x, y - 25);
    });

    // Draw track label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '13px Arial';
    ctx.textAlign = 'left';
    const trackNames: Record<string, string> = {
      desert: '🏜️ DESERT RACE',
      'night-city': '🌃 NIGHT CITY RACE',
      mountain: '⛰️ MOUNTAIN RACE',
    };
    ctx.fillText(trackNames[trackType], 10, 25);
  }, [players, trackType]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black p-2">
      <canvas
        ref={canvasRef}
        width={500}
        height={350}
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
