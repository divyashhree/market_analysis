// Core data types
export interface DataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
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

// ============ MULTI-COUNTRY TYPES ============

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface StockIndex {
  name: string;
  yahooSymbol?: string;
  description: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  currency: Currency;
  stockIndex: StockIndex;
  gdpRank: number;
}

export interface CountryDataPoint {
  date: string;
  value: number;
  country: string;
  countryName: string;
}

export interface InflationDataPoint extends CountryDataPoint {
  indicator: string;
}

export interface StockDataPoint extends CountryDataPoint {
  indexName: string;
}

export interface CurrencyDataPoint extends CountryDataPoint {
  pair: string;
}

export interface CountryData {
  country: Country;
  data: {
    cpi: InflationDataPoint[];
    inflation: InflationDataPoint[];
    gdpGrowth: CountryDataPoint[];
    stockIndex: StockDataPoint[];
    exchangeRate: CurrencyDataPoint[];
  };
  meta: {
    lastUpdated: string;
    sources: string[];
  };
}

export interface GlobalInflationEntry {
  code: string;
  name: string;
  flag: string;
  region: string;
  latestInflation: number | null;
  latestYear: string | null;
  historicalData: InflationDataPoint[];
}

export interface GlobalStockEntry {
  code: string;
  name: string;
  flag: string;
  region: string;
  indexName: string;
  latestValue: number | null;
  ytdReturn: number | null;
  oneYearReturn: number | null;
  historicalData: StockDataPoint[];
}

export interface GlobalCurrencyEntry {
  code: string;
  name: string;
  flag: string;
  currency: Currency;
  latestRate: number | null;
  yearChange: number | null;
  historicalData: CurrencyDataPoint[];
}

export interface CountryComparisonData {
  [countryCode: string]: CountryData | { error: string };
}

export interface RegionData {
  regions: string[];
  countriesByRegion: {
    [region: string]: Country[];
  };
}

export type ComparisonDataType = 'all' | 'inflation' | 'cpi' | 'stock' | 'fx' | 'gdp';

