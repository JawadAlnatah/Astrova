import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [isWarping, setIsWarping] = useState(false);


  const handleStart = () => {
    setIsWarping(true);
    // Trigger warp animation then transition
    setTimeout(() => {
      onStart();
    }, 2000);
  };

  const title = "ASTROVA";
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">

      {/* Background Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={isWarping ? 10 : 1} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div
        className="z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: isWarping ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex mb-4">
          {title.split("").map((char, index) => (
            <motion.h1
              key={index}
              className="text-6xl md:text-8xl font-orbitron font-bold tracking-widest glow-text"
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            >
              {char}
            </motion.h1>
          ))}
        </div>

        <motion.p
          className="text-lg md:text-xl text-gray-400 font-light tracking-wider mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          The cosmos, at your fingertips.
        </motion.p>

        <motion.button
          onClick={handleStart}
          className="px-8 py-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all font-orbitron tracking-widest text-sm uppercase glow-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 15px rgba(255, 255, 255, 0.1)",
              "0 0 25px rgba(255, 255, 255, 0.3)",
              "0 0 15px rgba(255, 255, 255, 0.1)"
            ]
          }}
          transition={{
            opacity: { duration: 1, delay: 3 },
            scale: { repeat: Infinity, duration: 2, delay: 4 },
            boxShadow: { repeat: Infinity, duration: 2, delay: 4 }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Exploration
        </motion.button>
      </motion.div>
    </div>
  );
}
