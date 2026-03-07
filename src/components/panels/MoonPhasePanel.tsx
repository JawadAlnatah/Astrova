import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface MoonPhasePanelProps {
  onClose: () => void;
  phase: number; // 0 to 1
  setPhase: (phase: number) => void;
}

// ─── 3D Moon Scene ─────────────────────────────────────────────────────────────
function MoonScene({ phase }: { phase: number }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const lightGroupRef = useRef<THREE.Group>(null);
  const moonTexture = useTexture('/textures/2k_moon.jpg');

  useMemo(() => {
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    moonTexture.anisotropy = 16;
  }, [moonTexture]);

  useFrame(() => {
    if (moonRef.current) moonRef.current.rotation.y += 0.001;
    if (lightGroupRef.current) {
      // Phase 0 = New Moon (Light behind the moon)
      // Phase 0.5 = Full Moon (Light in front of the moon)
      // Phase 1 = New Moon
      // We negate the phase angle so that the light orbits clockwise.
      // This means as phase increases from 0 to 0.5 (Waxing), the right side
      // gets illuminated first while the shadow is on the left.
      const angle = -(phase * Math.PI * 2) + Math.PI;

      lightGroupRef.current.rotation.y = angle;
    }
  });

  return (
    <>
      <ambientLight intensity={0.02} color="#ffffff" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

      <group ref={lightGroupRef}>
        <directionalLight
          position={[0, 0, 50]}
          intensity={4}
          color="#fff4e6"
          castShadow
        />
        {/* Fill light to barely see the dark side */}
        <directionalLight
          position={[0, 0, -50]}
          intensity={0.4}
          color="#3a5a8a"
        />
      </group>

      <mesh ref={moonRef}>
        <sphereGeometry args={[12, 128, 128]} />
        <meshStandardMaterial
          map={moonTexture}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </>
  );
}

// ─── Phase UI ──────────────────────────────────────────────────────────────────

export default function MoonPhasePanel({ onClose, phase, setPhase }: MoonPhasePanelProps) {
  const getPhaseName = (p: number) => {
    if (p < 0.05 || p > 0.95) return 'New Moon';
    if (p < 0.25) return 'Waxing Crescent';
    if (p < 0.3) return 'First Quarter';
    if (p < 0.45) return 'Waxing Gibbous';
    if (p < 0.55) return 'Full Moon';
    if (p < 0.75) return 'Waning Gibbous';
    if (p < 0.8) return 'Last Quarter';
    return 'Waning Crescent';
  };

  const illumination = Math.round((1 - Math.cos(phase * Math.PI * 2)) / 2 * 100);

  return (
    <div className="absolute inset-0 z-50 bg-[#020d1a] overflow-hidden flex flex-col">
      {/* 3D Viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 35], fov: 45 }} gl={{ antialias: true, alpha: false }}>
          <React.Suspense fallback={null}>
            <OrbitControls enableZoom={true} enablePan={false} minDistance={15} maxDistance={60} autoRotate={false} />
            <MoonScene phase={phase} />
          </React.Suspense>
        </Canvas>
      </div>

      {/* Top Bar Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-8 pointer-events-none">
        <span className="text-white font-bold text-xl tracking-widest pointer-events-auto" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.25em' }}>
          ASTROVA
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/15 pointer-events-auto"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', fontFamily: 'Orbitron, sans-serif' }}
        >
          <X size={12} />
          Close
        </button>
      </div>

      {/* Detail Overlay Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0" />

      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 w-full backdrop-blur-sm border-t border-white/10 z-10 p-6 pointer-events-auto"
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-2xl font-orbitron font-bold tracking-wider glow-text uppercase">Phase Navigator</h2>
                <p className="text-gray-400 font-orbitron tracking-widest text-sm mt-1 uppercase">29.5 Day Lunar Cycle</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={phase}
              onChange={(e) => setPhase(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
            />

            <div className="flex justify-between mt-2 text-xs text-gray-500 font-orbitron uppercase tracking-widest">
              <span>New</span>
              <span>First Qtr</span>
              <span>Full</span>
              <span>Last Qtr</span>
              <span>New</span>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 min-w-[150px]">
              <div className="text-xs text-gray-500 font-orbitron tracking-wider uppercase mb-1">Current Phase</div>
              <div className="text-lg font-medium">{getPhaseName(phase)}</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 min-w-[120px]">
              <div className="text-xs text-gray-500 font-orbitron tracking-wider uppercase mb-1">Illumination</div>
              <div className="text-lg font-medium">{illumination}%</div>
            </div>
            <button
              onClick={onClose}
              className="hidden md:block p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
