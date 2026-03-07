import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Bell } from 'lucide-react';

interface MySkyPanelProps {
  onClose: () => void;
}

export default function MySkyPanel({ onClose }: MySkyPanelProps) {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding for UI purposes
          setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`);
          setLoading(false);
        },
        () => {
          setLocation("Location Denied");
          setLoading(false);
        }
      );
    } else {
      setLocation("Geolocation Not Supported");
      setLoading(false);
    }
  }, []);

  const events = [
    { title: 'ISS Pass', time: '21:45', direction: 'NW to SE' },
    { title: 'Visible Planets', desc: 'Jupiter (East), Venus (West)' },
    { title: 'Moon Phase', desc: 'Waning Gibbous (82%)' },
    { title: 'Next Meteor Shower', desc: 'Perseids in 12 days' }
  ];

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-orbitron font-bold tracking-wider glow-text uppercase">My Sky Tonight</h2>
          <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm font-orbitron tracking-widest uppercase">
            <MapPin size={14} />
            {loading ? 'Locating...' : location}
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto no-scrollbar max-w-4xl mx-auto w-full">
        {/* Mock Sky Map Area */}
        <div className="w-full h-64 md:h-96 bg-gradient-to-b from-blue-900/20 to-black border border-white/10 rounded-2xl mb-8 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <p className="text-gray-500 font-orbitron tracking-widest uppercase text-sm z-10">Interactive Sky Map (AstronomyAPI)</p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-start hover:bg-white/10 transition-colors">
              <div>
                <h3 className="font-orbitron font-bold tracking-wider text-lg mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm">
                  {event.time && <span className="text-white mr-2">{event.time}</span>}
                  {event.direction || event.desc}
                </p>
              </div>
              <button className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors">
                <Bell size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
