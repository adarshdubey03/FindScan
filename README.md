# 📊 FindScan – Bollinger Bands Indicator

## ⚙️ Setup / Run Instructions
```bash
git clone https://github.com/adarshdubey03/FindScan.git
cd FindScan
npm install
npm run dev
Then open http://localhost:3000 in your browser.

📐 Formulas & StdDev Variant
Basis (Middle Band): 20-period Simple Moving Average (SMA) of the closing price.

Standard Deviation: Sample Standard Deviation (n-1 denominator), chosen since market price data is a sample of the population.

Upper Band: Basis + (StdDev × Multiplier) (default multiplier = 2).

Lower Band: Basis − (StdDev × Multiplier).

Offset: Shifts bands forward/backward by N bars (default = 0).

📊 KLineCharts Version
KLineCharts: 9.8.12

