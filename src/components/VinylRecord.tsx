'use client';

import { useEffect, useState } from 'react';

interface VinylRecordProps {
  isPlaying: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function VinylRecord({ isPlaying, onClick, size = 'md' }: VinylRecordProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setRotation(0);
      return;
    }

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} relative rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer overflow-hidden`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: isPlaying ? 'none' : 'transform 0.3s ease-out',
      }}
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      {/* Vinyl record image */}
      <img
        src="/vinyl-record.svg"
        alt="Vinyl Record"
        className="w-full h-full object-cover"
      />
    </button>
  );
}
