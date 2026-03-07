import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Asteroid belt circles the Sun between Mars (40) and Jupiter (65) — around radius 52
const BELT_INNER = 47;
const BELT_OUTER = 57;
const COUNT = 400;

export default function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const asteroids = useMemo(() => {
    const items = [];
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = BELT_INNER + Math.random() * (BELT_OUTER - BELT_INNER);
      const height = (Math.random() - 0.5) * 1.5;
      const scale = Math.random() * 0.18 + 0.04;
      const speed = 0.0006 + Math.random() * 0.0003; // slightly varying orbit speeds
      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;
      const spinX = (Math.random() - 0.5) * 0.02;
      const spinY = (Math.random() - 0.5) * 0.02;

      items.push({ angle, radius, height, scale, speed, rotX, rotY, rotZ, spinX, spinY });
    }
    return items;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    asteroids.forEach((a, i) => {
      const angle = a.angle + t * a.speed;
      dummy.position.set(
        Math.cos(angle) * a.radius,
        a.height,
        Math.sin(angle) * a.radius
      );
      dummy.rotation.set(
        a.rotX + t * a.spinX,
        a.rotY + t * a.spinY,
        a.rotZ
      );
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#7a7060" roughness={0.95} metalness={0.05} />
    </instancedMesh>
  );
}
