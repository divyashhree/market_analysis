# 🌍 Global Market Analyzer

A comprehensive full-stack web application for analyzing and comparing economic indicators across **30+ countries worldwide**. This educational research tool visualizes and compares inflation rates, stock market indices, GDP growth, and currency exchange rates using official data from the World Bank and major financial exchanges.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express-4-green)

## 🎯 Project Purpose

This tool is designed for **educational and research purposes only** to help understand:
- 🌍 Compare economic indicators across 30+ countries
- 📊 Relationships between inflation, stock markets, and currencies globally
- 📈 How different economies respond to global events
- 🔗 Correlations between major stock indices worldwide
- 📉 Currency strength and exchange rate trends

**⚠️ IMPORTANT DISCLAIMER:** This tool is NOT intended for trading, investment advice, or financial decisions. Past trends do not predict future performance.

## 🌐 Supported Countries (30+)

### North America
🇺🇸 United States (S&P 500) • 🇨🇦 Canada (TSX) • 🇲🇽 Mexico (IPC)

### Europe
🇬🇧 United Kingdom (FTSE 100) • 🇩🇪 Germany (DAX) • 🇫🇷 France (CAC 40) • 🇮🇹 Italy (FTSE MIB) • 🇪🇸 Spain (IBEX 35) • 🇳🇱 Netherlands (AEX) • 🇨🇭 Switzerland (SMI) • 🇸🇪 Sweden (OMX 30) • 🇵🇱 Poland (WIG20) • 🇷🇺 Russia (MOEX)

### Asia-Pacific
🇯🇵 Japan (Nikkei 225) • 🇨🇳 China (Shanghai) • 🇮🇳 India (NIFTY 50) • 🇰🇷 South Korea (KOSPI) • 🇦🇺 Australia (ASX 200) • 🇸🇬 Singapore (STI) • 🇭🇰 Hong Kong (Hang Seng) • 🇹🇼 Taiwan (TAIEX) • 🇮🇩 Indonesia (IDX) • 🇹🇭 Thailand (SET) • 🇲🇾 Malaysia (KLCI) • 🇵🇭 Philippines (PSEi) • 🇻🇳 Vietnam (VN-Index) • 🇳🇿 New Zealand (NZX 50)

### Middle East
🇸🇦 Saudi Arabia (Tadawul) • 🇦🇪 UAE (DFM) • 🇮🇱 Israel (TA-35) • 🇹🇷 Turkey (BIST 100)

### South America
🇧🇷 Brazil (Bovespa) • 🇦🇷 Argentina (MERVAL) • 🇨🇱 Chile (IPSA) • 🇨🇴 Colombia (COLCAP)

### Africa
🇿🇦 South Africa (JSE) • 🇳🇬 Nigeria (NSE) • 🇪🇬 Egypt (EGX 30)

## ✨ Features

### 🌍 NEW: Global Comparison
- **Multi-Country Charts** - Compare up to 10 countries on the same chart
- **Global Inflation Rankings** - See inflation rates across all countries
- **Stock Market Performance** - Compare YTD and 1-year returns
- **Currency Strength** - Track currency changes vs USD
- **Regional Analysis** - Compare economies by region
- **Country Detail Pages** - Deep dive into individual country data

### 📊 Data Visualization
- **Interactive Line Charts** - Individual charts for CPI, USD-INR, and NIFTY 50
- **Multi-Country Overlay Charts** - Compare multiple countries on one chart
- **Dual-Axis Overlay Charts** - Compare any two variables on the same chart
- **Correlation Scatter Plots** - Visualize relationships between variables
- **Correlation Heatmap** - 3x3 matrix showing all correlations
- **Distribution Histograms** - Compare returns in high vs low inflation periods
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🔍 Advanced Analytics
- **Pearson Correlation Coefficients** - Measure linear relationships
- **Moving Averages** - 3, 6, and 12-month windows
- **Rolling Correlations** - 12-month rolling window analysis
- **Statistical Measures** - Mean, standard deviation, min, max, median
- **Period Comparison** - Compare statistics across different time ranges
- **Volatility Analysis** - Coefficient of variation and trend analysis

### 💡 Auto-Generated Insights
- Strong correlation identification
- Trend reversal detection
- Volatility spike analysis
- Period-specific observations
- Color-coded insight cards (positive/negative/neutral)

