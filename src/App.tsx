import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QualityProvider } from './context/QualityContext';
import { AudioProvider } from './context/AudioContext';
import PlanetShowcase from './components/showcase/PlanetShowcase';
import CosmosGallery from './components/showcase/CosmosGallery';
import Observatory from './components/showcase/Observatory';

export default function App() {
  const [view, setView] = useState<'planets' | 'cosmos' | 'observatory'>('planets');

  return (
    <AudioProvider>
      <QualityProvider>
        <div className="w-full h-screen bg-black overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'planets' ? (
              <motion.div
                key="planets"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full absolute inset-0"
              >
                <PlanetShowcase onViewChange={setView} />
              </motion.div>
            ) : view === 'cosmos' ? (
              <motion.div
                key="cosmos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full absolute inset-0"
              >
                <CosmosGallery onViewChange={setView} />
              </motion.div>
            ) : (
              <motion.div
                key="observatory"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full absolute inset-0"
              >
                <Observatory onViewChange={setView} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </QualityProvider>
    </AudioProvider>
  );
}
