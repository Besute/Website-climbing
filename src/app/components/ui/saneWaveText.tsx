// SineWaveText.tsx
import React, { useEffect, useRef, useState } from 'react';

interface SineWaveTextProps {
  text: string;
  speed?: number;
  waveSpeed?: number;
  amplitude?: number;
  fontSize?: string;
  className?: string;
  rainbow?: boolean;
}

const SineWaveText: React.FC<SineWaveTextProps> = ({
  text,
  speed = 1.2,
  waveSpeed = 0.03,
  amplitude = 25,
  fontSize = 'text-4xl md:text-5xl lg:text-6xl',
  className = '',
  rainbow = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null); // 👈 Реф на контейнер с текстом
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [time, setTime] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (containerRef.current && textContainerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      const textWidth = textContainerRef.current.offsetWidth;
      setTextWidth(textWidth);
      setScrollPosition(-width);
      setIsInitialized(true);
    }
  }, [text, fontSize]);
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && textContainerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        const textWidth = textContainerRef.current.offsetWidth;
        setTextWidth(textWidth);
        
        if (!isResetting && scrollPosition < 0) {
          setScrollPosition(-width);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isResetting, scrollPosition]);
  useEffect(() => {
    if (textWidth === 0 || containerWidth === 0 || !isInitialized) return;
    let animationId: number;
    let lastTime = performance.now();
    const animate = (timestamp: number) => {
      const delta = Math.min((timestamp - lastTime) / 16, 2);
      lastTime = timestamp;
      setScrollPosition(prev => {
        if (isResetting) return prev;
        let newPos = prev + delta * speed;
        const maxScroll = textWidth + 100;
        if (newPos >= maxScroll) {
          setIsResetting(true);
          setIsVisible(false);
          
          setTimeout(() => {
            setScrollPosition(-containerWidth);
            setIsVisible(true);
            setIsResetting(false);
          }, 500);
          
          return prev;
        }
        
        return newPos;
      });
      setTime(prev => prev + delta * waveSpeed);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [speed, waveSpeed, textWidth, containerWidth, isResetting, isInitialized]);
  const letters = text.split('').map((char, index) => ({
    char,
    hue: (index / text.length) * 360,
    index,
  }));
  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex items-center 
        bg-transparent px-4 md:px-8 py-8
        ${className}`}
    >
      <div
        ref={textContainerRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{
          transform: `translateX(${-scrollPosition}px)`,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          willChange: 'transform, opacity',
        }}
      >
        {letters.map(({ char, hue, index }, arrayIndex) => {
          const phase = (index / text.length) * 2 * Math.PI * 3;
          const yOffset = Math.sin(time * 2 + phase) * amplitude;

          const color = rainbow 
            ? `hsl(${hue + time * 50}, 100%, 55%)`
            : 'white';

          return (
            <span
              key={arrayIndex}
              className={`inline-block font-black tracking-wider transition-colors duration-75 ${fontSize}`}
              style={{
                transform: `translateY(${yOffset}px)`,
                color: color,
                padding: '0 2px',
                userSelect: 'none',
                willChange: 'transform',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SineWaveText;