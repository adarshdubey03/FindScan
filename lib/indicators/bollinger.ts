import { OHLCV, BollingerBandsOptions, BollingerBandsPoint } from "../types";

/**
 * Calculates Simple Moving Average (SMA) for the last N values
 */
function calculateSMA(values: number[], length: number): number | null {
  if (values.length < length) return null;
  const sum = values.slice(-length).reduce((a, b) => a + b, 0);
  return sum / length;
}

/**
 * Calculates Standard Deviation (Population)
 * Formula: sqrt(sum((x - mean)^2) / N)
 */
function calculateStdDev(values: number[], length: number, mean: number): number | null {
  if (values.length < length) return null;
  const slice = values.slice(-length);
  const variance = slice.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / length;
  return Math.sqrt(variance);
}

/**
 * Computes Bollinger Bands for OHLCV data
 * Returns array of objects aligned with each candle
 *
 * Formula:
 *  - Basis = SMA(source, length)
 *  - StdDev = StdDev(source over last N)
 *  - Upper = Basis + (multiplier * StdDev)
 *  - Lower = Basis - (multiplier * StdDev)
 *  - Offset: shift bands by N candles
 */
export function computeBollingerBands(
  data: OHLCV[],
  options: BollingerBandsOptions
): BollingerBandsPoint[] {
  const { length, source, stdDevMultiplier, offset } = options;
  const results: BollingerBandsPoint[] = [];

  const sourcePrices: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const price = data[i][source];
    sourcePrices.push(price);

    const basis = calculateSMA(sourcePrices, length);
    if (basis === null) {
      results.push({ timestamp: data[i].timestamp, basis: null, upper: null, lower: null });
      continue;
    }

    const sd = calculateStdDev(sourcePrices, length, basis);
    if (sd === null) {
      results.push({ timestamp: data[i].timestamp, basis, upper: null, lower: null });
      continue;
    }

    const upper = basis + stdDevMultiplier * sd;
    const lower = basis - stdDevMultiplier * sd;

    results.push({
      timestamp: data[i].timestamp,
      basis,
      upper,
      lower,
    });
  }

  // ✅ Apply offset (shift forward/backward by N candles)
  if (offset !== 0) {
    const shifted: BollingerBandsPoint[] = new Array(data.length).fill(null).map((_, idx) => ({
      timestamp: data[idx].timestamp,
      basis: null,
      upper: null,
      lower: null,
    }));

    for (let i = 0; i < results.length; i++) {
      const j = i + offset;
      if (j >= 0 && j < results.length) {
        shifted[j] = { ...results[i], timestamp: data[j].timestamp };
      }
    }
    return shifted;
  }

  return results;
}

/**
 * Quick test function for unit testing
 */
export function testBollingerBands(): boolean {
  const testData: OHLCV[] = [
    { timestamp: 1000, open: 100, high: 105, low: 98, close: 102, volume: 1000 },
    { timestamp: 2000, open: 102, high: 108, low: 100, close: 106, volume: 1200 },
    { timestamp: 3000, open: 106, high: 110, low: 104, close: 108, volume: 1100 },
    { timestamp: 4000, open: 108, high: 112, low: 106, close: 110, volume: 1300 },
    { timestamp: 5000, open: 110, high: 115, low: 108, close: 113, volume: 1400 },
  ];

  const options: BollingerBandsOptions = {
    length: 3,
    source: "close",
    stdDevMultiplier: 2,
    offset: 0,
  };

  const result = computeBollingerBands(testData, options);

  // Basic validations
  if (result.length !== 5) return false;
  if (result[0].basis !== null && result[1].basis !== null) return false; // first 2 null
  if (result[2].basis === null || result[3].basis === null || result[4].basis === null) return false; // last 3 must exist

  return true;
}
