# 🧪 Testing Guide - Verification Checklist

## Complete Testing Manual for Market Analyzer

Use this guide to verify all calculations, features, and data flows are working correctly.

---

## 📊 Part 1: Data Loading Tests

### Test 1.1: Dashboard Data Display

**Navigate to:** `/dashboard`

**Expected Results:**
- ✅ 3 stat cards showing latest values
- ✅ CPI chart with line graph
- ✅ USD-INR chart with line graph
- ✅ NIFTY 50 chart with line graph
- ✅ Data table with sortable columns
- ✅ Green checkmark: "All data sources are live and up-to-date"

**Sample Expected Values (January 2026):**
```
CPI Index: ~145-150
USD-INR: ~83-84
NIFTY 50: ~25,000-26,000
```

**What to Check:**
- [ ] All charts load without errors
- [ ] Values are numeric (not NaN or undefined)
- [ ] Dates are properly formatted
- [ ] Charts are interactive (hover shows tooltips)
- [ ] No console errors in browser DevTools

---

### Test 1.2: Date Range Filtering

**Navigate to:** `/dashboard`

**Test Input:**
```
Start Date: 2020-01-01
End Date: 2023-12-31
Click "Apply"
```

**Expected Results:**
- ✅ All charts update to show only 2020-2023 data
- ✅ Data table filters to date range
- ✅ Stat cards update to latest value in range (Dec 2023)
- ✅ Charts should have ~48 data points (4 years × 12 months)

**Verification:**
```javascript
// In browser console:
// Check if all data points are within range
console.log('All dates within range:', 
  allDataPoints.every(d => 
    d.date >= '2020-01-01' && d.date <= '2023-12-31'
  )
);
```

**What to Check:**
- [ ] No data points outside date range
- [ ] Charts rescale appropriately
- [ ] Export CSV contains only filtered data

---

## 📈 Part 2: Analysis & Correlation Tests

### Test 2.1: Correlation Matrix

**Navigate to:** `/analysis`

**Expected Correlation Values (Approximate):**

Based on historical Indian economic data:

```
CPI vs NIFTY: -0.3 to -0.5 (negative correlation)
  → Higher inflation → Lower stock returns
  
CPI vs USD-INR: +0.4 to +0.6 (positive correlation)
  → Higher inflation → Weaker rupee
  
NIFTY vs USD-INR: -0.2 to -0.4 (weak negative)
  → Stock market strength → Rupee strength
```

**Manual Calculation to Verify:**

Take sample data (last 12 months):
```
Month    CPI    NIFTY    USD-INR
Jan-25   142    24500    83.2
Feb-25   143    24800    83.5
Mar-25   144    24200    83.8
...
```

**Pearson Correlation Formula:**
```
r = Σ[(X - X̄)(Y - Ȳ)] / √[Σ(X - X̄)² × Σ(Y - Ȳ)²]

Where:
X̄ = mean of X
Ȳ = mean of Y
```

**Quick Check with 3 points:**
```javascript
// Example calculation for CPI vs NIFTY
const cpi = [142, 143, 144];
const nifty = [24500, 24800, 24200];

const meanCPI = (142 + 143 + 144) / 3 = 143;
const meanNifty = (24500 + 24800 + 24200) / 3 = 24500;

// Covariance
const cov = [(142-143)*(24500-24500), 
             (143-143)*(24800-24500), 
             (144-143)*(24200-24500)];
// = [0, 0, -300]
// Sum = -300 / 2 = -150

// Should give negative correlation ✓
```

**What to Check:**
- [ ] Correlation values between -1 and +1
- [ ] Heatmap shows correct color gradient (red=negative, green=positive)
- [ ] Values match expected economic relationships
- [ ] Diagonal is always 1.0 (variable vs itself)

---

### Test 2.2: Scatter Plot Correlations

**Navigate to:** `/analysis` → Scroll to Scatter Plots

**Test Points to Verify:**

