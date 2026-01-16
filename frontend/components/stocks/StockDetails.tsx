"use client";

import React from 'react';
import { StockData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowUp, ArrowDown, Minus, ExternalLink, X, TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface StockDetailsProps {
  stockData: StockData;
  onClear: () => void;
}

const formatNumber = (num: number | undefined | null, options: Intl.NumberFormatOptions = {}) => {
  if (num === undefined || num === null) return 'N/A';
  return new Intl.NumberFormat('en-US', options).format(num);
};

const formatMarketCap = (num: number | undefined | null) => {
  if (num === undefined || num === null) return 'N/A';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toString()}`;
};

const StockDetails: React.FC<StockDetailsProps> = ({ stockData, onClear }) => {
  const { profile, historicalData } = stockData;
  const latestData = historicalData[historicalData.length - 1];
  const previousData = historicalData[historicalData.length - 2];

  const change = latestData && previousData ? latestData.close - previousData.close : 0;
  const percentChange = previousData ? (change / previousData.close) * 100 : 0;

  const ChangeIndicator = () => {
    if (change > 0) return <ArrowUp className="h-5 w-5 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  const chartData = historicalData.map(d => ({
    date: d.date,
    value: d.close,
  }));

  const InfoCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon?: React.ElementType }) => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{profile.symbol}</h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {profile.country}
                </Badge>
              </div>
              <p className="text-lg text-white/80">{profile.name}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="border-white/30 text-white">{profile.sector}</Badge>
                <Badge variant="outline" className="border-white/30 text-white">{profile.industry}</Badge>
              </div>
            </div>
            <button 
              onClick={onClear} 
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
        
        <CardContent className="pt-6">
          <div className="flex items-baseline gap-4 mb-6">
            <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              ${formatNumber(profile.currentPrice, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className={`flex items-center gap-1 text-xl font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <ChangeIndicator />
              <span>{formatNumber(Math.abs(change), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span>({formatNumber(Math.abs(percentChange), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <InfoCard title="Market Cap" value={formatMarketCap(profile.marketCap)} icon={DollarSign} />
            <InfoCard title="Volume" value={formatNumber(profile.volume)} icon={TrendingUp} />
            <InfoCard title="P/E Ratio" value={formatNumber(profile.forwardPE, { minimumFractionDigits: 2 })} />
            <InfoCard title="Div Yield" value={`${formatNumber((profile.dividendYield || 0) * 100, { minimumFractionDigits: 2 })}%`} />
            <InfoCard title="Beta" value={formatNumber(profile.beta, { minimumFractionDigits: 2 })} />
          </div>
        </CardContent>
      </Card>

      {/* Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Historical Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                />
                <YAxis 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>🏢 Company Profile</CardTitle>
            {profile.website && (
              <a 
                href={profile.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                Visit Website <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {profile.longBusinessSummary || 'No company summary available.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard title="52-Week High" value={`$${formatNumber(profile.fiftyTwoWeekHigh, { minimumFractionDigits: 2 })}`} />
            <InfoCard title="52-Week Low" value={`$${formatNumber(profile.fiftyTwoWeekLow, { minimumFractionDigits: 2 })}`} />
            <InfoCard title="Target Price" value={`$${formatNumber(profile.targetMeanPrice, { minimumFractionDigits: 2 })}`} icon={Target} />
            <InfoCard title="Recommendation" value={profile.recommendationKey?.replace(/_/g, ' ').toUpperCase() || 'N/A'} />
            <InfoCard title="Country" value={profile.country} />
            <InfoCard title="Employees" value={formatNumber(profile.fullTimeEmployees)} icon={Users} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockDetails;
