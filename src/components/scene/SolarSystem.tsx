import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Preload, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useDeviceTier, DeviceTier } from '../../hooks/useDeviceTier';

import Sun from './Sun';
import Planet from './Planet';
import AsteroidBelt from './AsteroidBelt';
import { planets } from '../../data/planets';
import PlanetDetailOverlay from '../panels/PlanetDetailOverlay';
import MoonPhasePanel from '../panels/MoonPhasePanel';
import HUDOverlay from '../hud/HUDOverlay';
import EventTimelinePanel from '../panels/EventTimelinePanel';

// ─── Orbit Ring ────────────────────────────────────────────────────────────────
function OrbitRing({ radius, tilt, color }: { radius: number; tilt: number; color: string }) {
  const points: THREE.Vector3[] = [];
  const segments = 320;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  // Solid colored ring
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35, depthWrite: false });
  const line = new THREE.LineLoop(geometry, material);
  return <primitive object={line} rotation={[tilt, 0, 0]} />;
}

// ─── Nebula Background ────────────────────────────────────────────────────────
function NebulaBackground() {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Deep indigo/violet nebula gradient
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(60, 40, 120, 0.55)');
    grad.addColorStop(0.3, 'rgba(20, 15, 60, 0.45)');
    grad.addColorStop(0.6, 'rgba(5, 10, 35, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Second off-center nebula blob (teal)
    const grad2 = ctx.createRadialGradient(size * 0.7, size * 0.3, 0, size * 0.7, size * 0.3, size * 0.35);
    grad2.addColorStop(0, 'rgba(0, 120, 140, 0.25)');
    grad2.addColorStop(0.5, 'rgba(0, 60, 80, 0.12)');
    grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <mesh ref={meshRef} position={[30, 0, -280]} rotation={[0, 0, 0.4]}>
      <planeGeometry args={[700, 700]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Orbital Planet Wrapper ────────────────────────────────────────────────────
function OrbitalPlanet({
  planet,
  isSelected,
  isMoonSelected,
  onPlanetClick,
  controlsRef,
}: {
  planet: any;
  isSelected: boolean;
  isMoonSelected: boolean;
  onPlanetClick: (id: string) => void;
  controlsRef?: React.RefObject<OrbitControlsImpl>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Animate camera to planet when selected
  useEffect(() => {
    if (!groupRef.current) return;

    if (isSelected) {
      // 1. Where is the planet?
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);

      // 2. We want to view it from the "inside" looking out.
      // This means the camera is positioned between the Sun (0,0,0) and the Planet.
      // This ensures the side of the planet facing the camera is perfectly illuminated by the Sun!
      const directionFromSun = worldPos.clone().normalize();

      // Let's add slight elevation
      directionFromSun.y += 0.1;
      directionFromSun.normalize();

      // 3. Distance from planet to camera (zoomed in closer)
      const targetDist = planet.mapSize * 9;

      // 4. Offset target to the left of the screen (panning camera right)
      // We are looking OUTWARD from the sun, so "forward" is directionFromSun.
      // "Right" is cross product of Up and Forward.
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), directionFromSun).normalize();

      // Pan target to the right => shifts planet to the left of the screen
      const focusOffset = right.multiplyScalar(-planet.mapSize * 3.5);
      const focusPoint = worldPos.clone().add(focusOffset);

      // 5. Final camera position: Place camera between Sun and Planet
      // So we subtract the direction vector from the focus point!
      const targetCamPos = focusPoint.clone().sub(directionFromSun.multiplyScalar(targetDist));

      gsap.to(camera.position, {
        x: targetCamPos.x,
        y: targetCamPos.y,
        z: targetCamPos.z,
        duration: 1.8,
        ease: 'power3.inOut',
      });

      if (controlsRef?.current) {
        gsap.to(controlsRef.current.target, {
          x: focusPoint.x,
          y: focusPoint.y,
          z: focusPoint.z,
          duration: 1.8,
          ease: 'power3.inOut',
        });
      }
    }
  }, [isSelected, camera, planet.mapSize, controlsRef]);

  useFrame(({ clock }) => {
    if (groupRef.current && !isSelected && !isMoonSelected) {
      const t = clock.getElapsedTime();
      const angle = t * planet.orbitSpeed + (planet.orbitOffset || 0);
      groupRef.current.position.set(
        Math.cos(angle) * planet.orbitRadius,
        Math.sin(planet.orbitTilt) * planet.orbitRadius * Math.sin(angle),
        Math.sin(angle) * planet.orbitRadius
      );
    }
  });

  const hidden = (isSelected === false && planets.some(p => p.id !== planet.id) && false) ||
    (isMoonSelected && planet.id !== 'earth');

  return (
    <group ref={groupRef} visible={!hidden}>
      <Planet
        data={planet}
        onClick={() => {
          if (!isMoonSelected) onPlanetClick(planet.id);
        }}
        isSelected={isSelected}
      />
    </group>
  );
}

// ─── Scene Content ─────────────────────────────────────────────────────────────
function SceneContent({
  selectedPlanet,
  setSelectedPlanet,
  moonPhase,
  isMoonSelected,
  controlsRef,
  cameraResetTrigger,
  tier,
}: {
  selectedPlanet: string | null;
  setSelectedPlanet: (id: string | null) => void;
  moonPhase: number;
  isMoonSelected: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl>;
  cameraResetTrigger: number;
  tier: DeviceTier;
}) {
  const { camera } = useThree();
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  // Initial camera position — pulled back for larger solar system (Neptune at orbit 900)
  useEffect(() => {
    camera.position.set(0, 950, 1300);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Freeze zoom and pan when a planet is selected, but allow rotation
  useEffect(() => {
    if (!controlsRef.current) return;
    if (selectedPlanet || isMoonSelected) {
      controlsRef.current.enableZoom = false;
      controlsRef.current.enablePan = false;
      // We keep enableRotate = true so the user can spin the planet
    } else {
      controlsRef.current.enableZoom = true;
      controlsRef.current.enablePan = true;
      controlsRef.current.enableRotate = true;
    }
  }, [selectedPlanet, isMoonSelected, controlsRef]);

  // Handle zooming back out to the solar system view
  useEffect(() => {
    if (cameraResetTrigger > 0) {
      gsap.to(camera.position, {
        x: 0,
        y: 950,
        z: 1300,
        duration: 2.0,
        ease: 'power3.inOut',
      });
      if (controlsRef.current) {
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2.0,
          ease: 'power3.inOut',
        });
      }
    }
  }, [cameraResetTrigger, camera, controlsRef]);

  // Moon phase directional light
  useEffect(() => {
    if (directionalLightRef.current && isMoonSelected) {
      const angle = moonPhase * Math.PI * 2;
      directionalLightRef.current.position.set(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
    }
  }, [moonPhase, isMoonSelected]);

  return (
    <>
      <ambientLight intensity={isMoonSelected ? 0.05 : 0.22} />

      {isMoonSelected && (
        <directionalLight ref={directionalLightRef} color="#ffffff" intensity={2} />
      )}

      {/* Deep-space nebula backdrop */}
      {!isMoonSelected && <NebulaBackground />}

      {/* Stars — radius far beyond max zoom so they're always visible */}
      <Stars radius={10000} depth={500} count={tier === 'high' ? 18000 : 5000} factor={8} saturation={0.5} speed={0.2} />
      {/* Deep-field layer — creates galaxy ball feel when zoomed way out */}
      <Stars radius={8000} depth={2000} count={tier === 'high' ? 6000 : 1500} factor={12} saturation={0.3} speed={0.1} />

      {/* Sun */}
      <group visible={!isMoonSelected}>
        <Sun />
      </group>

      {/* Orbit rings — colored per planet */}
      {!isMoonSelected && planets.map((p) => (
        <OrbitRing key={`ring-${p.id}`} radius={p.orbitRadius} tilt={p.orbitTilt} color={p.atmosphereColor} />
      ))}

      {/* Asteroid Belt */}
      {!isMoonSelected && <AsteroidBelt />}

      {/* Planets */}
      {planets.map((planet) => {
        const isThisSelected = selectedPlanet === planet.id;
        const hidden =
          (selectedPlanet !== null && !isThisSelected) ||
          (isMoonSelected && planet.id !== 'earth');

        return (
          <group key={planet.id} visible={!hidden}>
            <OrbitalPlanet
              planet={planet}
              isSelected={isThisSelected || (isMoonSelected && planet.id === 'earth')}
              isMoonSelected={isMoonSelected}
              onPlanetClick={(id) => setSelectedPlanet(id)}
              controlsRef={controlsRef}
            />
          </group>
        );
      })}
    </>
  );
}

import { ErrorBoundary } from 'react-error-boundary';

// ─── Main SolarSystem ──────────────────────────────────────────────────────────
export default function SolarSystem({
  onPlanetSelected
}: {
  onPlanetSelected?: (hasSelected: boolean) => void;
}) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isMoonSelected, setIsMoonSelected] = useState(false);
  const [moonPhase, setMoonPhase] = useState(0.5);
  const [showTimeline, setShowTimeline] = useState(false);
  const [cameraResetTrigger, setCameraResetTrigger] = useState(0);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const tier = useDeviceTier();

  // Handle camera reset on panel close
  const handleClosePlanet = useCallback(() => {
    setSelectedPlanet(null);
    if (onPlanetSelected) onPlanetSelected(false);
    setCameraResetTrigger(prev => prev + 1);

    // We can enable controls slightly before the animation fully finishes for fluidity
    setTimeout(() => {
      if (controlsRef.current) controlsRef.current.enabled = true;
    }, 1500);
  }, [onPlanetSelected]);

  useEffect(() => {
    const handleMoonClick = () => {
      setIsMoonSelected(true);
      setSelectedPlanet(null);
      if (onPlanetSelected) onPlanetSelected(false);
    };
    window.addEventListener('moon-clicked', handleMoonClick);
    return () => window.removeEventListener('moon-clicked', handleMoonClick);
  }, [onPlanetSelected]);

  return (
    <ErrorBoundary fallbackRender={({ error }: any) => (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white p-8 overflow-auto">
        <div className="max-w-2xl bg-red-950/30 border border-red-500 rounded p-6">
          <h2 className="text-xl font-bold text-red-500 mb-2">Canvas Render Error</h2>
          <pre className="text-sm font-mono whitespace-pre-wrap">{error.message}</pre>
          <pre className="text-xs font-mono text-gray-400 mt-4 whitespace-pre-wrap">{error.stack}</pre>
        </div>
      </div>
    )}>
      <>
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 40% 50%, #07102a 0%, #030818 45%, #010306 100%)' }}>
          <Canvas
            camera={{ position: [0, 950, 1300], fov: 45, near: 1, far: 20000 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
            dpr={[1, 2]}
          >
            <React.Suspense
              fallback={
                <Html center>
                  <div className="text-white/70 font-orbitron tracking-widest text-sm animate-pulse whitespace-nowrap">
                    LOADING SOLAR SYSTEM...
                  </div>
                </Html>
              }
            >
              <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                zoomSpeed={1.2}
                rotateSpeed={0.5}
                panSpeed={0.8}
                minDistance={60}
                maxDistance={4000}
                makeDefault
              />

              <SceneContent
                selectedPlanet={selectedPlanet}
                setSelectedPlanet={setSelectedPlanet}
                moonPhase={moonPhase}
                isMoonSelected={isMoonSelected}
                controlsRef={controlsRef}
                cameraResetTrigger={cameraResetTrigger}
                tier={tier}
              />
            </React.Suspense>
          </Canvas>
        </div>

        {/* HUD */}
        {!selectedPlanet && !isMoonSelected && (
          <HUDOverlay
            selectedPlanetId={null}
            onSelectPlanet={(id) => {
              setSelectedPlanet(id);
              if (onPlanetSelected) onPlanetSelected(true);
            }}
          />
        )}

        {/* Planet info panel — full-screen detail overlay */}
        {selectedPlanet && !isMoonSelected && (
          <PlanetDetailOverlay planetId={selectedPlanet} onClose={handleClosePlanet} />
        )}

        {/* Moon phase panel */}
        {isMoonSelected && (
          <MoonPhasePanel
            phase={moonPhase}
            setPhase={setMoonPhase}
            onClose={() => setIsMoonSelected(false)}
          />
        )}

        {/* Timeline toggle */}
        {!selectedPlanet && !isMoonSelected && (
          <button
            onClick={() => setShowTimeline(true)}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all z-40"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>
        )}

        <EventTimelinePanel isOpen={showTimeline} onClose={() => setShowTimeline(false)} />
      </>
    </ErrorBoundary>
  );
}
