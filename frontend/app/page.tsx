'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

// Floating country flags animation
function FloatingFlags() {
  const flags = ['🇺🇸', '🇬🇧', '🇩🇪', '🇯🇵', '🇨🇳', '🇮🇳', '🇫🇷', '🇧🇷', '🇰🇷', '🇦🇺', '🇨🇦', '🇸🇬', '🇨🇭', '🇪🇸', '🇮🇹'];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flags.map((flag, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-20 animate-float"
          style={{
            left: `${(i * 7) % 100}%`,
            top: `${(i * 13) % 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${15 + (i % 5)}s`,
          }}
        >
          {flag}
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          75% {
            transform: translateY(20px) rotate(-5deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-20 overflow-hidden">
        <FloatingFlags />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in">
              🌍 Global Market Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Compare economic indicators across <strong className="text-blue-600 dark:text-blue-400"><AnimatedCounter end={35} suffix="+" /></strong> countries - Inflation rates, 
              stock market indices, GDP growth, and currency exchange rates from official sources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/global"
                className="inline-block bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
              >
                🌍 Explore Global Data →
              </Link>
              <Link 
                href="/dashboard"
                className="inline-block bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-600 transform hover:scale-105 hover:-translate-y-1"
              >
                📊 India Dashboard →
              </Link>
            </div>
            
            {/* Live Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400"><AnimatedCounter end={35} suffix="+" /></p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Countries</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400"><AnimatedCounter end={6} /></p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Regions</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400"><AnimatedCounter end={100} suffix="+" /></p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Indices</p>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">24/7</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Live Data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Coverage Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            🌐 Global Coverage
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Compare economic data from major economies around the world using official data sources
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {[
              { flag: '🇺🇸', name: 'USA', index: 'S&P 500', color: 'from-blue-400 to-blue-600' },
              { flag: '🇬🇧', name: 'UK', index: 'FTSE 100', color: 'from-red-400 to-red-600' },
              { flag: '🇩🇪', name: 'Germany', index: 'DAX', color: 'from-yellow-400 to-yellow-600' },
              { flag: '🇯🇵', name: 'Japan', index: 'Nikkei 225', color: 'from-pink-400 to-pink-600' },
              { flag: '🇨🇳', name: 'China', index: 'Shanghai', color: 'from-red-500 to-red-700' },
              { flag: '🇮🇳', name: 'India', index: 'NIFTY 50', color: 'from-orange-400 to-orange-600' },
              { flag: '🇫🇷', name: 'France', index: 'CAC 40', color: 'from-blue-500 to-indigo-600' },
              { flag: '🇧🇷', name: 'Brazil', index: 'Bovespa', color: 'from-green-400 to-green-600' },
              { flag: '🇰🇷', name: 'S. Korea', index: 'KOSPI', color: 'from-blue-400 to-purple-600' },
              { flag: '🇦🇺', name: 'Australia', index: 'ASX 200', color: 'from-blue-500 to-blue-700' },
              { flag: '🇨🇦', name: 'Canada', index: 'TSX', color: 'from-red-400 to-pink-600' },
              { flag: '🇸🇬', name: 'Singapore', index: 'STI', color: 'from-red-500 to-red-600' },
            ].map((country) => (
              <div 
                key={country.name} 
                className={`
                  relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md text-center
                  transform transition-all duration-300 cursor-pointer
                  ${hoveredCountry === country.name ? 'scale-110 shadow-xl z-10' : 'hover:scale-105'}
                `}
                onMouseEnter={() => setHoveredCountry(country.name)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                {/* Gradient overlay on hover */}
                {hoveredCountry === country.name && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${country.color} opacity-10 rounded-lg`} />
                )}
                <div className="text-3xl mb-2 transform transition-transform duration-300 hover:scale-125">{country.flag}</div>
                <div className="font-semibold text-gray-900 dark:text-white text-sm">{country.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{country.index}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/global"
              className="inline-flex items-center gap-2 text-primary hover:text-blue-600 font-semibold transition-all duration-300 hover:gap-4"
            >
              View all 35+ countries 
              <span className="transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Interactive Visualizations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Explore data through line charts, scatter plots, dual-axis comparisons, 
                and correlation heatmaps powered by Recharts.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Calculate Pearson correlations, moving averages, rolling correlations, 
                and comparative statistics across multiple time periods.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Multi-Country Comparison
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compare inflation, stock indices, and currencies across 30+ countries 
                using official World Bank and Yahoo Finance data.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                10 Years of Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access monthly data from 2014-2024 for CPI, USD-INR exchange rates, 
                and NIFTY 50 index values.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">🌓</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Dark Mode Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comfortable viewing experience with full dark mode support and 
                responsive design for all devices.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Data Export
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Export filtered data and analysis results as CSV files for further 
                research and analysis in your preferred tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Data Sources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🏦</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Yahoo Finance
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                NIFTY 50 index and USD-INR exchange rate data
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                World Bank
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Consumer Price Index (CPI) data for India
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">📡</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Alpha Vantage
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Backup data source for market indicators
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore Economic Relationships?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start analyzing correlations between inflation, exchange rates, and market performance
          </p>
          <Link 
            href="/dashboard"
            className="inline-block bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
