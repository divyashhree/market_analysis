'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Zap,
  BarChart2,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Bell,
  RefreshCw,
  Eye,
  MessageSquare,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface NewsItem {
  id: number;
  headline: string;
  source: string;
  timestamp: string;
  category: string;
  sentiment: {
    sentiment: string;
    score: number;
    confidence: string;
  };
}

interface MarketSentiment {
  overallSentiment: string;
  fearGreedIndex: number;
  totalNewsAnalyzed: number;
  categorySentiments: Record<string, { score: string; sentiment: string }>;
  indicators: {
    fiiActivity: string;
    volatilityExpectation: string;
    trendStrength: string;
  };
}

export default function SentimentPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [movers, setMovers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [newsData, sentimentData, trendData, moversData, alertsData] = await Promise.all([
        api.getNewsFeed({ category: selectedCategory === 'all' ? undefined : selectedCategory, limit: 10 }),
        api.getMarketSentiment(),
        api.getSentimentTrend(7),
        api.getMarketMovers(),
        api.getSentimentAlerts(),
      ]);
      setNews(newsData);
      setMarketSentiment(sentimentData);
      setTrend(trendData);
      setMovers(moversData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-emerald-500" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      case 'negative': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800/50';
    }
  };

  const getFearGreedColor = (index: number) => {
    if (index <= 25) return '#ef4444'; // Extreme Fear
    if (index <= 40) return '#f59e0b'; // Fear
    if (index <= 60) return '#6b7280'; // Neutral
    if (index <= 75) return '#22c55e'; // Greed
    return '#16a34a'; // Extreme Greed
  };

  const getFearGreedLabel = (index: number) => {
    if (index <= 25) return 'Extreme Fear';
    if (index <= 40) return 'Fear';
    if (index <= 60) return 'Neutral';
    if (index <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  const categories = ['all', 'rbi', 'markets', 'global', 'earnings', 'budget', 'fed'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-cyan-950/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <Activity className="w-4 h-4" />
            Real-time Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Sentiment Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            AI-powered news sentiment analysis and market mood indicators
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - News Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Filter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 overflow-x-auto pb-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </motion.div>

            {/* News List */}
            <div className="space-y-4">
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-5 border-l-4 ${getSentimentColor(item.sentiment.sentiment)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400">
                          {item.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.source}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {item.headline}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          {getSentimentIcon(item.sentiment.sentiment)}
                          <span className="capitalize">{item.sentiment.sentiment}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          {item.sentiment.confidence}% confidence
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Sentiment Dashboard */}
          <div className="space-y-6">
            {/* Fear & Greed Index */}
            {marketSentiment && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Fear & Greed Index
                </h3>
                
                <div className="relative h-48 flex items-center justify-center">
                  {/* Circular Gauge */}
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      className="text-gray-200 dark:text-slate-700"
                      strokeWidth="12"
                      stroke="currentColor"
                      fill="transparent"
                      r="60"
                      cx="80"
                      cy="80"
                    />
                    <motion.circle
                      stroke={getFearGreedColor(marketSentiment.fearGreedIndex)}
                      strokeWidth="12"
                      fill="transparent"
                      r="60"
                      cx="80"
                      cy="80"
                      initial={{ strokeDasharray: '0 377' }}
                      animate={{ 
                        strokeDasharray: `${(marketSentiment.fearGreedIndex / 100) * 377} 377` 
                      }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className="text-4xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' }}
                    >
                      {marketSentiment.fearGreedIndex}
                    </motion.span>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: getFearGreedColor(marketSentiment.fearGreedIndex) }}
                    >
                      {getFearGreedLabel(marketSentiment.fearGreedIndex)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                    <div className="font-bold text-blue-600">{marketSentiment.indicators.fiiActivity}</div>
                    <div className="text-gray-500">FII Activity</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                    <div className="font-bold text-purple-600">{marketSentiment.indicators.volatilityExpectation}</div>
                    <div className="text-gray-500">Volatility</div>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
                    <div className="font-bold text-emerald-600">{marketSentiment.indicators.trendStrength}</div>
                    <div className="text-gray-500">Trend</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Sentiment Trend Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-500" />
                7-Day Sentiment Trend
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="fearGreedIndex" 
                    stroke="#8b5cf6" 
                    fill="url(#sentimentGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Market Movers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Trending in News
              </h3>
              <div className="space-y-3">
                {movers.slice(0, 5).map((mover, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                      <span className="font-medium">{mover.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${
                        parseFloat(mover.avgSentiment) > 0 
                          ? 'text-emerald-500' 
                          : parseFloat(mover.avgSentiment) < 0 
                            ? 'text-red-500' 
                            : 'text-gray-500'
                      }`}>
                        {parseFloat(mover.avgSentiment) > 0 ? '+' : ''}{mover.avgSentiment}
                      </span>
                      <span className="text-xs text-gray-500">
                        {mover.mentions} mentions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alerts */}
            {alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  Active Alerts
                </h3>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-l-4 ${
                        alert.type === 'warning' 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : alert.type === 'opportunity'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className={`w-4 h-4 ${
                          alert.type === 'warning' 
                            ? 'text-orange-500'
                            : alert.type === 'opportunity'
                              ? 'text-emerald-500'
                              : 'text-blue-500'
                        }`} />
                        <span className="font-semibold text-sm">{alert.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
