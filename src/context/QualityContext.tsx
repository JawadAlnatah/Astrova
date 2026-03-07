import React, { createContext, useContext, useState, useEffect } from 'react';

export type QualityTier = 'Low' | 'Medium' | 'High' | 'Ultra';

interface QualityContextType {
  tier: QualityTier;
  setTier: (tier: QualityTier) => void;
}

const QualityContext = createContext<QualityContextType | undefined>(undefined);

export const QualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<QualityTier>('High');

  useEffect(() => {
    // Basic benchmark simulation
    const start = performance.now();
    let frames = 0;
    let rafId: number;

    const loop = () => {
      frames++;
      if (performance.now() - start < 500) {
        rafId = requestAnimationFrame(loop);
      } else {
        const fps = frames * 2; // frames in 500ms * 2 = fps
        if (fps > 55) setTier('Ultra');
        else if (fps > 40) setTier('High');
        else if (fps > 25) setTier('Medium');
        else setTier('Low');
      }
    };
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <QualityContext.Provider value={{ tier, setTier }}>
      {children}
    </QualityContext.Provider>
  );
};

export const useQuality = () => {
  const context = useContext(QualityContext);
  if (!context) throw new Error('useQuality must be used within QualityProvider');
  return context;
};