### 🎨 UI/UX Features
- Dark mode support
- Date range filtering
- Data export to CSV
- Interactive data tables with sorting and pagination
- Loading skeletons
- Error handling and retry mechanisms
- Sticky navigation
- Mobile-first responsive design

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP Client:** Axios
- **Date Handling:** date-fns

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Data Fetching:** Axios
- **CSV Parsing:** csv-parser
- **Caching:** node-cache
- **Environment:** dotenv

### Data Sources (All Free, No API Keys Required!)
- **World Bank API** - Inflation, CPI, GDP data for 30+ countries
- **Yahoo Finance** - Stock indices and exchange rates for all major markets
- **Alpha Vantage** - Backup source (free tier: 500 calls/day)
- **CSV Fallback** - Local CSV files for offline operation

## 🔌 API Endpoints

### Country Data (NEW!)
| Endpoint | Description |
|----------|-------------|
| `GET /api/countries` | List all 30+ supported countries |
| `GET /api/countries/regions` | Get countries grouped by region |
| `GET /api/countries/top-economies` | Get top economies by GDP |
| `GET /api/countries/global/inflation` | Global inflation rankings |
| `GET /api/countries/global/stocks` | Global stock market performance |
| `GET /api/countries/global/currencies` | Currency strength comparison |
| `GET /api/countries/compare?countries=US,GB,DE` | Compare multiple countries |
| `GET /api/countries/:code` | Get comprehensive data for a country |
| `GET /api/countries/:code/inflation` | Get inflation data for a country |
| `GET /api/countries/:code/stock` | Get stock index data |
| `GET /api/countries/:code/currency` | Get exchange rate data |

### India-Specific Data
| Endpoint | Description |
|----------|-------------|
| `GET /api/data/all` | All India data (CPI, USD-INR, NIFTY) |
| `GET /api/data/cpi` | CPI data only |
| `GET /api/data/usdinr` | USD-INR exchange rate |
| `GET /api/data/nifty` | NIFTY 50 index |
| `GET /api/analysis/correlations` | Correlation matrix |
| `GET /api/analysis/insights` | Auto-generated insights |

## 📁 Project Structure

```
macro-market-analyzer/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── global/page.tsx          # 🆕 Global comparison
│   │   ├── country/[code]/page.tsx  # 🆕 Country details
│   │   ├── dashboard/page.tsx       # India dashboard
│   │   ├── analysis/page.tsx        # Correlation analysis
│   │   ├── insights/page.tsx        # Auto-generated insights
│   │   ├── about/page.tsx           # Methodology & info
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── charts/                  # Recharts components
│   │   │   ├── LineChartComponent.tsx
│   │   │   ├── MultiCountryChart.tsx # 🆕 Multi-country comparison
│   │   │   ├── DualAxisChart.tsx
│   │   │   ├── ScatterPlot.tsx
│   │   │   ├── CorrelationHeatmap.tsx
│   │   │   └── Histogram.tsx
│   │   ├── country/                 # 🆕 Country components
│   │   │   ├── CountrySelector.tsx
│   │   │   └── GlobalRankingTable.tsx
│   │   ├── ui/                      # Reusable UI components
│   │   │   ├── Card.tsx
│   │   │   ├── DataTable.tsx
│   │   │   └── LoadingSkeleton.tsx
│   │   └── layout/                  # Layout components
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── api.ts                   # API client (expanded!)
│   │   ├── types.ts                 # TypeScript types (expanded!)
│   │   └── utils.ts                 # Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── countries.js         # 🆕 30+ country configs
│   │   ├── controllers/
│   │   │   ├── dataController.js
│   │   │   └── analysisController.js
│   │   ├── services/
│   │   │   ├── dataService.js       # India data fetching
│   │   │   ├── countryDataService.js # 🆕 Multi-country data
│   │   │   ├── analysisService.js   # Statistical analysis
│   │   │   └── cacheService.js      # Caching logic
│   │   ├── routes/
│   │   │   ├── dataRoutes.js
│   │   │   ├── countryRoutes.js     # 🆕 Country endpoints
│   │   │   └── analysisRoutes.js
│   │   ├── data/                    # CSV data files
│   │   │   ├── cpi_data.csv
│   │   │   ├── usdinr_data.csv
│   │   │   └── nifty_data.csv
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd macro-market-analyzer
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Backend (.env):
```bash
cd ../backend
cp .env.example .env
# Edit .env if needed (defaults work fine)
```

Frontend (.env.local):
```bash
cd ../frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the Application

