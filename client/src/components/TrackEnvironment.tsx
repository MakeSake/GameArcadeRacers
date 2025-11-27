import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function TrackEnvironment() {
  const trackRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (trackRef.current) {
      // Subtle rotation for dynamic feel
      trackRef.current.rotation.y += 0.00005;
    }
  });

  return (
    <group ref={trackRef}>
      {/* Main Road Surface - Premium Asphalt */}
      <mesh receiveShadow position={[0, 0, 0]} castShadow>
        <planeGeometry args={[50, 150]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.6} 
          metalness={0.05}
          map={(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, 256, 256);
            // Add asphalt texture
            for (let i = 0; i < 500; i++) {
              ctx.fillStyle = `rgba(100, 100, 100, ${Math.random() * 0.3})`;
              ctx.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 5, Math.random() * 5);
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
          })()}
        />
      </mesh>

      {/* Neon Center Line - Glowing */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.8, 0.01, 150]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Lane Dividers - Left */}
      <mesh position={[-10, 0.02, 0]}>
        <boxGeometry args={[0.5, 0.01, 150]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Lane Dividers - Right */}
      <mesh position={[10, 0.02, 0]}>
        <boxGeometry args={[0.5, 0.01, 150]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Dashed lane markers with glow */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh key={i} position={[0, 0.02, -75 + i * 7.5]}>
          <boxGeometry args={[0.6, 0.01, 2]} />
          <meshStandardMaterial 
            color="#ffff00" 
            emissive="#ffff00"
            emissiveIntensity={0.8}
            opacity={0.9} 
            transparent 
          />
        </mesh>
      ))}

      {/* Track Edges - Left - Barrier */}
      <mesh position={[-25, 0.5, 0]}>
        <boxGeometry args={[4, 1, 150]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Track Edges - Right - Barrier */}
      <mesh position={[25, 0.5, 0]}>
        <boxGeometry args={[4, 1, 150]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Finish Line - Premium Checkered Pattern */}
      <mesh position={[0, 0.03, 75]}>
        <boxGeometry args={[20, 0.01, 3]} />
        <meshStandardMaterial
          map={(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const ctx = canvas.getContext('2d')!;
            const sq = 32;
            for (let x = 0; x < 512; x += sq) {
              for (let y = 0; y < 128; y += sq) {
                if (((x / sq) + (y / sq)) % 2 === 0) {
                  ctx.fillStyle = '#ffffff';
                } else {
                  ctx.fillStyle = '#000000';
                }
                ctx.fillRect(x, y, sq, sq);
              }
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
          })()}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Finish Line Flag */}
      <mesh position={[12, 3, 75]}>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[14, 4, 75]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial 
          map={(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 128, 128);
            ctx.fillStyle = '#ff0000';
            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 4; j++) {
                if ((i + j) % 2 === 0) {
                  ctx.fillRect(i * 32, j * 32, 32, 32);
                }
              }
            }
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
          })()}
        />
      </mesh>

      {/* Stadium Lights - Left */}
      <mesh position={[-30, 20, 0]}>
        <boxGeometry args={[2, 30, 150]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Stadium Lights - Right */}
      <mesh position={[30, 20, 0]}>
        <boxGeometry args={[2, 30, 150]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Light Glow */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`light-${i}`} position={[-30, 18, -60 + i * 25]}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshStandardMaterial
            color="#ffff99"
            emissive="#ffff99"
            emissiveIntensity={0.8}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}

      {/* Skybox - Sunset */}
      <mesh position={[0, 30, -200]} scale={[100, 60, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext('2d')!;
            const gradient = ctx.createLinearGradient(0, 0, 0, 256);
            gradient.addColorStop(0, '#ff6b35');
            gradient.addColorStop(0.3, '#f7931e');
            gradient.addColorStop(0.6, '#f1a208');
            gradient.addColorStop(1, '#1a1a2e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 256);
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
          })()}
          emissive="#ff6b35"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Sun/Halo */}
      <mesh position={[40, 35, -150]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshStandardMaterial
          color="#ffaa33"
          emissive="#ffaa33"
          emissiveIntensity={1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Crowd Grandstand - Left */}
      <mesh position={[-35, 8, 0]} scale={[5, 4, 35]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Crowd Grandstand - Right */}
      <mesh position={[35, 8, 0]} scale={[5, 4, 35]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
    </group>
  );
}
