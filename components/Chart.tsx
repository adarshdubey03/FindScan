'use client';

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { init, dispose } from 'klinecharts';
import { OHLCV, BollingerBandsPoint } from '../lib/types';

export interface ChartRef {
  updateBollingerBands: (data: BollingerBandsPoint[]) => void;
  getChartInstance: () => any;
}

interface ChartProps {
  data: OHLCV[];
  onChartReady?: (chart: any) => void;
}

const Chart = forwardRef<ChartRef, ChartProps>(
  ({ data, onChartReady }, ref) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<any>(null);
    const [isChartReady, setIsChartReady] = useState(false);
    const [chartError, setChartError] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      updateBollingerBands: (bollingerData: BollingerBandsPoint[]) => {
        if (!chartInstanceRef.current) return;
        try {
          // Placeholder: integrate with your registered KLineCharts indicator here
          // Example (when indicator is implemented):
          // chartInstanceRef.current.overrideIndicator({
          //   name: 'BBANDS',
          //   id: 'bb-1',
          //   calcResults: bollingerData.map(d => ({ basis: d.basis, upper: d.upper, lower: d.lower }))
          // });
          console.log('updateBollingerBands called with', bollingerData.length, 'points');
        } catch (e) {
          console.error('Failed to update Bollinger Bands on chart', e);
        }
      },
      getChartInstance: () => chartInstanceRef.current,
    }));

    // Memoize the onChartReady callback to prevent infinite loops
    const memoizedOnChartReady = useCallback((chart: any) => {
      if (onChartReady) {
        onChartReady(chart);
      }
    }, [onChartReady]);

    // Memoize the wheel event handler to prevent recreation on every render
    const handleWheel = useCallback((event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY;
      
      // Smooth zoom with smaller increments for better control
      const zoomFactor = delta > 0 ? 0.95 : 1.05;
      
      try {
        // Try to use KLineCharts zoom method if available
        const chartAny = chartInstanceRef.current as any;
        if (chartAny && typeof chartAny.zoom === 'function') {
          chartAny.zoom(zoomFactor);
        } else if (chartAny && typeof chartAny.scale === 'function') {
          // Alternative zoom method
          chartAny.scale(zoomFactor);
        } else {
          console.log('Zoom methods not available, zoom functionality limited');
        }
      } catch (e) {
        console.log('Zoom operation failed:', e);
      }
    }, []);

    useEffect(() => {
      if (!chartContainerRef.current || data.length === 0) return;

      // Prevent multiple chart instances
      if (chartInstanceRef.current) {
        console.log('Chart already exists, skipping initialization');
        return;
      }

      try {
        setChartError(null);

        const chart = init(chartContainerRef.current);
        if (!chart) {
          setChartError('Failed to initialize chart');
          return;
        }

        chartInstanceRef.current = chart;

        // Chart styling
        chart.setStyles({
          grid: {
            show: true,
            horizontal: { 
              show: true, 
              color: 'rgba(255, 255, 255, 0.25)', 
              size: 1
            },
            vertical: { 
              show: true, 
              color: 'rgba(255, 255, 255, 0.25)', 
              size: 1
            },
          },
          candle: {
            priceMark: {
              show: true,
              high: { show: true, color: '#10b981' },
              low: { show: true, color: '#ef4444' },
            },
          },
          indicator: {
            show: true,
            legend: { show: true, position: 'top' },
          },
          crosshair: {
            show: true,
          },
        });

        // Additional grid configuration to ensure visibility
        try {
          // Try to set grid properties directly if available
          const chartAny = chart as any;
          if (typeof chartAny.setGridVisible === 'function') {
            chartAny.setGridVisible(true);
          }
          if (typeof chartAny.setGridStyle === 'function') {
            chartAny.setGridStyle({
              horizontal: { show: true, color: 'rgba(255, 255, 255, 0.25)' },
              vertical: { show: true, color: 'rgba(255, 255, 255, 0.25)' }
            });
          }
        } catch (e) {
          console.log('Additional grid configuration not available, using default styling');
        }

        // Configure zoom behavior for smooth zooming
        chart.setZoomEnabled(true);
        chart.setScrollEnabled(true);

        // Add wheel event listener for zoom functionality
        chartContainerRef.current.addEventListener('wheel', handleWheel, { passive: false });

        // Feed candlestick data (ensure your OHLCV uses `timestamp`)
        const candlestickData = data.map((item) => ({
          timestamp: item.timestamp,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        }));

        try {
          chart.applyNewData(candlestickData);
        } catch (e) {
          console.warn('Failed to apply chart data:', e);
          setChartError('Failed to load chart data');
        }

        if (memoizedOnChartReady) memoizedOnChartReady(chart);
        setIsChartReady(true);
      } catch (error) {
        setChartError(
          'Error initializing chart: ' +
            (error instanceof Error ? error.message : 'Unknown error')
        );
      }

      return () => {
        // Cleanup function
        if (chartContainerRef.current) {
          chartContainerRef.current.removeEventListener('wheel', handleWheel);
        }
      };
    }, [data, memoizedOnChartReady, handleWheel]);

    // Separate cleanup effect for chart disposal
    useEffect(() => {
      return () => {
        if (chartInstanceRef.current && chartContainerRef.current) {
          dispose(chartContainerRef.current);
          chartInstanceRef.current = null;
          setIsChartReady(false);
        }
      };
    }, []);

    return (
      <div className="chart-container w-full h-full min-h-[600px] relative">
        <div
          ref={chartContainerRef}
          className="w-full h-full rounded-xl overflow-hidden cursor-crosshair"
          style={{ minHeight: '500px' }}
        />

        {/* Loading overlay */}
        {!isChartReady && !chartError && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300 text-lg">Initializing Chart...</p>
              <p className="text-gray-500 text-sm">Loading {data.length} data points</p>
            </div>
          </div>
        )}

        {/* Error overlay */}
        {chartError && (
          <div className="absolute inset-0 bg-red-900 bg-opacity-90 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <p className="text-red-200 text-lg mb-2">Chart Error</p>
              <p className="text-red-300 text-sm">{chartError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        )}

        {/* Info panel */}
        {/* Removed info panel as requested */}
      </div>
    );
  }
);

Chart.displayName = 'Chart';
export default Chart;
