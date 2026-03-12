import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Stars, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as THREE from 'three';
import { planets } from '../../data/planets';

// ─── Transition variants (same as PlanetShowcase) ─────────────────────────────
const textIn: Variants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const planetNameIn: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.94 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.25 } },
};

const overlayIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.45 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

// ─── Saturn rings (copied from ShowcaseScene for full fidelity) ───────────────
function SaturnRings({ ringTextureUrl, planetRadius }: { ringTextureUrl: string; planetRadius: number }) {
    const [ringTex] = useTexture([ringTextureUrl]);

    const ringGeo = useMemo(() => {
        const inner = planetRadius * 1.25;
        const outer = planetRadius * 2.3;
        const geo = new THREE.RingGeometry(inner, outer, 128, 8);

        const pos = geo.attributes.position as THREE.BufferAttribute;
        const uv = geo.attributes.uv as THREE.BufferAttribute;
        const v3 = new THREE.Vector3();

        for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            const len = v3.length();
            const u = (len - inner) / (outer - inner);
            uv.setXY(i, u, 0.5);
        }
        uv.needsUpdate = true;
        return geo;
    }, [planetRadius]);

    ringTex.colorSpace = THREE.SRGBColorSpace;

    return (
        <mesh geometry={ringGeo} rotation={[Math.PI * 0.42, 0.1, 0.05]}>
            <meshBasicMaterial
                color="#c8a96e"
                alphaMap={ringTex}
                transparent
                opacity={1}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.NormalBlending}
            />
        </mesh>
    );
}

// ─── Hero planet sphere (fully visible, centered at y=0) ─────────────────────
const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

