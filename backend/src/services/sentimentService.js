const axios = require('axios');
const cacheService = require('./cacheService');

/**
 * Sentiment Analysis Service
 * Analyzes news sentiment and correlates with market movements
 * Uses real RSS feeds from financial news sources
 */
class SentimentService {
  constructor() {
    // Keywords for sentiment analysis
    this.positiveKeywords = [
      'rally', 'surge', 'gain', 'rise', 'bull', 'growth', 'profit', 'boost',
      'upgrade', 'outperform', 'beat', 'exceed', 'strong', 'robust', 'optimistic',
      'recovery', 'expansion', 'investment', 'inflow', 'positive', 'breakthrough',
      'soar', 'climb', 'jump', 'advance', 'record', 'high', 'boom'
    ];
    
    this.negativeKeywords = [
      'fall', 'drop', 'crash', 'bear', 'loss', 'decline', 'plunge', 'slump',
      'downgrade', 'underperform', 'miss', 'weak', 'concern', 'fear', 'panic',
      'recession', 'crisis', 'outflow', 'negative', 'warning', 'cut', 'risk',
      'tumble', 'sink', 'slide', 'retreat', 'low', 'down', 'sell-off'
    ];
    
    // Market moving keywords for categorization
    this.marketKeywords = {
      rbi: ['RBI', 'repo rate', 'monetary policy', 'MPC', 'interest rate', 'CRR', 'SLR', 'Reserve Bank'],
      fed: ['Fed', 'Federal Reserve', 'FOMC', 'Jerome Powell', 'US rates', 'treasury'],
      budget: ['budget', 'fiscal deficit', 'capex', 'tax', 'disinvestment', 'GST'],
      earnings: ['Q1', 'Q2', 'Q3', 'Q4', 'quarterly results', 'earnings', 'profit', 'revenue', 'results'],
      global: ['crude oil', 'dollar', 'FII', 'DII', 'global markets', 'oil price', 'forex'],
      markets: ['Sensex', 'NIFTY', 'BSE', 'NSE', 'stock market', 'share', 'equity'],
    };
    
    // RSS feed URLs for financial news
    this.rssFeeds = [
      {
        url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
        source: 'Economic Times'
      },
      {
        url: 'https://www.moneycontrol.com/rss/marketreports.xml',
        source: 'Moneycontrol'
      },
      {
        url: 'https://www.livemint.com/rss/markets',
        source: 'Mint'
      },
      {
        url: 'https://feeds.feedburner.com/ndtvprofit-latest',
        source: 'NDTV Profit'
      }
    ];
    
    // News cache - will be populated from RSS feeds
    this.newsCache = [];
    this.lastFetch = null;
    this.fetchInterval = 5 * 60 * 1000; // Refresh every 5 minutes
    
    // Initialize with real news
    this.fetchRealNews();
  }

