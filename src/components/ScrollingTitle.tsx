'use client';

import { useEffect, useState, useRef } from 'react';

interface ScrollingTitleProps {
  title: string;
  width?: 'sm' | 'md' | 'lg';
}

export function ScrollingTitle({ title, width = 'md' }: ScrollingTitleProps) {
  const [position, setPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const widthClasses = {
    sm: 'w-20',
    md: 'w-32',
    lg: 'w-48',
  };

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const containerWidth = container.offsetWidth;
    const textWidth = text.offsetWidth;

    if (textWidth <= containerWidth) {
      setPosition(0);
      return;
    }

    const animate = () => {
      setPosition((prev) => {
        const next = prev - 0.5;
        if (next < -textWidth) {
          return containerWidth;
        }
        return next;
      });
    };

    const interval = setInterval(animate, 30);
    return () => clearInterval(interval);
  }, [title]);

  return (
    <div ref={containerRef} className={`${widthClasses[width]} overflow-hidden whitespace-nowrap`}>
      <span
        ref={textRef}
        className="inline-block text-xs text-foreground transition-transform"
        style={{ transform: `translateX(${position}px)` }}
      >
        {title}
      </span>
    </div>
  );
}
