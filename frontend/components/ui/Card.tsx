import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700', className)}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-6 pt-6">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-6 pt-6 pb-2', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-xl font-bold text-gray-900 dark:text-white', className)}>{children}</h3>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>;
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
  // Handle invalid/missing data
  const isInvalid = value === '0.00' || value === 0 || value === 'NaN' || value === null || value === undefined;
  const displayValue = isInvalid ? 'N/A' : value;
  const hasValidChange = change !== undefined && change !== null && !isNaN(change) && change !== 0;
  
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
          <p className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses] || 'text-gray-900 dark:text-white'} ${isInvalid ? 'text-gray-400 dark:text-gray-500' : ''}`}>
            {displayValue}
          </p>
          {isInvalid && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              No data in range
            </p>
          )}
          {!isInvalid && hasValidChange && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`text-4xl ${isInvalid ? 'opacity-20' : 'opacity-50'}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
