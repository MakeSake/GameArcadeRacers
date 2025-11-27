import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw, X } from "lucide-react";

type TimeOption = 1 | 10 | 60;

export default function CPSClicker() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTime, setSelectedTime] = useState<TimeOption>(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const [cps, setCps] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setClicks(currentClicks => {
        const finalCPS = currentClicks / selectedTime;
        setCps(parseFloat(finalCPS.toFixed(2)));
        return currentClicks;
      });
      handleGameEnd();
    }
  }, [isPlaying, timeLeft, selectedTime]);

  const handleClick = useCallback(() => {
    if (isPlaying) {
      setScore(prev => prev + 1);
      setClicks(prev => prev + 1);
    }
  }, [isPlaying]);

  const handleGameEnd = () => {
    setIsPlaying(false);
    setShowResultModal(true);
  };

  useEffect(() => {
    if (timeLeft === 0 && isPlaying) {
      handleGameEnd();
    }
  }, [timeLeft, isPlaying]);

  const startGame = () => {
    setScore(0);
    setClicks(0);
    setTimeLeft(selectedTime);
    setCps(0);
    setIsPlaying(true);
  };

  const resetGame = () => {
    setScore(0);
    setClicks(0);
    setTimeLeft(selectedTime);
    setCps(0);
    setIsPlaying(false);
    setShowResultModal(false);
  };

  const getTimeLabel = (time: TimeOption) => {
    if (time === 1) return "1 Second";
    if (time === 60) return "1 Minute";
    return "10 Seconds";
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
          <h1 className="game-title mb-4">
            CPS CLICKER
          </h1>
          <p className="game-subtitle text-xl md:text-2xl drop-shadow-md">
            ⚡ CLICK AS FAST AS YOU CAN! ⚡
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

          {!isPlaying && timeLeft === selectedTime && (
            <>
              <div className="mb-6">
                <div className="text-sm md:text-base text-white/80 mb-3 text-center">Select Time</div>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 10, 60] as TimeOption[]).map((time) => (
                    <Button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setTimeLeft(time);
                      }}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={`game-button text-sm md:text-base py-3 ${
                        selectedTime === time
                          ? "bg-gradient-to-br from-purple-500 via-pink-600 to-purple-700 hover:from-purple-400 hover:via-pink-500 hover:to-purple-600 text-white shadow-lg"
                          : "bg-white/10 text-white border-white/30 hover:bg-white/20"
                      }`}
                    >
                      {getTimeLabel(time)}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="game-button w-full text-xl py-6 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 hover:from-green-400 hover:via-emerald-500 hover:to-teal-600 shadow-lg hover:shadow-green-500/50"
              >
                🎮 START GAME 🎮
              </Button>
            </>
          )}

          {isPlaying && (
            <div className="w-full h-32 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 cursor-pointer transform transition active:scale-95 flex items-center justify-center shadow-lg border-4 border-yellow-200" onClick={handleClick}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">CLICK ME!</div>
                <div className="text-sm text-white/80 mt-2">HUGE CLICK AREA</div>
              </div>
            </div>
          )}

          {!isPlaying && timeLeft === 0 && !showResultModal && (
            <div className="space-y-4">
              <div className="text-center text-2xl font-bold">
                Game Over! Your CPS: {cps}
              </div>
              <Button
                onClick={() => setShowResultModal(true)}
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

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 border-4 border-yellow-400 shadow-2xl text-center space-y-4 max-w-md w-full mx-4">
            <button
              onClick={() => setShowResultModal(false)}
              className="absolute top-4 right-4 text-white hover:text-yellow-400"
            >
              <X className="h-6 w-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-yellow-400">YOUR RESULTS</h2>
            
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-4xl font-bold text-yellow-400 mb-1">{cps}</div>
                <div className="text-lg text-white">CPS</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-2xl font-bold text-cyan-400">{clicks}</div>
                <div className="text-base text-white">Total Clicks</div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={resetGame}
                  size="lg"
                  className="game-button w-full text-lg py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 font-bold"
                >
                  🔄 TRY AGAIN
                </Button>
                
                <Button
                  onClick={() => navigate("/")}
                  size="lg"
                  className="game-button w-full text-base py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 font-bold"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
