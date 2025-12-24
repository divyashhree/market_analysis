'use client';

import { formatNumber } from '@/lib/utils';
import { CorrelationMatrix } from '@/lib/types';

interface CorrelationHeatmapProps {
  correlations: CorrelationMatrix;
}

export default function CorrelationHeatmap({ correlations }: CorrelationHeatmapProps) {
  const variables = ['CPI', 'USD-INR', 'NIFTY 50'];
  
  // Create correlation matrix
  const matrix = [
    [1, correlations.cpi_usdinr, correlations.cpi_nifty],
    [correlations.cpi_usdinr, 1, correlations.usdinr_nifty],
    [correlations.cpi_nifty, correlations.usdinr_nifty, 1],
  ];

  // Get color based on correlation strength
  const getColor = (value: number): string => {
    const intensity = Math.abs(value);
    if (value > 0) {
      // Green shades for positive correlation
      if (intensity > 0.7) return 'bg-green-700';
      if (intensity > 0.5) return 'bg-green-600';
      if (intensity > 0.3) return 'bg-green-500';
      return 'bg-green-400';
    } else if (value < 0) {
      // Red shades for negative correlation
      if (intensity > 0.7) return 'bg-red-700';
      if (intensity > 0.5) return 'bg-red-600';
      if (intensity > 0.3) return 'bg-red-500';
      return 'bg-red-400';
    }
    return 'bg-gray-400';
  };

  const getTextColor = (value: number): string => {
    const intensity = Math.abs(value);
    return intensity > 0.5 ? 'text-white' : 'text-gray-900';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Correlation Matrix Heatmap
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-gray-900 dark:text-white"></th>
              {variables.map((variable) => (
                <th 
                  key={variable} 
                  className="p-2 text-center text-sm font-medium text-gray-900 dark:text-white"
                >
                  {variable}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variables.map((rowVariable, rowIndex) => (
              <tr key={rowVariable}>
                <td className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                  {rowVariable}
                </td>
                {matrix[rowIndex].map((value, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <div 
                      className={`
                        ${getColor(value)} 
                        ${getTextColor(value)}
                        rounded-lg p-4 text-center font-semibold text-sm
                        transition-transform hover:scale-105
                      `}
                      title={`Correlation: ${value.toFixed(3)}`}
                    >
                      {value.toFixed(3)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-700 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Strong Negative</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Weak</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-700 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Strong Positive</span>
        </div>
      </div>
    </div>
  );
}
