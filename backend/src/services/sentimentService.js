const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * Sentiment Analysis Service
 * Analyzes news sentiment and correlates with market movements
 */
class SentimentService {
  constructor() {
    // Keywords for sentiment analysis
    this.positiveKeywords = [
      'rally', 'surge', 'gain', 'rise', 'bull', 'growth', 'profit', 'boost',
      'upgrade', 'outperform', 'beat', 'exceed', 'strong', 'robust', 'optimistic',
      'recovery', 'expansion', 'investment', 'inflow', 'positive', 'breakthrough'
    ];
    
    this.negativeKeywords = [
      'fall', 'drop', 'crash', 'bear', 'loss', 'decline', 'plunge', 'slump',
      'downgrade', 'underperform', 'miss', 'weak', 'concern', 'fear', 'panic',
      'recession', 'crisis', 'outflow', 'negative', 'warning', 'cut', 'risk'
    ];
    
    // Market moving keywords
    this.marketKeywords = {
      rbi: ['RBI', 'repo rate', 'monetary policy', 'MPC', 'interest rate', 'CRR', 'SLR'],
      fed: ['Fed', 'Federal Reserve', 'FOMC', 'Jerome Powell', 'US rates'],
      budget: ['budget', 'fiscal deficit', 'capex', 'tax', 'disinvestment'],
      earnings: ['Q1', 'Q2', 'Q3', 'Q4', 'quarterly results', 'earnings', 'profit', 'revenue'],
      global: ['crude oil', 'dollar', 'FII', 'DII', 'global markets'],
    };
    
    // Simulated news feed (in production, would use news API)
    this.newsCache = [];
    this.generateMockNews();
  }

  /**
   * Generate mock news for demonstration
   */
  generateMockNews() {
    this.newsCache = [
      {
        id: 1,
        headline: 'RBI keeps repo rate unchanged at 6.5%, signals cautious stance on inflation',
        source: 'Economic Times',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'rbi',
        url: '#',
      },
      {
        id: 2,
        headline: 'NIFTY rallies 300 points on strong FII inflows, IT stocks lead gains',
        source: 'Moneycontrol',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: 'markets',
        url: '#',
      },
      {
        id: 3,
        headline: 'Crude oil prices surge above $85 amid Middle East tensions',
        source: 'Reuters',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        category: 'global',
        url: '#',
      },
      {
        id: 4,
        headline: 'TCS Q3 results beat estimates, revenue up 8% YoY',
        source: 'Business Standard',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        category: 'earnings',
        url: '#',
      },
      {
        id: 5,
        headline: 'Government announces Rs 11 lakh crore capex for infrastructure in FY25',
        source: 'CNBC TV18',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        category: 'budget',
        url: '#',
      },
      {
        id: 6,
        headline: 'Rupee weakens to 83.5 against dollar on FII outflows',
        source: 'Financial Express',
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        category: 'global',
        url: '#',
      },
      {
        id: 7,
        headline: 'Banking stocks under pressure as NPA concerns resurface',
        source: 'Mint',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        category: 'sectors',
        url: '#',
      },
      {
        id: 8,
        headline: 'Fed signals potential rate cuts in 2024, global markets cheer',
        source: 'Bloomberg',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        category: 'fed',
        url: '#',
      },
    ];
  }

