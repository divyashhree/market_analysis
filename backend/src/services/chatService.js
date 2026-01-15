/**
 * Chat Service - AI-powered economic insights chatbot
 * Uses Groq API for fast, free LLM inference
 */

const axios = require('axios');
const dataService = require('./dataService');
const { countries, getCountry } = require('../config/countries');

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY environment variable is not set. Chat functionality will be limited.');
}

// Economic knowledge base for context
const economicKnowledge = {
  inflation: {
    definition: "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power.",
    causes: ["Demand-pull inflation (too much money chasing too few goods)", "Cost-push inflation (rising production costs)", "Built-in inflation (wage-price spiral)", "Monetary expansion"],
    effects: ["Reduced purchasing power", "Higher interest rates", "Currency depreciation", "Impact on savings"],
    indicators: ["Consumer Price Index (CPI)", "Producer Price Index (PPI)", "Core inflation rate"]
  },
  stockMarket: {
    definition: "Stock markets are venues where buyers and sellers trade shares of publicly listed companies.",
    factors: ["Corporate earnings", "Interest rates", "Economic growth", "Political stability", "Global events", "Investor sentiment"],
    indices: {
      "NIFTY 50": "India's benchmark index of 50 largest companies on NSE",
      "S&P 500": "US index of 500 largest publicly traded companies",
      "FTSE 100": "UK's top 100 companies by market cap",
      "DAX": "Germany's 40 major companies",
      "Nikkei 225": "Japan's leading stock index"
    }
  },
  currency: {
    definition: "Exchange rates represent how much one currency is worth in terms of another.",
    factors: ["Interest rate differentials", "Inflation rates", "Trade balance", "Political stability", "Economic performance"],
    impacts: ["Import/export costs", "Foreign investment flows", "Debt servicing costs"]
  },
  correlations: {
    "inflation-stocks": "High inflation often leads to lower stock returns as it increases costs and interest rates",
    "inflation-currency": "High inflation typically weakens a currency as purchasing power decreases",
    "interest-stocks": "Rising interest rates can hurt stocks as borrowing becomes expensive",
    "gdp-stocks": "Strong GDP growth usually supports higher stock prices"
  }
};

// Build context about current data
async function buildDataContext() {
  try {
    const data = await dataService.getAllData();
    
    // Calculate some insights
    const latestCPI = data.cpi[data.cpi.length - 1];
    const latestUSDINR = data.usdinr[data.usdinr.length - 1];
    const latestNifty = data.nifty[data.nifty.length - 1];
    
    // Calculate changes
    const cpiChange = data.cpi.length > 12 
      ? ((latestCPI.value - data.cpi[data.cpi.length - 13].value) / data.cpi[data.cpi.length - 13].value * 100).toFixed(2)
      : 'N/A';
    
    const niftyChange = data.nifty.length > 12
      ? ((latestNifty.value - data.nifty[data.nifty.length - 13].value) / data.nifty[data.nifty.length - 13].value * 100).toFixed(2)
      : 'N/A';

    return {
      india: {
        latestCPI: latestCPI?.value,
        cpiDate: latestCPI?.date,
        cpiYearChange: cpiChange,
        latestUSDINR: latestUSDINR?.value,
        usdInrDate: latestUSDINR?.date,
        latestNifty: latestNifty?.value,
        niftyDate: latestNifty?.date,
        niftyYearChange: niftyChange
      },
      countries: Object.keys(countries).length
    };
  } catch (error) {
    console.error('Error building data context:', error);
    return null;
  }
}

