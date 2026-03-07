import React, { useState } from 'react';
import { Settings, MapPin, Volume2, VolumeX } from 'lucide-react';

export default function HUD() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        {/* Logo */}
        <div className="font-orbitron font-bold text-2xl tracking-widest text-white glow-text cursor-pointer hover:text-gray-300 transition-colors">
          ASTROVA
        </div>

        {/* Right Controls */}
        <div className="flex gap-4">
          <button className="p-2 rounded-full bg-black/40 border border-white/10 hover:bg-white/10 transition-colors text-white backdrop-blur-sm">
            <MapPin size={20} />
          </button>
          <button 
            className="p-2 rounded-full bg-black/40 border border-white/10 hover:bg-white/10 transition-colors text-white backdrop-blur-sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="p-2 rounded-full bg-black/40 border border-white/10 hover:bg-white/10 transition-colors text-white backdrop-blur-sm">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