  /**
   * Analyze sentiment of a text
   */
  analyzeSentiment(text) {
    const lowerText = text.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;
    const foundKeywords = { positive: [], negative: [] };
    
    this.positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        positiveScore++;
        foundKeywords.positive.push(keyword);
      }
    });
    
    this.negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        negativeScore++;
        foundKeywords.negative.push(keyword);
      }
    });
    
    const totalScore = positiveScore + negativeScore;
    let sentiment = 'neutral';
    let confidence = 0;
    
    if (totalScore > 0) {
      const ratio = (positiveScore - negativeScore) / totalScore;
      if (ratio > 0.2) sentiment = 'positive';
      else if (ratio < -0.2) sentiment = 'negative';
      confidence = Math.min(totalScore * 15, 95);
    }
    
    return {
      sentiment,
      score: positiveScore - negativeScore,
      confidence: confidence.toFixed(0),
      keywords: foundKeywords,
    };
  }

  /**
   * Get news feed with sentiment
   */
  getNewsFeed(options = {}) {
    const { category, limit = 10 } = options;
    
    let news = [...this.newsCache];
    
    if (category) {
      news = news.filter(n => n.category === category);
    }
    
    return news.slice(0, limit).map(item => ({
      ...item,
      sentiment: this.analyzeSentiment(item.headline),
    }));
  }

  /**
   * Get market sentiment summary
   */
  getMarketSentiment() {
    const allNews = this.newsCache;
    let totalScore = 0;
    const categoryScores = {};
    
    allNews.forEach(news => {
      const analysis = this.analyzeSentiment(news.headline);
      totalScore += analysis.score;
      
      if (!categoryScores[news.category]) {
        categoryScores[news.category] = { total: 0, count: 0 };
      }
      categoryScores[news.category].total += analysis.score;
      categoryScores[news.category].count++;
    });
    
    const avgScore = totalScore / allNews.length;
    
    let overallSentiment = 'Neutral';
    let fearGreedIndex = 50;
    
    if (avgScore > 0.5) {
      overallSentiment = 'Bullish';
      fearGreedIndex = Math.min(50 + avgScore * 25, 90);
    } else if (avgScore < -0.5) {
      overallSentiment = 'Bearish';
      fearGreedIndex = Math.max(50 + avgScore * 25, 10);
    }
    
    const categorySentiments = {};
    Object.entries(categoryScores).forEach(([cat, data]) => {
      const avg = data.total / data.count;
      categorySentiments[cat] = {
        score: avg.toFixed(2),
        sentiment: avg > 0.3 ? 'positive' : avg < -0.3 ? 'negative' : 'neutral',
      };
    });
    
    return {
      overallSentiment,
      fearGreedIndex: Math.round(fearGreedIndex),
      totalNewsAnalyzed: allNews.length,
      categorySentiments,
      lastUpdated: new Date().toISOString(),
      indicators: {
        fiiActivity: avgScore > 0 ? 'Buying' : 'Selling',
        volatilityExpectation: Math.abs(avgScore) > 1 ? 'High' : 'Low',
        trendStrength: Math.abs(avgScore) > 0.5 ? 'Strong' : 'Weak',
      },
    };
  }

  /**
   * Get sentiment trend over time (mock data)
   */
  getSentimentTrend(days = 7) {
    const trend = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate realistic-looking sentiment scores
      const baseScore = 50 + Math.sin(i * 0.8) * 20;
      const noise = (Math.random() - 0.5) * 15;
      
      trend.push({
        date: date.toISOString().split('T')[0],
        fearGreedIndex: Math.round(Math.max(10, Math.min(90, baseScore + noise))),
        newsCount: Math.floor(Math.random() * 20) + 10,
      });
    }
    
    return trend;
  }

  /**
   * Get key market movers from news
   */
  getMarketMovers() {
    const keywords = {};
    
    this.newsCache.forEach(news => {
      // Extract mentioned stocks/entities
      const mentions = this.extractMentions(news.headline);
      mentions.forEach(mention => {
        if (!keywords[mention]) {
          keywords[mention] = { count: 0, sentiment: 0 };
        }
        keywords[mention].count++;
        keywords[mention].sentiment += this.analyzeSentiment(news.headline).score;
      });
    });
    
    return Object.entries(keywords)
      .map(([name, data]) => ({
        name,
        mentions: data.count,
        avgSentiment: data.count > 0 ? (data.sentiment / data.count).toFixed(2) : 0,
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);
  }

  /**
   * Extract stock/entity mentions from text
   */
  extractMentions(text) {
    const stocks = ['TCS', 'NIFTY', 'RELIANCE', 'HDFC', 'INFOSYS', 'ICICI', 'SBI', 'BHARTI'];
    const entities = ['RBI', 'Fed', 'Government', 'FII', 'DII'];
    const allMentions = [...stocks, ...entities];
    
    return allMentions.filter(mention => 
      text.toUpperCase().includes(mention) || text.includes(mention)
    );
  }

  /**
   * Get alerts based on sentiment changes
   */
  getSentimentAlerts() {
    const alerts = [];
    const sentiment = this.getMarketSentiment();
    
    if (sentiment.fearGreedIndex > 75) {
      alerts.push({
        type: 'warning',
        title: 'Extreme Greed Detected',
        message: 'Market sentiment is extremely bullish. Consider taking profits.',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (sentiment.fearGreedIndex < 25) {
      alerts.push({
        type: 'opportunity',
        title: 'Extreme Fear Detected',
        message: 'Market sentiment is extremely bearish. Could be a buying opportunity.',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (sentiment.categorySentiments.rbi?.sentiment === 'negative') {
      alerts.push({
        type: 'info',
        title: 'RBI Sentiment Negative',
        message: 'Recent RBI news has negative sentiment. Monitor rate-sensitive sectors.',
        timestamp: new Date().toISOString(),
      });
    }
    
    return alerts;
  }
}

module.exports = new SentimentService();
