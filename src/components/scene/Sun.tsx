import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Sun radius — dominates the scene (larger than Jupiter's mapSize=52)
const SUN_RADIUS = 60;

export default function Sun({ onClick }: { onClick?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const [sunTexture] = useTexture(['/textures/8k_sun.jpg']);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core sun sphere — large, no corona halos */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[SUN_RADIUS, 128, 128]} />
        <meshStandardMaterial
          map={sunTexture}
          emissive={new THREE.Color('#ffffff')}
          emissiveMap={sunTexture}
          emissiveIntensity={hovered ? 2.2 : 1.5}
          toneMapped={false}
        />
        <Html distanceFactor={10} position={[SUN_RADIUS * 1.1, SUN_RADIUS * 1.1, 0]} center zIndexRange={[100, 0]}>
          <div
            className="text-white font-orbitron uppercase tracking-[0.5em] text-sm whitespace-nowrap pointer-events-none"
            style={{ opacity: hovered ? 1 : 0.5, textShadow: '0 0 12px rgba(255,200,0,0.8)', transition: 'opacity 0.3s' }}
          >
            Sun
          </div>
        </Html>
      </mesh>

      {/* Point light from the sun — illuminates all planets */}
      <pointLight color="#fff5cc" intensity={8} distance={2000} decay={1} />
    </group>
  );
}
