'use client';

interface TrendIndicatorProps {
  value: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function TrendIndicator({
  value,
  showValue = true,
  size = 'md',
  animated = true,
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const sizeClasses = {
    sm: { icon: 'w-3 h-3', text: 'text-xs' },
    md: { icon: 'w-4 h-4', text: 'text-sm' },
    lg: { icon: 'w-5 h-5', text: 'text-base' },
  };

  const colorClasses = isNeutral
    ? 'text-gray-500'
    : isPositive
    ? 'text-green-500 dark:text-green-400'
    : 'text-red-500 dark:text-red-400';

  const bgClasses = isNeutral
    ? 'bg-gray-100 dark:bg-gray-800'
    : isPositive
    ? 'bg-green-100 dark:bg-green-900/30'
    : 'bg-red-100 dark:bg-red-900/30';

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium
        ${bgClasses} ${colorClasses} ${sizeClasses[size].text}
        ${animated ? 'transition-all duration-300 hover:scale-105' : ''}
      `}
    >
      {/* Arrow Icon */}
      <svg
        className={`
          ${sizeClasses[size].icon}
          ${animated && !isNeutral ? 'animate-bounce' : ''}
          ${isPositive ? '' : 'rotate-180'}
        `}
        style={{ animationDuration: '2s' }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isNeutral ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        )}
      </svg>
      
      {showValue && (
        <span>{isPositive ? '+' : ''}{value.toFixed(2)}%</span>
      )}
    </span>
  );
}
