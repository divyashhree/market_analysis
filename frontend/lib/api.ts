import axios from 'axios';
import { Dataset, AnalysisData, PeriodComparison, DateRange } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API client functions
export const api = {
  // Data endpoints
  async getAllData(): Promise<Dataset> {
    const response = await apiClient.get('/api/data/all');
    return response.data;
  },

  async getCPIData(): Promise<any[]> {
    const response = await apiClient.get('/api/data/cpi');
    return response.data;
  },

  async getUSDINRData(): Promise<any[]> {
    const response = await apiClient.get('/api/data/usdinr');
    return response.data;
  },

  async getNiftyData(): Promise<any[]> {
    const response = await apiClient.get('/api/data/nifty');
    return response.data;
  },

  async getDataByRange(start: string, end: string): Promise<Dataset> {
    const response = await apiClient.get('/api/data/range', {
      params: { start, end },
    });
    return response.data;
  },

  // Analysis endpoints
  async getCorrelations(): Promise<any> {
    const response = await apiClient.get('/api/analysis/correlations');
    return response.data;
  },

  async getInsights(): Promise<any> {
    const response = await apiClient.get('/api/analysis/insights');
    return response.data;
  },

  async comparePeriods(period1: DateRange, period2: DateRange): Promise<PeriodComparison> {
    const response = await apiClient.get('/api/analysis/compare', {
      params: {
        period1Start: period1.start,
        period1End: period1.end,
        period2Start: period2.start,
        period2End: period2.end,
      },
    });
    return response.data;
  },

  async getAnalysis(): Promise<AnalysisData> {
    const response = await apiClient.get('/api/analysis/full');
    return response.data;
  },
};

export default api;
