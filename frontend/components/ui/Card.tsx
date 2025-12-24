import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export default Card;

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: string;
  color?: string;
}

export function StatCard({ title, value, change, icon, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'text-primary',
    cpi: 'text-cpi',
    usdinr: 'text-usdinr',
    nifty: 'text-nifty',
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses] || 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
          {change !== undefined && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-4xl opacity-50">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