1. **CPI vs NIFTY Scatter:**
   - Points should trend downward (negative slope)
   - Higher CPI → Lower NIFTY values

2. **CPI vs USD-INR Scatter:**
   - Points should trend upward (positive slope)
   - Higher CPI → Higher USD-INR (weaker rupee)

3. **NIFTY vs USD-INR Scatter:**
   - Points should show weak negative trend
   - Higher NIFTY → Lower USD-INR (stronger rupee)

**What to Check:**
- [ ] Each point represents one month
- [ ] Hover shows exact values
- [ ] Trend line (if shown) matches data direction
- [ ] No outliers that seem impossible (e.g., NIFTY = 0)

---

### Test 2.3: Rolling Correlation

**Navigate to:** `/analysis` → Scroll to Rolling Correlation

**Test Input:**
```
Window: 12 months
Pair: CPI-NIFTY
```

**Expected Results:**
- ✅ Line chart showing correlation over time
- ✅ Values oscillate between -0.8 and 0.2
- ✅ Line stays within bounds of -1 to +1
- ✅ Smoother than daily data

**Sample Expected Pattern:**
```
2019: -0.3 (moderate negative)
2020: -0.6 (COVID impact, high negative)
2021: -0.2 (recovery, weaker negative)
2022: -0.5 (inflation spike, strong negative)
2023: -0.3 (stabilization)
```

**What to Check:**
- [ ] No values outside [-1, 1] range
- [ ] Correlation changes over time
- [ ] No NaN or undefined values
- [ ] Chart starts after first window (12 months of data needed)

---

## 🧮 Part 3: Statistical Calculations

### Test 3.1: Statistical Summary

**Navigate to:** `/dashboard` → Scroll to Statistical Summary

**Expected Statistics for NIFTY 50 (2014-2026):**

```
Mean: ~15,000-18,000
  → Average of all monthly values
  
Median: ~14,000-16,000
  → Middle value when sorted
  
Std Dev: ~4,000-6,000
  → Measure of volatility
  
Min: ~6,000-7,000
  → Lowest point (2014-2015)
  
Max: ~26,000-27,000
  → Highest point (2025-2026)
  
Range: ~19,000-20,000
  → Max - Min
  
CV: ~30-40%
  → (Std Dev / Mean) × 100
  → Volatility relative to average
```

**Manual Verification (Sample 5 points):**

```javascript
const values = [10000, 12000, 15000, 18000, 20000];

// Mean
const mean = values.reduce((a,b) => a+b) / values.length;
// = 75000 / 5 = 15,000 ✓

// Median
const sorted = [...values].sort((a,b) => a-b);
const median = sorted[Math.floor(sorted.length/2)];
// = 15,000 ✓

// Std Dev
const squaredDiffs = values.map(v => (v - mean) ** 2);
const variance = squaredDiffs.reduce((a,b) => a+b) / values.length;
const stdDev = Math.sqrt(variance);
// = √(10,000,000) = 3,162 ✓

// CV (Coefficient of Variation)
const cv = (stdDev / mean) * 100;
// = (3162 / 15000) * 100 = 21% ✓
```

**What to Check:**
- [ ] Mean is between min and max
- [ ] Median is close to mean (for normal distribution)
- [ ] Std dev is positive
- [ ] Range = Max - Min
- [ ] CV makes sense (20-50% is typical for stocks)

---

### Test 3.2: Moving Averages

**Navigate to:** `/dashboard` → Toggle MA checkboxes

**Test Input:**
```
Enable: 3-month MA, 6-month MA, 12-month MA
```

**Expected Behavior:**

For NIFTY 50 values:
```
Month    Actual    3-MA     6-MA     12-MA
Jan-25   24500     -        -        -
Feb-25   24800     -        -        -
Mar-25   24200     24500    -        -
Apr-25   25000     24667    -        -
May-25   25500     24900    -        -
Jun-25   25200     25233    24867    -
Jul-25   25800     25500    24917    -
...
Dec-25   26000     25700    25333    25200
Jan-26   25700     25833    25433    25258
```

