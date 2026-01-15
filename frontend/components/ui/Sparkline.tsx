'use client';

import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  animated?: boolean;
}

export default function Sparkline({
  data,
  width = 80,
  height = 24,
  color = '#3b82f6',
  showDots = false,
  animated = true,
}: SparklineProps) {
  const { path, lastPoint, trend } = useMemo(() => {
    if (!data || data.length < 2) {
      return { path: '', lastPoint: null, trend: 0 };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return { x, y, value };
    });

    const pathD = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');

    const lastP = points[points.length - 1];
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const trendPercent = ((lastValue - firstValue) / firstValue) * 100;

    return { path: pathD, lastPoint: lastP, trend: trendPercent };
  }, [data, width, height]);

  if (!data || data.length < 2) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center text-gray-400 text-xs"
      >
        No data
      </div>
    );
  }

  const trendColor = trend >= 0 ? '#22c55e' : '#ef4444';

  return (
    <svg 
      width={width} 
      height={height} 
      className={animated ? 'transition-all duration-500' : ''}
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path
        d={`${path} L ${width - 2} ${height - 2} L 2 ${height - 2} Z`}
        fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
        className={animated ? 'animate-fade-in' : ''}
      />
      
      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animated ? 'animate-draw-line' : ''}
        style={animated ? {
          strokeDasharray: 200,
          strokeDashoffset: 200,
          animation: 'draw-line 1s ease-out forwards'
        } : {}}
      />
      
      {/* End dot */}
      {lastPoint && showDots && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="3"
          fill={trendColor}
          className={animated ? 'animate-pulse' : ''}
        />
      )}

      <style jsx>{`
        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}
