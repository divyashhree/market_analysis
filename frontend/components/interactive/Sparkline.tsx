'use client';

import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showArea?: boolean;
  className?: string;
}

export default function Sparkline({
  data,
  width = 100,
  height = 30,
  color = '#3B82F6',
  fillColor,
  strokeWidth = 2,
  showDots = false,
  showArea = true,
  className = '',
}: SparklineProps) {
  const pathData = useMemo(() => {
    if (data.length === 0) return { line: '', area: '', dots: [] };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const padding = 4;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    const points = data.map((value, index) => ({
      x: padding + (index / (data.length - 1 || 1)) * innerWidth,
      y: padding + innerHeight - ((value - min) / range) * innerHeight,
    }));

    // Create smooth curve using quadratic bezier
    let line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      line += ` Q ${prev.x + (curr.x - prev.x) / 4} ${prev.y}, ${cpx} ${(prev.y + curr.y) / 2}`;
      line += ` Q ${curr.x - (curr.x - prev.x) / 4} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Area path
    const area = `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return { line, area, dots: points };
  }, [data, width, height]);

  const trend = data.length >= 2 ? data[data.length - 1] - data[0] : 0;
  const trendColor = trend >= 0 ? '#10B981' : '#EF4444';
  const finalColor = color === 'auto' ? trendColor : color;

  return (
    <svg
      width={width}
      height={height}
      className={`overflow-visible ${className}`}
      style={{ minWidth: width }}
    >
      <defs>
        <linearGradient id={`sparkline-gradient-${finalColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={finalColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={finalColor} stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      {showArea && pathData.area && (
        <path
          d={pathData.area}
          fill={fillColor || `url(#sparkline-gradient-${finalColor.replace('#', '')})`}
          className="transition-all duration-500"
        />
      )}

      {/* Line */}
      {pathData.line && (
        <path
          d={pathData.line}
          fill="none"
          stroke={finalColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 0,
            animation: 'sparkline-draw 1s ease-out forwards',
          }}
        />
      )}

      {/* Dots */}
      {showDots && pathData.dots.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={i === pathData.dots.length - 1 ? 4 : 2}
          fill={i === pathData.dots.length - 1 ? finalColor : 'white'}
          stroke={finalColor}
          strokeWidth={1.5}
          className="transition-all duration-300"
        />
      ))}

      {/* End dot (always visible) */}
      {pathData.dots.length > 0 && (
        <circle
          cx={pathData.dots[pathData.dots.length - 1].x}
          cy={pathData.dots[pathData.dots.length - 1].y}
          r={3}
          fill={finalColor}
          className="animate-pulse"
        />
      )}

      <style jsx>{`
        @keyframes sparkline-draw {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </svg>
  );
}