**Manual Calculation (3-month MA for April):**
```
MA₃(April) = (Jan + Feb + Mar) / 3
           = (24500 + 24800 + 24200) / 3
           = 73500 / 3
           = 24,500 ✓
```

**What to Check:**
- [ ] Moving averages are smoother than raw data
- [ ] 12-MA is smoothest (less volatile)
- [ ] 3-MA follows trends more closely
- [ ] MAs lag behind actual values (by design)
- [ ] No MA values in first N-1 months (where N is window)

---

## 📊 Part 4: Comparative Analysis

### Test 4.1: Dual-Axis Charts

**Navigate to:** `/analysis`

**Test Input:**
```
Left Axis: CPI
Right Axis: NIFTY
```

**Expected Results:**
- ✅ Two Y-axes (left for CPI, right for NIFTY)
- ✅ Different scales (CPI: 100-150, NIFTY: 6,000-26,000)
- ✅ Lines use different colors
- ✅ Inverse relationship visible (when CPI rises sharply, NIFTY often falls)

**Key Observations to Verify:**

```
2020 (COVID):
  CPI: Dropped to ~115 (deflation risk)
  NIFTY: Crashed to ~7,500 (March 2020)
  ✓ Both fell together

2021 (Recovery):
  CPI: Rose to ~125-130
  NIFTY: Rallied to ~18,000
  ✓ Divergence (inflation up, stocks up too)

2022 (Inflation Spike):
  CPI: Surged to ~140-145
  NIFTY: Volatile, ~17,000-18,000
  ✓ Negative correlation visible
```

**What to Check:**
- [ ] Both lines visible and distinct
- [ ] Scales are appropriate (no overlap issues)
- [ ] Tooltip shows both values for same date
- [ ] Legend indicates which line is which

---

### Test 4.2: Period Comparison

**Navigate to:** `/compare`

**Test Input:**
```
Period 1:
  Start: 2019-01-01
  End: 2019-12-31
  
Period 2:
  Start: 2022-01-01
  End: 2022-12-31
```

**Expected Comparison Results:**

```
CPI:
  Period 1 Mean: ~120-125
  Period 2 Mean: ~138-143
  Change: +15-18% (inflation increased)
  
USD-INR:
  Period 1 Mean: ~70-72
  Period 2 Mean: ~78-80
  Change: +10-12% (rupee weakened)
  
NIFTY:
  Period 1 Mean: ~11,000-12,000
  Period 2 Mean: ~17,000-18,000
  Change: +45-50% (strong market growth)
  
Correlations:
  CPI-NIFTY:
    Period 1: -0.2 to -0.4
    Period 2: -0.4 to -0.6
    Analysis: Stronger negative correlation in Period 2
```

**What to Check:**
- [ ] Both periods analyzed independently
- [ ] Changes show direction (+ or -)
- [ ] Percentage changes calculated correctly
- [ ] Correlation changes make economic sense

---

## 🌍 Part 5: Multi-Country Features

### Test 5.1: Global Comparison

**Navigate to:** `/global`

**Test Input:**
```
Select Countries: USA, India, UK, Germany, Japan
Indicator: Stock Index (YTD Return)
```

**Expected Results (Sample 2025 Data):**

```
Country    Index        YTD Return    Status
USA        S&P 500      +18.5%        🟢 Positive
India      NIFTY 50     +12.3%        🟢 Positive
UK         FTSE 100     +6.8%         🟢 Positive
Germany    DAX          +15.2%        🟢 Positive
Japan      Nikkei 225   +8.9%         🟢 Positive
```

**What to Check:**
- [ ] All 5 countries display
- [ ] Returns are calculated from Jan 1 to current date
- [ ] Positive returns show green, negative show red
- [ ] Chart shows all countries on same scale
- [ ] Hover reveals exact values

---