function HeroPlanetSphere({
    textureUrl,
    cloudsUrl,
    ringTextureUrl,
    isInteracting,
}: {
    textureUrl: string;
    cloudsUrl?: string;
    ringTextureUrl?: string;
    isInteracting: boolean;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const { gl } = useThree();
    const maxAniso = gl.capabilities.getMaxAnisotropy();

    const textures = useTexture([textureUrl, cloudsUrl || PLACEHOLDER]);
    const texture = textures[0];
    const cloudsTexture = cloudsUrl ? textures[1] : null;

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAniso;
    texture.needsUpdate = true;
    if (cloudsTexture) {
        cloudsTexture.colorSpace = THREE.SRGBColorSpace;
        cloudsTexture.anisotropy = maxAniso;
        cloudsTexture.needsUpdate = true;
    }

    useFrame(() => {
        if (!isInteracting) {
            if (meshRef.current) meshRef.current.rotation.y += 0.0025;
            if (cloudsRef.current) cloudsRef.current.rotation.y += 0.003;
        }
    });

    // radius=22, position fully centered at [0,0,0] so the whole planet is visible
    return (
        <group position={[0, 0, 0]}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[22, 128, 128]} />
                <meshStandardMaterial map={texture} roughness={0.75} metalness={0.05} />
            </mesh>

            {cloudsTexture && (
                <mesh ref={cloudsRef}>
                    <sphereGeometry args={[22 * 1.008, 128, 128]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        alphaMap={cloudsTexture}
                        transparent
                        opacity={0.9}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            )}

            {ringTextureUrl && (
                <SaturnRings ringTextureUrl={ringTextureUrl} planetRadius={22} />
            )}
        </group>
    );
}

// ─── 3D Scene ─────────────────────────────────────────────────────────────────
function DetailScene({
    planet,
}: {
    planet: (typeof planets)[0];
}) {
    const [isInteracting, setIsInteracting] = useState(false);

    return (
        <>
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                enableRotate={true}
                rotateSpeed={0.5}
                autoRotate={false}
                onStart={() => setIsInteracting(true)}
                onEnd={() => setIsInteracting(false)}
            />
            {/* Same lighting as ShowcaseScene for identical look */}
            <ambientLight intensity={0.08} color="#c8d8ff" />
            <directionalLight position={[-12, 6, 10]} color="#fff5e0" intensity={3.5} castShadow={false} />
            <directionalLight position={[10, -4, -8]} color="#1a3a6a" intensity={0.4} />

            <Stars radius={200} depth={60} count={7000} factor={4} saturation={0} fade speed={0.5} />

            <HeroPlanetSphere
                key={planet.id}
                textureUrl={planet.textureUrl}
                cloudsUrl={planet.cloudsUrl}
                ringTextureUrl={planet.ringTextureUrl}
                isInteracting={isInteracting}
            />
        </>
    );
}

// ─── Stats panel (right side) ─────────────────────────────────────────────────
function StatsPanel({ planet }: { planet: (typeof planets)[0] }) {
    const [factIndex, setFactIndex] = useState(0);

    useEffect(() => {
        const iv = setInterval(() => {
            setFactIndex((i) => (i + 1) % planet.facts.length);
        }, 5000);
        return () => clearInterval(iv);
    }, [planet]);

    return (
        <div
            className="absolute top-0 right-0 h-full overflow-y-auto no-scrollbar hidden md:block"
            style={{
                width: 'min(420px, 38vw)',
                background: 'linear-gradient(to left, rgba(2,5,18,0.92) 0%, rgba(2,5,18,0.75) 70%, transparent 100%)',
                paddingTop: 'clamp(80px, 11vh, 120px)',
                paddingBottom: '40px',
                paddingRight: '40px',
                paddingLeft: '32px',
            }}
        >
            {/* Classification badge */}
            <motion.p
                variants={textIn}
                initial="hidden"
                animate="visible"
                className="text-xs uppercase tracking-[0.45em] mb-2 font-semibold"
                style={{ color: '#00d4d8', fontFamily: 'Orbitron, sans-serif' }}
            >
                {planet.classification}
            </motion.p>

            {/* Planet name */}
            <motion.h1
                variants={planetNameIn}
                initial="hidden"
                animate="visible"
                className="font-bold leading-none mb-4 text-white"
                style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                    textShadow: '0 0 60px rgba(255,255,255,0.15)',
                }}
            >
                {planet.name.toUpperCase()}
            </motion.h1>

            {/* Teal accent line */}
            <motion.div
                variants={textIn}
                initial="hidden"
                animate="visible"
                className="mb-5 rounded-full"
                style={{ width: 60, height: 2, background: '#00d4d8' }}
            />

            {/* Description (first fact) */}
            <motion.p
                variants={textIn}
                initial="hidden"
                animate="visible"
                className="leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}
            >
                {planet.facts[0]}
            </motion.p>

            {/* Stats grid */}
            <motion.div
                variants={textIn}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 mb-6"
            >
                {Object.entries(planet.stats).map(([key, value]) => (
                    <div
                        key={key}
                        className="rounded-xl p-3"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                    >
                        <div
                            className="text-[10px] uppercase tracking-wider mb-1"
                            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Orbitron, sans-serif' }}
                        >
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-medium text-white">{value}</div>
                    </div>
                ))}
            </motion.div>

            {/* Rotating fact */}
            <motion.div
                variants={textIn}
                initial="hidden"
                animate="visible"
                className="mb-6 relative"
                style={{ minHeight: '90px' }}
            >
                <h3
                    className="text-[10px] uppercase tracking-widest mb-3 pb-2"
                    style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontFamily: 'Orbitron, sans-serif',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    Shocking Facts
                </h3>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={factIndex}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm leading-relaxed italic pl-3"
                        style={{ color: 'rgba(255,255,255,0.75)', borderLeft: `2px solid ${planet.atmosphereColor}` }}
                    >
                        "{planet.facts[factIndex]}"
                    </motion.p>
                </AnimatePresence>
                <div className="flex gap-2 mt-3 justify-end">
                    <button
                        onClick={() => setFactIndex((i) => (i - 1 + planet.facts.length) % planet.facts.length)}
                        className="p-1 rounded transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() => setFactIndex((i) => (i + 1) % planet.facts.length)}
                        className="p-1 rounded transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </motion.div>

            {/* Missions */}
            <motion.div variants={textIn} initial="hidden" animate="visible">
                <h3
                    className="text-[10px] uppercase tracking-widest mb-3 pb-2"
                    style={{
                        color: 'rgba(255,255,255,0.4)',
                        fontFamily: 'Orbitron, sans-serif',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    Missions
                </h3>
                <div className="space-y-3">
                    {planet.missions.map((mission, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl p-4 group cursor-pointer transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                            }}
                            onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.09)')
                            }
                            onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)')
                            }
                        >
                            <div className="flex justify-between items-center mb-1">
                                <h4
                                    className="font-bold tracking-wider text-sm text-white"
                                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                                >
                                    {mission.name}
                                </h4>
                                <span
                                    className="text-[10px] px-2 py-0.5 rounded-full"
                                    style={{
                                        background:
                                            mission.status === 'Active' ? 'rgba(34,197,94,0.2)' : 'rgba(156,163,175,0.2)',
                                        color: mission.status === 'Active' ? '#4ade80' : '#9ca3af',
                                    }}
                                >
                                    {mission.status}
                                </span>
                            </div>
                            <div className="text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                {mission.agency} · {mission.launchYear}
                            </div>
                            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {mission.description}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

// ─── Main overlay ─────────────────────────────────────────────────────────────
interface PlanetDetailOverlayProps {
    planetId: string;
    onClose: () => void;
}

