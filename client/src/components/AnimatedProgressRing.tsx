import React from 'react';

interface AnimatedProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  animated?: boolean;
  showPercentage?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function AnimatedProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 6, 
  color = 'hsl(var(--primary))', 
  bgColor = 'hsl(var(--muted))',
  animated = true,
  showPercentage = true,
  className = '',
  children
}: AnimatedProgressRingProps) {
  // Calculate attributes based on size and stroke
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - (progress / 100) * circumference;
  
  // Center coordinates
  const center = size / 2;
  
  // Clamp progress to 0-100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  // Calculate animation speed based on progress
  const animationDuration = animated ? `${Math.max(3, 8 - (clampedProgress / 20))}s` : '0s';
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.2}
        />
        
        {/* Progress circle with dashed animation */}
        {animated && clampedProgress > 0 && clampedProgress < 100 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth / 2}
            strokeDasharray="3,3"
            fill="none"
            opacity={0.4}
            style={{ 
              animation: `rotate-ring ${animationDuration} linear infinite`,
            }}
          />
        )}
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          style={{ 
            transition: "stroke-dashoffset 0.5s ease",
            animation: animated && clampedProgress > 5 && clampedProgress < 100 
              ? `pulse-scale ${animationDuration} ease-in-out infinite` 
              : 'none',
          }}
        />
        
        {/* Optional inner decorative circle with reverse animation */}
        {animated && clampedProgress > 20 && clampedProgress < 90 && (
          <circle
            cx={center}
            cy={center}
            r={radius * 0.7}
            stroke={color}
            strokeWidth={strokeWidth / 3}
            strokeDasharray="5,5"
            fill="none"
            opacity={0.3}
            style={{ 
              animation: `reverse-rotate-ring ${animationDuration} linear infinite`,
            }}
          />
        )}
        
        {/* Optional glow effect for higher progress */}
        {animated && clampedProgress > 80 && (
          <circle
            cx={center}
            cy={center}
            r={radius * 1.2}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth / 4}
            opacity={0.3}
            className={clampedProgress >= 100 ? "animate-ping" : ""}
            style={{ 
              animation: clampedProgress < 100 
                ? `pulse ${animationDuration} ease-in-out infinite` 
                : 'animate-ping',
            }}
          />
        )}
      </svg>
      
      {/* Center content */}
      <div 
        className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
      >
        {children ? (
          children
        ) : (
          showPercentage && (
            <div className="text-center">
              <span 
                className={`font-bold ${size > 80 ? 'text-2xl' : 'text-xl'}`}
                style={{ color }}
              >
                {Math.round(clampedProgress)}%
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}