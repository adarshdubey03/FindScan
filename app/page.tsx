'use client';

import React, { useState, useRef, useEffect } from 'react';
import Chart, { ChartRef } from '../components/Chart';
import SimpleChart from '../components/SimpleChart';
import BollingerIndicator from '../components/BollingerIndicator';
import BollingerSettings from '../components/BollingerSettings';
import AddIndicatorButton from '../components/AddIndicatorButton';
import { OHLCV, BollingerSettings as BollingerSettingsType } from '../lib/types';

export default function Home() {
  const [ohlcvData, setOHLCVData] = useState<OHLCV[]>([]);
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [isIndicatorAdded, setIsIndicatorAdded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSimpleChart, setUseSimpleChart] = useState(false);

  const [bollingerSettings, setBollingerSettings] = useState<BollingerSettingsType>({
    inputs: {
      length: 20,
      source: 'close',
      stdDevMultiplier: 2,
      offset: 0, // Changed back to 0 as requested
    },
    style: {
      middle: { visible: true, color: '#fbbf24', lineWidth: 1, lineStyle: 'solid' },
      upper: { visible: true, color: '#22c55e', lineWidth: 1, lineStyle: 'solid' },
      lower: { visible: true, color: '#ef4444', lineWidth: 1, lineStyle: 'solid' },
      background: { visible: true, opacity: 10 },
    },
  });

  const chartRef = useRef<ChartRef>(null);

  // Load OHLCV data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/data/ohlcv.json');
        if (response.ok) {
          const rawData = await response.json();
          
          // Normalize data to ensure it has 'timestamp' field
          const normalizedData = rawData.map((item: any) => ({
            timestamp: item.timestamp || item.time, // Handle both 'timestamp' and 'time' fields
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume,
          }));
          
          setOHLCVData(normalizedData);
        } else {
          console.warn('No ohlcv.json found, generating fallback data');
          generateFallbackData();
        }
      } catch (err) {
        console.error('Error loading OHLCV data:', err);
        setError('Failed to load chart data');
        generateFallbackData(); // still provide data
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate fallback data
  const generateFallbackData = () => {
    const data: OHLCV[] = [];
    let basePrice = 100;
    let currentTime = Date.now() - 250 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < 250; i++) {
      const volatility = 0.02;
      const trend = Math.sin(i / 30) * 0.002; // cycle trend
      const randomChange = (Math.random() - 0.5) * volatility;
      const totalChange = randomChange + trend;

      const open = basePrice;
      const close = open * (1 + totalChange);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(1_000_000 + Math.random() * 2_000_000);

      data.push({
        timestamp: currentTime,
        open: +open.toFixed(2),
        high: +high.toFixed(2),
        low: +low.toFixed(2),
        close: +close.toFixed(2),
        volume,
      });

      basePrice = close;
      currentTime += 24 * 60 * 60 * 1000; // next day
    }

    setOHLCVData(data);
  };

  const handleChartReady = (chart: any) => setChartInstance(chart);

  const handleAddIndicator = () => {
    setIsIndicatorAdded(true);
    setIsSettingsOpen(true);
  };

  const handleSettingsChange = (newSettings: BollingerSettingsType) => {
    setBollingerSettings(newSettings);
    // Chart/Indicator will re-render due to props change
  };

  const handleCloseSettings = () => setIsSettingsOpen(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="py-8 border-b border-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">
                <span className="text-green-400">Bollinger</span> Bands
              </h1>
              <p className="text-gray-400 text-lg">Advanced Technical Analysis Tool</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>• Volatility Analysis</span>
                <span>• Trend Identification</span>
                <span>• Risk Management</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">Data Points</div>
                <div className="text-2xl font-bold text-green-400">{ohlcvData.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Last Update</div>
                <div className="text-sm text-gray-300">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Chart Type Toggle */}
        <div className="mb-6">
          <div className="inline-flex bg-gray-900 rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setUseSimpleChart(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                !useSimpleChart 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              KLine Charts
            </button>
            <button
              onClick={() => setUseSimpleChart(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                useSimpleChart 
                  ? 'bg-green-600 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              Simple Chart
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {useSimpleChart ? 'Simple Chart' : 'KLine Charts'}
            </h2>
            <AddIndicatorButton onClick={handleAddIndicator} disabled={isIndicatorAdded} />
          </div>

          {useSimpleChart ? (
            <SimpleChart data={ohlcvData} />
          ) : (
            <Chart ref={chartRef} data={ohlcvData} onChartReady={handleChartReady} />
          )}

          {/* Settings Description */}
          {isIndicatorAdded && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-white mb-3">Current Settings</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Period Length:</span>
                  <span className="text-white ml-2">{bollingerSettings.inputs.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">StdDev Multiplier:</span>
                  <span className="text-white ml-2">{bollingerSettings.inputs.stdDevMultiplier}</span>
                </div>
                <div>
                  <span className="text-gray-400">Price Source:</span>
                  <span className="text-white ml-2 capitalize">{bollingerSettings.inputs.source}</span>
                </div>
                <div>
                  <span className="text-gray-400">Offset:</span>
                  <span className="text-white ml-2">{bollingerSettings.inputs.offset}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="text-gray-400">Middle:</span>
                    <span className="text-white">{bollingerSettings.style.middle.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-gray-400">Upper:</span>
                    <span className="text-white">{bollingerSettings.style.upper.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-gray-400">Lower:</span>
                    <span className="text-white">{bollingerSettings.style.lower.visible ? 'Visible' : 'Hidden'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Indicator Legend + Settings */}
        {isIndicatorAdded && (
          <>
            {chartInstance && !useSimpleChart && (
              <BollingerIndicator
                chart={chartInstance}
                data={ohlcvData}
                options={bollingerSettings.inputs}
                styleSettings={bollingerSettings.style}
              />
            )}
            <BollingerSettings
              settings={bollingerSettings}
              onSettingsChange={handleSettingsChange}
              isOpen={isSettingsOpen}
              onClose={handleCloseSettings}
            />
          </>
        )}
      </div>
    </div>
  );
}
