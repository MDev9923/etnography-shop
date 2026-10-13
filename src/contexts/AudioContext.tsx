'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  toggleMute: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  currentTrackIndex: number;
  currentTrackTitle: string;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const tracks = [
    { file: '/background-music.mp3', title: 'ЕБСФ - Денови' },
    { file: '/background-music1.mp3', title: 'Даниела Панчетовиќ - За нас почнува живот (DJ Goce Edit)' }
  ];

  const currentTrackTitle = tracks[currentTrackIndex].title;

  // Create the audio once (on mount)
  useEffect(() => {
    const audio = new Audio(tracks[currentTrackIndex].file);
    audio.loop = false;
    audio.preload = 'auto';
    audio.volume = 0.35;

    // Start muted and not playing by default
    audio.muted = true;
    audioRef.current = audio;

    // Handle track end to play next track
    const handleEnded = () => {
      wasPlayingRef.current = true;
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, []);

  // Keep HTMLAudioElement muted state synced with React state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  // Load new track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const shouldAutoPlay = wasPlayingRef.current;
    wasPlayingRef.current = false;

    audio.src = tracks[currentTrackIndex].file;
    audio.load();

    if (shouldAutoPlay) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const toggleMute = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.muted = true;
      setIsMuted(true);
      audio.pause();
      setIsPlaying(false);
    }
  };

  const value = useMemo<AudioContextType>(
    () => ({
      isPlaying,
      setIsPlaying,
      toggleMute,
      isMuted,
      setIsMuted,
      currentTrackIndex,
      currentTrackTitle,
    }),
    [isPlaying, isMuted, currentTrackIndex, currentTrackTitle]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
