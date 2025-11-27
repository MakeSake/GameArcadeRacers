import * as THREE from 'three';

export default function MountainTrack() {
  return (
    <group>
      {/* Rocky Road Surface */}
      <mesh receiveShadow position={[0, 0, 0]} castShadow>
        <planeGeometry args={[20, 50]} />
        <meshStandardMaterial 
          color="#5a5a5a" 
          roughness={0.9} 
          metalness={0}
        />
      </mesh>

      {/* Center Yellow Line */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.6, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ffff00" 
          emissive="#ffff00" 
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Left Lane Marker */}
      <mesh position={[-8, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Right Lane Marker */}
      <mesh position={[8, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Left Mountain */}
      <mesh position={[-13, 5, 0]}>
        <boxGeometry args={[5, 10, 50]} />
        <meshStandardMaterial 
          color="#6b5d52" 
          roughness={1}
        />
      </mesh>

      {/* Right Mountain */}
      <mesh position={[13, 5, 0]}>
        <boxGeometry args={[5, 10, 50]} />
        <meshStandardMaterial 
          color="#6b5d52" 
          roughness={1}
        />
      </mesh>

      {/* Snow Peak - Left */}
      <mesh position={[-15, 12, -5]}>
        <coneGeometry args={[4, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.7}
        />
      </mesh>

      {/* Snow Peak - Right */}
      <mesh position={[15, 12, 15]}>
        <coneGeometry args={[4, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.7}
        />
      </mesh>

      {/* Finish Line */}
      <mesh position={[0, 0.03, 25]}>
        <boxGeometry args={[16, 0.01, 2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00ff00"
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

      {/* Guard Rails - Left */}
      <mesh position={[-10, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.6, 50]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Guard Rails - Right */}
      <mesh position={[10, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.6, 50]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Morning Sky */}
      <mesh position={[0, 30, -40]} scale={[100, 30, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#87ceeb"
          emissive="#87ceeb"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Sun reflection on snow */}
      <mesh position={[30, 25, -100]}>
        <sphereGeometry args={[15, 16, 16]} />
        <meshStandardMaterial
          color="#ffff99"
          emissive="#ffff99"
          emissiveIntensity={0.9}
        />
      </mesh>
    </group>
  );
}
