'use client';

import React, { useEffect, useRef } from 'react';
import { OHLCV } from '../lib/types';

interface SimpleChartProps {
  data: OHLCV[];
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle HiDPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Chart dimensions
    const padding = 60;
    const chartWidth = rect.width - 2 * padding;
    const chartHeight = rect.height - 2 * padding;
    const candleWidth = Math.max(2, chartWidth / data.length - 3);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Find price range
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.2)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * chartWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, rect.height - padding);
      ctx.stroke();
    }

    // Draw candlesticks
    data.forEach((candle, index) => {
      const x = padding + (index / data.length) * chartWidth;
      const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
      const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
      const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;

      const isGreen = candle.close >= candle.open;
      const color = isGreen ? '#22c55e' : '#ef4444';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const bodyHeight = Math.max(2, Math.abs(closeY - openY));
      const bodyY = Math.min(openY, closeY);

      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
      ctx.strokeStyle = color;
      ctx.strokeRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
    });

    // Price labels
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (i / 5) * priceRange;
      const y = padding + (i / 5) * chartHeight;
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(price.toFixed(2), padding - 10, y + 4);
    }

    // Time labels
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const index = Math.floor((i / 5) * (data.length - 1));
      const x = padding + (i / 5) * chartWidth;
      const date = new Date(data[index].timestamp);
      const text = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(text, x, rect.height - padding + 20);
    }

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Price Chart', rect.width / 2, 30);

    // Volume bars
    const volumeHeight = 60;
    const volumeY = rect.height - volumeHeight;
    const maxVolume = Math.max(...data.map(d => d.volume));
    data.forEach((candle, index) => {
      const x = padding + (index / data.length) * chartWidth;
      const barHeight = (candle.volume / maxVolume) * (volumeHeight - 20);
      const y = volumeY + (volumeHeight - 20) - barHeight;
      ctx.fillStyle = candle.close >= candle.open ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
      ctx.fillRect(x - candleWidth / 2, y, candleWidth, barHeight);
    });

  }, [data]);

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
      {/* Info panels removed as requested */}
    </div>
  );
};

export default SimpleChart;