### Test 5.2: Interactive World Map

**Navigate to:** `/global` → Scroll to World Map

**Test Interaction:**
```
1. Click on India
2. Click on USA
3. Click on Brazil
```

**Expected Results:**
- ✅ Country highlights on click
- ✅ Sidebar shows country details:
  - Stock index name
  - Current value
  - YTD change
  - Inflation rate
  - Currency vs USD
- ✅ Color intensity indicates performance

**What to Check:**
- [ ] Map is responsive (clickable)
- [ ] Country data loads on click
- [ ] Colors match legend (green=positive, red=negative)
- [ ] All 35+ countries are clickable

---

## 🎓 Part 6: Educational Features

### Test 6.1: Tutorials & Quizzes

**Navigate to:** `/learn`

**Test Tutorial: "Understanding Inflation"**

**Test Quiz Questions:**

```
Q1: If CPI is 120 this year and 126 next year, what is inflation?
Expected Answer: 5%
Calculation: (126-120)/120 × 100 = 5%

Q2: Which asset typically performs well during high inflation?
Expected Answer: Gold/Commodities
Reason: Tangible assets hold value

Q3: If inflation is 7% and your FD gives 6%, what's real return?
Expected Answer: -1%
Calculation: 6% - 7% = -1%
```

**What to Check:**
- [ ] Quiz accepts correct answers
- [ ] Wrong answers show explanation
- [ ] Progress tracking works
- [ ] Score calculation is accurate

---

## 🤖 Part 7: AI Chatbot

### Test 7.1: Economic Queries

**Navigate to:** Any page with chatbot

**Test Queries:**

```
Query 1: "What is the correlation between CPI and NIFTY?"
Expected Response:
  - Should mention negative correlation (~-0.3 to -0.5)
  - Explain that higher inflation reduces stock returns
  - Reference actual data from the app

Query 2: "Why did NIFTY fall in March 2020?"
Expected Response:
  - COVID-19 pandemic
  - Global market crash
  - Lockdowns and economic uncertainty
  - Recovery in subsequent months

Query 3: "How does inflation affect the rupee?"
Expected Response:
  - Higher inflation weakens currency
  - Reduces purchasing power
  - Makes imports expensive
  - Mention positive correlation with USD-INR
```

**What to Check:**
- [ ] Responses are contextual (use app data)
- [ ] No generic/wrong information
- [ ] Response time < 3 seconds
- [ ] Can handle follow-up questions

---

## 💼 Part 8: Portfolio Analyzer

### Test 8.1: Portfolio Sensitivity

**Navigate to:** `/portfolio`

**Test Input:**
```
Create Portfolio:
  - RELIANCE (100 shares @ ₹2,500)
  - TCS (50 shares @ ₹3,500)
  - HDFCBANK (80 shares @ ₹1,600)

Total Value: ₹553,000
```

**Expected Sector Allocation:**
```
Energy (RELIANCE): ₹250,000 (45.2%)
Technology (TCS): ₹175,000 (31.6%)
Banking (HDFC): ₹128,000 (23.2%)
```

**Expected Macro Sensitivities:**

```
Inflation Sensitivity: -0.4 (Medium Negative)
  → High inflation hurts this portfolio

Interest Rate Sensitivity: -0.5 (High Negative)
  → Rate hikes will impact negatively
  → Banking sector typically benefits, but others suffer

Oil Price Sensitivity: +0.2 (Low Positive)
  → RELIANCE benefits from oil prices
  
Fed Rate Sensitivity: -0.3 (Medium Negative)
  → FII outflows on Fed rate hikes
```

**Manual Calculation:**
```javascript
// Weighted sensitivity
const weights = [0.452, 0.316, 0.232]; // Sector weights
const inflationSens = [-0.2, -0.3, -0.5]; // Sector sensitivities

const portfolioInflationSens = 
  (0.452 * -0.2) + (0.316 * -0.3) + (0.232 * -0.5)
  = -0.090 + -0.095 + -0.116
  = -0.301 (≈ -0.3) ✓
```

