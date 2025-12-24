# API Testing Guide

## Base URL
```
http://localhost:5000
```

## Health Check

### Check Server Status
```bash
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-24T10:30:00.000Z",
  "environment": "development"
}
```

## Data Endpoints

### 1. Get All Economic Data

```bash
GET /api/data/all
```

**Response:**
```json
{
  "cpi": [
    { "date": "2014-01-01", "value": 100.00 },
    ...
  ],
  "usdinr": [
    { "date": "2014-01-01", "value": 61.80 },
    ...
  ],
  "nifty": [
    { "date": "2014-01-01", "value": 6089.50 },
    ...
  ]
}
```

### 2. Get CPI Data Only

```bash
GET /api/data/cpi
```

### 3. Get USD-INR Data Only

```bash
GET /api/data/usdinr
```

### 4. Get NIFTY 50 Data Only

```bash
GET /api/data/nifty
```

### 5. Get Data by Date Range

```bash
GET /api/data/range?start=2020-01-01&end=2023-12-31
```

**Query Parameters:**
- `start` (required): Start date in YYYY-MM-DD format
- `end` (required): End date in YYYY-MM-DD format

## Analysis Endpoints

### 1. Get Correlation Coefficients

```bash
GET /api/analysis/correlations
```

**Response:**
```json
{
  "cpi_usdinr": 0.876,
  "cpi_nifty": 0.654,
  "usdinr_nifty": 0.723
}
```

### 2. Get Auto-Generated Insights

```bash
GET /api/analysis/insights
```

**Response:**
```json
[
  {
    "type": "positive",
    "title": "Positive CPI-NIFTY Correlation",
    "description": "Strong positive correlation (0.654) between inflation and market performance.",
    "value": 0.654
  },
  ...
]
```

### 3. Get Full Analysis

```bash
GET /api/analysis/full
```

**Response includes:**
- Correlation matrix
- Statistical measures (mean, std, min, max, median)
- Rolling 12-month correlations
- Auto-generated insights

### 4. Compare Two Time Periods

```bash
GET /api/analysis/compare?period1Start=2014-01-01&period1End=2019-12-31&period2Start=2020-01-01&period2End=2024-12-31
```

**Query Parameters:**
- `period1Start` (required)
- `period1End` (required)
- `period2Start` (required)
- `period2End` (required)

**Response:**
```json
{
  "period1": {
    "start": "2014-01-01",
    "end": "2019-12-31",
    "stats": { ... },
    "correlations": { ... }
  },
  "period2": {
    "start": "2020-01-01",
    "end": "2024-12-31",
    "stats": { ... },
    "correlations": { ... }
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Both start and end dates are required"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Route GET /api/invalid not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Error description",
  "stack": "..." // Only in development mode
}
```

## Testing with cURL

### Get All Data
```bash
curl http://localhost:5000/api/data/all
```

### Get Data for Specific Range
```bash
curl "http://localhost:5000/api/data/range?start=2020-01-01&end=2023-12-31"
```

### Get Correlations
```bash
curl http://localhost:5000/api/analysis/correlations
```

### Compare Periods
```bash
curl "http://localhost:5000/api/analysis/compare?period1Start=2014-01-01&period1End=2019-12-31&period2Start=2020-01-01&period2End=2024-12-31"
```

## Testing with JavaScript (fetch)

```javascript
// Get all data
const response = await fetch('http://localhost:5000/api/data/all');
const data = await response.json();
console.log(data);

// Get correlations
const corrResponse = await fetch('http://localhost:5000/api/analysis/correlations');
const correlations = await corrResponse.json();
console.log(correlations);

// Get data by range
const rangeResponse = await fetch(
  'http://localhost:5000/api/data/range?start=2020-01-01&end=2023-12-31'
);
const rangeData = await rangeResponse.json();
console.log(rangeData);
```

## Rate Limiting & Caching

- API responses are cached for 1 hour
- Yahoo Finance API may have rate limits
- World Bank API is generally unrestricted
- Application falls back to CSV if APIs fail

## CORS Configuration

Default CORS origin: `http://localhost:3000`

To change, edit `backend/.env`:
```
CORS_ORIGIN=http://your-frontend-url.com
```
