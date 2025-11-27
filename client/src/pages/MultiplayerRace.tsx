import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Users, Trophy, Volume2, VolumeX } from "lucide-react";
import { io, Socket } from "socket.io-client";
import QRCodeScanner from "@/components/QRCodeScanner";
import Race2D from "@/components/Race2D";
import { getWinVideo } from "@/utils/deviceDetection";

interface Player {
  id: string;
  name: string;
  progress: number;
  finished: boolean;
  carIndex: number;
}

interface GameState {
  players: Player[];
  targetText: string;
  isStarted: boolean;
  winner: Player | null;
}

type TrackType = 'desert' | 'night-city' | 'mountain';

const CAR_EMOJIS = ["🏎️", "🚗", "🚕", "🚙", "🏍️", "🚓"];

export default function MultiplayerRace() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    targetText: "",
    isStarted: false,
    winner: null,
  });
  const [userInput, setUserInput] = useState("");
  const [myPlayerId, setMyPlayerId] = useState("");
  const [showWinVideo, setShowWinVideo] = useState(false);
  const [winnerCarIndex, setWinnerCarIndex] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<TrackType>('desert');
  const [showTrackSelect, setShowTrackSelect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [bgVideo] = useState(() => {
    const videoIndex = Math.floor(Math.random() * 7) + 1;
    return `/videos/wide_${videoIndex}.mp4`;
  });

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0.8 : 0;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setMyPlayerId(newSocket.id || "");
    });

    newSocket.on("gameState", (state: GameState) => {
      setGameState(state);
    });

    newSocket.on("gameStarted", (state: GameState) => {
      setGameState(state);
      setUserInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
    });

    newSocket.on("playerProgress", ({ playerId, progress }: { playerId: string; progress: number }) => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, progress } : p
        ),
      }));
    });

    newSocket.on("playerFinished", ({ playerId }: { playerId: string }) => {
      setGameState((prev) => ({
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, finished: true } : p
        ),
      }));
    });

    newSocket.on("gameWon", ({ winner }: { winner: Player }) => {
      if (winner) {
        setGameState((prev) => ({
          ...prev,
          winner,
        }));
        setShowWinVideo(true);
        setWinnerCarIndex(winner.carIndex);
      }
    });

    newSocket.on("error", ({ message }: { message: string }) => {
      console.error("Server error:", message);
      alert(message);
      setIsConnected(false);
    });

    newSocket.on("joinedGame", () => {
      setIsConnected(true);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (gameState.targetText && gameState.isStarted) {
      const correctChars = userInput
        .split("")
        .filter((char, index) => char === gameState.targetText[index]).length;
      const progress = (correctChars / gameState.targetText.length) * 100;

      if (socket) {
        socket.emit("updateProgress", { progress });

        if (correctChars === gameState.targetText.length && userInput === gameState.targetText) {
          socket.emit("finishRace");
        }
      }
    }
  }, [userInput, gameState.targetText, gameState.isStarted, socket]);

  const joinGame = () => {
    if (socket && playerName.trim()) {
      socket.emit("joinGame", { name: playerName.trim() });
    }
  };

  const startGame = () => {
    if (socket) {
      socket.emit("startGame");
    }
  };

  const resetGame = () => {
    if (socket) {
      socket.emit("resetGame");
      setUserInput("");
      setShowWinVideo(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState.isStarted && !gameState.winner) {
      setUserInput(e.target.value);
    }
  };

  const myPlayer = gameState.players.find((p) => p.id === myPlayerId);
  const canStart = gameState.players.length >= 1 && !gameState.isStarted;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        key={bgVideo}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={toggleMute}
          className="game-button px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-2 border-red-300 shadow-lg"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>

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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-3xl font-bold bg-black/70 px-6 py-3 rounded-lg game-title">
              {gameState.winner?.name} WINS! 🏆
            </div>
            <Button
              onClick={() => setShowWinVideo(false)}
              className="game-button absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-2 border-white"
            >
              ✕ Skip
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

      <div className="flex flex-col items-center justify-start h-full text-white px-4 pt-4">
        <div className="text-center mb-3">
          <h1 className="game-title mb-1">
            MULTIPLAYER RACE
          </h1>
          <p className="game-subtitle text-sm md:text-lg drop-shadow-md">
            ⚡ RACE AGAINST OTHER PLAYERS ⚡
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 mb-4 w-full max-w-4xl max-h-[calc(100vh-120px)] overflow-y-auto">
          {!isConnected ? (
            <div className="text-center space-y-6">
              <Users className="mx-auto h-16 w-16 text-blue-400" />
              <h2 className="text-2xl font-bold">Join the Race</h2>
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && joinGame()}
                className="w-full text-lg p-4 bg-white/90 text-black"
                placeholder="Enter your name..."
                maxLength={20}
              />
              <Button
                onClick={joinGame}
                disabled={!playerName.trim()}
                size="lg"
                className="game-button text-xl py-6 px-12 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 hover:from-green-400 hover:via-emerald-500 hover:to-teal-600 shadow-lg hover:shadow-green-500/50"
              >
                Join Game
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">
                  Players ({gameState.players.length})
                </h3>
                <div className="space-y-2">
                  {gameState.players.map((player) => (
                    <div
                      key={player.id}
                      className={`bg-white/10 rounded-lg p-3 flex items-center justify-between ${
                        player.id === myPlayerId ? "ring-2 ring-yellow-400" : ""
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {CAR_EMOJIS[player.carIndex]} {player.name}
                        {player.id === myPlayerId && " (You)"}
                      </span>
                      {player.finished && <Trophy className="h-5 w-5 text-yellow-400" />}
                    </div>
                  ))}
                </div>
              </div>

              {!gameState.isStarted && !gameState.winner && (
                <div className="text-center space-y-4">
                  <div className="flex justify-center gap-2 mb-4">
                    <Button
                      onClick={() => setShowTrackSelect(!showTrackSelect)}
                      className="game-button px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white border-2 border-yellow-300 shadow-lg text-sm"
                    >
                      🛣️ {selectedTrack.toUpperCase()}
                    </Button>
                  </div>

                  {showTrackSelect && (
                    <div className="bg-black/90 backdrop-blur rounded-lg p-3 border border-white/30 w-48 mx-auto mb-4 space-y-2">
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

                  <QRCodeScanner roomId={myPlayerId} isConnected={isConnected} />
                  <Button
                    onClick={startGame}
                    disabled={!canStart}
                    size="lg"
                    className="game-button text-xl py-6 px-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 hover:from-yellow-300 hover:via-orange-400 hover:to-red-500 shadow-2xl hover:shadow-orange-500/50"
                  >
                    🏁 START RACE 🏁
                  </Button>
                  {gameState.players.length === 0 && (
                    <p className="mt-4 text-white/60">Waiting for players...</p>
                  )}
                </div>
              )}

              {gameState.isStarted && (
                <div className="flex flex-col gap-1 h-full">
                  <div className="bg-gradient-to-b from-sky-600 via-blue-700 to-slate-800 rounded-lg overflow-hidden shadow-xl border-2 border-yellow-400 h-40">
                    <Race2D 
                      playerProgress={gameState.players.find(p => p.id === myPlayerId)?.progress || 0}
                      opponent1Progress={gameState.players[1]?.progress || 0}
                      opponent2Progress={gameState.players[2]?.progress || 0}
                      trackType={selectedTrack}
                      trackShape="curved"
                      playerCount={gameState.players.length}
                    />
                  </div>

                  <div className="bg-white/5 rounded p-1 font-mono text-xs leading-tight line-clamp-2">
                    {gameState.targetText.split("").map((char, index) => {
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
                    className="w-full text-xs py-1 px-2 bg-white/90 text-black"
                    placeholder="Start typing here..."
                    disabled={!!gameState.winner}
                    autoFocus
                  />

                  <div className="space-y-1 flex-1 overflow-hidden">
                    {gameState.players.map((player) => (
                      <div key={player.id} className="relative h-8 bg-white/5 rounded overflow-hidden text-xs">
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 font-semibold z-10 truncate max-w-[60%]">
                          {player.name}
                        </div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 text-lg"
                          style={{ left: `calc(${player.progress}% - 15px)` }}
                        >
                          {CAR_EMOJIS[player.carIndex]}
                        </div>
                        <div className="absolute right-0 top-0 w-1 h-full bg-yellow-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {gameState.winner && (
                <div className="text-center mt-6">
                  <Trophy className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
                  <h2 className="text-3xl font-bold mb-2">
                    {gameState.winner.name} Wins! {CAR_EMOJIS[gameState.winner.carIndex]}
                  </h2>
                  <Button
                    onClick={resetGame}
                    size="lg"
                    className="game-button text-xl py-6 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/50 mt-4"
                  >
                    🔄 PLAY AGAIN
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
