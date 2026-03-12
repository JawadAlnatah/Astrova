import React, { useState } from 'react';
import { Volume2, VolumeX, Settings2, Menu, X } from 'lucide-react';
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
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const navLinks = (['planets', 'cosmos', 'observatory'] as const);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-5 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(2,13,26,0.95) 0%, transparent 100%)' }}
        >
            {/* Logo */}
            <span className="text-white font-bold text-lg md:text-xl tracking-widest pointer-events-auto" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.25em' }}>
                ASTROVA
            </span>

            {/* Desktop Nav links */}
            <div className="hidden md:flex items-center gap-10 pointer-events-auto">
                {navLinks.map((link) => (
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
            <div className="flex items-center gap-2 md:gap-3 relative z-50 pointer-events-auto">
                {/* Audio button */}
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
                            className="absolute top-12 right-0 w-56 md:w-64 rounded-2xl p-4 shadow-2xl z-30 flex flex-col gap-4"
                            style={{
                                background: 'rgba(2,13,26,0.85)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(0,212,216,0.3)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
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

                {/* Explore map button — desktop only in planets view */}
                {currentView === 'planets' && (
                    <button
                        onClick={onExplore}
                        className="hidden md:block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10"
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

                {/* Mobile hamburger menu button */}
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="md:hidden p-2 rounded-full transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                    aria-label="Open navigation menu"
                >
                    {showMobileMenu ? <X size={18} className="text-white/80" /> : <Menu size={18} className="text-white/80" />}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 flex flex-col pointer-events-auto"
                        style={{
                            background: 'rgba(2,13,26,0.97)',
                            backdropFilter: 'blur(16px)',
                            borderBottom: '1px solid rgba(0,212,216,0.15)',
                        }}
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link}
                                onClick={() => { onViewChange(link); setShowMobileMenu(false); }}
                                className="flex items-center justify-between px-6 py-4 uppercase tracking-widest transition-colors text-left"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: '11px',
                                    color: currentView === link ? '#fff' : 'rgba(255,255,255,0.5)',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                }}
                            >
                                {link}
                                {currentView === link && (
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00d4d8' }} />
                                )}
                            </button>
                        ))}
                        {currentView === 'planets' && (
                            <button
                                onClick={() => { onExplore(); setShowMobileMenu(false); }}
                                className="px-6 py-4 uppercase tracking-widest text-left"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: '11px',
                                    color: '#00d4d8',
                                }}
                            >
                                Explore Map →
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
