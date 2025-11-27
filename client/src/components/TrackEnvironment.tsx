import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function TrackEnvironment() {
  const trackRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (trackRef.current) {
      trackRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <group ref={trackRef}>
      {/* Main Road Surface */}
      <mesh receiveShadow position={[0, 0, 0]} castShadow>
        <planeGeometry args={[40, 120]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Road Markings - Center Line */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.5, 0.01, 120]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>

      {/* Lane Dividers - Left */}
      <mesh position={[-8, 0.01, 0]}>
        <boxGeometry args={[0.3, 0.01, 120]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Lane Dividers - Right */}
      <mesh position={[8, 0.01, 0]}>
        <boxGeometry args={[0.3, 0.01, 120]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Dashed lane markers */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh key={i} position={[0, 0.01, -60 + i * 8]}>
          <boxGeometry args={[0.4, 0.01, 2]} />
          <meshStandardMaterial color="#ffff00" opacity={0.6} transparent />
        </mesh>
      ))}

      {/* Track Edges - Left */}
      <mesh position={[-20, 0, 0]}>
        <boxGeometry args={[2, 0.5, 120]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>

      {/* Track Edges - Right */}
      <mesh position={[20, 0, 0]}>
        <boxGeometry args={[2, 0.5, 120]} />
        <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>

      {/* Finish Line */}
      <mesh position={[0, 0.02, 60]}>
        <boxGeometry args={[16, 0.01, 2]} />
        <meshStandardMaterial
          color="#000000"
          map={(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 64;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 128, 64);
            ctx.fillStyle = '#000000';
            ctx.fillRect(128, 0, 128, 64);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 32, 64, 32);
            ctx.fillStyle = '#000000';
            ctx.fillRect(64, 32, 64, 32);
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
          })()}
        />
      </mesh>

      {/* Skybox/Background Mountains */}
      <mesh position={[0, 0, -100]} scale={[60, 40, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#87ceeb"
          emissive="#4a90e2"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Sun/Light glow */}
      <mesh position={[30, 40, -50]}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshStandardMaterial
          color="#ffaa33"
          emissive="#ffaa33"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Crowd/Stands - Left */}
      <mesh position={[-25, 5, 0]} scale={[3, 3, 30]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Crowd/Stands - Right */}
      <mesh position={[25, 5, 0]} scale={[3, 3, 30]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}
