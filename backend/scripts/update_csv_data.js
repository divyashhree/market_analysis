const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script to update CSV fallback data files
 * Run this periodically to keep fallback data fresh
 */

const DATA_DIR = path.join(__dirname, '../src/data');

/**
 * Update NIFTY 50 data from Yahoo Finance
 */
async function updateNiftyCSV() {
  console.log('📊 Updating NIFTY 50 data...');
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?interval=1mo&range=10y';
    const response = await axios.get(url, { timeout: 15000 });
    
    if (response.data?.chart?.result?.[0]) {
      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];
      
      let csv = 'date,value\n';
      timestamps.forEach((timestamp, index) => {
        const date = new Date(timestamp * 1000).toISOString().split('T')[0];
        const value = quotes.close[index] || quotes.open[index];
        if (value > 0) {
          csv += `${date},${value.toFixed(2)}\n`;
        }
      });
      
      await fs.writeFile(path.join(DATA_DIR, 'nifty_data.csv'), csv);
      console.log('✅ Updated nifty_data.csv');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to update NIFTY data:', error.message);
    return false;
  }
}

/**
 * Update USD-INR data from Yahoo Finance
 */
async function updateUSDINRCSV() {
  console.log('💱 Updating USD-INR data...');
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/INR=X?interval=1mo&range=10y';
    const response = await axios.get(url, { timeout: 15000 });
    
    if (response.data?.chart?.result?.[0]) {
      const result = response.data.chart.result[0];
      const timestamps = result.timestamp;
      const quotes = result.indicators.quote[0];
      
      let csv = 'date,value\n';
      timestamps.forEach((timestamp, index) => {
        const date = new Date(timestamp * 1000).toISOString().split('T')[0];
        const value = quotes.close[index] || quotes.open[index];
        if (value > 0) {
          csv += `${date},${value.toFixed(2)}\n`;
        }
      });
      
      await fs.writeFile(path.join(DATA_DIR, 'usdinr_data.csv'), csv);
      console.log('✅ Updated usdinr_data.csv');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to update USD-INR data:', error.message);
    return false;
  }
}

/**
 * Update CPI data from World Bank API
 */
async function updateCPICSV() {
  console.log('📈 Updating CPI data...');
  try {
    const url = 'https://api.worldbank.org/v2/country/IND/indicator/FP.CPI.TOTL?format=json&date=2014:2026&per_page=200';
    const response = await axios.get(url, { timeout: 15000 });
    
    if (response.data && Array.isArray(response.data) && response.data[1]) {
      const data = response.data[1]
        .filter(item => item.value !== null)
        .sort((a, b) => parseInt(a.date) - parseInt(b.date));
      
      let csv = 'date,value\n';
      data.forEach(item => {
        csv += `${item.date}-01-01,${parseFloat(item.value).toFixed(2)}\n`;
      });
      
      await fs.writeFile(path.join(DATA_DIR, 'cpi_data.csv'), csv);
      console.log('✅ Updated cpi_data.csv');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to update CPI data:', error.message);
    return false;
  }
}

/**
 * Generate metadata file with last update info
 */
async function generateMetadata(results) {
  const metadata = {
    lastUpdate: new Date().toISOString(),
    updatedBy: 'update_csv_data.js',
    status: {
      nifty: results.nifty ? 'success' : 'failed',
      usdinr: results.usdinr ? 'success' : 'failed',
      cpi: results.cpi ? 'success' : 'failed'
    },
    note: 'This data is a fallback. The app fetches live data from APIs when available.'
  };
  
  await fs.writeFile(
    path.join(DATA_DIR, 'data_metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  console.log('✅ Generated metadata file');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting CSV data update...\n');
  
  const results = {
    nifty: await updateNiftyCSV(),
    usdinr: await updateUSDINRCSV(),
    cpi: await updateCPICSV()
  };
  
  await generateMetadata(results);
  
  console.log('\n📊 Update Summary:');
  console.log(`NIFTY 50: ${results.nifty ? '✅ Success' : '❌ Failed'}`);
  console.log(`USD-INR: ${results.usdinr ? '✅ Success' : '❌ Failed'}`);
  console.log(`CPI: ${results.cpi ? '✅ Success' : '❌ Failed'}`);
  
  const successCount = Object.values(results).filter(Boolean).length;
  if (successCount === 3) {
    console.log('\n🎉 All data files updated successfully!');
  } else if (successCount > 0) {
    console.log(`\n⚠️ Partial success: ${successCount}/3 files updated`);
  } else {
    console.log('\n❌ Failed to update any files. Please check your internet connection.');
  }
}

// Run the script
main().catch(console.error);
