import React from 'react';

export type MascotMood = 'idle' | 'scanning' | 'happy' | 'sad';

interface DomainMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

export default function DomainMascot({ 
  mood = 'idle', 
  size = 120, 
  className = ''
}: DomainMascotProps) {
  // Different eye shapes based on mood
  const getEyePath = () => {
    switch(mood) {
      case 'scanning':
        return (
          <>
            {/* Left eye with scanning animation */}
            <circle cx="30" cy="38" r="5" fill="#2563EB" className="animate-pulse" />
            {/* Right eye with scanning animation */}
            <circle cx="70" cy="38" r="5" fill="#2563EB" className="animate-pulse" />
          </>
        );
      case 'happy':
        return (
          <>
            {/* Happy eyes (upside-down arcs) */}
            <path d="M25,35 Q30,30 35,35" stroke="#2563EB" strokeWidth="3" fill="none" />
            <path d="M65,35 Q70,30 75,35" stroke="#2563EB" strokeWidth="3" fill="none" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad eyes (downward arcs) */}
            <path d="M25,38 Q30,43 35,38" stroke="#2563EB" strokeWidth="3" fill="none" />
            <path d="M65,38 Q70,43 75,38" stroke="#2563EB" strokeWidth="3" fill="none" />
          </>
        );
      case 'idle':
      default:
        return (
          <>
            {/* Neutral eyes (circles) */}
            <circle cx="30" cy="38" r="5" fill="#2563EB" />
            <circle cx="70" cy="38" r="5" fill="#2563EB" />
          </>
        );
    }
  };

  // Different mouth shapes based on mood
  const getMouthPath = () => {
    switch(mood) {
      case 'scanning':
        return (
          // Scanning mouth (small o shape with animation)
          <path 
            d="M40,65 Q50,75 60,65 Q50,55 40,65" 
            fill="#2563EB" 
            className="animate-pulse" 
          />
        );
      case 'happy':
        return (
          // Happy mouth (wide smile)
          <path 
            d="M30,65 Q50,85 70,65" 
            stroke="#2563EB" 
            strokeWidth="3" 
            fill="none" 
          />
        );
      case 'sad':
        return (
          // Sad mouth (downturned)
          <path 
            d="M30,75 Q50,65 70,75" 
            stroke="#2563EB" 
            strokeWidth="3" 
            fill="none" 
          />
        );
      case 'idle':
      default:
        return (
          // Neutral mouth (slight smile)
          <path 
            d="M35,65 Q50,75 65,65" 
            stroke="#2563EB" 
            strokeWidth="3" 
            fill="none" 
          />
        );
    }
  };

  // Additional animations based on mood
  const getAdditionalAnimations = () => {
    if (mood === 'scanning') {
      return (
        <g className="scanning-rays">
          {/* Scanning beams radiating from the mascot */}
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            stroke="#2563EB" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="5,5" 
            className="animate-ping opacity-30" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="60" 
            stroke="#2563EB" 
            strokeWidth="1" 
            fill="none" 
            strokeDasharray="3,6" 
            className="animate-ping opacity-20" 
          />
        </g>
      );
    }
    return null;
  };

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 100 100" 
        width={size} 
        height={size} 
        className={`${mood === 'scanning' ? 'animate-bounce-slow' : mood === 'happy' ? 'animate-wiggle' : ''}`}
      >
        {/* Background glowing effect for scanning */}
        {mood === 'scanning' && (
          <circle 
            cx="50" 
            cy="50" 
            r="48" 
            fill="url(#scanGradient)" 
            className="opacity-70" 
          />
        )}
        
        {/* Gradients */}
        <defs>
          <radialGradient id="mascotGradient" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="90%" stopColor="#2563eb" />
          </radialGradient>
          <radialGradient id="scanGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Additional animations */}
        {getAdditionalAnimations()}
        
        {/* Main mascot body - a globe/domain shape */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="url(#mascotGradient)" 
          className={`${mood === 'sad' ? 'opacity-80' : 'opacity-95'}`} 
        />
        
        {/* Web-like lines suggesting a globe */}
        <path 
          d="M20,50 Q30,20 50,20 Q70,20 80,50 Q70,80 50,80 Q30,80 20,50" 
          stroke="white" 
          strokeWidth="1.5" 
          fill="none" 
          strokeOpacity="0.5" 
        />
        <path 
          d="M50,10 Q50,30 50,90" 
          stroke="white" 
          strokeWidth="1.5" 
          fill="none" 
          strokeOpacity="0.5" 
        />
        <path 
          d="M10,50 Q30,50 90,50" 
          stroke="white" 
          strokeWidth="1.5" 
          fill="none" 
          strokeOpacity="0.5" 
        />
        
        {/* Face */}
        {getEyePath()}
        {getMouthPath()}
      </svg>
    </div>
  );
}