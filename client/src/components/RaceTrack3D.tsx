import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import RacingCar from './RacingCar';
import TrackEnvironment from './TrackEnvironment';

interface RaceTrack3DProps {
  progress: number;
}

export default function RaceTrack3D({ progress }: RaceTrack3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 8, 25]} fov={60} />
          
          {/* Lighting */}
          <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <directionalLight position={[-10, 10, -10]} intensity={0.6} />
          <ambientLight intensity={0.8} />
          
          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* Track */}
          <TrackEnvironment />
          
          {/* Player Car - moves based on typing progress */}
          <RacingCar progress={progress} position={[-15 + (progress * 0.3), 0, 0]} />
          
          {/* Opponent Cars - static for now */}
          <RacingCar progress={Math.max(0, progress - 15)} position={[-15 + ((progress - 15) * 0.3), 5, -8]} isOpponent color="blue" />
          <RacingCar progress={Math.max(0, progress - 5)} position={[-15 + ((progress - 5) * 0.3), 5, 8]} isOpponent color="yellow" />
        </Suspense>
      </Canvas>
    </div>
  );
}
