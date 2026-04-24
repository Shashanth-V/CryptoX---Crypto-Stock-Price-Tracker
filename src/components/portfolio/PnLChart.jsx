import React from 'react';
import { Line } from 'react-chartjs-2';

function PnLChart({ baseValue = 10000 }) {
  const points = Array.from({ length: 30 }, (_, i) => Number((baseValue * (1 + Math.sin(i / 4) * 0.06 + i * 0.002)).toFixed(2)));
  const data = {
    labels: points.map((_, i) => i + 1),
    datasets: [{ data: points, borderColor: '#f0b90b', pointRadius: 0, fill: true, backgroundColor: 'rgba(240,185,11,0.15)' }],
  };
  return (
    <section className="panel">
      <h3>Portfolio Value (30D)</h3>
      <div style={{ height: 220 }}>
        <Line data={data} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#848e9c' }, grid: { color: 'rgba(255,255,255,0.04)' } }, y: { ticks: { color: '#848e9c' }, grid: { color: 'rgba(255,255,255,0.04)' } } } }} />
      </div>
    </section>
  );
}

export default PnLChart;
