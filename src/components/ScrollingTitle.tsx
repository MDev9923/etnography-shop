'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollingTitleProps {
  title: string;
  width?: 'sm' | 'md' | 'lg';
}

export function ScrollingTitle({ title }: ScrollingTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLSpanElement>(null);

  const [textWidth, setTextWidth] = useState(0);
  const [availableWidth, setAvailableWidth] = useState(0);

  const gap = 32;
  const speed = 25; // Pixels per second.

  useEffect(() => {
    const container = containerRef.current;
    const text = measurementRef.current;
    const parent = container?.parentElement;

    if (!container || !text || !parent) return;

    const measure = () => {
      setTextWidth(text.getBoundingClientRect().width);
      setAvailableWidth(parent.clientWidth);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    observer.observe(text);

    return () => observer.disconnect();
  }, [title]);

  const windowWidth = Math.min(
    availableWidth,
    Math.max(1, textWidth - 24)
  );

  const distance = textWidth + gap;
  const duration = distance / speed;

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 max-w-full overflow-hidden whitespace-nowrap text-xs text-white"
      style={{
        width: windowWidth > 0 ? windowWidth : '100%',
      }}
      aria-label={title}
    >
      {/* Measure the complete title without displaying it. */}
      <span
        ref={measurementRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 inline-block whitespace-nowrap"
      >
        {title}
      </span>

      {textWidth > 0 && (
        <div
          key={title}
          aria-hidden="true"
          className="song-title-track flex w-max items-center"
          style={{
            gap,
            animationDuration: `${duration}s`,
          }}
        >
          <span className="block shrink-0">{title}</span>
          <span className="block shrink-0">{title}</span>
        </div>
      )}

      <style jsx>{`
        .song-title-track {
          animation-name: song-title-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        @keyframes song-title-scroll {
          from {
            transform: translateX(-${distance}px);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}