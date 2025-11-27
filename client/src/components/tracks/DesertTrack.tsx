import * as THREE from 'three';

export default function DesertTrack() {
  return (
    <group>
      {/* Sandy Road Surface */}
      <mesh receiveShadow position={[0, 0, 0]} castShadow>
        <planeGeometry args={[20, 50]} />
        <meshStandardMaterial 
          color="#d4a574" 
          roughness={0.8} 
          metalness={0}
        />
      </mesh>

      {/* Center Line - White Paint */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.6, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Left Lane Marker */}
      <mesh position={[-8, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ffaa00"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Right Lane Marker */}
      <mesh position={[8, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ffaa00" 
          emissive="#ffaa00"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Left Barrier - Sand Dunes */}
      <mesh position={[-12, 1, 0]}>
        <boxGeometry args={[3, 2, 50]} />
        <meshStandardMaterial 
          color="#c4915d" 
          emissive="#c4915d" 
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Right Barrier - Sand Dunes */}
      <mesh position={[12, 1, 0]}>
        <boxGeometry args={[3, 2, 50]} />
        <meshStandardMaterial 
          color="#c4915d" 
          emissive="#c4915d" 
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Finish Line */}
      <mesh position={[0, 0.03, 25]}>
        <boxGeometry args={[16, 0.01, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff6b00"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Start Line */}
      <mesh position={[0, 0.03, -25]}>
        <boxGeometry args={[16, 0.01, 1.5]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffaa00"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Palm Trees - Simple pillars */}
      {[
        [-15, 3, -20],
        [15, 3, -15],
        [-15, 3, 0],
        [15, 3, 5],
        [-15, 3, 20],
        [15, 3, 25],
      ].map((pos, i) => (
        <mesh key={`tree-${i}`} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.5, 0.6, 6, 8]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      ))}

      {/* Sun */}
      <mesh position={[40, 40, -150]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshStandardMaterial
          color="#ffaa33"
          emissive="#ffaa33"
          emissiveIntensity={1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Sky */}
      <mesh position={[0, 30, -40]} scale={[100, 30, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#87ceeb"
          emissive="#87ceeb"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
