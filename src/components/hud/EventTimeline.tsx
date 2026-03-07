import React from 'react';

const events = [
  { id: 1, title: 'Perseid Meteor Shower', date: 'Aug 12', time: 'Peak' },
  { id: 2, title: 'ISS Pass', date: 'Tonight', time: '21:45' },
  { id: 3, title: 'Lunar Eclipse', date: 'Sep 18', time: 'Partial' },
  { id: 4, title: 'Falcon 9 Launch', date: 'Tomorrow', time: '08:00' },
  { id: 5, title: 'Jupiter Opposition', date: 'Nov 3', time: 'Brightest' },
];

export default function EventTimeline() {
  return (
    <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-4 overflow-x-auto no-scrollbar">
      {events.map((event) => (
        <div 
          key={event.id} 
          className="flex-shrink-0 min-w-[150px] bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3 cursor-pointer transition-all hover:scale-105"
        >
          <div className="text-xs text-gray-400 font-orbitron tracking-wider mb-1 uppercase">{event.date} • {event.time}</div>
          <div className="text-sm text-white font-medium">{event.title}</div>
        </div>
      ))}
    </div>
  );
}
