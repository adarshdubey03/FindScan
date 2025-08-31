/**
 * Candle (OHLCV) data
 * KLineCharts expects `timestamp` in milliseconds
 */
export interface OHLCV {
  timestamp: number;   // ✅ changed from `time` to `timestamp`
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * User-configurable inputs for Bollinger Bands
 */
export interface BollingerBandsOptions {
  length: number;                          // default: 20
  source: 'close' | 'open' | 'high' | 'low'; // assignment only needs 'close'
  stdDevMultiplier: number;                // default: 2
  offset: number;                          // default: 0
}

/**
 * Result of Bollinger Bands calculation for each candle
 */
export interface BollingerBandsPoint {
  timestamp: number;
  basis: number | null;
  upper: number | null;
  lower: number | null;
}

/**
 * Style settings for Bollinger Bands lines & background
 */
export interface BollingerStyleSettings {
  middle: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed' | 'dotted';
  };
  upper: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed' | 'dotted';
  };
  lower: {
    visible: boolean;
    color: string;
    lineWidth: number;
    lineStyle: 'solid' | 'dashed' | 'dotted';
  };
  background: {
    visible: boolean;
    opacity: number; // 0 → transparent, 1 → fully opaque
  };
}

/**
 * Full settings: inputs + style
 */
export interface BollingerSettings {
  inputs: BollingerBandsOptions;
  style: BollingerStyleSettings;
}
