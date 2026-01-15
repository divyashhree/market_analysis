'use client';

interface TrendIndicatorProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  invertColors?: boolean;
  className?: string;
}

export default function TrendIndicator({
  value,
  size = 'md',
  showLabel = true,
  invertColors = false,
  className = '',
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  // For stocks, positive is good (green). For inflation, high is bad (red)
  // invertColors: true = green for positive (stocks), false = red for positive (inflation)
  const colorClass = isNeutral
    ? 'text-gray-500'
    : invertColors
      ? isPositive
        ? 'text-green-500'
        : 'text-red-500'
      : isPositive
        ? 'text-red-500'
        : 'text-green-500';

  const bgClass = isNeutral
    ? 'bg-gray-100 dark:bg-gray-800'
    : invertColors
      ? isPositive
        ? 'bg-green-100 dark:bg-green-900/30'
        : 'bg-red-100 dark:bg-red-900/30'
      : isPositive
        ? 'bg-red-100 dark:bg-red-900/30'
        : 'bg-green-100 dark:bg-green-900/30';

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const arrowSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${bgClass} ${colorClass} ${sizeClasses[size]}
        transition-all duration-300 transform hover:scale-110
        ${className}
      `}
    >
      <span className={`${arrowSize[size]} animate-bounce`} style={{ animationDuration: '1.5s' }}>
        {isNeutral ? '→' : isPositive ? '↑' : '↓'}
      </span>
      {showLabel && (
        <span>{Math.abs(value).toFixed(1)}%</span>
      )}
    </span>
  );
}
