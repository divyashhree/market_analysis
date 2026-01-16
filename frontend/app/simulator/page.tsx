'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  ChevronRight,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  params: Array<{
    name: string;
    type: string;
    default?: number;
    min?: number;
    max?: number;
    label: string;
    options?: string[];
  }>;
}

interface SimulationResult {
  scenario?: string;
  impacts?: Record<string, { change: number; confidence: number; direction: string }>;
  sectorImpacts?: Array<{ sector: string; impact: number }>;
  historicalContext?: {
    event: string;
    date: string;
    niftyChange: number;
    usdinrChange: number;
  };
  riskLevel?: string;
  recommendation?: string;
}

export default function SimulatorPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [params, setParams] = useState<Record<string, any>>({});
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadScenarios();
    loadHistory();
  }, []);

  const loadScenarios = async () => {
    try {
      const data = await api.getSimulatorScenarios();
      setScenarios(data);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await api.getSimulatorHistory();
      setHistory(data.history);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const selectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setResult(null);
    const defaultParams: Record<string, any> = {};
    scenario.params.forEach(p => {
      defaultParams[p.name] = p.default || (p.options ? p.options[0] : 0);
    });
    setParams(defaultParams);
  };

  const runSimulation = async () => {
    if (!selectedScenario) return;
    
    setLoading(true);
    try {
      const data = await api.runSimulation(selectedScenario.id, params);
      setResult(data);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact > 2) return 'text-emerald-500';
    if (impact > 0) return 'text-green-400';
    if (impact > -2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'high': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-indigo-950/30 dark:to-purple-950/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            What-If Simulator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Predict how market changes could impact NIFTY, USD/INR, and different sectors
            using AI models trained on historical data
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Scenario Selection */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-500" />
                Choose Scenario
              </h2>
              
              <div className="space-y-3">
                {scenarios.map((scenario, index) => (
                  <motion.button
                    key={scenario.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => selectScenario(scenario)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                      selectedScenario?.id === scenario.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{scenario.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold">{scenario.name}</div>
                        <div className={`text-sm ${
                          selectedScenario?.id === scenario.id
                            ? 'text-white/70'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {scenario.description}
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${
                        selectedScenario?.id === scenario.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* History Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 mt-6"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Model Accuracy
              </h3>
              <div className="space-y-3">
                {history.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">{item.event}</span>
                    <span className={`font-semibold ${item.accuracy >= 80 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                      {item.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Parameters & Results */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {selectedScenario && (
                <motion.div
                  key={selectedScenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-6"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    Configure Parameters
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedScenario.params.map((param) => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                          {param.label}
                        </label>
                        {param.type === 'select' ? (
                          <select
                            value={params[param.name] || ''}
                            onChange={(e) => setParams({ ...params, [param.name]: e.target.value })}
                            className="glass-input w-full px-4 py-3"
                          >
                            {param.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            <input
                              type="range"
                              min={param.min}
                              max={param.max}
                              step={0.25}
                              value={params[param.name] || param.default}
                              onChange={(e) => setParams({ ...params, [param.name]: parseFloat(e.target.value) })}
                              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500">{param.min}%</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {params[param.name] || param.default}%
                              </span>
                              <span className="text-gray-500">{param.max}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={runSimulation}
                    disabled={loading}
                    className="btn-primary w-full mt-6 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Running Simulation...' : 'Run Simulation'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Impact Summary */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {result.impacts && Object.entries(result.impacts).map(([key, data], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-2xl ${
                          data.change >= 0 ? 'stat-card-green' : 'stat-card-red'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {key.toUpperCase()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            data.confidence >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {data.confidence}% confidence
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {data.change >= 0 ? (
                            <TrendingUp className="w-8 h-8 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-8 h-8 text-red-500" />
                          )}
                          <span className={`text-3xl font-bold ${getImpactColor(data.change)}`}>
                            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sector Impact Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-indigo-500" />
                      Sector Impact Analysis
                    </h3>
                    {result.sectorImpacts && result.sectorImpacts.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={result.sectorImpacts} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                          <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                          <YAxis dataKey="sector" type="category" width={100} />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Impact']}
                            contentStyle={{
                              backgroundColor: 'rgba(15, 23, 42, 0.9)',
                              border: 'none',
                              borderRadius: '12px',
                              color: '#fff',
                            }}
                          />
                          <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                            {result.sectorImpacts.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={entry.impact >= 0 ? '#10b981' : '#ef4444'}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No sector impact data available
                      </div>
                    )}
                  </motion.div>

                  {/* Historical Context & Recommendation */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {result.historicalContext && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card p-6"
                      >
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-500" />
                          Historical Context
                        </h3>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                          <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                            Similar Event
                          </div>
                          <div className="font-bold text-lg mb-2">{result.historicalContext.event}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.historicalContext.date}
                          </div>
                          <div className="flex gap-4 mt-3">
                            <div className="text-sm">
                              <span className="text-gray-500">NIFTY: </span>
                              <span className={result.historicalContext.niftyChange >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                {result.historicalContext.niftyChange >= 0 ? '+' : ''}{result.historicalContext.niftyChange}%
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">USD/INR: </span>
                              <span className={result.historicalContext.usdinrChange >= 0 ? 'text-red-500' : 'text-emerald-500'}>
                                {result.historicalContext.usdinrChange >= 0 ? '+' : ''}{result.historicalContext.usdinrChange}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="glass-card p-6"
                    >
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        AI Recommendation
                      </h3>
                      {result.riskLevel && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-500">Risk Level:</span>
                          <span className={getRiskColor(result.riskLevel)}>
                            {result.riskLevel?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {result.recommendation || 'Analysis complete. Review the impact data above for detailed insights.'}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!selectedScenario && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Select a Scenario</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Choose a scenario from the left panel to simulate how different economic
                  changes could impact Indian markets
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
