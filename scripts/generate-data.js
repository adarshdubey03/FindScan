const fs = require('fs');
const path = require('path');

// Generate synthetic OHLCV data with 250 daily candles
function generateOHLCVData() {
  const data = [];
  let basePrice = 100;
  let currentTime = Date.now() - (250 * 24 * 60 * 60 * 1000); // 250 days ago
  
  for (let i = 0; i < 250; i++) {
    // Generate realistic price movements
    const volatility = 0.02; // 2% daily volatility
    const trend = 0.0001; // Slight upward trend
    
    const randomChange = (Math.random() - 0.5) * volatility;
    const trendChange = trend;
    const totalChange = randomChange + trendChange;
    
    const open = basePrice;
    const close = open * (1 + totalChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = Math.floor(1000000 + Math.random() * 2000000);
    
    data.push({
      time: currentTime,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: volume
    });
    
    basePrice = close;
    currentTime += 24 * 60 * 60 * 1000; // Next day
  }
  
  return data;
}

// Generate and save data
const ohlcvData = generateOHLCVData();
const outputPath = path.join(__dirname, '../public/data/ohlcv.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(ohlcvData, null, 2));
console.log(`Generated ${ohlcvData.length} OHLCV candles at ${outputPath}`);
