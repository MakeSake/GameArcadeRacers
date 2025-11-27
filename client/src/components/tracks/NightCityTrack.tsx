import * as THREE from 'three';

export default function NightCityTrack() {
  return (
    <group>
      {/* Dark Asphalt Road */}
      <mesh receiveShadow position={[0, 0, 0]} castShadow>
        <planeGeometry args={[20, 50]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.5} 
          metalness={0.1}
        />
      </mesh>

      {/* Center Neon Line - Cyan */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.6, 0.01, 50]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Left Lane Marker - Pink Neon */}
      <mesh position={[-8, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.01, 50]} />
        <meshStandardMaterial 
          color="#ff00ff" 
          emissive="#ff00ff"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Right Lane Marker - Purple Neon */}
      <mesh position={[8, 0.02, 0]}>
        <boxGeometry args={[0.4, 0.01, 50]} />
        <meshStandardMaterial 
          color="#9900ff" 
          emissive="#9900ff"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Left Wall - Neon Barrier */}
      <mesh position={[-11, 0.5, 0]}>
        <boxGeometry args={[2, 1, 50]} />
        <meshStandardMaterial 
          color="#ff0080" 
          emissive="#ff0080" 
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Right Wall - Neon Barrier */}
      <mesh position={[11, 0.5, 0]}>
        <boxGeometry args={[2, 1, 50]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Finish Line - Glowing */}
      <mesh position={[0, 0.03, 25]}>
        <boxGeometry args={[16, 0.01, 2]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Start Line - Glowing */}
      <mesh position={[0, 0.03, -25]}>
        <boxGeometry args={[16, 0.01, 1.5]} />
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={1.8}
          toneMapped={false}
        />
      </mesh>

      {/* Neon Light Poles - Left */}
      {[-20, 0, 20].map((z, i) => (
        <mesh key={`pole-l-${i}`} position={[-13, 8, z]}>
          <cylinderGeometry args={[0.4, 0.4, 16, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      ))}

      {/* Neon Light Poles - Right */}
      {[-20, 0, 20].map((z, i) => (
        <mesh key={`pole-r-${i}`} position={[13, 8, z]}>
          <cylinderGeometry args={[0.4, 0.4, 16, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      ))}

      {/* Neon Light Glow - Left */}
      {[-20, 0, 20].map((z, i) => (
        <mesh key={`glow-l-${i}`} position={[-13, 10, z]}>
          <sphereGeometry args={[2, 8, 8]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Neon Light Glow - Right */}
      {[-20, 0, 20].map((z, i) => (
        <mesh key={`glow-r-${i}`} position={[13, 10, z]}>
          <sphereGeometry args={[2, 8, 8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Dark City Sky */}
      <mesh position={[0, 30, -40]} scale={[100, 30, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0a0a2e"
          emissive="#0a0a2e"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}
