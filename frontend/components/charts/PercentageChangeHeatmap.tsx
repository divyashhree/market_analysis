'use client';

import { DataPoint } from '@/lib/types';
import { calculatePercentageChange } from '@/lib/utils';

interface PercentageChangeHeatmapProps {
  data: DataPoint[];
  title: string;
  colorScale: 'red' | 'green' | 'blue';
}

export default function PercentageChangeHeatmap({ data, title, colorScale }: PercentageChangeHeatmapProps) {
  // Group data by year and month
  const groupedData: { [year: string]: { [month: string]: number } } = {};
  const changes: number[] = [];

  data.forEach((point, index) => {
    if (index === 0) return;
    
    const [year, month] = point.date.split('-');
    const change = calculatePercentageChange(data[index - 1].value, point.value);
    
    if (!groupedData[year]) {
      groupedData[year] = {};
    }
    groupedData[year][month] = change;
    changes.push(change);
  });

  const years = Object.keys(groupedData).sort();
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate color intensity based on value
  const maxChange = Math.max(...changes.map(Math.abs));
  
  const getColor = (change: number | undefined) => {
    if (change === undefined) return 'bg-gray-100 dark:bg-gray-800';
    
    const intensity = Math.min(Math.abs(change) / maxChange, 1);
    const level = Math.floor(intensity * 5);
    
    const colorMap = {
      red: [
        'bg-red-50 dark:bg-red-950',
        'bg-red-100 dark:bg-red-900',
        'bg-red-200 dark:bg-red-800',
        'bg-red-400 dark:bg-red-700',
        'bg-red-500 dark:bg-red-600',
        'bg-red-600 dark:bg-red-500',
      ],
      green: [
        'bg-green-50 dark:bg-green-950',
        'bg-green-100 dark:bg-green-900',
        'bg-green-200 dark:bg-green-800',
        'bg-green-400 dark:bg-green-700',
        'bg-green-500 dark:bg-green-600',
        'bg-green-600 dark:bg-green-500',
      ],
      blue: [
        'bg-blue-50 dark:bg-blue-950',
        'bg-blue-100 dark:bg-blue-900',
        'bg-blue-200 dark:bg-blue-800',
        'bg-blue-400 dark:bg-blue-700',
        'bg-blue-500 dark:bg-blue-600',
        'bg-blue-600 dark:bg-blue-500',
      ],
    };

    return change > 0 ? colorMap[colorScale][level] : colorMap.red[level];
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monthly percentage changes across years
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white dark:bg-gray-900 p-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Year
              </th>
              {monthNames.map((month) => (
                <th
                  key={month}
                  className="p-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr key={year}>
                <td className="sticky left-0 bg-white dark:bg-gray-900 p-2 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                  {year}
                </td>
                {months.map((month) => {
                  const change = groupedData[year][month];
                  return (
                    <td
                      key={month}
                      className={`p-2 text-center text-xs font-medium cursor-help transition-transform hover:scale-110 ${getColor(change)}`}
                      title={change !== undefined ? `${change.toFixed(2)}%` : 'No data'}
                    >
                      {change !== undefined ? (
                        <span className={change > 0 ? 'text-gray-900' : 'text-gray-900'}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <span>Legend:</span>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${getColor(maxChange)}`}></div>
          <span>High Change</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${getColor(maxChange * 0.5)}`}></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 ${getColor(maxChange * 0.1)}`}></div>
          <span>Low</span>
        </div>
      </div>
    </div>
  );
}
