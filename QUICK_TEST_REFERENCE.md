# 🎯 Quick Test Reference - Example Values

## Copy-Paste Test Inputs

---

## 📊 Dashboard Tests

### Test 1: Basic Data Display
**URL:** `http://localhost:3000/dashboard`

**Expected Latest Values (Jan 2026):**
```
CPI: 145-150
USD-INR: 83-84
NIFTY 50: 25,000-26,000
```

---

### Test 2: Date Range Filter
**Input:**
```
Start Date: 2020-01-01
End Date: 2023-12-31
```
**Expected Points:** 48 months (4 years)

---

### Test 3: Quick Presets
Click these buttons and verify:
```
Last 1 Year → Should show 12 data points
Last 3 Years → Should show 36 data points
Last 5 Years → Should show 60 data points
All Time → Should show 120+ data points
```

---

## 🔍 Analysis Page Tests

### Test 4: Correlation Matrix
**URL:** `http://localhost:3000/analysis`

**Expected Values:**
```
CPI vs NIFTY: -0.3 to -0.5 (RED cell)
CPI vs USD-INR: +0.4 to +0.6 (GREEN cell)
NIFTY vs USD-INR: -0.2 to -0.4 (ORANGE cell)
CPI vs CPI: 1.0 (GREEN - diagonal)
```

**Visual Check:**
- ✅ 3×3 grid
- ✅ Red for negative correlations
- ✅ Green for positive correlations
- ✅ Diagonal always 1.0 (green)

---

### Test 5: Dual Axis Chart
**Input:**
```
Left Axis: Select "CPI"
Right Axis: Select "NIFTY"
```

**What to Look For:**
- ✅ Two separate Y-axes (left and right)
- ✅ CPI scale: 100-150
- ✅ NIFTY scale: 6,000-26,000
- ✅ Different colored lines
- ✅ Inverse relationship visible (when one goes up, other often goes down)

---

### Test 6: Scatter Plot
**What to See:**
```
CPI vs NIFTY:
  ✅ Downward slope (negative correlation)
  ✅ ~120 points
  ✅ Points cluster around trend

CPI vs USD-INR:
  ✅ Upward slope (positive correlation)
  ✅ Points show clear pattern

NIFTY vs USD-INR:
  ✅ Slight downward slope (weak negative)
  ✅ More scattered (weaker correlation)
```

---

### Test 7: Rolling Correlation
**Input:**
```
Window: 12 months
Pair: CPI-NIFTY
```

**Expected Range:** -0.8 to 0.2
**Visual:** Line should oscillate, staying between -1 and +1

---

## 📈 Statistics Tests

### Test 8: Statistical Summary
**URL:** `/dashboard` (scroll down)

**NIFTY 50 Expected Stats (2014-2026):**
```
Mean: 15,000-18,000
Median: 14,000-16,000
Std Dev: 4,000-6,000
Min: 6,000-7,000
Max: 26,000-27,000
Range: 19,000-20,000
CV: 30-40%
```

**CPI Expected Stats:**
```
Mean: 125-135
Median: 128-133
Std Dev: 12-18
Min: 100
Max: 145-150
Range: 45-50
CV: 10-15%
```

**USD-INR Expected Stats:**
```
Mean: 70-75
Median: 72-74
Std Dev: 5-8
Min: 58-60
Max: 83-84
Range: 23-26
CV: 8-12%
```

**Manual Check Formula:**
```javascript
// Mean
mean = sum of all values / count

// Std Dev
stdDev = √(Σ(x - mean)² / n)

// CV
cv = (stdDev / mean) × 100
```

---

### Test 9: Moving Averages
**Enable all MAs:**
```
☑ 3-month MA
☑ 6-month MA
☑ 12-month MA
```

**Visual Check:**
- ✅ 3 additional lines appear
- ✅ 12-month MA is smoothest
- ✅ 3-month MA follows actual data most closely
- ✅ All MAs lag behind actual values

**Sample Values to Verify (Last 3 months NIFTY):**
```
Oct 2025: 26,200
Nov 2025: 26,130
Dec 2025: 25,694

3-month MA (Dec) = (26,200 + 26,130 + 25,694) / 3
                 = 78,024 / 3
                 = 26,008 ✅
```

---

## 🌍 Global Comparison Tests

### Test 10: Multi-Country Comparison
**URL:** `http://localhost:3000/global`