**What to Check:**
- [ ] Sector allocation percentages sum to 100%
- [ ] Sensitivities are between -1 and +1
- [ ] Weighted averages calculated correctly
- [ ] Alerts trigger at appropriate thresholds

---

## 🎯 Part 9: What-If Simulator

### Test 9.1: Inflation Impact Simulation

**Navigate to:** `/simulator`

**Test Input:**
```
Scenario: "Inflation increases by 2%"
Current CPI: 145
Simulated CPI: 147 (145 + 2)
```

**Expected Impact:**

```
On NIFTY 50:
  Current: 25,000
  Expected Impact: -7.2% (from historical data)
  Simulated: ~23,200
  Confidence: 70%

On USD-INR:
  Current: 83.5
  Expected Impact: +4.5% (rupee weakens)
  Simulated: ~87.3
  Confidence: 68%

On Banking Sector:
  Impact: -5.0% (NIM pressure)

On Real Estate:
  Impact: -8.0% (demand reduction)
```

**What to Check:**
- [ ] Impacts are in expected ranges
- [ ] Negative for stocks, positive for USD-INR
- [ ] Confidence levels displayed
- [ ] Multiple scenarios can be compared

---

### Test 9.2: RBI Policy Simulator

**Test Input:**
```
Scenario: "RBI increases repo rate by 0.5%"
Current Rate: 6.5%
New Rate: 7.0%
```

**Expected Impact:**

```
On NIFTY:
  Impact: -5.0% (market correction)
  
On Banking Stocks:
  Impact: +5.5% (higher NIMs)
  
On Real Estate:
  Impact: -7.0% (higher EMIs)
  
On Auto Sector:
  Impact: -6.0% (costlier loans)
```

**What to Check:**
- [ ] Banking sector benefits (positive impact)
- [ ] Rate-sensitive sectors hurt (negative impact)
- [ ] Overall market shows net negative
- [ ] Magnitudes match historical patterns

---

## 📰 Part 10: News & Sentiment

### Test 10.1: News Feed

**Navigate to:** `/sentiment`

**What to Check:**

```
Headlines should include:
✓ Real RSS feed articles
✓ Source attribution (ET, Moneycontrol, Mint)
✓ Recent timestamps (< 24 hours)
✓ Categories: RBI, Fed, Budget, Earnings, Global
```

**Test Sentiment Analysis:**

Pick a headline: "Markets rally on strong earnings"

**Expected Sentiment:**
- Sentiment: Positive
- Score: +3 to +5
- Confidence: 75-85%
- Keywords detected: ["rally", "strong", "earnings"]

**What to Check:**
- [ ] Sentiment matches tone (positive = green, negative = red)
- [ ] Keywords highlighted correctly
- [ ] Confidence scores seem reasonable
- [ ] News refreshes every 5 minutes

---

## ⚡ Part 11: Performance Tests

### Test 11.1: Load Time

**Test Procedure:**
```
1. Open browser DevTools → Network tab
2. Clear cache
3. Navigate to /dashboard
4. Record load times
```

**Expected Performance:**

```
Initial Page Load: < 3 seconds
API Response Time: < 1 second
Chart Rendering: < 500ms
Total Interactive Time: < 4 seconds
```

**What to Check:**
- [ ] No requests timeout
- [ ] No 500 errors
- [ ] Caching works (second load faster)
- [ ] Images/assets load

---

### Test 11.2: Large Dataset Handling

**Test Input:**
```
Date Range: 2014-01-01 to 2026-12-31 (13 years)
Data Points: ~156 months per indicator
Total Points: ~468 across all indicators
```

**Expected Behavior:**
- ✅ All 468 points load successfully
- ✅ Charts remain responsive
- ✅ No memory leaks (check Task Manager)
- ✅ Smooth scrolling and interactions

