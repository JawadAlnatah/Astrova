import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  data: any;
  onClick: () => void;
  isSelected: boolean;
  showOrbitRing?: boolean;
}

const placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export default function Planet({ data, onClick, isSelected, showOrbitRing = true }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const moonGroupRef = useRef<THREE.Group>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [moonHovered, setMoonHovered] = useState(false);

  const { gl } = useThree();
  const maxAniso = gl.capabilities.getMaxAnisotropy();

  // Always use 8k textures for sharp visuals on the Explore Map
  const getTexture = (url: string | undefined) => {
    if (!url) return placeholder;
    return url; // always 8k
  };

  const textures = useTexture([
    getTexture(data.mapTextureUrl || data.textureUrl),
    getTexture(data.mapCloudsUrl || data.cloudsUrl) || placeholder,
    getTexture(data.ringTextureUrl) || placeholder,
    data.id === 'earth' ? '/textures/2k_moon.jpg' : placeholder,
  ]);

  const texture = textures[0];
  const cloudsTexture = data.cloudsUrl ? textures[1] : null;
  const ringTexture = data.ringTextureUrl ? textures[2] : null;
  const moonTexture = data.id === 'earth' ? textures[3] : null;

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAniso;
  texture.needsUpdate = true;
  if (cloudsTexture) {
    cloudsTexture.colorSpace = THREE.SRGBColorSpace;
    cloudsTexture.anisotropy = maxAniso;
    cloudsTexture.needsUpdate = true;
  }
  if (ringTexture) {
    ringTexture.colorSpace = THREE.SRGBColorSpace;
    ringTexture.anisotropy = maxAniso;
    ringTexture.needsUpdate = true;
  }
  if (moonTexture) {
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    moonTexture.anisotropy = maxAniso;
    moonTexture.needsUpdate = true;
  }

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.005;
    }
    if (moonGroupRef.current) {
      const mt = clock.getElapsedTime() * 0.4;
      moonGroupRef.current.position.x = Math.cos(mt) * (data.mapSize * 2.2);
      moonGroupRef.current.position.z = Math.sin(mt) * (data.mapSize * 2.2);
    }
    if (moonMeshRef.current) {
      moonMeshRef.current.rotation.y += 0.008;
    }
  });

  const s = data.mapSize;

  // Orbit ring: a torus at radius = orbitRadius, in world space around the Sun.
  // We draw it here but it actually lives in the solar system group positioned at (0,0,0).
  // We'll draw orbit rings separately in SolarSystem.tsx.

  return (
    <group>
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[s, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.8}
          metalness={0.1}
          emissive={new THREE.Color(data.atmosphereColor)}
          emissiveIntensity={hovered ? 0.4 : 0.08}
        />

        {/* Label */}
        {!isSelected && (
          <Html distanceFactor={10} position={[s * 1.4, s * 1.4, 0]} center zIndexRange={[100, 0]}>
            <div
              className="text-white font-orbitron uppercase tracking-[0.4em] text-[11px] whitespace-nowrap pointer-events-none transition-all duration-300"
              style={{
                opacity: hovered ? 1 : 0.55,
                textShadow: hovered ? '0 0 10px rgba(255,255,255,0.9)' : 'none',
              }}
            >
              {data.name}
            </div>
          </Html>
        )}
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[s * 1.06, 32, 32]} />
        <meshBasicMaterial
          color={data.atmosphereColor}
          transparent
          opacity={hovered ? 0.18 : 0.07}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Earth clouds */}
      {cloudsTexture && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[s * 1.012, 64, 64]} />
          <meshStandardMaterial
            map={cloudsTexture}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Saturn rings — UV-corrected alpha ring */}
      {ringTexture && (() => {
        const inner = s * 1.3;
        const outer = s * 2.5;
        const geo = new THREE.RingGeometry(inner, outer, 128, 8);
        const pos = geo.attributes.position as THREE.BufferAttribute;
        const uv = geo.attributes.uv as THREE.BufferAttribute;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          const len = v3.length();
          uv.setXY(i, (len - inner) / (outer - inner), 0.5);
        }
        uv.needsUpdate = true;
        ringTexture.colorSpace = THREE.SRGBColorSpace;
        return (
          <mesh geometry={geo} rotation={[Math.PI * 0.42, 0.1, 0.05]}>
            <meshBasicMaterial
              color="#c8a96e"
              alphaMap={ringTexture}
              transparent
              opacity={1}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.NormalBlending}
            />
          </mesh>
        );
      })()}

      {/* Moon (Earth only) */}
      {moonTexture && (
        <group ref={moonGroupRef}>
          <mesh
            ref={moonMeshRef}
            onClick={(e) => {
              e.stopPropagation();
              const worldPos = new THREE.Vector3();
              moonMeshRef.current?.getWorldPosition(worldPos);
              window.dispatchEvent(new CustomEvent('moon-clicked', { detail: { position: worldPos } }));
            }}
            onPointerOver={(e) => { e.stopPropagation(); setMoonHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); setMoonHovered(false); document.body.style.cursor = 'auto'; }}
          >
            <sphereGeometry args={[s * 0.27, 32, 32]} />
            <meshStandardMaterial
              map={moonTexture}
              roughness={0.9}
              metalness={0.05}
              emissive={new THREE.Color('#ffffff')}
              emissiveIntensity={moonHovered ? 0.2 : 0}
            />
            {!isSelected && (
              <Html distanceFactor={10} position={[s * 0.42, s * 0.42, 0]} center zIndexRange={[100, 0]}>
                <div
                  className="text-white font-orbitron uppercase tracking-[0.3em] text-[9px] whitespace-nowrap pointer-events-none transition-all duration-300"
                  style={{ opacity: moonHovered ? 1 : 0.4, textShadow: moonHovered ? '0 0 8px rgba(255,255,255,0.8)' : 'none' }}
                >
                  Moon
                </div>
              </Html>
            )}
          </mesh>
        </group>
      )}
    </group>
  );
}
