import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import RacingCar from './RacingCar';
import TrackEnvironment from './TrackEnvironment';

interface RaceTrack3DProps {
  playerProgress: number;
  opponent1Progress?: number;
  opponent2Progress?: number;
}

export default function RaceTrack3D({ playerProgress, opponent1Progress = 0, opponent2Progress = 0 }: RaceTrack3DProps) {
  // 50 meter track - convert progress (0-100) to distance (0-50)
  const playerDistance = (playerProgress / 100) * 25 - 25;
  const opponent1Distance = (opponent1Progress / 100) * 25 - 25;
  const opponent2Distance = (opponent2Progress / 100) * 25 - 25;

  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 1]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
          
          {/* Optimized Lighting */}
          <directionalLight 
            position={[15, 20, 10]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <ambientLight intensity={0.8} />
          
          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* Track */}
          <TrackEnvironment />
          
          {/* Player Car - Red - moves based on typing */}
          <RacingCar 
            progress={playerProgress} 
            position={[-6, 0, playerDistance]} 
            color="red"
          />
          
          {/* Opponent 1 - Blue */}
          <RacingCar 
            progress={opponent1Progress}
            position={[0, 0, opponent1Distance]} 
            isOpponent 
            color="blue" 
          />
          
          {/* Opponent 2 - Yellow */}
          <RacingCar 
            progress={opponent2Progress}
            position={[6, 0, opponent2Distance]} 
            isOpponent 
            color="yellow" 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
