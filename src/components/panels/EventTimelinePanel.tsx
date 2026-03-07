import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Eye, EyeOff } from 'lucide-react';

interface EventTimelinePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const events = [
  { id: 1, date: '2026-03-03', title: 'Total Lunar Eclipse', type: 'Eclipse', description: 'The Moon passes fully into Earth\'s shadow causing a "Blood Moon".', regions: ['america', 'pacific', 'asia', 'australia'] },
  { id: 2, date: '2026-05-31', title: 'Saturn at Opposition', type: 'Planetary', description: 'Saturn reaches its closest approach to Earth, bringing its rings into bright, clear view.', regions: ['global'] },
  { id: 3, date: '2026-08-12', title: 'Total Solar Eclipse', type: 'Eclipse', description: 'The Moon completely blocks out the Sun. Path of totality crosses Greenland, Iceland, and Northern Spain.', regions: ['europe', 'atlantic', 'arctic'] },
  { id: 4, date: '2026-08-13', title: 'Perseid Meteor Shower', type: 'Meteor', description: 'One of the brightest meteor showers of the year, producing up to 100 meteors per hour.', regions: ['global'] },
  { id: 5, date: '2026-08-28', title: 'Partial Lunar Eclipse', type: 'Eclipse', description: 'A portion of the Moon passes through Earth\'s dark umbral shadow.', regions: ['europe', 'africa', 'america', 'atlantic'] },
  { id: 6, date: '2026-12-14', title: 'Geminid Meteor Shower', type: 'Meteor', description: 'Considered the king of meteor showers, producing up to 120 multicolored meteors per hour at its peak.', regions: ['global'] }
];

export default function EventTimelinePanel({ isOpen, onClose }: EventTimelinePanelProps) {
  // Approximate the user's broad timezone region (e.g., "America/New_York" -> "america")
  const [userRegion, setUserRegion] = React.useState('global');

  React.useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
      // tz is usually "continent/city"
      const continent = tz.split('/')[0];
      setUserRegion(continent);
    } catch {
      setUserRegion('global');
    }
  }, []);

  const isVisible = (eventRegions: string[]) => {
    if (eventRegions.includes('global')) return true;
    return eventRegions.some(r => userRegion.includes(r));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-full md:w-[350px] bg-black/80 backdrop-blur-xl border-l border-white/10 z-50 overflow-y-auto no-scrollbar"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Calendar className="text-white/70" size={20} />
                <h2 className="text-xl font-orbitron font-bold tracking-wider uppercase text-white/90">Timeline</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {events.map((event) => {
                const canSeeRow = isVisible(event.regions);

                return (
                  <div key={event.id} className="relative pl-6 border-l border-white/10 group mb-6">
                    <div className="absolute left-0 top-1.5 w-2 h-2 -translate-x-1/2 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors glow-border"></div>

                    <div className="text-xs text-blue-400 font-orbitron tracking-widest uppercase mb-1">{event.date}</div>
                    <h3 className="text-sm font-bold text-white/90 mb-1">{event.title}</h3>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-orbitron">{event.type}</div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">{event.description}</p>

                    {/* Visibility Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-medium uppercase tracking-wider ${canSeeRow
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400/80 border border-red-500/20'
                      }`}>
                      {canSeeRow ? <Eye size={12} /> : <EyeOff size={12} />}
                      {canSeeRow ? 'Visible from your location' : 'Not visible from your region'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
