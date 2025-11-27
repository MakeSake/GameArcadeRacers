import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import RacingCar from './RacingCar';
import AsphaltTrack from './tracks/AsphaltTrack';
import DesertTrack from './tracks/DesertTrack';
import NightCityTrack from './tracks/NightCityTrack';
import MountainTrack from './tracks/MountainTrack';

interface RaceTrack3DProps {
  playerProgress: number;
  opponent1Progress?: number;
  opponent2Progress?: number;
  trackType?: 'asphalt' | 'desert' | 'night-city' | 'mountain';
}

export default function RaceTrack3D({ playerProgress, opponent1Progress = 0, opponent2Progress = 0, trackType = 'asphalt' }: RaceTrack3DProps) {
  // 50 meter track - convert progress (0-100) to meters (0-50) and then to scene units
  const playerDistance = (playerProgress / 100) * 50 - 25;
  const opponent1Distance = (opponent1Progress / 100) * 50 - 25;
  const opponent2Distance = (opponent2Progress / 100) * 50 - 25;

  const renderTrack = () => {
    switch (trackType) {
      case 'desert':
        return <DesertTrack />;
      case 'night-city':
        return <NightCityTrack />;
      case 'mountain':
        return <MountainTrack />;
      case 'asphalt':
      default:
        return <AsphaltTrack />;
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 1]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 8, 25]} fov={65} />
          
          {/* Optimized Lighting */}
          <directionalLight 
            position={[20, 25, 15]} 
            intensity={1.3} 
            castShadow 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <ambientLight intensity={0.9} />
          
          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* Track */}
          {renderTrack()}
          
          {/* Player Car - Red - moves based on typing */}
          <RacingCar 
            progress={playerProgress} 
            position={[-8, 0, playerDistance]} 
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
            position={[8, 0, opponent2Distance]} 
            isOpponent 
            color="yellow" 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
