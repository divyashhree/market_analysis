// Core data types
export interface DataPoint {
  date: string;
  value: number;
}

export interface Dataset {
  cpi: DataPoint[];
  usdinr: DataPoint[];
  nifty: DataPoint[];
}

export interface DateRange {
  start: string;
  end: string;
}

// Analysis types
export interface CorrelationMatrix {
  cpi_usdinr: number;
  cpi_nifty: number;
  usdinr_nifty: number;
}

export interface Statistics {
  mean: number;
  std: number;
  min: number;
  max: number;
  median: number;
}

export interface DataStatistics {
  cpi: Statistics;
  usdinr: Statistics;
  nifty: Statistics;
}

export interface MovingAverage {
  date: string;
  ma3: number;
  ma6: number;
  ma12: number;
}

export interface RollingCorrelation {
  date: string;
  cpi_nifty: number;
  usdinr_nifty: number;
  cpi_usdinr: number;
}

// Insight types
export type InsightType = 'positive' | 'negative' | 'neutral';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  value?: number;
}

// Period comparison
export interface PeriodComparison {
  period1: {
    start: string;
    end: string;
    stats: DataStatistics;
    correlations: CorrelationMatrix;
  };
  period2: {
    start: string;
    end: string;
    stats: DataStatistics;
    correlations: CorrelationMatrix;
  };
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AnalysisData {
  correlations: CorrelationMatrix;
  statistics: DataStatistics;
  rollingCorrelations: RollingCorrelation[];
  insights: Insight[];
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

// Distribution data for histograms
export interface Distribution {
  highInflation: number[];
  lowInflation: number[];
  bins: number[];
}
