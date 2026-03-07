import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { planets } from '../../data/planets';
import MySkyPanel from './MySkyPanel';

interface PlanetPanelProps {
  planetId: string;
  onClose: () => void;
}

export default function PlanetPanel({ planetId, onClose }: PlanetPanelProps) {
  const planet = planets.find(p => p.id === planetId);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [showMySky, setShowMySky] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % (planet?.facts.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [planet]);

  if (!planet) return null;

  return (
    <>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-0 right-0 h-full w-full md:w-[450px] bg-black/80 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto no-scrollbar"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-orbitron font-bold tracking-wider glow-text uppercase">{planet.name}</h2>
              <p className="text-gray-400 font-orbitron tracking-widest text-sm mt-1 uppercase">{planet.classification}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {Object.entries(planet.stats).map(([key, value]) => (
              <div key={key} className="bg-white/5 border border-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-500 font-orbitron tracking-wider uppercase mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-sm font-medium">{value}</div>
              </div>
            ))}
          </div>

          {/* Shocking Facts */}
          <div className="mb-10 relative h-40">
            <h3 className="text-sm font-orbitron text-gray-400 tracking-widest uppercase mb-4 border-b border-white/10 pb-2">Shocking Facts</h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFactIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full"
              >
                <p className="text-xl font-light leading-relaxed italic border-l-2 pl-4" style={{ borderColor: planet.atmosphereColor }}>
                  "{planet.facts[currentFactIndex]}"
                </p>
              </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-0 right-0 flex gap-2">
              <button 
                onClick={() => setCurrentFactIndex((prev) => (prev - 1 + planet.facts.length) % planet.facts.length)}
                className="p-1 rounded bg-white/5 hover:bg-white/10"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentFactIndex((prev) => (prev + 1) % planet.facts.length)}
                className="p-1 rounded bg-white/5 hover:bg-white/10"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Missions */}
          <div>
            <h3 className="text-sm font-orbitron text-gray-400 tracking-widest uppercase mb-4 border-b border-white/10 pb-2">Missions</h3>
            <div className="space-y-4">
              {planet.missions.map((mission, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-orbitron font-bold tracking-wider text-lg">{mission.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${mission.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {mission.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{mission.agency} • {mission.launchYear}</div>
                  <p className="text-sm text-gray-300 mb-3">{mission.description}</p>
                  <div className="text-xs bg-black/40 p-2 rounded border border-white/5 hidden group-hover:block">
                    <span className="text-white/50">Fact:</span> {mission.facts[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Special Button for Earth */}
          {planet.id === 'earth' && (
            <button 
              onClick={() => setShowMySky(true)}
              className="w-full mt-8 py-4 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 rounded-xl font-orbitron tracking-widest uppercase text-sm transition-all glow-border"
            >
              My Sky Tonight
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showMySky && <MySkyPanel onClose={() => setShowMySky(false)} />}
      </AnimatePresence>
    </>
  );
}
