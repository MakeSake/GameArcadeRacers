import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function ParticleAura() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 150;

    let animationId: number;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new particles occasionally
      if (Math.random() > 0.7) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;

        particlesRef.current.push({
          x: centerX + Math.cos(angle) * 50,
          y: centerY + Math.sin(angle) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 1,
          maxLife: 1,
        });
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.02;

        if (p.life > 0) {
          const alpha = Math.min(p.life, 0.5);
          ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ height: '150px' }}
    />
  );
}
