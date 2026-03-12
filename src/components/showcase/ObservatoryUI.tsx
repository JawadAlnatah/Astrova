import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CosmicObject, CosmicCategory } from '../../data/observatory';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ObservatoryUIProps {
    currentObj: CosmicObject;
    totalObjects: number;
    currentIndex: number;
    onNext: () => void;
    onPrev: () => void;
    onSetIndex: (index: number) => void;
    activeCategory: CosmicCategory;
    onSetCategory: (cat: CosmicCategory) => void;
    visibleItemsCount: number;
    is360View: boolean;
    onToggle360View: () => void;
}

const CATEGORIES: { id: CosmicCategory | 'all', label: string }[] = [
    { id: 'all', label: 'all' },
    { id: 'nebula', label: 'nebulae' },
    { id: 'starscape', label: 'starscapes' }
];

export default function ObservatoryUI({
    currentObj,
    totalObjects,
    currentIndex,
    onNext,
    onPrev,
    onSetIndex,
    activeCategory,
    onSetCategory,
    visibleItemsCount,
    is360View,
    onToggle360View
}: ObservatoryUIProps) {

    const [isHoveringTop, setIsHoveringTop] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Detect touch device — show filter bar by default on touch
    useEffect(() => {
        const isTouchDevice = window.matchMedia('(hover: none)').matches;
        if (isTouchDevice) setShowFilters(true);
    }, []);

    // Filter Bar at the top — always visible on mobile, hover-reveal on desktop
    const FilterBar = () => (
        <div
            className="fixed top-0 inset-x-0 z-40 flex flex-col items-center justify-start pt-20 md:pt-24 pointer-events-none"
            onMouseEnter={() => { setIsHoveringTop(true); setShowFilters(true); }}
            onMouseLeave={() => { setIsHoveringTop(false); setShowFilters(false); }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showFilters ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap justify-center gap-4 md:gap-6 px-6 md:px-8 pointer-events-auto"
            >
                {CATEGORIES.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => onSetCategory(id as CosmicCategory)}
                        className="text-[9px] uppercase tracking-[0.2em] font-medium relative py-1 transition-colors"
                        style={{
                            fontFamily: 'Orbitron, sans-serif',
                            color: activeCategory === id ? '#fff' : 'rgba(255,255,255,0.4)'
                        }}
                    >
                        {label}
                        {activeCategory === id && (
                            <motion.div
                                layoutId="activeCat"
                                className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#00d4d8]"
                            />
                        )}
                    </button>
                ))}

                {/* 360 View Toggle */}
                <button
                    onClick={onToggle360View}
                    className="text-[9px] uppercase tracking-[0.2em] font-medium relative py-1 transition-colors ml-4 md:ml-8 border border-white/20 px-3 rounded-full hover:bg-white/10"
                    style={{
                        fontFamily: 'Orbitron, sans-serif',
                        color: is360View ? '#00d4d8' : 'rgba(255,255,255,0.6)',
                        borderColor: is360View ? '#00d4d8' : 'rgba(255,255,255,0.2)'
                    }}
                >
                    {is360View ? '360°: ON' : '360°: OFF'}
                </button>
            </motion.div>
        </div>
    );

    // Information Layer staggered fade in based on object ID change
    const InfoLayer = () => (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentObj.id}
                className="absolute inset-0 pointer-events-none z-30"
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* Name & Classification (Left side, low) */}
                <div className="absolute left-5 md:left-20 bottom-24 md:bottom-40 max-w-[calc(100%-2.5rem)] md:max-w-2xl pr-4 md:pr-0">
                    <motion.p
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 1.5 } } }}
                        className="text-[#00d4d8] uppercase tracking-[0.3em] font-semibold text-[9px] md:text-xs mb-2 md:mb-3"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                    >
                        {currentObj.classification}
                    </motion.p>
                    <motion.h1
                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.7, duration: 1.5 } } }}
                        className="text-white font-bold leading-none mb-3 md:mb-6 tracking-widest uppercase"
                        style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.6rem, 5vw, 4.5rem)', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
                    >
                        {currentObj.title}
                    </motion.h1>
                    <motion.p
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1.5, duration: 2.0 } } }}
                        className="text-white/80 text-sm md:text-lg leading-relaxed max-w-sm md:max-w-xl"
                        style={{ fontFamily: "'Playfair Display', 'Georgia', serif", textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                    >
                        {currentObj.fact}
                    </motion.p>
                </div>

                {/* Distance (Bottom right) — move up on mobile so it doesn't overlap nav dots */}
                <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 2.0, duration: 2.0 } } }}
                    className="absolute right-4 md:right-8 bottom-20 md:bottom-12 text-white/30 text-[9px] md:text-xs tracking-widest uppercase text-right max-w-[160px] md:max-w-[200px]"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    {currentObj.distance}
                </motion.div>

                {/* Credit (Bottom left) — push up so it doesn't overlap back button */}
                <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 2.5, duration: 2.0 } } }}
                    className="absolute left-5 md:left-8 bottom-20 md:bottom-12 text-white/30 text-[8px] md:text-[10px] tracking-widest uppercase"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                    {currentObj.credit}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    // Standard Nav Dots — centered at the very bottom
    const NavDots = () => (
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 z-30 pointer-events-auto">
            {Array.from({ length: visibleItemsCount }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => onSetIndex(i)}
                    className="rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: i === currentIndex ? 24 : 6,
                        height: 6,
                        background: i === currentIndex ? currentObj.glowColor || '#00d4d8' : 'rgba(255,255,255,0.2)'
                    }}
                    aria-label={`Go to object ${i + 1}`}
                />
            ))}
        </div>
    );

    // Navigation arrows — bigger touch targets on mobile
    const NavArrows = () => (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-1 md:px-8">
            <button
                onClick={onPrev}
                className="pointer-events-auto p-4 md:p-4 rounded-full text-white/40 hover:text-white/90 active:text-white transition-colors"
                style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 70%)' }}
                aria-label="Previous object"
            >
                <ChevronLeft size={36} strokeWidth={1} />
            </button>
            <button
                onClick={onNext}
                className="pointer-events-auto p-4 md:p-4 rounded-full text-white/40 hover:text-white/90 active:text-white transition-colors"
                style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, transparent 70%)' }}
                aria-label="Next object"
            >
                <ChevronRight size={36} strokeWidth={1} />
            </button>
        </div>
    );

    return (
        <>
            <FilterBar />
            <InfoLayer />
            <NavArrows />
            <NavDots />
        </>
    );
}