**Option 1: Run both servers separately**

Terminal 1 - Backend:
```bash
cd backend
npm start        # Production
# or
npm run dev      # Development with nodemon
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option 2: Production build**

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Documentation

### Data Endpoints

#### Get All Data
```http
GET /api/data/all
```
Returns CPI, USD-INR, and NIFTY 50 data.

#### Get Specific Dataset
```http
GET /api/data/cpi
GET /api/data/usdinr
GET /api/data/nifty
```

#### Get Data by Date Range
```http
GET /api/data/range?start=YYYY-MM-DD&end=YYYY-MM-DD
```
Example: `/api/data/range?start=2020-01-01&end=2023-12-31`

### Analysis Endpoints

#### Get Correlations
```http
GET /api/analysis/correlations
```
Returns Pearson correlation coefficients.

#### Get Insights
```http
GET /api/analysis/insights
```
Returns auto-generated insights.

#### Get Full Analysis
```http
GET /api/analysis/full
```
Returns correlations, statistics, rolling correlations, and insights.

#### Compare Periods
```http
GET /api/analysis/compare?period1Start=2014-01-01&period1End=2019-12-31&period2Start=2020-01-01&period2End=2024-12-31
```

## 📊 Data Methodology

### Data Collection
- **Time Period:** January 2014 - December 2024 (10 years)
- **Frequency:** Monthly data points
- **Sources:** Yahoo Finance, World Bank API, CSV fallback

### Statistical Methods

**Pearson Correlation Coefficient:**
```
r = Σ((x - x̄)(y - ȳ)) / √(Σ(x - x̄)² × Σ(y - ȳ)²)
```
Measures linear relationship between -1 (perfect negative) and +1 (perfect positive).

**Moving Average:**
```
MA(n) = (x₁ + x₂ + ... + xₙ) / n
```
Smooths data using 3, 6, and 12-month windows.

**Standard Deviation & Volatility:**
Used to measure market volatility and data dispersion.

## 🎨 Customization

### Color Scheme
Edit `frontend/tailwind.config.ts`:
```typescript
colors: {
  primary: '#3B82F6',    // Blue
  cpi: '#EF4444',        // Red
  usdinr: '#10B981',     // Green
  nifty: '#3B82F6',      // Blue
}
```

### Date Range
Default: 2014-2024. Modify CSV files or add more data in `backend/src/data/`.

### Cache Duration
Edit `backend/src/services/cacheService.js`:
```javascript
stdTTL: 3600  // Cache TTL in seconds (default: 1 hour)
```

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set build directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<backend-url>`
5. Deploy

### Backend (Render/Railway)
1. Push code to GitHub
2. Create new web service
3. Set start command: `node src/server.js`
4. Set root directory to `backend`
5. Add environment variables from `.env.example`
6. Deploy

## 🔒 Security & Limitations

### Limitations
- **Correlation ≠ Causation** - Strong correlations don't imply causation
- **Linear Analysis Only** - Non-linear patterns may be missed
- **Historical Data** - Past relationships may not continue
- **Missing Variables** - Many factors affect markets beyond these indicators
- **Monthly Data** - Misses intra-month volatility

### Security
- No authentication required (public tool)
- CORS configured for frontend origin
- Input validation on all endpoints
- Error handling without exposing sensitive data
- Rate limiting recommended for production

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

This is an educational project. Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## ⚠️ Legal Disclaimer

**EDUCATIONAL TOOL - NOT FOR FINANCIAL ADVICE**

This application is designed exclusively for educational and research purposes. It is NOT intended for:
- Trading decisions or investment advice
- Financial planning or wealth management
- Professional financial analysis
- Predicting future market movements

The creators assume NO LIABILITY for any financial decisions made based on this information. Always consult qualified financial professionals before making investment decisions.

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Review the documentation
- Check existing issues for solutions

## 🙏 Acknowledgments

- **Data Sources:** Yahoo Finance, World Bank, Alpha Vantage
- **Frameworks:** Next.js, React, Express.js
- **Visualization:** Recharts library
- **Styling:** Tailwind CSS

---

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** ✅ Production Ready

Built with ❤️ for education and research
