'use client';

import { useRef } from 'react';
import { Download } from 'lucide-react';

interface ExportChartButtonProps {
  elementId: string;
  filename: string;
  className?: string;
}

export function ExportChartButton({ elementId, filename, className = '' }: ExportChartButtonProps) {
  const handleExport = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      
      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element with id '${elementId}' not found`);
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Higher quality
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${filename}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
      title="Export as PNG"
    >
      <Download className="w-4 h-4" />
      Export Chart
    </button>
  );
}

/**
 * Export SVG chart (for Recharts)
 */
export function exportChartAsSVG(svgElement: SVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}