// Generate response using Groq API (fast LLM inference)
async function generateAIResponse(userMessage, dataContext) {
  if (!GROQ_API_KEY) {
    return generateLocalResponse(userMessage, dataContext);
  }

  try {
    const systemPrompt = `You are an expert economic analyst assistant for a Global Market Analyzer application. 
You help users understand economic data, market trends, and financial concepts in simple terms.

Current Data Context:
- The app tracks ${dataContext?.countries || 35}+ countries
- India's latest CPI: ${dataContext?.india?.latestCPI || 'N/A'} (${dataContext?.india?.cpiDate || ''})
- India's CPI year-over-year change: ${dataContext?.india?.cpiYearChange || 'N/A'}%
- USD/INR exchange rate: ${dataContext?.india?.latestUSDINR || 'N/A'}
- NIFTY 50 index: ${dataContext?.india?.latestNifty || 'N/A'}
- NIFTY year-over-year change: ${dataContext?.india?.niftyYearChange || 'N/A'}%

Guidelines:
1. Explain economic concepts in simple, easy-to-understand language
2. When discussing data, reference actual numbers when available
3. Provide context for why trends occur
4. Be helpful and educational
5. If you don't know something, say so
6. Keep responses concise but informative (2-3 paragraphs max)
7. Use relevant emojis to make responses friendly`;

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.95
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        timeout: 30000
      }
    );

    const aiResponse = response.data?.choices?.[0]?.message?.content;
    return aiResponse || generateLocalResponse(userMessage, dataContext);
  } catch (error) {
    console.error('Groq API error:', error.message);
    return generateLocalResponse(userMessage, dataContext);
  }
}

