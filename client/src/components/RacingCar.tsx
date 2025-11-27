import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface RacingCarProps {
  progress: number;
  position: [number, number, number];
  isOpponent?: boolean;
  color?: string;
}

export default function RacingCar({ progress, position, isOpponent = false, color = 'red' }: RacingCarProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1] + Math.sin(progress * 0.01) * 0.2, position[2]);
      groupRef.current.rotation.z = (progress * 0.3) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Car Body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.6, 2]} />
        <meshStandardMaterial
          color={color === 'blue' ? '#0066ff' : color === 'yellow' ? '#ffff00' : '#ff0000'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Car Cabin */}
      <mesh castShadow position={[0, 0.2, -0.2]}>
        <boxGeometry args={[0.7, 0.4, 1]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Wheels */}
      {[-0.4, 0.4].map((x) => 
        [-0.6, 0.6].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.4, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.5} />
          </mesh>
        ))
      )}

      {/* Speed Effect Glow */}
      {progress > 30 && (
        <mesh position={[0, 0, -1.2]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#ffaa33" emissive="#ffaa33" emissiveIntensity={0.6} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}
