import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface RacingCarProps {
  progress: number;
  position: [number, number, number];
  isOpponent?: boolean;
  color?: string;
}

export default function RacingCar({ progress, position, isOpponent = false, color = 'red' }: RacingCarProps) {
  const { scene } = useGLTF('/models/red-race-car.glb');
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = scene.clone();

  // Color the car based on opponent
  if (isOpponent && color !== 'red') {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (color === 'blue') {
          material.color.set('#0066ff');
        } else if (color === 'yellow') {
          material.color.set('#ffff00');
        }
      }
    });
  }

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1], position[2]);
    }
  });

  return (
    <group ref={groupRef} scale={[2.5, 2.5, 2.5]}>
      <primitive object={clonedScene} />
    </group>
  );
}
