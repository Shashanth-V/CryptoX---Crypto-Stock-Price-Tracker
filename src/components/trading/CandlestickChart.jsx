import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  CandlestickController,
  CandlestickElement
);

const movingAverage = (candles, period) => {
  const out = [];
  for (let i = 0; i < candles.length; i += 1) {
    const start = Math.max(0, i - period + 1);
    const range = candles.slice(start, i + 1);
    const avg = range.reduce((acc, c) => acc + c.c, 0) / range.length;
    out.push({ x: candles[i].x, y: Number(avg.toFixed(2)) });
  }
  return out;
};

function CandlestickChart({ candles, volume, activeIndicators }) {
  const chartData = useMemo(() => {
    const sets = [
      {
        type: 'candlestick',
        label: 'OHLC',
        data: candles,
        borderColor: '#2a2e39',
      },
      {
        type: 'bar',
        label: 'Volume',
        data: volume,
        yAxisID: 'y1',
        backgroundColor: 'rgba(24,144,255,0.25)',
      },
    ];

    if (activeIndicators.includes('MA7')) {
      sets.push({ type: 'line', label: 'MA7', data: movingAverage(candles, 7), borderColor: '#f0b90b', pointRadius: 0, yAxisID: 'y' });
    }
    if (activeIndicators.includes('MA25')) {
      sets.push({ type: 'line', label: 'MA25', data: movingAverage(candles, 25), borderColor: '#9b59b6', pointRadius: 0, yAxisID: 'y' });
    }
    if (activeIndicators.includes('MA99')) {
      sets.push({ type: 'line', label: 'MA99', data: movingAverage(candles, 99), borderColor: '#1890ff', pointRadius: 0, yAxisID: 'y' });
    }
    return { datasets: sets };
  }, [candles, volume, activeIndicators]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { labels: { color: '#848e9c', boxWidth: 10 } },
      tooltip: {
        backgroundColor: '#1e222d',
        titleColor: '#f0b90b',
        bodyColor: '#eaecef',
      },
    },
    scales: {
      x: { type: 'time', grid: { color: 'var(--chart-grid)' }, ticks: { color: '#848e9c' } },
      y: { grid: { color: 'var(--chart-grid)' }, ticks: { color: '#848e9c' } },
      y1: { position: 'right', grid: { display: false }, ticks: { color: '#474d57' } },
    },
  };

  return <div className="chart-shell"><Chart type="candlestick" data={chartData} options={options} /></div>;
}

export default CandlestickChart;