export default function PlanetDetailOverlay({ planetId, onClose }: PlanetDetailOverlayProps) {
    const planet = planets.find((p) => p.id === planetId);

    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
            }
        };
        // Add listener to the document capturing phase so we intercept it first
        document.addEventListener('keydown', handler, true);
        return () => document.removeEventListener('keydown', handler, true);
    }, [onClose]);

    if (!planet) return null;

    return (
        <AnimatePresence>
            <motion.div
                key="planet-detail-overlay"
                variants={overlayIn}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 z-50 overflow-hidden"
                style={{ background: '#020d1a' }}
            >
                {/* ── 3D Canvas — same settings as PlanetShowcase ─────────────────────── */}
                {/* Camera pulled back slightly more (fov 48, z=42) to ensure the large
            planet (r=22) stays fully within the viewport even on narrow screens. */}
                <div className="absolute inset-0">
                    <Canvas
                        key={planet.id}
                        camera={{ position: [0, 0, 52], fov: 48 }}
                        gl={{ antialias: true, alpha: false }}
                        dpr={[1, 2]}
                    >
                        <React.Suspense fallback={null}>
                            <DetailScene planet={planet} />
                        </React.Suspense>
                    </Canvas>
                </div>

                {/* ── Top gradient overlay (same as PlanetShowcase) ───────────────────── */}
                <div
                    className="absolute inset-x-0 top-0 z-10 h-[55%] pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to bottom, rgba(2,13,26,0.82) 0%, rgba(2,13,26,0.3) 55%, transparent 100%)',
                    }}
                />
                {/* Bottom vignette */}
                <div
                    className="absolute inset-x-0 bottom-0 z-10 h-[20%] pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(2,13,26,0.5) 0%, transparent 100%)' }}
                />

                {/* ── Navbar-style top bar ─────────────────────────────────────────────── */}
                <div
                    className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(2,13,26,0.95) 0%, transparent 100%)',
                    }}
                >
                    <span
                        className="text-white font-bold text-xl tracking-widest"
                        style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.25em' }}
                    >
                        ASTROVA
                    </span>

                    {/* Close button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/15"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: '1.5px solid rgba(255,255,255,0.3)',
                            color: '#fff',
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '10px',
                        }}
                    >
                        <X size={12} />
                        Close
                    </button>
                </div>

                {/* ── Left side: planet name hero text ─── Desktop layout ─────────────── */}
                <div
                    className="absolute left-0 top-0 bottom-0 z-20 flex flex-col justify-center pointer-events-none hidden md:flex"
                    style={{ paddingLeft: 'clamp(32px, 6vw, 80px)', maxWidth: '50vw' }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={planet.id}
                            className="flex flex-col"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.p
                                variants={textIn}
                                className="text-xs uppercase tracking-[0.45em] mb-3 font-semibold"
                                style={{ color: '#00d4d8', fontFamily: 'Orbitron, sans-serif' }}
                            >
                                Planet
                            </motion.p>

                            <motion.h1
                                variants={planetNameIn}
                                className="font-bold leading-none mb-4 text-white"
                                style={{
                                    fontFamily: "'Playfair Display', 'Georgia', serif",
                                    fontSize: 'clamp(4.5rem, 11vw, 9rem)',
                                    textShadow: '0 0 60px rgba(255,255,255,0.15)',
                                }}
                            >
                                {planet.name.toUpperCase()}
                            </motion.h1>

                            <motion.div
                                variants={textIn}
                                className="mb-5 rounded-full"
                                style={{ width: 60, height: 2, background: '#00d4d8' }}
                            />

                            <motion.p
                                variants={textIn}
                                className="leading-relaxed"
                                style={{
                                    color: 'rgba(255,255,255,0.55)',
                                    fontSize: '15px',
                                    maxWidth: '440px',
                                }}
                            >
                                {planet.facts[0]}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Mobile: Planet name + scrollable stats stacked ─────────────────── */}
                <div className="md:hidden absolute inset-0 z-20 flex flex-col overflow-hidden"
                    style={{ paddingTop: '72px' }}
                >
                    {/* Planet name at the top on mobile */}
                    <div className="px-5 pt-4 flex-shrink-0 pointer-events-none">
                        <p className="text-[#00d4d8] uppercase tracking-[0.3em] font-semibold text-[9px] mb-1"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}>Planet</p>
                        <h1 className="font-bold leading-none mb-3 text-white uppercase"
                            style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: 'clamp(2rem, 10vw, 3.5rem)', textShadow: '0 0 40px rgba(255,255,255,0.15)' }}>
                            {planet.name.toUpperCase()}
                        </h1>
                    </div>
                    {/* Scrollable stats below */}
                    <div className="flex-1 overflow-y-auto no-scrollbar"
                        style={{
                            background: 'linear-gradient(to top, rgba(2,5,18,0.98) 0%, rgba(2,5,18,0.80) 60%, transparent 100%)',
                            paddingTop: '12px', paddingBottom: '32px', paddingLeft: '20px', paddingRight: '20px'
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div key={planet.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <StatsPanel planet={planet} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Right side stats panel ─────────── Desktop only ──────────────────── */}
                <div className="absolute top-0 right-0 h-full z-20 pointer-events-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={planet.id}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.15 } }}
                            exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
                            className="h-full"
                        >
                            <StatsPanel planet={planet} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
