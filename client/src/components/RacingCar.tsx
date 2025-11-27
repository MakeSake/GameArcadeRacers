import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface RacingCarProps {
  progress: number;
  position: [number, number, number];
  isOpponent?: boolean;
  color?: string;
}

const getColorValue = (color?: string) => {
  if (color === 'blue') return '#0066ff';
  if (color === 'yellow') return '#ffff00';
  return '#ff0000';
};

export default function RacingCar({ progress, position, isOpponent = false, color = 'red' }: RacingCarProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position[0], position[1] + Math.sin(progress * 0.01) * 0.2, position[2]);
      groupRef.current.rotation.z = (progress * 0.3) * 0.02;
    }
  });

  const carColor = getColorValue(color);

  return (
    <group ref={groupRef}>
      {/* Main Car Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.7, 2.5]} />
        <meshStandardMaterial
          color={carColor}
          metalness={0.85}
          roughness={0.15}
          emissive={carColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Car Cabin/Roof */}
      <mesh castShadow position={[0, 0.35, -0.3]}>
        <boxGeometry args={[0.85, 0.5, 1.2]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Windshield */}
      <mesh castShadow position={[0, 0.5, 0.2]}>
        <boxGeometry args={[0.8, 0.3, 0.1]} />
        <meshStandardMaterial color="#4a90e2" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Front Left Wheel */}
      <mesh position={[-0.5, -0.35, 0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.6} />
      </mesh>

      {/* Front Right Wheel */}
      <mesh position={[0.5, -0.35, 0.6]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.6} />
      </mesh>

      {/* Back Left Wheel */}
      <mesh position={[-0.5, -0.35, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.6} />
      </mesh>

      {/* Back Right Wheel */}
      <mesh position={[0.5, -0.35, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.6} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.35, 0.1, 1.3]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffff88" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[0.35, 0.1, 1.3]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#ffff88" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>

      {/* Speed Glow Effect */}
      {progress > 30 && (
        <mesh position={[0, 0, -1.5]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial
            color="#ffaa33"
            emissive="#ffaa33"
            emissiveIntensity={0.7}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}
