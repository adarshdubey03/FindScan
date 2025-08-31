import { OHLCV } from "./types";

/**
 * Shifts a series by the specified offset.
 * Positive offset = forward (right), Negative offset = backward (left).
 * Out-of-bounds values are filled with null.
 */
export function shiftSeriesWithOffset<T>(series: (T | null)[], offset: number): (T | null)[] {
  if (offset === 0) return [...series];

  const result: (T | null)[] = new Array(series.length).fill(null);

  for (let i = 0; i < series.length; i++) {
    const sourceIndex = i - offset;
    if (sourceIndex >= 0 && sourceIndex < series.length) {
      result[i] = series[sourceIndex];
    }
  }

  return result;
}

/**
 * Formats a number to a specified number of decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Converts a hex color to rgba with opacity
 * @param hex - hex string (#RRGGBB)
 * @param opacity - 0 to 1 (e.g., 0.2 = 20% opacity)
 */
export function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`; // ✅ no /100
}

/**
 * Gets the source price from OHLCV data based on source type
 */
export function getSourcePrice(
  data: OHLCV[],
  source: "close" | "open" | "high" | "low"
): number[] {
  return data.map((candle) => candle[source]);
}

/**
 * Validates OHLCV data structure
 */
export function validateOHLCVData(data: OHLCV[]): boolean {
  if (!Array.isArray(data) || data.length === 0) return false;

  return data.every(
    (candle) =>
      typeof candle.timestamp === "number" && // ✅ fixed from time → timestamp
      typeof candle.open === "number" &&
      typeof candle.high === "number" &&
      typeof candle.low === "number" &&
      typeof candle.close === "number" &&
      typeof candle.volume === "number" &&
      candle.high >= Math.max(candle.open, candle.close) &&
      candle.low <= Math.min(candle.open, candle.close)
  );
}
