import React, { useState, useCallback, useEffect, useRef, useTransition, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { planets } from '../../data/planets';
import ShowcaseScene, { StaticEnvironment, IdlePreloader } from './ShowcaseScene';
import SolarSystem from '../scene/SolarSystem';
import HUD from '../hud/HUD';
import Navbar from '../ui/Navbar';

// ─── Transition variants ───────────────────────────────────────────────────────
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



// ─── Side planet label ─────────────────────────────────────────────────────────
function SideLabel({ name, side, isScrolled }: { name: string; side: 'left' | 'right'; isScrolled: boolean }) {
    return (
        <div
            className="fixed top-1/2 -translate-y-1/2 pointer-events-none select-none z-20"
            style={{
                [side === 'left' ? 'left' : 'right']: '6vw',
                opacity: isScrolled ? 0 : 1,
                transition: 'opacity 0.6s ease-in-out'
            }}
        >
            <p
                className="text-white/70 uppercase tracking-[0.35em] text-xs"
                style={{ fontFamily: 'Orbitron, sans-serif', writingMode: 'horizontal-tb' }}
            >
                {name}
            </p>
        </div>
    );
}

// ─── Scroll indicator ─────────────────────────────────────────────────────────
function ScrollIndicator({ visible }: { visible: boolean }) {
    return (
        <motion.div
            className="fixed bottom-10 left-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
            style={{ translateX: '-50%' }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.4 }}
        >
            <span
                className="text-white/40 uppercase tracking-[0.35em] text-[9px]"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
                Scroll
            </span>
            <motion.div
                className="w-[1px] bg-white/30 rounded-full"
                animate={{ height: [16, 32, 16], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
        </motion.div>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function PlanetShowcase({ onViewChange }: { onViewChange: (view: 'planets' | 'cosmos') => void }) {
    const [index, setIndex] = useState(0);
    const [showMap, setShowMap] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isPlanetSelected, setIsPlanetSelected] = useState(false);

    // Track both the current intended target AND the physical rendered state for crossfading
    const [targetIndex, setTargetIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPending, startTransition] = useTransition();

    const touchStartY = useRef(0);

    const total = planets.length;
    // The UI should follow the CURRENT visually stable planet, not the pending target planet.
    const planet = planets[currentIndex];
    const leftPl = planets[(currentIndex - 1 + total) % total];
    const rightPl = planets[(currentIndex + 1) % total];

    const nextLeftPl = planets[(targetIndex - 2 + total) % total];
    const nextRightPl = planets[(targetIndex + 2) % total];

    // Reset scroll when planet changes
    useEffect(() => {
        setIsScrolled(false);
    }, [targetIndex]);

    // When the Suspense boundary finally renders the new planet,
    // we can advance the currentIndex to match targetIndex, completing the swap.
    const onSceneReady = useCallback(() => {
        if (currentIndex !== targetIndex) {
            setCurrentIndex(targetIndex);
        }
    }, [currentIndex, targetIndex]);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 50) setIsScrolled(true);
        else if (e.deltaY < -50) setIsScrolled(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const delta = touchStartY.current - e.changedTouches[0].clientY;
        if (delta > 50) setIsScrolled(true);
        else if (delta < -50) setIsScrolled(false);
    };

    const go = useCallback((dir: 1 | -1) => {
        startTransition(() => {
            setTargetIndex((i) => (i + dir + total) % total);
            setAnimKey((k) => k + 1);
            setIsScrolled(false);
        });
    }, [total]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') go(-1);
            if (e.key === 'ArrowRight') go(1);
            if (e.key === 'Escape' && showMap) setShowMap(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [go, showMap]);

    if (showMap) {
        return (
            <div className="w-full h-screen relative overflow-hidden">
                <SolarSystem onPlanetSelected={setIsPlanetSelected} />
                <HUD />
                {!isPlanetSelected && (
                    <button
                        onClick={() => setShowMap(false)}
                        className="absolute top-20 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/15 group"
                        style={{
                            background: 'rgba(0,212,216,0.08)',
                            border: '1.5px solid rgba(0,212,216,0.45)',
                            color: '#00d4d8',
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '10px',
                            boxShadow: '0 0 18px rgba(0,212,216,0.12)',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Back
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full h-screen bg-[#020d1a] overflow-hidden select-none">
            {/* ── 1. FIXED 3D CANVAS LAYER ────────────────────────────────── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 3, 38], fov: 52 }} gl={{ antialias: true, alpha: false }}>
                    <StaticEnvironment />
                    <Suspense fallback={null}>
                        <ShowcaseScene
                            currentPlanet={planets[targetIndex]}
                            prevPlanet={planets[currentIndex]}
                            leftPlanet={planets[(targetIndex - 1 + total) % total]}
                            rightPlanet={planets[(targetIndex + 1) % total]}
                            isScrolled={isScrolled}
                            onReady={onSceneReady}
                        />
                    </Suspense>

                    {/* GPU Caching for +2 and -2 planets while idle */}
                    <Suspense fallback={null}>
                        {currentIndex === targetIndex && (
                            <>
                                <IdlePreloader planet={planets[(currentIndex + 2) % total]} />
                                <IdlePreloader planet={planets[(currentIndex - 2 + total) % total]} />
                            </>
                        )}
                    </Suspense>
                </Canvas>
            </div>

            {/* ── 2. GRADIENT OVERLAYS ─────────────────────────────────────── */}
            <div className="absolute inset-x-0 top-0 z-10 h-[55%] pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, rgba(2,13,26,0.82) 0%, rgba(2,13,26,0.3) 55%, transparent 100%)' }}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 h-[25%] pointer-events-none transition-opacity duration-700"
                style={{
                    background: 'linear-gradient(to top, rgba(2,13,26,0.6) 0%, transparent 100%)',
                    opacity: isScrolled ? 0 : 1,
                }}
            />

            {/* ── 3. SCROLL CATCHER LAYER ──────────────────────────────────── */}
            <div
                className="absolute inset-0 z-20 pointer-events-auto"
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            />

            {/* ── 4. FIXED UI LAYER ────────────────────────────────────────── */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Navbar */}
                <div style={{ pointerEvents: 'auto' }}>
                    <Navbar onExplore={() => setShowMap(true)} currentView="planets" onViewChange={onViewChange} />
                </div>

                {/* ── Side planet labels (fixed) ─────────────────────────────── */}
                <SideLabel name={leftPl.name} side="left" isScrolled={isScrolled} />
                <SideLabel name={rightPl.name} side="right" isScrolled={isScrolled} />

                {/* ── Hero text — fades out on scroll ───────────────────────── */}
                <div
                    className="absolute inset-x-0 top-0 flex flex-col items-center justify-start pointer-events-none"
                    style={{
                        paddingTop: 'clamp(90px, 13vh, 140px)',
                        opacity: isScrolled ? 0 : 1,
                        transform: `translateY(${isScrolled ? -40 : 0}px)`,
                        transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className="flex flex-col items-center"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* PLANET label */}
                            <motion.p
                                variants={textIn}
                                className="text-xs uppercase tracking-[0.45em] mb-3 font-semibold"
                                style={{ color: '#00d4d8', fontFamily: 'Orbitron, sans-serif' }}
                            >
                                Planet
                            </motion.p>

                            {/* Planet name */}
                            <motion.h1
                                variants={planetNameIn}
                                className="font-bold text-center leading-none mb-4 text-white"
                                style={{
                                    fontFamily: "'Playfair Display', 'Georgia', serif",
                                    fontSize: 'clamp(4.5rem, 11vw, 9rem)',
                                    textShadow: '0 0 60px rgba(255,255,255,0.15)',
                                }}
                            >
                                {planet.name.toUpperCase()}
                            </motion.h1>

                            {/* Teal accent line */}
                            <motion.div
                                variants={textIn}
                                className="mb-5 rounded-full"
                                style={{ width: 60, height: 2, background: '#00d4d8' }}
                            />

                            {/* Description */}
                            <motion.p
                                variants={textIn}
                                className="text-center max-w-[480px] leading-relaxed mb-8 px-4"
                                style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}
                            >
                                {planet.facts[0]}
                            </motion.p>

                            {/* CTA button */}
                            <motion.button
                                variants={textIn}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.2)' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowMap(true)}
                                className="px-9 py-3 rounded-full font-bold uppercase tracking-widest text-sm"
                                style={{
                                    background: '#ffffff',
                                    color: '#020d1a',
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: '12px',
                                    letterSpacing: '0.18em',
                                    pointerEvents: 'auto',
                                }}
                            >
                                Get Started
                            </motion.button>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── "Scrolled-in" planet label — appears at bottom of scroll ── */}
                <div
                    className="absolute top-1/2 left-[8vw] pointer-events-none"
                    style={{
                        opacity: isScrolled ? 1 : 0,
                        transform: `translate(0, calc(-50% + ${isScrolled ? 0 : 40}px))`,
                        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
                    }}
                >
                    <p
                        className="uppercase tracking-[0.35em] text-[10px] mb-1 font-semibold"
                        style={{ color: '#00d4d8', fontFamily: 'Orbitron, sans-serif' }}
                    >
                        The {['Mercury', 'Venus', 'Earth', 'Mars'].includes(planet.name) ? (
                            planet.name === 'Earth' ? 'Blue' :
                                planet.name === 'Mars' ? 'Red' :
                                    planet.name === 'Venus' ? 'Veiled' : 'Swift'
                        ) : planet.name === 'Jupiter' ? 'Giant' : planet.name === 'Saturn' ? 'Ringed' : planet.name === 'Uranus' ? 'Ice' : planet.name === 'Neptune' ? 'Mystic' : ''} Planet
                    </p>
                    <h2
                        className="text-white font-bold"
                        style={{
                            fontFamily: "'Playfair Display', 'Georgia', serif",
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        }}
                    >
                        {planet.name.toUpperCase()}
                    </h2>
                    <div className="mt-3 mb-4 rounded-full" style={{ width: 48, height: 2, background: '#00d4d8' }} />
                    <p
                        className="max-w-[420px] leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', maxWidth: '380px' }}
                    >
                        {planet.facts[0]}
                    </p>
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowMap(true)}
                            className="px-7 py-3 rounded-full font-bold uppercase tracking-widest"
                            style={{
                                background: '#ffffff',
                                color: '#020d1a',
                                fontFamily: 'Orbitron, sans-serif',
                                fontSize: '11px',
                                letterSpacing: '0.14em',
                                pointerEvents: isScrolled ? 'auto' : 'none',
                            }}
                        >
                            Learn More
                        </button>
                        <button
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/20 active:scale-95"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.25)',
                                color: 'white',
                                pointerEvents: isScrolled ? 'auto' : 'none',
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── Left / Right nav arrows (fixed) ────────────────────────── */}
                <div style={{ pointerEvents: 'auto' }}>
                    {[
                        { dir: -1 as const, side: 'left', icon: <ChevronLeft size={22} /> },
                        { dir: 1 as const, side: 'right', icon: <ChevronRight size={22} /> },
                    ].map(({ dir, side, icon }) => (
                        <button
                            key={side}
                            onClick={() => go(dir)}
                            className={`absolute top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-500 hover:scale-110 active:scale-95 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            style={{
                                [side]: '2vw',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                color: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(6px)',
                            }}
                            aria-label={`Navigate ${side}`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>

                {/* ── Planet dot indicators (fixed at bottom first screen) ────── */}
                <div style={{ pointerEvents: 'auto' }}>
                    <div
                        className="absolute bottom-8 left-1/2 flex gap-2 items-center"
                        style={{
                            transform: 'translateX(-50%)',
                            opacity: isScrolled ? 0 : 1,
                            pointerEvents: isScrolled ? 'none' : 'auto',
                            transition: 'opacity 0.6s ease-in-out'
                        }}
                    >
                        {planets.map((p, i) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    startTransition(() => {
                                        setIndex(i);
                                        setAnimKey(k => k + 1);
                                        setIsScrolled(false);
                                    });
                                }}
                                className="rounded-full transition-all"
                                style={{
                                    width: i === index ? 24 : 6,
                                    height: 6,
                                    background: i === index ? '#00d4d8' : 'rgba(255,255,255,0.25)',
                                }}
                                aria-label={p.name}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Scroll indicator ────────────────────────────────────────── */}
                <ScrollIndicator visible={!isScrolled} />
            </div>
        </div>
    );
}