// Local response generation (fallback when no API key)
function generateLocalResponse(userMessage, dataContext) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Pattern matching for common questions
  if (lowerMessage.includes('inflation') && (lowerMessage.includes('what') || lowerMessage.includes('explain') || lowerMessage.includes('mean'))) {
    return `📊 **What is Inflation?**

Inflation is the rate at which prices for goods and services increase over time. When inflation rises, each unit of currency buys fewer items.

**Key causes include:**
• Too much money in the economy (demand-pull)
• Rising production costs (cost-push)
• Supply chain disruptions

${dataContext?.india?.cpiYearChange ? `📈 India's CPI has changed by ${dataContext.india.cpiYearChange}% over the past year.` : ''}

High inflation erodes savings and purchasing power, which is why central banks try to keep it around 2-4%.`;
  }

  if (lowerMessage.includes('nifty') || lowerMessage.includes('stock market') || lowerMessage.includes('sensex')) {
    return `📈 **About NIFTY 50**

NIFTY 50 is India's benchmark stock market index, representing the weighted average of 50 largest companies listed on the National Stock Exchange (NSE).

${dataContext?.india?.latestNifty ? `**Current Value:** ${dataContext.india.latestNifty.toLocaleString()}` : ''}
${dataContext?.india?.niftyYearChange ? `**1-Year Change:** ${dataContext.india.niftyYearChange}%` : ''}

Stock markets are influenced by:
• Corporate earnings & economic growth
• Interest rates & inflation
• Global market trends
• Political and policy changes
• Investor sentiment`;
  }

  if (lowerMessage.includes('usd') || lowerMessage.includes('inr') || lowerMessage.includes('rupee') || lowerMessage.includes('dollar') || lowerMessage.includes('exchange')) {
    return `💱 **USD/INR Exchange Rate**

The USD/INR rate shows how many Indian Rupees you need to buy one US Dollar.

${dataContext?.india?.latestUSDINR ? `**Current Rate:** ₹${dataContext.india.latestUSDINR.toFixed(2)} per $1 USD` : ''}

**Factors affecting the rate:**
• Interest rate differences between countries
• Trade balance (imports vs exports)
• Foreign investment flows
• Inflation differentials
• Global economic conditions

A weaker rupee makes imports expensive but helps exporters.`;
  }

  if (lowerMessage.includes('cpi') || lowerMessage.includes('consumer price')) {
    return `📊 **Consumer Price Index (CPI)**

CPI measures the average change in prices paid by consumers for a basket of goods and services over time. It's the most common measure of inflation.

${dataContext?.india?.latestCPI ? `**India's Latest CPI:** ${dataContext.india.latestCPI}` : ''}
${dataContext?.india?.cpiYearChange ? `**Year-over-Year Change:** ${dataContext.india.cpiYearChange}%` : ''}

The CPI basket typically includes:
• Food & beverages
• Housing & utilities
• Transportation
• Healthcare
• Education`;
  }

  if (lowerMessage.includes('correlation') || lowerMessage.includes('relationship') || lowerMessage.includes('connected')) {
    return `🔗 **Economic Correlations**

Economic indicators are interconnected:

📈 **Inflation ↔ Stocks:**
High inflation often hurts stocks because it increases costs and leads to higher interest rates.

💱 **Inflation ↔ Currency:**
High inflation typically weakens a currency as purchasing power decreases.

📊 **Interest Rates ↔ Stocks:**
Rising rates make borrowing expensive, which can slow company growth and hurt stock prices.

🌍 **Global Connections:**
In today's connected world, events in one country can ripple across global markets.`;
  }

  if (lowerMessage.includes('why') && (lowerMessage.includes('fall') || lowerMessage.includes('drop') || lowerMessage.includes('crash') || lowerMessage.includes('down'))) {
    return `📉 **Why Markets Fall**

Stock markets can decline for various reasons:

**Short-term factors:**
• Negative earnings reports
• Geopolitical tensions
• Interest rate hikes
• Global market selloffs

**Longer-term factors:**
• Economic recession fears
• High inflation eroding profits
• Currency weakness
• Policy uncertainty

Remember: Market corrections are normal and often present buying opportunities for long-term investors. 📊`;
  }

  if (lowerMessage.includes('why') && (lowerMessage.includes('rise') || lowerMessage.includes('up') || lowerMessage.includes('grow') || lowerMessage.includes('increase'))) {
    return `📈 **Why Markets Rise**

Markets generally rise when:

**Economic factors:**
• Strong GDP growth
• Low inflation environment
• Corporate earnings growth
• Job market strength

**Policy factors:**
• Low interest rates
• Government stimulus
• Pro-business policies

**Sentiment factors:**
• Investor optimism
• Foreign investment inflows
• Global risk-on sentiment

Healthy bull markets are usually supported by fundamental economic growth. 🌱`;
  }

  if (lowerMessage.includes('compare') || lowerMessage.includes('country') || lowerMessage.includes('global')) {
    return `🌍 **Global Comparison**

Our platform tracks ${dataContext?.countries || 35}+ countries across 6 regions:

**Major Economies Tracked:**
• 🇺🇸 USA (S&P 500)
• 🇬🇧 UK (FTSE 100)
• 🇩🇪 Germany (DAX)
• 🇯🇵 Japan (Nikkei 225)
• 🇨🇳 China (Shanghai Composite)
• 🇮🇳 India (NIFTY 50)

You can compare inflation rates, stock performance, and currency movements across all these countries using our Global page.

Each country has unique economic drivers, but global markets are increasingly interconnected.`;
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `👋 **Hello! I'm your Economic Insights Assistant**

I can help you understand:
• 📊 What inflation is and how it affects you
• 📈 Stock market movements and trends
• 💱 Currency exchange rates
• 🔗 How different economic indicators relate
• 🌍 Global economic comparisons

Just ask me anything about the data you're seeing! For example:
• "Why did the stock market fall?"
• "What is CPI?"
• "How does inflation affect the rupee?"`;
  }

  // Default response
  return `🤔 I can help you understand economic data and trends!

Here are some things you can ask me:
• "What is inflation?"
• "Explain the NIFTY 50"
• "Why do stock markets fall?"
• "How are inflation and stocks related?"
• "What affects the USD/INR rate?"

${dataContext?.india?.latestNifty ? `\n📊 **Quick Stats:**\n• NIFTY 50: ${dataContext.india.latestNifty.toLocaleString()}\n• USD/INR: ₹${dataContext.india.latestUSDINR?.toFixed(2)}\n• CPI Change: ${dataContext.india.cpiYearChange}%` : ''}

Feel free to ask anything about the charts and data you're seeing!`;
}

// Main chat function
async function chat(message, conversationHistory = []) {
  const dataContext = await buildDataContext();
  const response = await generateAIResponse(message, dataContext);
  
  return {
    message: response,
    timestamp: new Date().toISOString(),
    hasAI: !!GROQ_API_KEY
  };
}

// Get suggested questions based on current data
function getSuggestedQuestions() {
  return [
    "What is inflation and how does it affect me?",
    "Why did the stock market change recently?",
    "How are inflation and stock markets related?",
    "What affects the USD/INR exchange rate?",
    "Compare India's economy with other countries",
    "What is CPI and why does it matter?",
    "How do global events affect Indian markets?"
  ];
}

module.exports = {
  chat,
  getSuggestedQuestions,
  buildDataContext
};
