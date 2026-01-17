# CSV Data Update Script

This script updates the fallback CSV data files with fresh data from Yahoo Finance and World Bank APIs.

## Purpose

The app uses real-time APIs as the primary data source, but falls back to CSV files when APIs are unavailable. This script keeps those CSV files up-to-date.

## Files Updated

- `src/data/nifty_data.csv` - NIFTY 50 index data (10 years)
- `src/data/usdinr_data.csv` - USD-INR exchange rates (10 years)
- `src/data/cpi_data.csv` - India CPI data (2014-2026)
- `src/data/data_metadata.json` - Metadata about last update

## Usage

### Manual Update

```bash
# From backend directory
cd backend
node scripts/update_csv_data.js
```

### Using npm script

```bash
# From backend directory
cd backend
npm run update-data
```

### From project root

```bash
# Update CSV data
npm run update-data
```

## When to Run

- **Monthly**: After new economic data is released
- **Before deployment**: Ensure fallback data is fresh
- **After long downtime**: If APIs were down for extended period
- **Manual check**: Anytime you want to refresh fallback data

## Automation (Optional)

You can automate this with:

### GitHub Actions (Recommended)

Add to `.github/workflows/update-data.yml`:

```yaml
name: Update CSV Data

on:
  schedule:
    - cron: '0 0 1 * *' # Run on 1st of every month
  workflow_dispatch: # Allow manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd backend && npm install
      - run: cd backend && node scripts/update_csv_data.js
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'chore: update CSV data'
          file_pattern: backend/src/data/*.csv backend/src/data/*.json
```

### Cron Job (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add line to run monthly
0 0 1 * * cd /path/to/project/backend && node scripts/update_csv_data.js
```

### Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger to monthly
4. Action: Run `node.exe` with arguments `C:\path\to\project\backend\scripts\update_csv_data.js`

## Output

Success:
```
🚀 Starting CSV data update...

📊 Updating NIFTY 50 data...
✅ Updated nifty_data.csv
💱 Updating USD-INR data...
✅ Updated usdinr_data.csv
📈 Updating CPI data...
✅ Updated cpi_data.csv
✅ Generated metadata file

📊 Update Summary:
NIFTY 50: ✅ Success
USD-INR: ✅ Success
CPI: ✅ Success

🎉 All data files updated successfully!
```

Partial failure:
```
📊 Update Summary:
NIFTY 50: ✅ Success
USD-INR: ❌ Failed
CPI: ✅ Success

⚠️ Partial success: 2/3 files updated
```

## Troubleshooting

### All Updates Fail

**Problem**: No internet connection or APIs down
**Solution**: Check your internet connection and try again later

### Specific API Fails

**Problem**: Individual API (Yahoo Finance or World Bank) is down
**Solution**: Wait and retry. The app will use old CSV as fallback

### Permission Errors

**Problem**: Cannot write to CSV files
**Solution**: Check file permissions. Run with appropriate privileges

## Data Sources

- **NIFTY 50**: Yahoo Finance API (`^NSEI`)
- **USD-INR**: Yahoo Finance API (`INR=X`)
- **CPI**: World Bank API (India, indicator `FP.CPI.TOTL`)

## Notes

- The script fetches 10 years of historical data
- Monthly interval data (one data point per month)
- CSV format: `date,value`
- Metadata file tracks last update time and success status
- Old CSV files are overwritten completely
