import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AudioContextType {
    isMuted: boolean;
    volume: number;
    toggleMute: () => void;
    setVolume: (vol: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.1);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element once
    useEffect(() => {
        const audio = new Audio('/Astrova Music.mp3');
        audio.loop = true;
        audio.volume = volume;
        audio.muted = isMuted;
        audioRef.current = audio;

        // Attempt autoplay (browsers usually block this until first interaction, but it's good practice)
        if (!isMuted) {
            audio.play().catch(() => {
                // Autoplay blocked, will play on next user interaction
                console.log("Autoplay blocked pending user interaction.");
            });
        }

        const handleFirstInteraction = () => {
            if (!isMuted && audioRef.current) {
                audioRef.current.play().catch(() => { });
            }
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('keydown', handleFirstInteraction);
        window.addEventListener('pointerdown', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            audio.pause();
            audio.src = '';
            audioRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleMute = () => {
        setIsMuted(prev => {
            const next = !prev;
            if (audioRef.current) {
                audioRef.current.muted = next;
                if (!next) {
                    audioRef.current.play().catch(() => { });
                }
            }
            return next;
        });
    };

    const setVolume = (vol: number) => {
        setVolumeState(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    return (
        <AudioContext.Provider value={{ isMuted, volume, toggleMute, setVolume }}>
            {children}
        </AudioContext.Provider>
    );
};
