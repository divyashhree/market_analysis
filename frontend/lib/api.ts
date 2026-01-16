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
import { Stock, StockData } from './types';

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

  // ============ STOCK DATA ENDPOINTS ============

  /**
   * Search for stocks by symbol or name.
   * @param query The search query.
   * @returns A list of matching stocks.
   */
  async searchStocks(query: string): Promise<Stock[]> {
    if (!query) return [];
    const response = await apiClient.get(`/api/stocks/search/${query}`);
    return response.data;
  },

  /**
   * Get detailed data for a specific stock.
   * @param symbol The stock symbol.
   * @param period The time period for historical data.
   * @returns The stock's profile and historical data.
   */
  async getStockData(symbol: string, period: string = '1y'): Promise<StockData> {
    const response = await apiClient.get(`/api/stocks/${symbol}`, {
      params: { period },
    });
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

  // ============ SOCIAL ENDPOINTS ============

  // Get activity feed
  async getActivityFeed(): Promise<{ success: boolean; data: any[]; activeUsers: number }> {
    const response = await apiClient.get('/api/social/activity');
    return response.data;
  },

  // Get or create user profile
  async getUserProfile(userId: string): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get(`/api/social/profile/${userId}`);
    return response.data;
  },

  // Post a comment
  async postComment(userId: string, data: { country?: string; indicator?: string; text: string; pageId?: string }): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.post('/api/social/comments', { userId, ...data });
    return response.data;
  },

  // Get comments
  async getComments(country?: string, indicator?: string, limit?: number): Promise<{ success: boolean; data: any[] }> {
    const response = await apiClient.get('/api/social/comments', { 
      params: { country, indicator, limit } 
    });
    return response.data;
  },

  // Get recent comments
  async getRecentComments(limit?: number): Promise<{ success: boolean; data: any[] }> {
    const response = await apiClient.get('/api/social/comments/recent', { params: { limit } });
    return response.data;
  },

  // Add reaction
  async addReaction(userId: string, targetId: string, reactionType?: string): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.post('/api/social/reactions', { userId, targetId, reactionType });
    return response.data;
  },

  // Share an insight
  async shareInsight(userId: string, data: { 
    title?: string; 
    content: string; 
    countries?: string[]; 
    indicators?: string[]; 
    sentiment?: string 
  }): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.post('/api/social/insights', { userId, ...data });
    return response.data;
  },

  // Get social insights feed
  async getSocialInsights(limit?: number, filters?: { country?: string; sentiment?: string }): Promise<{ success: boolean; data: any[] }> {
    const response = await apiClient.get('/api/social/insights', { 
      params: { limit, ...filters } 
    });
    return response.data;
  },

  // Get leaderboard
  async getLeaderboard(limit?: number): Promise<{ success: boolean; data: any[] }> {
    const response = await apiClient.get('/api/social/leaderboard', { params: { limit } });
    return response.data;
  },

  // Get platform stats
  async getPlatformStats(): Promise<{ success: boolean; data: any }> {
    const response = await apiClient.get('/api/social/platform-stats');
    return response.data;
  },

  // ============ SIMULATOR ENDPOINTS ============

  // Get available simulation scenarios
  async getSimulatorScenarios(): Promise<any[]> {
    const response = await apiClient.get('/api/simulator/scenarios');
    return response.data;
  },

  // Run a what-if simulation
  async runSimulation(type: string, params: Record<string, any>): Promise<any> {
    const response = await apiClient.post('/api/simulator/run', { type, params });
    return response.data;
  },

  // Get simulator history
  async getSimulatorHistory(): Promise<{ history: any[]; avgAccuracy: string }> {
    const response = await apiClient.get('/api/simulator/history');
    return response.data;
  },

  // ============ PORTFOLIO ENDPOINTS ============

  // Create portfolio
  async createPortfolio(userId: string, holdings: Array<{ symbol: string; quantity: number; avgPrice: number }>): Promise<any> {
    const response = await apiClient.post('/api/portfolio/create', { userId, holdings });
    return response.data;
  },

  // Get portfolio
  async getPortfolio(userId: string): Promise<any> {
    const response = await apiClient.get(`/api/portfolio/${userId}`);
    return response.data;
  },

  // Update portfolio
  async updatePortfolio(userId: string, holdings: Array<{ symbol: string; quantity: number; avgPrice: number }>): Promise<any> {
    const response = await apiClient.put(`/api/portfolio/${userId}`, { holdings });
    return response.data;
  },

  // Get portfolio alerts
  async getPortfolioAlerts(userId: string): Promise<any[]> {
    const response = await apiClient.get(`/api/portfolio/${userId}/alerts`);
    return response.data;
  },

  // Run portfolio stress test
  async runStressTest(userId: string, scenario: string): Promise<any> {
    const response = await apiClient.post(`/api/portfolio/${userId}/stress-test`, { scenario });
    return response.data;
  },

  // Get available sectors
  async getSectors(): Promise<any[]> {
    const response = await apiClient.get('/api/portfolio/sectors/list');
    return response.data;
  },

  // Get NSE stocks list
  async getNSEStocks(): Promise<any[]> {
    const response = await apiClient.get('/api/portfolio/stocks/nse');
    return response.data;
  },

  // ============ EDUCATION ENDPOINTS ============

  // Get all tutorials
  async getTutorials(): Promise<any[]> {
    const response = await apiClient.get('/api/education/tutorials');
    return response.data;
  },

  // Get tutorial by ID
  async getTutorial(id: string): Promise<any> {
    const response = await apiClient.get(`/api/education/tutorials/${id}`);
    return response.data;
  },

  // Get all case studies
  async getCaseStudies(): Promise<any[]> {
    const response = await apiClient.get('/api/education/case-studies');
    return response.data;
  },

  // Get case study by ID
  async getCaseStudy(id: string): Promise<any> {
    const response = await apiClient.get(`/api/education/case-studies/${id}`);
    return response.data;
  },

  // Generate quiz
  async generateQuiz(options?: { category?: string; difficulty?: string; count?: number }): Promise<any> {
    const response = await apiClient.post('/api/education/quiz/generate', options || {});
    return response.data;
  },

  // Submit quiz
  async submitQuiz(quizId: string, answers: Array<{ questionId: number; answer: number }>, userId?: string): Promise<any> {
    const response = await apiClient.post('/api/education/quiz/submit', { quizId, answers, userId });
    return response.data;
  },

  // Get learning progress
  async getLearningProgress(userId: string): Promise<any> {
    const response = await apiClient.get(`/api/education/progress/${userId}`);
    return response.data;
  },

  // Complete tutorial
  async completeTutorial(tutorialId: string, userId: string): Promise<any> {
    const response = await apiClient.post(`/api/education/tutorials/${tutorialId}/complete`, { userId });
    return response.data;
  },

  // ============ SENTIMENT ENDPOINTS ============

  // Get news with sentiment
  async getNewsFeed(options?: { category?: string; limit?: number }): Promise<any[]> {
    const response = await apiClient.get('/api/sentiment/news', { params: options });
    return response.data;
  },

  // Get market sentiment
  async getMarketSentiment(): Promise<any> {
    const response = await apiClient.get('/api/sentiment/market');
    return response.data;
  },

  // Get sentiment trend
  async getSentimentTrend(days?: number): Promise<any[]> {
    const response = await apiClient.get('/api/sentiment/trend', { params: { days } });
    return response.data;
  },

  // Get market movers from news
  async getMarketMovers(): Promise<any[]> {
    const response = await apiClient.get('/api/sentiment/movers');
    return response.data;
  },

  // Get sentiment alerts
  async getSentimentAlerts(): Promise<any[]> {
    const response = await apiClient.get('/api/sentiment/alerts');
    return response.data;
  },

  // Analyze custom text sentiment
  async analyzeSentiment(text: string): Promise<any> {
    const response = await apiClient.post('/api/sentiment/analyze', { text });
    return response.data;
  },
};

export default api;
