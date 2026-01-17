'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import {
  Briefcase,
  Plus,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  PieChart,
  BarChart2,
  RefreshCw,
  Bell,
  ChevronRight,
  Info,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface Holding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number;
  sector?: string;
  change?: number;
  value?: number;
  pnl?: number;
}

interface Portfolio {
  userId: string;
  holdings: Holding[];
  totalValue: number;
  totalPnL: number;
  riskMetrics: {
    volatility: number;
    beta: number;
    sectorConcentration: number;
  };
  sectorBreakdown: Record<string, number>;
}

interface Alert {
  type: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  time: string;
}

const SECTOR_COLORS: Record<string, string> = {
  'Banking & Finance': '#3b82f6',
  'IT & Technology': '#8b5cf6',
  'FMCG': '#10b981',
  'Pharma & Healthcare': '#f59e0b',
  'Auto & Auto Components': '#ef4444',
  'Energy & Utilities': '#06b6d4',
  'Infrastructure': '#6366f1',
  'Metals & Mining': '#84cc16',
  'Telecom': '#f97316',
  'Others': '#64748b',
};

const STRESS_SCENARIOS = [
  { id: 'gfc', name: '2008 GFC Replay', icon: '📉', description: 'Global financial crisis scenario' },
  { id: 'covid', name: 'COVID Crash', icon: '🦠', description: 'March 2020 market crash' },
  { id: 'stagflation', name: 'Stagflation', icon: '📈', description: 'High inflation + low growth' },
  { id: 'rate_shock', name: 'Rate Shock', icon: '🏦', description: 'Sudden 200bps rate hike' },
  { id: 'rupee_crisis', name: 'Rupee Crisis', icon: '💱', description: '20% currency depreciation' },
];