  /**
   * Parse RSS XML to extract news items
   */
  parseRSSXML(xml, source) {
    const items = [];
    try {
      // Simple XML parsing for RSS items
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      const titleRegex = /<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/i;
      const linkRegex = /<link>(.*?)<\/link>/i;
      const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/i;
      const descRegex = /<description><!\[CDATA\[(.*?)\]\]>|<description>(.*?)<\/description>/i;

      let match;
      while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1];
        
        const titleMatch = titleRegex.exec(itemContent);
        const linkMatch = linkRegex.exec(itemContent);
        const pubDateMatch = pubDateRegex.exec(itemContent);
        const descMatch = descRegex.exec(itemContent);
        
        const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
        const link = linkMatch ? linkMatch[1].trim() : '#';
        const pubDate = this.parseDate(pubDateMatch ? pubDateMatch[1] : null);
        const description = descMatch ? (descMatch[1] || descMatch[2] || '').trim() : '';
        
        if (title) {
          items.push({
            headline: this.cleanHTML(title),
            url: link,
            timestamp: pubDate,
            source,
            description: this.cleanHTML(description).substring(0, 200)
          });
        }
      }
    } catch (error) {
      console.error(`Error parsing RSS from ${source}:`, error.message);
    }
    return items;
  }

  /**
   * Parse date from various formats
   */
  parseDate(dateStr) {
    if (!dateStr) return new Date().toISOString();
    
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {
      // Try manual parsing for common RSS date formats
    }
    
    // Return current time as fallback
    return new Date().toISOString();
  }

  /**
   * Clean HTML tags from text
   */
  cleanHTML(text) {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  /**
   * Categorize news based on keywords
   */
  categorizeNews(headline) {
    const lowerHeadline = headline.toLowerCase();
    
    for (const [category, keywords] of Object.entries(this.marketKeywords)) {
      for (const keyword of keywords) {
        if (lowerHeadline.includes(keyword.toLowerCase())) {
          return category;
        }
      }
    }
    return 'general';
  }

  /**
   * Fetch real news from RSS feeds
   */
  async fetchRealNews() {
    // Check if we have recent cached news
    const cacheKey = 'real_news_feed';
    const cached = cacheService.get(cacheKey);
    if (cached && this.lastFetch && (Date.now() - this.lastFetch) < this.fetchInterval) {
      this.newsCache = cached;
      return;
    }

    console.log('📰 Fetching real financial news from RSS feeds...');
    const allNews = [];
    
    // Fetch from all RSS feeds in parallel
    const feedPromises = this.rssFeeds.map(async (feed) => {
      try {
        const response = await axios.get(feed.url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml'
          }
        });
        
        const items = this.parseRSSXML(response.data, feed.source);
        console.log(`✅ Fetched ${items.length} articles from ${feed.source}`);
        return items;
      } catch (error) {
        console.warn(`⚠️ Failed to fetch from ${feed.source}: ${error.message}`);
        return [];
      }
    });

    try {
      const results = await Promise.all(feedPromises);
      results.forEach(items => allNews.push(...items));
      
      // Sort by timestamp and assign IDs
      this.newsCache = allNews
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 50) // Keep top 50 articles
        .map((item, index) => ({
          ...item,
          id: index + 1,
          category: this.categorizeNews(item.headline)
        }));
      
      this.lastFetch = Date.now();
      cacheService.set(cacheKey, this.newsCache, 300); // Cache for 5 minutes
      
      console.log(`📰 Total news articles cached: ${this.newsCache.length}`);
    } catch (error) {
      console.error('Error fetching news:', error.message);
      // Keep existing cache if fetch fails
    }
    
    // If no news fetched, use fallback
    if (this.newsCache.length === 0) {
      this.generateFallbackNews();
    }
  }

  /**
   * Generate fallback news only if RSS feeds fail
   */
  generateFallbackNews() {
    console.log('⚠️ Using fallback news data as RSS feeds unavailable');
    this.newsCache = [
      {
        id: 1,
        headline: 'Markets await RBI monetary policy decision this week',
        source: 'Market Update',
        timestamp: new Date().toISOString(),
        category: 'rbi',
        url: '#',
      },
      {
        id: 2,
        headline: 'Global markets show mixed trends amid economic uncertainty',
        source: 'Market Update',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'global',
        url: '#',
      },
      {
        id: 3,
        headline: 'Quarterly earnings season kicks off with major IT companies reporting',
        source: 'Market Update',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        category: 'earnings',
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
   * Get news feed with sentiment (async to ensure fresh data)
   */
  async getNewsFeed(options = {}) {
    // Refresh news if needed
    await this.fetchRealNews();
    
    const { category, limit = 10 } = options;
    
    let news = [...this.newsCache];
    
    if (category) {
      news = news.filter(n => n.category === category);
    }
    
    return news.slice(0, limit).map(item => ({
      ...item,
      sentiment: this.analyzeSentiment(item.headline + ' ' + (item.description || '')),
    }));
  }

  /**
   * Get market sentiment summary (async to ensure fresh data)
   */
  async getMarketSentiment() {
    // Refresh news if needed
    await this.fetchRealNews();
    
    const allNews = this.newsCache;
    let totalScore = 0;
    const categoryScores = {};
    
    allNews.forEach(news => {
      const analysis = this.analyzeSentiment(news.headline + ' ' + (news.description || ''));
      totalScore += analysis.score;
      
      if (!categoryScores[news.category]) {
        categoryScores[news.category] = { total: 0, count: 0 };
      }
      categoryScores[news.category].total += analysis.score;
      categoryScores[news.category].count++;
    });
    
    const avgScore = allNews.length > 0 ? totalScore / allNews.length : 0;
    
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
        fiiActivity: avgScore > 0 ? 'Buying' : avgScore < 0 ? 'Selling' : 'Neutral',
        volatilityExpectation: Math.abs(avgScore) > 1 ? 'High' : 'Low',
        trendStrength: Math.abs(avgScore) > 0.5 ? 'Strong' : 'Weak',
      },
    };
  }

  /**
   * Get sentiment trend based on actual cached news timestamps
   */
  async getSentimentTrend(days = 7) {
    // Refresh news if needed
    await this.fetchRealNews();
    
    const trend = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Filter news for this day
      const dayNews = this.newsCache.filter(news => {
        const newsDate = new Date(news.timestamp).toISOString().split('T')[0];
        return newsDate === dateStr;
      });
      
      // Calculate sentiment for this day
      let dayScore = 0;
      dayNews.forEach(news => {
        const analysis = this.analyzeSentiment(news.headline);
        dayScore += analysis.score;
      });
      
      const avgScore = dayNews.length > 0 ? dayScore / dayNews.length : 0;
      const fearGreedIndex = 50 + (avgScore * 15);
      
      trend.push({
        date: dateStr,
        fearGreedIndex: Math.round(Math.max(10, Math.min(90, fearGreedIndex))),
        newsCount: dayNews.length,
        sentiment: avgScore > 0.3 ? 'positive' : avgScore < -0.3 ? 'negative' : 'neutral'
      });
    }
    
    return trend;
  }

  /**
   * Get key market movers from news
   */
  async getMarketMovers() {
    // Refresh news if needed
    await this.fetchRealNews();
    
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
    const stocks = ['TCS', 'NIFTY', 'SENSEX', 'RELIANCE', 'HDFC', 'INFOSYS', 'ICICI', 'SBI', 'BHARTI', 'WIPRO', 'HCL', 'TATA', 'BAJAJ', 'KOTAK', 'AXIS', 'LIC', 'ADANI'];
    const entities = ['RBI', 'Fed', 'Government', 'FII', 'DII', 'SEBI', 'MPC'];
    const allMentions = [...stocks, ...entities];
    
    return allMentions.filter(mention => 
      text.toUpperCase().includes(mention) || text.includes(mention)
    );
  }

  /**
   * Get alerts based on sentiment changes
   */
  async getSentimentAlerts() {
    const alerts = [];
    const sentiment = await this.getMarketSentiment();
    
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
