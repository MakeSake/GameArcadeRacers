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
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={75} />
          
          {/* Lighting */}
          <directionalLight 
            position={[15, 30, 15]} 
            intensity={1.4} 
            castShadow 
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-10, 10, -10]} intensity={0.5} />
          <ambientLight intensity={0.7} />
          
          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* Track */}
          <TrackEnvironment />
          
          {/* Player Car - Red - moves based on typing */}
          <RacingCar 
            progress={playerProgress} 
            position={[-8 + (playerProgress * 0.15), 0, 0]} 
            color="red"
          />
          
          {/* Opponent 1 - Blue */}
          <RacingCar 
            progress={opponent1Progress}
            position={[-8 + (opponent1Progress * 0.15), 0, -4]} 
            isOpponent 
            color="blue" 
          />
          
          {/* Opponent 2 - Yellow */}
          <RacingCar 
            progress={opponent2Progress}
            position={[-8 + (opponent2Progress * 0.15), 0, 4]} 
            isOpponent 
            color="yellow" 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
