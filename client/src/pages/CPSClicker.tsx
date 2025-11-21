import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";

export default function CPSClicker() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [cps, setCps] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      const finalCPS = clicks / 10;
      setCps(parseFloat(finalCPS.toFixed(2)));
    }
  }, [isPlaying, timeLeft, clicks]);

  const handleClick = useCallback(() => {
    if (isPlaying) {
      setScore(score + 1);
      setClicks(clicks + 1);
    }
  }, [isPlaying, score, clicks]);

  const startGame = () => {
    setScore(0);
    setClicks(0);
    setTimeLeft(10);
    setCps(0);
    setIsPlaying(true);
  };

  const resetGame = () => {
    setScore(0);
    setClicks(0);
    setTimeLeft(10);
    setCps(0);
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 overflow-hidden">
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center h-full text-white px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            CPS Clicker
          </h1>
          <p className="text-xl md:text-2xl drop-shadow-md">
            Click as fast as you can!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8 min-w-[300px] md:min-w-[500px]">
          <div className="text-center mb-6">
            <div className="text-6xl md:text-8xl font-bold mb-2">{score}</div>
            <div className="text-xl md:text-2xl text-white/80">Clicks</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl md:text-4xl font-bold">{timeLeft}</div>
              <div className="text-sm md:text-base text-white/80">Seconds Left</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl md:text-4xl font-bold">{cps}</div>
              <div className="text-sm md:text-base text-white/80">CPS</div>
            </div>
          </div>

          {!isPlaying && timeLeft === 10 && (
            <Button
              onClick={startGame}
              size="lg"
              className="w-full text-xl py-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Start Game
            </Button>
          )}

          {isPlaying && (
            <Button
              onClick={handleClick}
              size="lg"
              className="w-full text-xl py-12 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform transition active:scale-95"
            >
              CLICK ME!
            </Button>
          )}

          {!isPlaying && timeLeft === 0 && (
            <div className="space-y-4">
              <div className="text-center text-2xl font-bold">
                Game Over! Your CPS: {cps}
              </div>
              <Button
                onClick={resetGame}
                size="lg"
                className="w-full text-xl py-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Play Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
