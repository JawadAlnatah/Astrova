import React, { useState } from 'react';
import { Volume2, VolumeX, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';

interface NavbarProps {
    onExplore: () => void;
    currentView: 'planets' | 'cosmos' | 'observatory';
    onViewChange: (view: 'planets' | 'cosmos' | 'observatory') => void;
}

export default function Navbar({
    onExplore,
    currentView,
    onViewChange,
}: NavbarProps) {
    const { isMuted, volume, toggleMute, setVolume } = useAudio();
    const [showAudioCard, setShowAudioCard] = useState(false);
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(2,13,26,0.95) 0%, transparent 100%)' }}
        >
            {/* Logo */}
            <span className="text-white font-bold text-xl tracking-widest pointer-events-auto" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.25em' }}>
                ASTROVA
            </span>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-10 pointer-events-auto">
                {(['planets', 'cosmos', 'observatory'] as const).map((link) => (
                    <button
                        key={link}
                        onClick={() => onViewChange(link)}
                        className="text-sm font-medium tracking-widest uppercase transition-colors"
                        style={{
                            color: currentView === link ? '#fff' : 'rgba(255,255,255,0.55)',
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '11px',
                        }}
                    >
                        {link}
                        {currentView === link && (
                            <div className="h-[2px] mt-1 rounded-full" style={{ background: '#00d4d8', width: '100%' }} />
                        )}
                    </button>
                ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3 relative z-50 pointer-events-auto">
                <button
                    onClick={() => setShowAudioCard(!showAudioCard)}
                    className="p-2 rounded-full transition-colors relative z-40"
                    style={{ background: showAudioCard ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                    {isMuted ? <VolumeX size={16} className="text-white/60" /> : <Volume2 size={16} className="text-white/60" />}
                </button>

                <AnimatePresence>
                    {showAudioCard && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-12 right-0 w-64 rounded-2xl p-4 shadow-2xl z-30 flex flex-col gap-4"
                            style={{
                                background: 'rgba(2,13,26,0.85)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(0,212,216,0.3)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)' // Added extra shadow for depth
                            }}
                        >
                            <div className="flex items-center justify-between pointer-events-auto">
                                <span className="text-[10px] uppercase tracking-widest text-[#00d4d8]" style={{ fontFamily: 'Orbitron, sans-serif' }}>Audio Systems</span>
                                <Settings2 size={14} className="text-white/40" />
                            </div>

                            <div className="flex items-center gap-4 pointer-events-auto">
                                <button
                                    onClick={toggleMute}
                                    className="p-2 rounded-full transition-colors bg-white/5 hover:bg-white/10"
                                >
                                    {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-white" />}
                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none outline-none overflow-hidden cursor-pointer"
                                    style={{
                                        boxShadow: `inset ${volume * 120}px 0 0 #00d4d8`
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Explore map button is only relevant in planets view */}
                {currentView === 'planets' && (
                    <button
                        onClick={onExplore}
                        className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10"
                        style={{
                            border: '1.5px solid rgba(255,255,255,0.5)',
                            color: '#fff',
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: '10px',
                        }}
                    >
                        Explore Map
                    </button>
                )}
            </div>
        </nav>
    );
}
