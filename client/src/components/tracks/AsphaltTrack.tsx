import * as THREE from 'three';

export default function AsphaltTrack() {
  return (
    <group>
      {/* Main Road Surface - Premium Asphalt */}
      <mesh receiveShadow position={[0, 0, 0]} castShadow>
        <planeGeometry args={[20, 50]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.6} 
          metalness={0.05}
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
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Right Lane Marker */}
      <mesh position={[8, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Left Barrier */}
      <mesh position={[-11, 0.5, 0]}>
        <boxGeometry args={[2, 1, 50]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Right Barrier */}
      <mesh position={[11, 0.5, 0]}>
        <boxGeometry args={[2, 1, 50]} />
        <meshStandardMaterial 
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0.3}
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

      {/* Stadium Lights - Left */}
      <mesh position={[-12, 15, 0]}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial
          color="#ffff99"
          emissive="#ffff99"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Stadium Lights - Right */}
      <mesh position={[12, 15, 0]}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial
          color="#ffff99"
          emissive="#ffff99"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Simple Skybox Background */}
      <mesh position={[0, 30, -40]} scale={[100, 30, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
