import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function PortfolioPieChart({ holdings, assets }) {
  const rows = holdings.map((h) => {
    const a = assets.find((x) => x.symbol === h.symbol);
    return a ? { ...h, value: h.quantity * a.price, color: a.color, name: a.name } : null;
  }).filter(Boolean);

  const total = rows.reduce((s, r) => s + r.value, 0);

  const data = {
    labels: rows.map((r) => r.symbol),
    datasets: [{ data: rows.map((r) => r.value), backgroundColor: rows.map((r) => r.color) }],
  };

  if (rows.length === 0) {
    return (
      <section className="panel">
        <h3>Allocation</h3>
        <p className="status-text">No holdings yet. Add positions to see allocation.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <h3>Allocation</h3>
      <Doughnut data={data} options={{ plugins: { legend: { labels: { color: '#848e9c' } } } }} />
      <p className="price-num">Total ${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
    </section>
  );
}

export default PortfolioPieChart;
