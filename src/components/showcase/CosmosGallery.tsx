import React from 'react';
import { motion } from 'framer-motion';
import { cosmosData } from '../../data/cosmos';
import Navbar from '../ui/Navbar';

export default function CosmosGallery({ onViewChange }: { onViewChange: (view: 'planets' | 'cosmos') => void }) {
    return (
        <div className="w-full h-screen bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth relative text-white" style={{ scrollSnapType: 'y mandatory', scrollBehavior: 'smooth' }}>
            {/* Shared Navbar overlay */}
            <div className="fixed top-0 inset-x-0 z-50 pointer-events-auto">
                <Navbar
                    onExplore={() => { }}
                    currentView="cosmos"
                    onViewChange={onViewChange}
                />
            </div>

            {/* Scroll Indication at the very top */}
            <motion.div
                className="fixed bottom-10 left-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none mix-blend-difference"
                style={{ translateX: '-50%' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <span className="text-white/60 uppercase tracking-[0.35em] text-[9px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    Scroll to Explore
                </span>
                <motion.div
                    className="w-[1px] bg-white/50 rounded-full"
                    animate={{ height: [16, 32, 16], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
            </motion.div>

            {/* Gallery Sections */}
            {cosmosData.map((item, index) => (
                <section
                    key={item.id}
                    className="w-full h-screen snap-start relative flex items-center justify-center overflow-hidden"
                >
                    {/* Background Image Container */}
                    <div className="absolute inset-0 z-0 bg-black">
                        <motion.img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1.8, ease: "easeOut" }}
                        />
                        {/* Dramatic vignette and text protection gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none w-1/2" />
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto px-12 md:px-24 flex flex-col justify-end h-full pb-32">
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: false, amount: 0.6 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            <motion.p
                                className="text-[#00d4d8] uppercase tracking-[0.45em] text-xs font-semibold mb-4"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                {item.category}
                            </motion.p>

                            <motion.h1
                                className="font-bold leading-none mb-6"
                                style={{
                                    fontFamily: "'Playfair Display', 'Georgia', serif",
                                    fontSize: 'clamp(3rem, 6vw, 6rem)',
                                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                }}
                            >
                                {item.title}
                            </motion.h1>

                            <motion.div
                                className="h-[2px] bg-[#00d4d8] w-16 mb-6 rounded-full"
                            />

                            <motion.p
                                className="text-white/80 leading-relaxed text-lg lg:text-xl font-light drop-shadow-md mb-6"
                                style={{
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                }}
                            >
                                {item.description}
                            </motion.p>

                            <motion.p
                                className="text-white/40 uppercase tracking-widest text-[10px]"
                                style={{ fontFamily: 'Orbitron, sans-serif' }}
                            >
                                CREDIT: {item.credit}
                            </motion.p>
                        </motion.div>
                    </div>
                </section>
            ))}
        </div>
    );
}