**What to Check:**
- [ ] Browser memory < 500MB
- [ ] No lag when hovering charts
- [ ] Table pagination works
- [ ] Export CSV completes

---

## 🔍 Part 12: Error Handling

### Test 12.1: API Failure Simulation

**Test Procedure:**
```
1. Go to backend/src/services/dataService.js
2. Temporarily change API URL to invalid endpoint
3. Reload dashboard
```

**Expected Behavior:**
- ✅ Fallback to CSV data automatically
- ✅ Yellow warning banner appears
- ✅ Message: "Using cached data. API unavailable."
- ✅ Data still displays (from CSV)
- ✅ No blank screens

**What to Check:**
- [ ] Graceful degradation
- [ ] Clear user messaging
- [ ] No console errors crash the app
- [ ] Retry button works

---

### Test 12.2: Invalid Input Handling

**Test Inputs:**

```
1. Date Range: End before Start
   Input: 2023-12-31 to 2020-01-01
   Expected: Error message "End date must be after start date"

2. Empty Portfolio:
   Input: 0 stocks added
   Expected: Prompt "Add at least one stock"

3. Invalid Stock Symbol:
   Input: Search "XXXXXX"
   Expected: "No results found"
```

**What to Check:**
- [ ] Form validation prevents submission
- [ ] Error messages are clear
- [ ] No crashes on bad input
- [ ] User can correct and retry

---

## ✅ Final Verification Checklist

### Data Accuracy
- [ ] All correlations between -1 and +1
- [ ] Means between min and max
- [ ] No NaN or undefined values
- [ ] Dates in correct format (YYYY-MM-DD)
- [ ] All calculations match manual verification

### Visual Elements
- [ ] All charts load correctly
- [ ] Colors match data (red=negative, green=positive)
- [ ] Tooltips show on hover
- [ ] Legends display properly
- [ ] Responsive on mobile

### Functionality
- [ ] All filters work
- [ ] All buttons clickable
- [ ] Navigation smooth
- [ ] CSV export works
- [ ] Dark mode toggles

### Performance
- [ ] Page load < 3 seconds
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] No console errors
- [ ] Works offline (with cache)

### Data Freshness
- [ ] CSV data updated to 2026
- [ ] Warning shows if stale
- [ ] Metadata file present
- [ ] Update script works

---

## 🐛 Known Expected Behaviors

These are NOT bugs:

1. **CPI data is annual** → Shows one value per year, not monthly
2. **Stock data is monthly** → End-of-month values only
3. **Correlations change over time** → This is correct behavior
4. **First N months have no MA** → Moving average needs N points
5. **Rolling correlation starts late** → Needs window size of data

---

## 📝 Testing Report Template

After testing, document findings:

```markdown
## Testing Report - [Date]

### Tests Passed: __ / 50
### Tests Failed: __ / 50
### Critical Issues: __
### Minor Issues: __

### Failed Tests:
1. [Test Name] - [Issue Description] - [Priority: High/Med/Low]
2. ...

### Performance Metrics:
- Page Load: __ seconds
- API Response: __ ms
- Memory Usage: __ MB

### Browser Compatibility:
- Chrome: ✅/❌
- Firefox: ✅/❌
- Safari: ✅/❌
- Edge: ✅/❌

### Recommendations:
1. ...
2. ...
```

---

## 🚀 Quick Start Testing

**Minimum Tests (10 minutes):**

1. ✅ Load dashboard → Check if data displays
2. ✅ View analysis page → Check correlations
3. ✅ Filter date range → Verify it works
4. ✅ Try chatbot → Ask a question
5. ✅ Check mobile view → Responsive?
6. ✅ Export CSV → File downloads?
7. ✅ Check data freshness banner → Present?
8. ✅ View multi-country page → Countries load?
9. ✅ Open DevTools → No console errors?
10. ✅ Test dark mode → Toggle works?

**If all 10 pass → Website is functional! ✅**

---

*Happy Testing!* 🎉