// Consistent number formatting to avoid hydration mismatch
const formatINR = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export default function PortfolioPage() {
  const [userId, setUserId] = useState<string>('');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [nseStocks, setNseStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stressTestResult, setStressTestResult] = useState<any>(null);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // New holding form
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    quantity: 0,
    avgPrice: 0,
  });

  // Generate userId on client side only to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Check localStorage for existing userId or generate new one
    let storedUserId = localStorage.getItem('portfolio_user_id');
    if (!storedUserId) {
      storedUserId = 'user_' + Math.random().toString(36).substring(7);
      localStorage.setItem('portfolio_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  useEffect(() => {
    if (searchQuery && nseStocks.length > 0) {
      const filtered = nseStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10);
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks([]);
    }
  }, [searchQuery, nseStocks]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stocksData, portfolioData, alertsData] = await Promise.all([
        api.getNSEStocks(),
        api.getPortfolio(userId).catch(() => null),
        api.getPortfolioAlerts(userId).catch(() => []),
      ]);
      
      setNseStocks(stocksData);
      if (portfolioData) {
        setPortfolio(portfolioData);
      }
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPortfolio = async () => {
    try {
      const result = await api.createPortfolio(userId, []);
      setPortfolio(result);
    } catch (error) {
      console.error('Failed to create portfolio:', error);
    }
  };

  const addHolding = async () => {
    console.log('addHolding called with:', newHolding);
    
    // Validate inputs
    if (!newHolding.symbol || !newHolding.symbol.trim()) {
      alert('Please enter a stock symbol');
      return;
    }
    if (newHolding.quantity <= 0) {
      alert('Please enter a valid quantity (greater than 0)');
      return;
    }
    if (newHolding.avgPrice <= 0) {
      alert('Please enter a valid price (greater than 0)');
      return;
    }
    
    console.log('Validation passed, updating portfolio...');
    
    try {
      const holdings = portfolio?.holdings || [];
      const existingIndex = holdings.findIndex(h => h.symbol === newHolding.symbol);
      
      let updatedHoldings;
      if (existingIndex >= 0) {
        // Update existing holding (average the prices)
        const existing = holdings[existingIndex];
        const totalQty = existing.quantity + newHolding.quantity;
        const avgPrice = ((existing.avgPrice * existing.quantity) + (newHolding.avgPrice * newHolding.quantity)) / totalQty;
        updatedHoldings = [...holdings];
        updatedHoldings[existingIndex] = { ...existing, quantity: totalQty, avgPrice };
      } else {
        updatedHoldings = [...holdings, newHolding];
      }
      
      console.log('Updated holdings:', updatedHoldings);
      
      if (!portfolio) {
        console.log('Creating new portfolio...');
        const result = await api.createPortfolio(userId, updatedHoldings);
        setPortfolio(result);
      } else {
        console.log('Updating existing portfolio...');
        const result = await api.updatePortfolio(userId, updatedHoldings);
        setPortfolio(result);
      }
      
      console.log('Portfolio updated successfully!');
      
      setNewHolding({ symbol: '', quantity: 0, avgPrice: 0 });
      setSearchQuery('');
      setIsAddingStock(false);
      
      // Reload alerts
      const alertsData = await api.getPortfolioAlerts(userId);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to add holding:', error);
      alert('Failed to add stock. Please try again.');
    }
  };

  const removeHolding = async (symbol: string) => {
    if (!portfolio) return;
    
    try {
      const updatedHoldings = portfolio.holdings.filter(h => h.symbol !== symbol);
      const result = await api.updatePortfolio(userId, updatedHoldings);
      setPortfolio(result);
    } catch (error) {
      console.error('Failed to remove holding:', error);
    }
  };

  const runStressTest = async (scenario: string) => {
    if (!portfolio || portfolio.holdings.length === 0) return;
    
    setSelectedScenario(scenario);
    try {
      const result = await api.runStressTest(userId, scenario);
      setStressTestResult(result);
    } catch (error) {
      console.error('Stress test failed:', error);
    }
  };

  const selectStock = (stock: any) => {
    setNewHolding({ ...newHolding, symbol: stock.symbol });
    setSearchQuery(stock.symbol);
    setFilteredStocks([]);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'danger': return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300';
    }
  };

  const sectorPieData = portfolio?.sectorBreakdown 
    ? Object.entries(portfolio.sectorBreakdown).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
        color: SECTOR_COLORS[name] || SECTOR_COLORS['Others'],
      }))
    : [];

  const stressTestChartData = stressTestResult?.impacts
    ? Object.entries(stressTestResult.impacts).map(([sector, impact]) => ({
        sector,
        impact: typeof impact === 'number' ? impact : 0,
        fill: (typeof impact === 'number' && impact < 0) ? '#ef4444' : '#10b981',
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-emerald-950/30 dark:to-teal-950/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Personal Finance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Portfolio Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track your investments, receive macro alerts, and stress test your portfolio against historical scenarios.
          </p>
        </motion.div>

        {/* Alert Banner */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="glass-card p-4 border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Macro Alerts</h3>
                <span className="badge badge-warning">{alerts.length} alerts</span>
              </div>
              <div className="space-y-2">
                {alerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm opacity-80">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Portfolio Summary - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Cards */}
              {portfolio && portfolio.holdings.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{formatINR(portfolio.totalValue)}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-4"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total P&L</div>
                    <div className={`text-2xl font-bold ${portfolio.totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {portfolio.totalPnL >= 0 ? '+' : ''}₹{formatINR(portfolio.totalPnL)}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-4"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Volatility</div>
                    <div className="text-2xl font-bold text-blue-500">
                      {portfolio.riskMetrics?.volatility?.toFixed(1) || '0'}%
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-4"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Holdings</div>
                    <div className="text-2xl font-bold text-purple-500">
                      {portfolio.holdings?.length || 0}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Holdings Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    Your Holdings
                  </h2>
                  <button
                    onClick={() => setIsAddingStock(true)}
                    className="btn-primary text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Stock
                  </button>
                </div>

                {/* Add Stock Form */}
                <AnimatePresence>
                  {isAddingStock && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-4">Add New Holding</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Stock Symbol</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setNewHolding({ ...newHolding, symbol: e.target.value.toUpperCase() });
                              }}
                              placeholder="Search stock..."
                              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          {/* Dropdown */}
                          {filteredStocks.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-h-48 overflow-auto">
                              {filteredStocks.map((stock) => (
                                <button
                                  key={stock.symbol}
                                  onClick={() => selectStock(stock)}
                                  className="w-full px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/30 flex items-center justify-between"
                                >
                                  <span className="font-medium text-gray-900 dark:text-white">{stock.symbol}</span>
                                  <span className="text-sm text-gray-500">{stock.name?.substring(0, 20)}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={newHolding.quantity || ''}
                            onChange={(e) => setNewHolding({ ...newHolding, quantity: parseInt(e.target.value) || 0 })}
                            placeholder="100"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Price (₹)</label>
                          <input
                            type="number"
                            value={newHolding.avgPrice || ''}
                            onChange={(e) => setNewHolding({ ...newHolding, avgPrice: parseFloat(e.target.value) || 0 })}
                            placeholder="1500"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        
                        <div className="flex items-end gap-2">
                          <button onClick={addHolding} className="btn-primary flex-1">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Add
                          </button>
                          <button onClick={() => setIsAddingStock(false)} className="btn-secondary">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Holdings List */}
                {!portfolio || portfolio.holdings.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No holdings yet</h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">
                      Start building your portfolio by adding your first stock
                    </p>
                    <button onClick={() => setIsAddingStock(true)} className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Stock
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          <th className="pb-3 font-medium">Stock</th>
                          <th className="pb-3 font-medium">Sector</th>
                          <th className="pb-3 font-medium text-right">Qty</th>
                          <th className="pb-3 font-medium text-right">Avg Price</th>
                          <th className="pb-3 font-medium text-right">Current</th>
                          <th className="pb-3 font-medium text-right">P&L</th>
                          <th className="pb-3 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.holdings.map((holding, index) => (
                          <motion.tr
                            key={holding.symbol}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                          >
                            <td className="py-4">
                              <div className="font-medium text-gray-900 dark:text-white">{holding.symbol}</div>
                            </td>
                            <td className="py-4">
                              <span className="text-sm px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                {holding.sector || 'Others'}
                              </span>
                            </td>
                            <td className="py-4 text-right text-gray-700 dark:text-gray-300">{holding.quantity}</td>
                            <td className="py-4 text-right text-gray-700 dark:text-gray-300">₹{formatINR(holding.avgPrice)}</td>
                            <td className="py-4 text-right text-gray-700 dark:text-gray-300">{holding.currentPrice ? `₹${formatINR(holding.currentPrice)}` : '-'}</td>
                            <td className="py-4 text-right">
                              {holding.pnl !== undefined ? (
                                <span className={holding.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                  {holding.pnl >= 0 ? '+' : ''}₹{formatINR(holding.pnl)}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => removeHolding(holding.symbol)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Stress Test Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-red-500" />
                  Stress Test Your Portfolio
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  See how your portfolio would perform under historical crisis scenarios
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {STRESS_SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => runStressTest(scenario.id)}
                      disabled={!portfolio || portfolio.holdings.length === 0}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedScenario === scenario.id
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="text-2xl mb-2">{scenario.icon}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{scenario.name}</div>
                    </button>
                  ))}
                </div>

                {/* Stress Test Results */}
                {stressTestResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{stressTestResult.scenario}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stressTestResult.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Projected Loss</div>
                        <div className="text-2xl font-bold text-red-500">
                          {stressTestResult.portfolioImpact?.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Estimated ₹ Impact</div>
                        <div className="text-2xl font-bold text-red-500">
                          -₹{formatINR(Math.abs(stressTestResult.estimatedLoss || 0))}
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Recovery Time</div>
                        <div className="text-2xl font-bold text-orange-500">
                          {stressTestResult.recoveryTime || '6-12'} months
                        </div>
                      </div>
                    </div>

                    {stressTestChartData.length > 0 && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stressTestChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={['dataMin - 5', 'dataMax + 5']} tickFormatter={(v) => `${v}%`} />
                            <YAxis type="category" dataKey="sector" width={100} />
                            <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Impact']} />
                            <Bar dataKey="impact" fill="#ef4444" radius={[0, 4, 4, 0]}>
                              {stressTestChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {stressTestResult.recommendation && (
                      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-700 dark:text-blue-300">Recommendation</p>
                            <p className="text-sm text-blue-600 dark:text-blue-400">{stressTestResult.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Sector Breakdown */}
              {portfolio && portfolio.holdings.length > 0 && sectorPieData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5 text-purple-500" />
                    Sector Breakdown
                  </h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={sectorPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {sectorPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}%`, 'Allocation']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    {sectorPieData.map((sector) => (
                      <div key={sector.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{sector.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{sector.value}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Risk Metrics */}
              {portfolio && portfolio.riskMetrics && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-orange-500" />
                    Risk Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{portfolio.riskMetrics.volatility?.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all"
                          style={{ width: `${Math.min(portfolio.riskMetrics.volatility * 2, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Beta (vs NIFTY)</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{portfolio.riskMetrics.beta?.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                          style={{ width: `${Math.min(portfolio.riskMetrics.beta * 50, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sector Concentration</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{portfolio.riskMetrics.sectorConcentration?.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${portfolio.riskMetrics.sectorConcentration}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <Info className="w-3 h-3 inline mr-1" />
                      High concentration (&gt;40%) increases sector-specific risk. Consider diversifying.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={loadData}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">Refresh Portfolio</span>
                  </button>
                  
                  <a
                    href="/simulator"
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700 dark:text-gray-300">Run What-If Analysis</span>
                  </a>
                  
                  <a
                    href="/sentiment"
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Activity className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">Check Market Sentiment</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
