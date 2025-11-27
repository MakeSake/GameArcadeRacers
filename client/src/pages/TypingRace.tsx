import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, RotateCcw, Trophy } from "lucide-react";
import RaceTrack3D from "@/components/RaceTrack3D";

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog and runs through the forest.",
  "Practice makes perfect when you type with accuracy and speed every single day.",
  "Racing against time requires focus, determination, and lightning fast fingers.",
  "Champions are made through dedication, practice, and never giving up on dreams.",
  "Type like the wind and let your fingers dance across the keyboard smoothly."
];

export default function TypingRace() {
  const navigate = useNavigate();
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showWinVideo, setShowWinVideo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (targetText) {
      const correctChars = userInput.split("").filter((char, index) => char === targetText[index]).length;
      const progressPercent = (correctChars / targetText.length) * 100;
      setProgress(progressPercent);

      if (userInput.length > 0) {
        const accuracyPercent = (correctChars / userInput.length) * 100;
        setAccuracy(Math.round(accuracyPercent));
      }

      if (correctChars === targetText.length && userInput === targetText) {
        handleFinish();
      }
    }
  }, [userInput, targetText]);

  const handleFinish = () => {
    if (!isFinished) {
      const end = Date.now();
      setEndTime(end);
      setIsFinished(true);
      setIsPlaying(false);
      setShowWinVideo(true);

      if (startTime) {
        const timeInMinutes = (end - startTime) / 1000 / 60;
        const words = targetText.split(" ").length;
        const calculatedWpm = Math.round(words / timeInMinutes);
        setWpm(calculatedWpm);
      }
    }
  };

  const startGame = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setTargetText(randomText);
    setUserInput("");
    setIsPlaying(true);
    setIsFinished(false);
    setProgress(0);
    setStartTime(Date.now());
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setShowWinVideo(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const resetGame = () => {
    setTargetText("");
    setUserInput("");
    setIsPlaying(false);
    setIsFinished(false);
    setProgress(0);
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setShowWinVideo(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlaying && !isFinished) {
      setUserInput(e.target.value);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-800 overflow-hidden">
      {showWinVideo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative">
            <video
              autoPlay
              onEnded={() => setShowWinVideo(false)}
              className="max-w-full max-h-screen"
            >
              <source src="/videos/win1.mp4" type="video/mp4" />
            </video>
            <Button
              onClick={() => setShowWinVideo(false)}
              className="absolute top-4 right-4"
              variant="outline"
            >
              Skip
            </Button>
          </div>
        </div>
      )}

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
            Typing Race
          </h1>
          <p className="text-xl md:text-2xl drop-shadow-md">
            Single Player Mode
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8 w-full max-w-4xl">
          <div className="mb-6">
            <div className="relative w-full h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>Progress: {Math.round(progress)}%</span>
              <span>Accuracy: {accuracy}%</span>
            </div>
          </div>

          {!isPlaying && !isFinished && (
            <div className="text-center">
              <Button
                onClick={startGame}
                size="lg"
                className="text-xl py-6 px-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                Start Race
              </Button>
            </div>
          )}

          {isPlaying && (
            <div>
              <div className="bg-white/5 rounded-lg p-6 mb-4 font-mono text-lg leading-relaxed">
                {targetText.split("").map((char, index) => {
                  let className = "text-white/50";
                  if (index < userInput.length) {
                    className = userInput[index] === char ? "text-green-400" : "text-red-400";
                  }
                  return (
                    <span key={index} className={className}>
                      {char}
                    </span>
                  );
                })}
              </div>

              <Input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full text-lg p-4 bg-white/90 text-black"
                placeholder="Start typing here..."
                autoFocus
              />

              {/* 3D Racing Scene */}
              <div className="mt-6 relative w-full h-96 bg-gradient-to-b from-sky-400 to-blue-600 rounded-lg overflow-hidden shadow-2xl border-4 border-yellow-400">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading Race Track...</div>}>
                  <RaceTrack3D progress={progress} />
                </Suspense>
                <div className="absolute bottom-2 left-2 text-xs text-white font-mono bg-black/50 px-2 py-1 rounded">
                  Progress: {Math.round(progress)}% | Speed: {Math.round(progress * 2)} km/h
                </div>
              </div>
            </div>
          )}

          {isFinished && (
            <div className="text-center space-y-4">
              <Trophy className="mx-auto h-16 w-16 text-yellow-400" />
              <h2 className="text-3xl font-bold">Race Complete!</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-4xl font-bold">{wpm}</div>
                  <div className="text-sm text-white/80">WPM</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-4xl font-bold">{accuracy}%</div>
                  <div className="text-sm text-white/80">Accuracy</div>
                </div>
              </div>
              <Button
                onClick={resetGame}
                size="lg"
                className="text-xl py-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Race Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
