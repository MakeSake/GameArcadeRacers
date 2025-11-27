import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface RacingCarProps {
  progress: number;
  position: [number, number, number];
  isOpponent?: boolean;
  color?: string;
}

export default function RacingCar({ progress, position, isOpponent = false, color = 'red' }: RacingCarProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/red-race-car.glb');
  const carRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (group.current) {
      group.current.position.set(...position);
    }
  }, [position]);

  useFrame(() => {
    if (group.current) {
      // Slight rotation tilt based on speed
      const tilt = (progress * 0.3) * 0.02;
      group.current.rotation.z = tilt;
      
      // Bob up and down slightly for impact
      group.current.position.y = position[1] + Math.sin(progress * 0.02) * 0.3;
      
      // Update position smoothly
      group.current.position.x = position[0];
      group.current.position.z = position[2];
    }
  });

  return (
    <group ref={group} scale={isOpponent ? 0.8 : 1}>
      <primitive object={scene.clone()} />
      <mesh castShadow receiveShadow scale={isOpponent ? 0.8 : 1}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial
          color={isOpponent ? (color === 'blue' ? '#0066ff' : '#ffff00') : '#ff0000'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/red-race-car.glb');
