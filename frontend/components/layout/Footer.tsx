export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Macro Market Analyzer
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              An educational research tool for analyzing relationships between economic indicators and market performance.
            </p>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Data Sources
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>
                <a 
                  href="https://finance.yahoo.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Yahoo Finance (NIFTY & USD-INR)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.worldbank.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  World Bank (CPI Data)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.alphavantage.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Alpha Vantage (Backup)
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Important Notice
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This tool is for educational and research purposes only. It is not intended for trading decisions, investment advice, or financial planning. Past performance does not indicate future results.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>© {currentYear} Macro Market Analyzer. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Built with Next.js, Express.js, and Recharts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