**Input:**
```
Select Countries:
☑ United States
☑ India
☑ United Kingdom
☑ Germany
☑ Japan

Indicator: Stock Market Performance (YTD)
```

**Expected Results:**
```
Country     Index          YTD Return
USA         S&P 500        +15 to +20%
India       NIFTY 50       +10 to +15%
UK          FTSE 100       +5 to +10%
Germany     DAX            +12 to +18%
Japan       Nikkei 225     +8 to +12%
```

---

### Test 11: World Map Interaction
**URL:** `/global` (scroll to map)

**Test Clicks:**
```
1. Click India
   Expected: Sidebar shows NIFTY 50 details
   
2. Click USA
   Expected: Sidebar shows S&P 500 details
   
3. Click Brazil
   Expected: Sidebar shows Bovespa details
   
4. Click Japan
   Expected: Sidebar shows Nikkei 225 details
```

**Visual Check:**
- ✅ Country highlights on click
- ✅ Color matches performance (green=positive, red=negative)
- ✅ Hover shows country name

---

## 💬 Period Comparison Tests

### Test 12: Period Comparison
**URL:** `http://localhost:3000/compare`

**Input:**
```
Period 1:
  Start: 2019-01-01
  End: 2019-12-31
  
Period 2:
  Start: 2022-01-01
  End: 2022-12-31
```

**Expected Results:**

**CPI:**
```
Period 1: ~122
Period 2: ~140
Change: +14.8% (inflation increased)
```

**USD-INR:**
```
Period 1: ~71
Period 2: ~79
Change: +11.3% (rupee weakened)
```

**NIFTY:**
```
Period 1: ~11,500
Period 2: ~17,500
Change: +52.2% (strong growth)
```

**Correlations:**
```
CPI-NIFTY:
  Period 1: -0.32
  Period 2: -0.51
  Change: -0.19 (stronger negative)
```

---

## 💼 Portfolio Tests

### Test 13: Portfolio Creation
**URL:** `http://localhost:3000/portfolio`

**Input:**
```
Stock 1:
  Symbol: RELIANCE.NS
  Quantity: 100
  Avg Price: 2500

Stock 2:
  Symbol: TCS.NS
  Quantity: 50
  Avg Price: 3500

Stock 3:
  Symbol: HDFCBANK.NS
  Quantity: 80
  Avg Price: 1600
```

**Expected Calculation:**
```
RELIANCE: 100 × 2,500 = ₹250,000 (45.2%)
TCS: 50 × 3,500 = ₹175,000 (31.6%)
HDFCBANK: 80 × 1,600 = ₹128,000 (23.1%)
Total: ₹553,000
```

**Expected Sensitivities:**
```
Inflation: -0.4 (Medium Negative)
Interest Rate: -0.5 (High Negative)
Oil Price: +0.2 (Low Positive)
Fed Rate: -0.3 (Medium Negative)
```

---

## 🎯 Simulator Tests

### Test 14: Inflation Simulator
**URL:** `http://localhost:3000/simulator`

**Input:**
```
Scenario: Inflation increases by 2%
```

**Expected Impact:**
```
NIFTY 50: -7.2% (₹25,000 → ₹23,200)
USD-INR: +4.5% (₹83.5 → ₹87.3)
Banking Sector: -5.0%
Real Estate: -8.0%
```

---

### Test 15: RBI Policy Simulator
**Input:**
```
Scenario: RBI increases repo rate by 0.5%
```

**Expected Impact:**
```
NIFTY: -5.0%
Banking Stocks: +5.5% (benefit from higher rates)
Real Estate: -7.0% (EMI increase)
Auto Sector: -6.0% (loan costs up)
```

---

## 🤖 AI Chatbot Tests

### Test 16: Chatbot Questions
**URL:** Any page (chatbot icon)

**Test Questions:**

**Q1:**
```
Input: "What is the correlation between CPI and NIFTY?"

Expected Response:
- Mentions: negative correlation
- Value: -0.3 to -0.5
- Explanation: Higher inflation reduces stock returns
- References app data
```

**Q2:**
```
Input: "Why did markets crash in March 2020?"

Expected Response:
- COVID-19 pandemic
- Global lockdowns
- Economic uncertainty
- Historical context from data
```

**Q3:**
```
Input: "If inflation is 7% and FD gives 6%, what's my real return?"

Expected Response:
- Real return = -1%
- Calculation: 6% - 7% = -1%
- Explanation of purchasing power loss
```

---

## 📰 News & Sentiment Tests

