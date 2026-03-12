import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../ui/Navbar';
import ObservatoryUI from './ObservatoryUI';
import ObservatoryScene from './ObservatoryScene';
import { cosmosCollection, CosmicObject, CosmicCategory } from '../../data/observatory';
import { ErrorBoundary } from 'react-error-boundary';
import { useDeviceTier } from '../../hooks/useDeviceTier';

interface ObservatoryProps {
    onViewChange: (view: 'planets' | 'cosmos' | 'observatory') => void;
}

export default function Observatory({ onViewChange }: ObservatoryProps) {
    const tier = useDeviceTier();
    const [isReady, setIsReady] = useState(false);

    const [allObjects, setAllObjects] = useState<CosmicObject[]>([]);
    const [filteredObjects, setFilteredObjects] = useState<CosmicObject[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [activeCategory, setActiveCategory] = useState<CosmicCategory>('all');
    const [is360View, setIs360View] = useState(true);

    const isTransitioningRef = useRef(false);

    const navigateTo = (newIndexOrUpdater: number | ((prev: number) => number)) => {
        if (isTransitioningRef.current) return;
        setIsTransitioning(true);
        isTransitioningRef.current = true;

        setTimeout(() => {
            setCurrentIndex(prev => {
                const nextIdx = typeof newIndexOrUpdater === 'function' ? newIndexOrUpdater(prev) : newIndexOrUpdater;
                setDisplayedIndex(nextIdx);
                return nextIdx;
            });
        }, 800);

        setTimeout(() => {
            setIsTransitioning(false);
            isTransitioningRef.current = false;
        }, 1600);
    };

    // Initial load
    useEffect(() => {
        let mounted = true;
        const loadData = () => {
            if (!mounted) return;

            setAllObjects([...cosmosCollection]);
            setFilteredObjects([...cosmosCollection]);

            const minDelay = tier === 'high' ? 3000 : 1500; // shorter wait on mobile
            setTimeout(() => {
                if (mounted) setIsReady(true);
            }, minDelay);
        };

        loadData();

        return () => { mounted = false; };
    }, []);

    // Prevent body bounce on touch devices
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    // Keyboard & Scroll Navigation
    useEffect(() => {
        if (!isReady || filteredObjects.length === 0) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                navigateTo(prev => (prev - 1 + filteredObjects.length) % filteredObjects.length);
            } else if (e.key === 'ArrowRight') {
                navigateTo(prev => (prev + 1) % filteredObjects.length);
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 50) {
                navigateTo(prev => (prev + 1) % filteredObjects.length);
            } else if (e.deltaY < -50) {
                navigateTo(prev => (prev - 1 + filteredObjects.length) % filteredObjects.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [isReady, filteredObjects.length]);

    // Handle Category change
    const handleSetCategory = (cat: CosmicCategory) => {
        setActiveCategory(cat);
        const nextFiltered = cat === 'all' ? allObjects : allObjects.filter(obj => obj.category === cat);
        setFilteredObjects(nextFiltered);

        if (isTransitioningRef.current) return;
        setIsTransitioning(true);
        isTransitioningRef.current = true;
        setTimeout(() => {
            setCurrentIndex(0);
            setDisplayedIndex(0);
        }, 800);
        setTimeout(() => {
            setIsTransitioning(false);
            isTransitioningRef.current = false;
        }, 1600);
    };

    const currentObj = filteredObjects[currentIndex];
    const displayedObj = filteredObjects[displayedIndex] || currentObj;

    return (
        <div className="w-full h-screen bg-black overflow-hidden relative text-white" style={{ touchAction: 'none' }}>

            {/* Cinematic Entry Overlay */}
            <AnimatePresence>
                {!isReady && (
                    <motion.div
                        key="entry-overlay"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center"
                    >
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="text-white font-bold tracking-[0.3em] uppercase mb-4 text-center"
                            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)' }}
                        >
                            THE OBSERVATORY
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 1 }}
                            className="text-white/60 tracking-widest text-sm text-center"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            "The universe, one wonder at a time."
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-0 inset-x-0 z-50 pointer-events-none">
                <Navbar
                    onExplore={() => onViewChange('planets')}
                    currentView="observatory"
                    onViewChange={onViewChange}
                />
            </div>

            {/* Return Link — positioned to avoid nav dots */}
            <div className="absolute bottom-16 md:bottom-8 left-4 md:left-8 z-40 pointer-events-auto">
                <button
                    onClick={() => onViewChange('planets')}
                    className="group flex flex-col items-start gap-1 p-2 opacity-50 hover:opacity-100 active:opacity-100 transition-opacity duration-300"
                >
                    <span
                        className="text-[10px] tracking-[0.2em] uppercase font-bold text-white transition-colors"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                        &larr; Solar System
                    </span>
                    <div className="h-[1px] w-0 group-hover:w-full bg-[#00d4d8] transition-all duration-300" />
                </button>
            </div>

            {/* Main Interactive Layers */}
            {isReady && currentObj && (
                <>
                    <ObservatoryUI
                        currentObj={currentObj}
                        totalObjects={allObjects.length}
                        currentIndex={currentIndex}
                        onNext={() => navigateTo(prev => (prev + 1) % filteredObjects.length)}
                        onPrev={() => navigateTo(prev => (prev - 1 + filteredObjects.length) % filteredObjects.length)}
                        onSetIndex={navigateTo}
                        activeCategory={activeCategory}
                        onSetCategory={handleSetCategory}
                        visibleItemsCount={filteredObjects.length}
                        is360View={is360View}
                        onToggle360View={() => setIs360View(v => !v)}
                    />

                    <div className="absolute inset-0 z-0 bg-black">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="w-full h-full absolute inset-0"
                        >
                            <AnimatePresence>
                                {isTransitioning && (
                                    <motion.div
                                        key="transition-overlay"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute inset-0 z-20 bg-black pointer-events-none"
                                    />
                                )}
                            </AnimatePresence>

                            <ErrorBoundary fallback={
                                <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
                                    <p className="text-[#00d4d8]/50 uppercase tracking-widest text-xs" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                                        Visual Data Unavailable
                                    </p>
                                </div>
                            }>
                                <ObservatoryScene currentObj={displayedObj} is360View={is360View} />
                            </ErrorBoundary>
                        </motion.div>
                    </div>
                </>
            )}
        </div>
    );
}
