'use client';

interface AnimatedGlobeLoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export default function AnimatedGlobeLoader({
  size = 120,
  text = 'Loading global data...',
  className = '',
}: AnimatedGlobeLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      {/* Animated Globe */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-30 animate-pulse"
          style={{ transform: 'scale(1.2)' }}
        />
        
        {/* Globe */}
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className="relative z-10"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#globe-gradient)"
            stroke="#3B82F6"
            strokeWidth="1"
          />
          
          {/* Latitude lines */}
          {[20, 35, 50, 65, 80].map((y, i) => (
            <ellipse
              key={`lat-${i}`}
              cx="50"
              cy={y}
              rx={Math.sqrt(45 * 45 - (y - 50) * (y - 50))}
              ry="5"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="0.5"
              opacity="0.5"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          
          {/* Longitude lines (animated) */}
          {[0, 30, 60, 90, 120, 150].map((angle, i) => (
            <ellipse
              key={`lng-${i}`}
              cx="50"
              cy="50"
              rx={Math.sin((angle * Math.PI) / 180) * 45}
              ry="45"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="0.5"
              opacity="0.5"
              className="animate-spin"
              style={{ 
                transformOrigin: '50% 50%',
                animationDuration: '20s',
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
          
          {/* Equator */}
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="10"
            fill="none"
            stroke="#2563EB"
            strokeWidth="1"
            opacity="0.8"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="globe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Orbiting dots */}
        {[0, 120, 240].map((angle, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-yellow-400 shadow-lg"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${angle}deg) translateX(${size / 2 + 10}px) translateY(-50%)`,
              animation: `orbit ${3 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Loading text */}
      <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
        {text}
      </p>
      
      {/* Progress dots */}
      <div className="flex gap-1 mt-3">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-blue-500"
            style={{
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(${size / 2 + 10}px) translateY(-50%);
          }
          to {
            transform: rotate(360deg) translateX(${size / 2 + 10}px) translateY(-50%);
          }
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