### Test 17: News Feed
**URL:** `http://localhost:3000/sentiment`

**What to Check:**
```
✅ Headlines from real sources (ET, Moneycontrol, Mint)
✅ Published time < 24 hours ago
✅ Categories: RBI, Fed, Budget, Earnings, Global
✅ Click to read full article
```

**Test Sentiment:**
```
Positive Headline: "Markets rally on strong earnings"
Expected: 
  - Sentiment: Positive (Green)
  - Score: +3 to +5
  - Keywords: ["rally", "strong", "earnings"]

Negative Headline: "Markets tumble on recession fears"
Expected:
  - Sentiment: Negative (Red)
  - Score: -3 to -5
  - Keywords: ["tumble", "recession", "fears"]
```

---

## 🎓 Education Tests

### Test 18: Quiz
**URL:** `http://localhost:3000/learn`

**Quiz Questions & Answers:**

**Q1:** "If CPI is 120 today and 126 next year, what is inflation?"
```
Answer: 5%
Calculation: (126-120)/120 × 100 = 5%
```

**Q2:** "If inflation is 7% and your FD gives 6%, real return?"
```
Answer: -1%
Calculation: 6% - 7% = -1%
```

**Q3:** "Which sector typically benefits during high inflation?"
```
Answer: Gold/Commodities
Reason: Inflation hedge
```

---

## 🔧 Error Handling Tests

### Test 19: Invalid Date Range
**Input:**
```
Start Date: 2023-12-31
End Date: 2020-01-01
```
**Expected:** Error message "End date must be after start date"

---

### Test 20: Empty Search
**Input:**
```
Search stock: "XXXXXXX"
```
**Expected:** "No results found"

---

## ⚡ Performance Tests

### Test 21: Load Time Check
**Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Clear cache (Ctrl+Shift+Delete)
4. Navigate to `/dashboard`
5. Check "Load" time at bottom

**Expected:**
```
Initial Load: < 3 seconds
API Calls: < 1 second each
Total Time: < 4 seconds
```

---

### Test 22: Memory Usage
**Steps:**
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find browser process
3. Navigate through all pages
4. Check memory after 5 minutes

**Expected:**
```
Initial: ~200 MB
After 5 min: < 500 MB
No continuous growth (no memory leak)
```

---

## ✅ Quick 5-Minute Test

**Just want to verify it works? Do these 10:**

1. ✅ Open dashboard → Data displays
2. ✅ Check correlation matrix → Values between -1 and +1
3. ✅ Filter date range → Charts update
4. ✅ View scatter plot → Points visible
5. ✅ Enable moving averages → Lines appear
6. ✅ Go to global page → Countries load
7. ✅ Click chatbot → Ask a question
8. ✅ Export CSV → File downloads
9. ✅ Check console (F12) → No red errors
10. ✅ Toggle dark mode → Works

**If all 10 pass → Your website is functional!** ✅

---

## 📱 Mobile Test Values

**Open on mobile/tablet:**

**Viewport Sizes to Test:**
```
Mobile: 375px width
Tablet: 768px width
Desktop: 1920px width
```

**What to Check:**
```
✅ Charts resize properly
✅ Tables show pagination
✅ Hamburger menu works
✅ All buttons clickable
✅ Text readable (no overflow)
```

---

## 🐛 Common Issues & Expected Values

### If Correlation is >1 or <-1
```
🐛 BUG - Correlations must be between -1 and +1
Check: dataService.js correlation calculation
```

### If Mean > Max or Mean < Min
```
🐛 BUG - Mean must be between min and max
Check: Statistical calculation logic
```

### If Std Dev is negative
```
🐛 BUG - Standard deviation cannot be negative
Check: Square root of variance calculation
```

### If Dates are in wrong order
```
🐛 BUG - Dates should be chronological
Check: Data sorting in backend
```

---

## 📞 Quick Reference

**Default Date Range:**
```
Start: 2014-01-01
End: 2026-01-17
```

**Sample Countries for Testing:**
```
USA, India, UK, Germany, Japan, China, Brazil
```

**Sample Stocks for Testing:**
```
RELIANCE.NS, TCS.NS, HDFCBANK.NS, INFY.NS, ITC.NS
```

**API Endpoints to Test:**
```
GET /api/data/all
GET /api/data/cpi
GET /api/analysis/correlations
GET /api/analysis/insights
GET /api/countries/list
```

---

*Use this guide for quick verification!* ⚡
