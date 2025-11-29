import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, MousePointerClick, Keyboard, Volume2, VolumeX, Zap } from "lucide-react";
import ParticleAura from "@/components/ParticleAura";

export default function HomePage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
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

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      <ParticleAura />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={toggleMute}
          className="game-button px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-2 border-red-300 shadow-lg"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <div className="text-center mb-12">
          <h1 className="game-title mb-4 text-3d-rotate" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 100, 0, 0.6), 0 0 60px rgba(255, 50, 0, 0.2)' }}>
            GAME HUB
          </h1>
          <p className="game-subtitle text-xl md:text-2xl drop-shadow-md text-3d-rotate-reverse" style={{ textShadow: '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 100, 0, 0.4)' }}>
            ⚡ CHOOSE YOUR CHALLENGE ⚡
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <Button
            size="lg"
            onClick={() => navigate("/cps-clicker")}
            className="game-button text-lg px-10 py-8 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 hover:from-purple-400 hover:via-purple-500 hover:to-pink-500 shadow-2xl transform transition-all duration-300 hover:shadow-purple-500/50"
          >
            <MousePointerClick className="mr-4 h-7 w-7" />
            CPS CLICKER
          </Button>

          <Button
            size="lg"
            onClick={() => navigate("/typing-race")}
            className="game-button text-lg px-10 py-8 bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-700 hover:from-cyan-400 hover:via-blue-500 hover:to-blue-600 shadow-2xl transform transition-all duration-300 hover:shadow-blue-500/50"
          >
            <Keyboard className="mr-4 h-7 w-7" />
            TURBO RACE
          </Button>

          <Button
            size="lg"
            onClick={() => navigate("/multiplayer-race")}
            className="game-button text-lg px-10 py-8 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 hover:from-green-400 hover:via-emerald-500 hover:to-teal-600 shadow-2xl transform transition-all duration-300 hover:shadow-green-500/50"
          >
            <Gamepad2 className="mr-4 h-7 w-7" />
            MULTIPLAYER
          </Button>

          <Button
            size="lg"
            onClick={() => navigate("/gravity-dash")}
            className="game-button text-lg px-10 py-8 bg-gradient-to-br from-orange-500 via-red-600 to-red-700 hover:from-orange-400 hover:via-red-500 hover:to-red-600 shadow-2xl transform transition-all duration-300 hover:shadow-red-500/50"
          >
            <Zap className="mr-4 h-7 w-7" />
            GRAVITY DASH
          </Button>
        </div>
      </div>
    </div>
  );
}
