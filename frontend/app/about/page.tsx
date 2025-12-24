export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About This Project</h1>

      {/* Project Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Project Overview</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Macro Market Analyzer is an educational research tool designed to help understand the relationships between 
            key economic indicators and market performance in India. The dashboard analyzes three primary variables:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-4">
            <li><strong>Consumer Price Index (CPI):</strong> A measure of inflation tracking changes in the price level of consumer goods and services</li>
            <li><strong>USD-INR Exchange Rate:</strong> The value of the Indian Rupee against the US Dollar</li>
            <li><strong>NIFTY 50 Index:</strong> A benchmark Indian stock market index representing the weighted average of 50 of the largest companies</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-400">
            This tool provides 10 years of monthly data (2014-2024) with interactive visualizations and statistical analysis.
          </p>
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Data Sources</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Yahoo Finance
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Provides historical data for NIFTY 50 index (^NSEI) and USD-INR exchange rate (INR=X).
              </p>
              <a 
                href="https://finance.yahoo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                finance.yahoo.com
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                World Bank Open Data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Consumer Price Index data for India through their public API.
              </p>
              <a 
                href="https://data.worldbank.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                data.worldbank.org
              </a>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Alpha Vantage (Backup)
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Alternative data source with free API tier (500 requests/day).
              </p>
              <a 
                href="https://www.alphavantage.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                alphavantage.co
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Methodology</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Data Processing
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-4">
            <li>Monthly data points collected from January 2014 to December 2024</li>
            <li>Data aligned by common dates to ensure accurate comparisons</li>
            <li>Missing values handled through linear interpolation where appropriate</li>
            <li>All datasets normalized to enable meaningful correlation analysis</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">
            Statistical Methods
          </h3>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <div>
              <strong>Pearson Correlation Coefficient:</strong>
              <p className="mt-1 ml-4">
                Measures linear relationship between two variables. Formula: r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
              </p>
              <p className="mt-1 ml-4 text-sm">
                Values range from -1 (perfect negative correlation) to +1 (perfect positive correlation).
              </p>
            </div>

            <div>
              <strong>Moving Averages:</strong>
              <p className="mt-1 ml-4">
                Calculated for 3-month, 6-month, and 12-month windows to identify trends and smooth out short-term fluctuations.
              </p>
            </div>

            <div>
              <strong>Rolling Correlation:</strong>
              <p className="mt-1 ml-4">
                12-month rolling window correlation to show how relationships between variables change over time.
              </p>
            </div>

            <div>
              <strong>Volatility Measures:</strong>
              <p className="mt-1 ml-4">
                Standard deviation and coefficient of variation used to assess market volatility and stability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Limitations</h2>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <ul className="list-disc list-inside space-y-2 text-yellow-800 dark:text-yellow-200">
            <li><strong>Correlation ≠ Causation:</strong> Strong correlations do not imply that one variable causes changes in another</li>
            <li><strong>Linear Relationships Only:</strong> Pearson correlation measures linear relationships and may miss complex non-linear patterns</li>
            <li><strong>Historical Data:</strong> Past relationships may not continue in the future due to changing economic conditions</li>
            <li><strong>Missing Variables:</strong> Many other factors influence markets beyond these three indicators</li>
            <li><strong>Data Quality:</strong> Analysis depends on accuracy of source data; any errors propagate through calculations</li>
            <li><strong>Monthly Aggregation:</strong> Using monthly data may miss important intra-month volatility and events</li>
            <li><strong>No Lag Analysis:</strong> Does not account for delayed effects or lead-lag relationships</li>
          </ul>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Technology Stack</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Frontend</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Next.js 14 (App Router)</li>
                <li>React 18</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Recharts</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Backend</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Node.js</li>
                <li>Express.js</li>
                <li>Axios</li>
                <li>CSV Parser</li>
                <li>Node Cache</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Important Disclaimer</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-800 dark:text-red-200 font-semibold mb-3">
            Educational and Research Purposes Only
          </p>
          <p className="text-red-700 dark:text-red-300 mb-3">
            This tool is designed exclusively for educational and research purposes. It is NOT intended for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300 mb-3">
            <li>Trading decisions or investment advice</li>
            <li>Financial planning or wealth management</li>
            <li>Professional financial analysis or recommendations</li>
            <li>Predicting future market movements or economic conditions</li>
          </ul>
          <p className="text-red-700 dark:text-red-300">
            <strong>Past performance and historical correlations do not indicate or predict future results.</strong> Always consult 
            qualified financial professionals before making investment decisions. The creators of this tool assume no liability 
            for any financial decisions made based on this information.
          </p>
        </div>
      </section>

      {/* Contact/Contribution */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Project Information</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is an open educational project built to demonstrate full-stack development skills and provide 
            a practical tool for learning about economic indicators and their relationships.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Version:</strong> 1.0.0<br />
            <strong>Last Updated:</strong> December 2024
          </p>
        </div>
      </section>
    </div>
  );
}
