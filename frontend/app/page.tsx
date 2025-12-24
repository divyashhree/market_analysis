import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Macro Market Analyzer
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Educational research tool for analyzing relationships between inflation (CPI), 
              USD-INR exchange rates, and Indian stock market (NIFTY 50)
            </p>
            <Link 
              href="/dashboard"
              className="inline-block bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Explore Dashboard →
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
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Auto-Generated Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover key findings about correlations, trends, and volatility patterns 
                with automatically generated insights.
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
