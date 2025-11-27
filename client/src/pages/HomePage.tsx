import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, MousePointerClick, Keyboard } from "lucide-react";
import ParticleAura from "@/components/ParticleAura";

export default function HomePage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.8;
    }
  }, []);

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

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <div className="text-center mb-12">
          <h1 className="game-title mb-4 text-3d-rotate">
            GAME HUB
          </h1>
          <p className="game-subtitle text-xl md:text-2xl drop-shadow-md text-3d-rotate-reverse">
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
        </div>
      </div>
    </div>
  );
}
