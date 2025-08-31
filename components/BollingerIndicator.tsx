'use client';

import React, { useEffect, useRef } from 'react';
import { BollingerBandsOptions, BollingerStyleSettings, OHLCV } from '../lib/types';
import { computeBollingerBands } from '../lib/indicators/bollinger';

interface BollingerIndicatorProps {
  chart: any;
  data: OHLCV[];
  options: BollingerBandsOptions;
  styleSettings: BollingerStyleSettings;
}

const BollingerIndicator: React.FC<BollingerIndicatorProps> = ({
  chart,
  data,
  options,
  styleSettings,
}) => {
  const indicatorRefs = useRef<{ upper: any; middle: any; lower: any }>({
    upper: null,
    middle: null,
    lower: null,
  });

  // Function to create/update indicators
  const createOrUpdateIndicators = () => {
    if (!chart || !data.length) return;

    console.log('🔄 BollingerIndicator: Creating/updating indicators...');
    console.log('📊 Chart instance:', chart);
    console.log('📈 Data points:', data.length);
    console.log('⚙️ Options:', options);
    console.log('🎨 Style settings:', styleSettings);

    // Debug: Check what methods are available on the chart
    console.log('🔍 Available chart methods:', Object.getOwnPropertyNames(chart));
    console.log('🔍 Chart prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(chart)));

    try {
      const bollingerData = computeBollingerBands(data, options);
      console.log('🧮 Computed Bollinger data:', bollingerData.length, 'points');

      // Remove previous indicators
      Object.values(indicatorRefs.current).forEach((ind) => {
        if (ind) {
          try {
            // Try different removal methods available in KLineCharts v9
            if (typeof chart.removeIndicator === 'function') {
              chart.removeIndicator(ind);
            } else if (typeof chart.removeOverlay === 'function') {
              chart.removeOverlay(ind);
            } else if (typeof chart.removeLine === 'function') {
              chart.removeLine(ind);
            } else if (typeof chart.removeShape === 'function') {
              chart.removeShape(ind);
            }
          } catch (e) {
            console.warn('Failed to remove indicator:', e);
          }
        }
      });
      indicatorRefs.current = { upper: null, middle: null, lower: null };

      // Try to create indicators using KLineCharts v9 API
      try {
        // For KLineCharts v9, we need to use the correct API methods
        // Let's try using createShape or similar methods
        
        // Upper Band
        if (styleSettings.upper.visible) {
          const upperData = bollingerData
            .filter(point => point.upper !== null)
            .map((point) => ({
              timestamp: point.timestamp,
              value: point.upper,
            }));

          if (upperData.length > 0) {
            try {
              console.log('📈 Creating upper band indicator...');
              console.log('🎨 Upper band color:', styleSettings.upper.color);
              console.log('🎨 Upper band width:', styleSettings.upper.lineWidth);
              console.log('🎨 Upper band style:', styleSettings.upper.lineStyle);
              
              // Try to create a line shape for the upper band
              if (typeof chart.createShape === 'function') {
                const upperIndicator = chart.createShape('line', {
                  points: upperData.map(d => ({ timestamp: d.timestamp, value: d.value })),
                  styles: {
                    color: styleSettings.upper.color,
                    size: styleSettings.upper.lineWidth,
                    style: styleSettings.upper.lineStyle === 'dashed' ? 'dash' : 
                           styleSettings.upper.lineStyle === 'dotted' ? 'dot' : 'solid',
                  }
                });

                if (upperIndicator) {
                  indicatorRefs.current.upper = upperIndicator;
                  console.log('✅ Upper indicator created successfully with createShape');
                } else {
                  console.warn('❌ Upper indicator creation returned null');
                }
              } else if (typeof chart.addShape === 'function') {
                const upperIndicator = chart.addShape('line', {
                  points: upperData.map(d => ({ timestamp: d.timestamp, value: d.value })),
                  styles: {
                    color: styleSettings.upper.color,
                    size: styleSettings.upper.lineWidth,
                    style: styleSettings.upper.lineStyle === 'dashed' ? 'dash' : 
                           styleSettings.upper.lineStyle === 'dotted' ? 'dot' : 'solid',
                  }
                });

                if (upperIndicator) {
                  indicatorRefs.current.upper = upperIndicator;
                  console.log('✅ Upper indicator created successfully with addShape');
                } else {
                  console.warn('❌ Upper indicator creation returned null');
                }
              } else {
                console.log('⚠️ No suitable method found for creating upper indicator');
              }
            } catch (e) {
              console.warn('Failed to create upper indicator:', e);
            }
          }
        }

        // Middle SMA
        if (styleSettings.middle.visible) {
          const middleData = bollingerData
            .filter(point => point.basis !== null)
            .map((point) => ({
              timestamp: point.timestamp,
              value: point.basis,
            }));

          if (middleData.length > 0) {
            try {
              console.log('📈 Creating middle band indicator...');
              console.log('🎨 Middle band color:', styleSettings.middle.color);
              console.log('🎨 Middle band width:', styleSettings.middle.lineWidth);
              console.log('🎨 Middle band style:', styleSettings.middle.lineStyle);
              
              if (typeof chart.createShape === 'function') {
                const middleIndicator = chart.createShape('line', {
                  points: middleData.map(d => ({ timestamp: d.timestamp, value: d.value })),
                  styles: {
                    color: styleSettings.middle.color,
                    size: styleSettings.middle.lineWidth,
                    style: styleSettings.middle.lineStyle === 'dashed' ? 'dash' : 
                           styleSettings.middle.lineStyle === 'dotted' ? 'dot' : 'solid',
                  }
                });

                if (middleIndicator) {
                  indicatorRefs.current.middle = middleIndicator;
                  console.log('✅ Middle indicator created successfully with createShape');
                } else {
                  console.warn('❌ Middle indicator creation returned null');
                }
              } else if (typeof chart.addShape === 'function') {
                const middleIndicator = chart.addShape('line', {
                  points: middleData.map(d => ({ timestamp: d.timestamp, value: d.value })),
                  styles: {
                    color: styleSettings.middle.color,
                    size: styleSettings.middle.lineWidth,
                    style: styleSettings.middle.lineStyle === 'dashed' ? 'dash' : 
                           styleSettings.middle.lineStyle === 'dotted' ? 'dot' : 'solid',
                  }
                });

                if (middleIndicator) {
                  indicatorRefs.current.middle = middleIndicator;
                  console.log('✅ Middle indicator created successfully with addShape');
                } else {
                  console.warn('❌ Middle indicator creation returned null');
                }
              } else {
                console.log('⚠️ No suitable method found for creating middle indicator');
              }
            } catch (e) {
              console.warn('Failed to create middle indicator:', e);
            }
          }
        }

        // Lower Band
        if (styleSettings.lower.visible) {
          const lowerData = bollingerData
            .filter(point => point.lower !== null)
            .map((point) => ({
              timestamp: point.timestamp,
              value: point.lower,
            }));

          if (lowerData.length > 0) {
            try {
              console.log('📈 Creating lower band indicator...');
              console.log('🎨 Lower band color:', styleSettings.lower.color);
              console.log('🎨 Lower band width:', styleSettings.lower.lineWidth);
              console.log('🎨 Lower band style:', styleSettings.lower.lineStyle);
              
              if (typeof chart.createShape === 'function') {
                const lowerIndicator = chart.createShape('line', {
                  points: lowerData.map(d => ({ timestamp: d.timestamp, value: d.value })),
                  styles: {
                    color: styleSettings.lower.color,
                    size: styleSettings.lower.lineWidth,
                    style: styleSettings.lower.lineStyle === 'dashed' ? 'dash' : 
                           styleSettings.lower.lineStyle === 'dotted' ? 'dot' : 'solid',
                  }
                });

                if (lowerIndicator) {
                  indicatorRefs.current.lower = lowerIndicator;
                  console.log('✅ Lower indicator created successfully with createShape');
                } else {
                  console.warn('❌ Lower indicator creation returned null');
                }
              } else if (typeof chart.addShape === 'function') {
                const lowerIndicator = chart.addShape('line', {
                  points: lowerData.map(d => ({ timestamp: d.timestamp, value: d.value })),
                  styles: {
                    color: styleSettings.lower.color,
                    size: styleSettings.lower.lineWidth,
                    style: styleSettings.lower.lineStyle === 'dashed' ? 'dash' : 
                           styleSettings.lower.lineStyle === 'dotted' ? 'dot' : 'solid',
                  }
                });

                if (lowerIndicator) {
                  indicatorRefs.current.lower = lowerIndicator;
                  console.log('✅ Lower indicator created successfully with addShape');
                } else {
                  console.warn('❌ Lower indicator creation returned null');
                }
              } else {
                console.log('⚠️ No suitable method found for creating lower indicator');
              }
            } catch (e) {
              console.warn('Failed to create lower indicator:', e);
            }
          }
        }

        console.log('🎯 All indicators processed. Current refs:', indicatorRefs.current);
      } catch (error) {
        console.error('❌ Error in indicator creation process:', error);
      }
    } catch (error) {
      console.error('❌ Error computing Bollinger Bands:', error);
    }
  };

  // Initial creation of indicators
  useEffect(() => {
    createOrUpdateIndicators();
  }, [chart, data]); // Only run when chart or data changes

  // Update indicators when settings change - this is the key fix
  useEffect(() => {
    if (chart && data.length) {
      console.log('🔄 Settings changed, updating indicators...');
      console.log('🎨 New style settings:', styleSettings);
      createOrUpdateIndicators();
    }
  }, [options, styleSettings, chart, data]); // Include all dependencies to ensure updates

  return null; // This component doesn't render anything visible
};

export default BollingerIndicator;
