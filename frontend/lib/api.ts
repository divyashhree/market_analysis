import axios from 'axios';
import { 
  Dataset, 
  AnalysisData, 
  PeriodComparison, 
  DateRange,
  Country,
  CountryData,
  GlobalInflationEntry,
  GlobalStockEntry,
  GlobalCurrencyEntry,
  CountryComparisonData,
  RegionData,
  ComparisonDataType
} from './types';

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

  // ============ MULTI-COUNTRY ENDPOINTS ============

  // Get all available countries
  async getAllCountries(): Promise<{ success: boolean; count: number; data: Country[] }> {
    const response = await apiClient.get('/api/countries');
    return response.data;
  },

  // Get regions and countries by region
  async getRegions(): Promise<{ success: boolean; data: RegionData }> {
    const response = await apiClient.get('/api/countries/regions');
    return response.data;
  },

  // Get top economies by GDP
  async getTopEconomies(limit: number = 20): Promise<{ success: boolean; data: CountryComparisonData }> {
    const response = await apiClient.get('/api/countries/top-economies', {
      params: { limit }
    });
    return response.data;
  },

  // Get global inflation comparison
  async getGlobalInflation(): Promise<{ success: boolean; count: number; data: GlobalInflationEntry[] }> {
    const response = await apiClient.get('/api/countries/global/inflation');
    return response.data;
  },

  // Get global stock market performance
  async getGlobalStocks(): Promise<{ success: boolean; count: number; data: GlobalStockEntry[] }> {
    const response = await apiClient.get('/api/countries/global/stocks');
    return response.data;
  },

  // Get global currency comparison
  async getGlobalCurrencies(): Promise<{ success: boolean; count: number; data: GlobalCurrencyEntry[] }> {
    const response = await apiClient.get('/api/countries/global/currencies');
    return response.data;
  },

  // Compare multiple countries
  async compareCountries(
    countryCodes: string[], 
    type: ComparisonDataType = 'all'
  ): Promise<{ success: boolean; countries: string[]; dataType: string; data: CountryComparisonData }> {
    const response = await apiClient.get('/api/countries/compare', {
      params: { 
        countries: countryCodes.join(','),
        type 
      }
    });
    return response.data;
  },

  // Get data for a specific region
  async getRegionData(region: string): Promise<{ success: boolean; region: string; data: CountryComparisonData }> {
    const response = await apiClient.get(`/api/countries/region/${encodeURIComponent(region)}`);
    return response.data;
  },

  // Get comprehensive data for a single country
  async getCountryData(countryCode: string): Promise<{ success: boolean; data: CountryData }> {
    const response = await apiClient.get(`/api/countries/${countryCode}`);
    return response.data;
  },

  // Get inflation data for a specific country
  async getCountryInflation(countryCode: string): Promise<any> {
    const response = await apiClient.get(`/api/countries/${countryCode}/inflation`);
    return response.data;
  },

  // Get stock data for a specific country
  async getCountryStock(countryCode: string): Promise<any> {
    const response = await apiClient.get(`/api/countries/${countryCode}/stock`);
    return response.data;
  },

  // Get currency data for a specific country
  async getCountryCurrency(countryCode: string): Promise<any> {
    const response = await apiClient.get(`/api/countries/${countryCode}/currency`);
    return response.data;
  },

  // ============ CHAT ENDPOINTS ============
  
  // Send a chat message
  async sendChatMessage(message: string, conversationHistory?: any[]): Promise<{
    success: boolean;
    data: {
      message: string;
      timestamp: string;
      hasAI: boolean;
    };
  }> {
    const response = await apiClient.post('/api/chat', {
      message,
      conversationHistory
    });
    return response.data;
  },

  // Get chat suggestions
  async getChatSuggestions(): Promise<{ success: boolean; data: string[] }> {
    const response = await apiClient.get('/api/chat/suggestions');
    return response.data;
  },

  // Get chat context (for debugging)
  async getChatContext(): Promise<any> {
    const response = await apiClient.get('/api/chat/context');
    return response.data;
  },
};

export default api;
