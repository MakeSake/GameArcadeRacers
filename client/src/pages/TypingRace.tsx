import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, RotateCcw, Trophy, Zap, Volume2, VolumeX } from "lucide-react";
import Race2D from "@/components/Race2D";
import { detectDevice, getWinVideo } from "@/utils/deviceDetection";

const SAMPLE_TEXTS = [
  "speed is everything in racing fast reflexes win championships",
  "asphalt burns rubber flies high speeds demand pure skill",
  "championship racing pushes cars to extreme limits today",
  "victory awaits those who type with lightning fast speed",
  "turbocharged engines roar as champions race for glory"
];

type TrackType = 'asphalt' | 'desert' | 'night-city' | 'mountain';
type TrackShape = 'straight' | 'curved' | 'circle';

export default function TypingRace() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [targetText, setTargetText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [opponent1Progress, setOpponent1Progress] = useState(0);
  const [opponent2Progress, setOpponent2Progress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showWinVideo, setShowWinVideo] = useState(false);
  const [winner, setWinner] = useState<'player' | 'opponent1' | 'opponent2' | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackType>('desert');
  const [showTrackSelect, setShowTrackSelect] = useState(false);
  const [selectedShape, setSelectedShape] = useState<TrackShape>('curved');
  const [showShapeSelect, setShowShapeSelect] = useState(false);
  const [device, setDevice] = useState(detectDevice());
  const [difficulty, setDifficulty] = useState<'normal' | 'hard'>('normal');
  const inputRef = useRef<HTMLInputElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (bgVideoRef.current) {
      bgVideoRef.current.volume = isMuted ? 0.8 : 0;
      setIsMuted(!isMuted);
    }
  };
  const [bgVideo] = useState(() => {
    const videoIndex = Math.floor(Math.random() * 7) + 1;
    return `/videos/wide_${videoIndex}.mp4`;
  });

  useEffect(() => {
    if (targetText && isPlaying) {
      const correctChars = userInput.split("").filter((char, index) => char === targetText[index]).length;
      const progressPercent = (correctChars / targetText.length) * 100;
      setPlayerProgress(progressPercent);

      if (userInput.length > 0) {
        const accuracyPercent = (correctChars / userInput.length) * 100;
        setAccuracy(Math.round(accuracyPercent));
      }

      // Check if player finished
      if (correctChars === targetText.length && userInput === targetText && !isFinished) {
        handleFinish('player');
      }
    }
  }, [userInput, targetText, isPlaying, isFinished]);

  // AI opponents progress simulation
  useEffect(() => {
    if (isPlaying && !isFinished) {
      const interval = setInterval(() => {
        const speed = difficulty === 'hard' ? 2 : 0.3;
        const speed2 = difficulty === 'hard' ? 1.8 : 0.25;
        
        setOpponent1Progress(prev => {
          const newVal = prev + Math.random() * speed;
          if (newVal >= 100 && winner === null) {
            handleFinish('opponent1');
          }
          return Math.min(newVal, 100);
        });

        setOpponent2Progress(prev => {
          const newVal = prev + Math.random() * speed2;
          if (newVal >= 100 && winner === null) {
            handleFinish('opponent2');
          }
          return Math.min(newVal, 100);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, isFinished, winner, difficulty]);

  const handleFinish = (finishedBy: 'player' | 'opponent1' | 'opponent2') => {
    if (!isFinished && winner === null) {
      setIsFinished(true);
      setIsPlaying(false);
      setWinner(finishedBy);
      const end = Date.now();
      setEndTime(end);

      if (finishedBy === 'player') {
        // Mute background video when player wins
        if (bgVideoRef.current) {
          bgVideoRef.current.volume = 0;
        }
        // Show win video only when player wins
        setShowWinVideo(true);
        
        if (startTime) {
          const timeInMinutes = (end - startTime) / 1000 / 60;
          const words = targetText.split(" ").length;
          const calculatedWpm = Math.round(words / timeInMinutes);
          setWpm(calculatedWpm);
        }
      }
    }
  };

  const startGame = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setTargetText(randomText);
    setUserInput("");
    setIsPlaying(true);
    setIsFinished(false);
    setPlayerProgress(0);
    setOpponent1Progress(0);
    setOpponent2Progress(0);
    setStartTime(Date.now());
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setShowWinVideo(false);
    setWinner(null);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const resetGame = () => {
    setTargetText("");
    setUserInput("");
    setIsPlaying(false);
    setIsFinished(false);
    setPlayerProgress(0);
    setOpponent1Progress(0);
    setOpponent2Progress(0);
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setShowWinVideo(false);
    setWinner(null);
    setShowTrackSelect(false);
    // Restore background video volume
    if (bgVideoRef.current) {
      bgVideoRef.current.volume = 1;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlaying && !isFinished) {
      setUserInput(e.target.value);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={bgVideoRef}
        autoPlay
        loop
        playsInline
        key={bgVideo}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      {showWinVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              autoPlay
              onEnded={() => setShowWinVideo(false)}
              className="w-full h-full object-contain"
            >
              <source src={getWinVideo()} type="video/mp4" />
            </video>
            <Button
              onClick={() => setShowWinVideo(false)}
              className="game-button absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-2 border-white"
            >
              ✕ Skip
            </Button>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Button
          onClick={toggleMute}
          className="game-button px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-2 border-red-300 shadow-lg"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="game-button bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white cursor-pointer border-2"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>

      <div className="flex flex-col h-full p-4 md:p-8 text-white relative z-10">
        <div className="text-center mb-3">
          <h1 className="game-title mb-1 flex items-center justify-center gap-2 text-2xl md:text-3xl">
            <Zap className="text-yellow-400 animate-bounce h-5 w-5" />
            TURBO CHAMPIONS
            <Zap className="text-yellow-400 animate-bounce h-5 w-5" />
          </h1>
          <p className="game-subtitle text-xs md:text-sm drop-shadow-md text-yellow-300">
            🏁 TYPE FAST! BEAT THE AI! 🏁
          </p>
        </div>

        {/* 2D Racing Scene */}
        <div className="flex-1 bg-gradient-to-b from-sky-600 via-blue-700 to-slate-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400 mb-6 relative">
          <Race2D 
            playerProgress={playerProgress}
            opponent1Progress={opponent1Progress}
            opponent2Progress={opponent2Progress}
            trackType={selectedTrack}
            trackShape={selectedShape}
            playerCount={3}
          />
          
          {/* Difficulty & Track Selection Overlay */}
          {!isPlaying && !isFinished && (
            <div className="absolute top-4 right-4 z-20 flex gap-2 flex-wrap justify-end">
              <Button
                onClick={() => setDifficulty(difficulty === 'normal' ? 'hard' : 'normal')}
                className={`game-button px-4 py-2 text-white border-2 shadow-lg text-sm ${
                  difficulty === 'hard' 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-300 hover:from-red-500 hover:to-red-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 border-green-300 hover:from-green-400 hover:to-green-500'
                }`}
              >
                ⚡ {difficulty.toUpperCase()}
              </Button>
              
              <Button
                onClick={() => setShowTrackSelect(!showTrackSelect)}
                className="game-button px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white border-2 border-yellow-300 shadow-lg text-sm"
              >
                🛣️ {selectedTrack.toUpperCase()}
              </Button>
              
              {showTrackSelect && (
                <div className="absolute top-12 right-0 bg-black/90 backdrop-blur rounded-lg p-3 border border-white/30 w-48 max-h-64 overflow-y-auto space-y-2 z-50">
                  {(['desert', 'night-city', 'mountain'] as TrackType[]).map(track => (
                    <Button
                      key={track}
                      onClick={() => {
                        setSelectedTrack(track);
                        setShowTrackSelect(false);
                      }}
                      className={`w-full text-left justify-start text-sm ${selectedTrack === track ? 'bg-yellow-500 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                      {track === 'desert' && '🏜️ Desert'}
                      {track === 'night-city' && '🌃 Night City'}
                      {track === 'mountain' && '⛰️ Mountain'}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Race Info */}
        {isPlaying && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-red-500/30 backdrop-blur rounded-lg p-4 border border-red-400">
              <div className="text-sm text-gray-200">YOU (Red)</div>
              <div className="text-3xl font-bold">{Math.round(playerProgress)}%</div>
              <div className="w-full bg-black/30 h-2 rounded mt-2">
                <div className="bg-red-500 h-full rounded transition-all" style={{ width: `${playerProgress}%` }} />
              </div>
            </div>
            <div className="bg-blue-500/30 backdrop-blur rounded-lg p-4 border border-blue-400">
              <div className="text-sm text-gray-200">OPPONENT 1 (Blue)</div>
              <div className="text-3xl font-bold">{Math.round(opponent1Progress)}%</div>
              <div className="w-full bg-black/30 h-2 rounded mt-2">
                <div className="bg-blue-500 h-full rounded transition-all" style={{ width: `${opponent1Progress}%` }} />
              </div>
            </div>
            <div className="bg-yellow-500/30 backdrop-blur rounded-lg p-4 border border-yellow-400">
              <div className="text-sm text-gray-200">OPPONENT 2 (Yellow)</div>
              <div className="text-3xl font-bold">{Math.round(opponent2Progress)}%</div>
              <div className="w-full bg-black/30 h-2 rounded mt-2">
                <div className="bg-yellow-500 h-full rounded transition-all" style={{ width: `${opponent2Progress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Text to Type */}
        {!isPlaying && !isFinished && (
          <div className="text-center">
            <Button
              onClick={startGame}
              size="lg"
              className="game-button text-3xl py-8 px-20 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 hover:from-yellow-300 hover:via-orange-400 hover:to-red-500 text-white font-bold shadow-2xl hover:shadow-orange-500/50 border-2 border-yellow-200"
            >
              🏁 START RACE 🏁
            </Button>
          </div>
        )}

        {isPlaying && (
          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <p className="text-xs font-mono text-gray-300 mb-1">TYPE THE TEXT TO MOVE YOUR CAR:</p>
              <div className="bg-black/30 rounded-lg p-2 font-mono text-xs leading-relaxed mb-2 max-h-20 overflow-hidden">
                {targetText.split("").map((char, index) => {
                  let className = "text-gray-400";
                  if (index < userInput.length) {
                    className = userInput[index] === char ? "text-green-400 font-bold" : "text-red-400 font-bold";
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
                className="w-full text-xs p-2 bg-white/20 text-white placeholder-gray-400 border-2 border-yellow-400"
                placeholder="Start typing here..."
                autoFocus
              />
              <div className="mt-2 flex justify-between text-xs">
                <span>Accuracy: <span className="text-green-400 font-bold">{accuracy}%</span></span>
                <span>Progress: <span className="text-blue-400 font-bold">{Math.round(playerProgress)}%</span></span>
              </div>
            </div>
          </div>
        )}

        {isFinished && winner !== 'player' && (
          <div className="bg-red-600/40 backdrop-blur-md rounded-xl p-8 border-4 border-red-400 text-center space-y-4">
            <div className="text-8xl">😭</div>
            <h2 className="text-4xl font-bold text-red-300">
              TOO WEAK!
            </h2>
            <p className="text-3xl text-red-200 font-mono">
              It would take you 200 YEARS to win...
            </p>
            <Button
              onClick={resetGame}
              size="lg"
              className="game-button text-xl py-6 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold shadow-lg hover:shadow-cyan-500/50"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              TRY AGAIN
            </Button>
          </div>
        )}

        {isFinished && winner === 'player' && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border-4 border-yellow-400 text-center space-y-4">
            <Trophy className="mx-auto h-20 w-20 text-yellow-400" />
            <h2 className="text-4xl font-bold">
              🎉 YOU WIN! 🎉
            </h2>
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-4xl font-bold text-green-400">{wpm}</div>
                <div className="text-sm text-gray-300">WPM</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-4xl font-bold text-green-400">{accuracy}%</div>
                <div className="text-sm text-gray-300">Accuracy</div>
              </div>
            </div>
            <Button
              onClick={resetGame}
              size="lg"
              className="game-button text-xl py-6 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold shadow-lg hover:shadow-cyan-500/50"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              RACE AGAIN
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
