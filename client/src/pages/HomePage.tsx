import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, MousePointerClick, Keyboard } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.3;
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

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 drop-shadow-lg">
            Game Hub
          </h1>
          <p className="text-xl md:text-2xl drop-shadow-md">
            Choose Your Challenge
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Button
            size="lg"
            onClick={() => navigate("/cps-clicker")}
            className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl transform transition hover:scale-105"
          >
            <MousePointerClick className="mr-3 h-6 w-6" />
            CPS Clicker
          </Button>

          <Button
            size="lg"
            onClick={() => navigate("/typing-race")}
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-2xl transform transition hover:scale-105"
          >
            <Keyboard className="mr-3 h-6 w-6" />
            Typing Race
          </Button>

          <Button
            size="lg"
            onClick={() => navigate("/multiplayer-race")}
            className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-2xl transform transition hover:scale-105"
          >
            <Gamepad2 className="mr-3 h-6 w-6" />
            Multiplayer Race
          </Button>
        </div>
      </div>
    </div>
  );
}
