import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface RacingCarProps {
  progress: number;
  position: [number, number, number];
  isOpponent?: boolean;
  color?: string;
}

export default function RacingCar({ progress, position, isOpponent = false, color = 'red' }: RacingCarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/red-race-car.glb');

  useEffect(() => {
    if (groupRef.current) {
      // Color the car
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = (child.material as THREE.MeshStandardMaterial).clone();
          
          if (color === 'blue') {
            material.color.set('#0066ff');
          } else if (color === 'yellow') {
            material.color.set('#ffff00');
          } else {
            material.color.set('#ff0000');
          }
          
          child.material = material;
        }
      });
    }
  }, [color, scene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(new THREE.Vector3(...position));
      // Subtle bounce effect
      groupRef.current.position.y += Math.sin(progress * 0.05) * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={[2, 2, 2]}>
      <primitive object={scene} />
    </group>
  );
}
