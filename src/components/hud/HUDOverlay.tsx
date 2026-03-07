import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { planets } from '../../data/planets';

interface HUDOverlayProps {
  selectedPlanetId: string | null;
  onSelectPlanet: (id: string) => void;
}

// Animated coordinate ticker
function CoordTicker({ value }: { value: string }) {
  return (
    <span className="font-mono" style={{ color: '#00d4d8', letterSpacing: '0.08em' }}>
      {value}
    </span>
  );
}

export default function HUDOverlay({ selectedPlanetId, onSelectPlanet }: HUDOverlayProps) {
  const [showHint, setShowHint] = useState(true);
  const [time, setTime] = useState(new Date());
  const [scanLine, setScanLine] = useState(0);

  // Fade hint after 5 s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Live clock
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // Animated scan line across the screen
  useEffect(() => {
    let raf: number;
    let pos = 0;
    const animate = () => {
      pos = (pos + 0.2) % 100;
      setScanLine(pos);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">

      {/* ── Moving scan line ─────────────────────────────────────────────────── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          top: `${scanLine}%`,
          height: 1,
          background: 'linear-gradient(to right, transparent 0%, rgba(0,212,216,0.12) 20%, rgba(0,212,216,0.06) 80%, transparent 100%)',
          zIndex: 1,
        }}
      />



      {/* ── Center hint ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.6 }}
            className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
          >
            {/* Pulsing dot */}
            <div className="relative flex items-center justify-center">
              <div
                className="w-2 h-2 rounded-full animate-ping absolute"
                style={{ background: 'rgba(0,212,216,0.4)' }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#00d4d8' }}
              />
            </div>
            <div
              className="font-orbitron text-[10px] uppercase tracking-[0.3em]"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Drag · Scroll · Click planet
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom planet strip ───────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-0.5 pointer-events-auto"
        style={{
          background: 'linear-gradient(to top, rgba(1,3,14,0.97) 0%, rgba(1,4,18,0.85) 60%, transparent 100%)',
          paddingBottom: '16px',
          paddingTop: '36px',
        }}
      >
        {/* Thin teal line above the strip */}
        <div
          className="absolute top-9 left-0 right-0 mx-auto"
          style={{
            height: 1,
            background: 'linear-gradient(to right, transparent 5%, rgba(0,212,216,0.25) 30%, rgba(0,212,216,0.25) 70%, transparent 95%)',
            width: '70%',
          }}
        />

        {planets.map((planet) => {
          const isActive = selectedPlanetId === planet.id;
          return (
            <button
              key={planet.id}
              onClick={() => onSelectPlanet(planet.id)}
              className="flex flex-col items-center gap-1.5 px-3.5 py-2.5 rounded-lg transition-all duration-250 group relative"
              style={{
                background: isActive
                  ? `radial-gradient(ellipse at 50% 0%, ${planet.atmosphereColor}22 0%, transparent 70%)`
                  : 'transparent',
                border: isActive
                  ? `1px solid ${planet.atmosphereColor}55`
                  : '1px solid transparent',
              }}
            >
              {/* Glow dot */}
              <div
                className="rounded-full transition-all duration-250"
                style={{
                  width: isActive ? 10 : 7,
                  height: isActive ? 10 : 7,
                  background: planet.atmosphereColor,
                  boxShadow: isActive
                    ? `0 0 10px ${planet.atmosphereColor}, 0 0 20px ${planet.atmosphereColor}66`
                    : `0 0 4px ${planet.atmosphereColor}55`,
                  opacity: isActive ? 1 : 0.55,
                  transition: 'all 0.25s ease',
                }}
              />

              {/* Active indicator line at top */}
              {isActive && (
                <div
                  className="absolute top-0 left-4 right-4 rounded-full"
                  style={{ height: 2, background: planet.atmosphereColor, boxShadow: `0 0 8px ${planet.atmosphereColor}` }}
                />
              )}

              <span
                className="font-orbitron uppercase transition-all duration-250"
                style={{
                  fontSize: '8px',
                  letterSpacing: '0.2em',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                {planet.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Left data column ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-32 left-8 flex flex-col gap-1"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <div className="text-[8px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
          OBJECTS: <span style={{ color: 'rgba(255,255,255,0.4)' }}>8 PLANETS</span>
        </div>
        <div className="text-[8px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
          VEL: <CoordTicker value="29.78 km/s" />
        </div>
        <div className="text-[8px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
          REF: <span style={{ color: 'rgba(255,255,255,0.4)' }}>ECLIPTIC J2000</span>
        </div>
      </div>

    </div>
  );
}
