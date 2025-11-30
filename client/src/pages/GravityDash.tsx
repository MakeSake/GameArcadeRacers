import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";

export default function GravityDash() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = document.querySelector("[data-fullscreen-container]") as HTMLElement;
    if (!container) return;

    if (!isFullscreen) {
      const requestFullscreen = container.requestFullscreen || 
        (container as any).webkitRequestFullscreen || 
        (container as any).mozRequestFullScreen || 
        (container as any).msRequestFullscreen;
      
      if (requestFullscreen) {
        requestFullscreen.call(container).catch(() => {
          console.error("Fullscreen request failed");
        });
      }
    } else {
      const exitFullscreen = document.exitFullscreen || 
        (document as any).webkitExitFullscreen || 
        (document as any).mozCancelFullScreen || 
        (document as any).msExitFullscreen;
      
      if (exitFullscreen) {
        exitFullscreen.call(document).catch(() => {
          console.error("Exit fullscreen failed");
        });
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      data-fullscreen-container
      className={`relative text-white flex flex-col user-select-none overflow-hidden ${
        isFullscreen ? "w-screen h-screen" : "w-full h-screen"
      }`}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10">
        {!isFullscreen && (
          <div className="flex items-center justify-between p-4 bg-black/60">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            <h1 className="game-title" style={{ fontSize: "8px" }}>
              GRAVITY DASH
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
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
              className="text-white hover:bg-white/20 bg-black/60"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 bg-black/60"
            >
              ✕ Exit
            </Button>
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
        <iframe
          ref={iframeRef}
          src="/gravity-dash-game.html"
          className="w-full h-full border-0"
          title="Gravity Dash Game"
          style={{ 
            opacity: isMuted ? 0.7 : 1,
          }}
        />
      </div>
    </div>
  );
}
