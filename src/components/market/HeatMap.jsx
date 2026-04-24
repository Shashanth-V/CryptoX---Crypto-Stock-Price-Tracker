import React from 'react';

function colorForChange(change) {
  if (change > 5) return '#0d5c43';
  if (change > 0) return '#0e7a57';
  if (change === 0) return '#2a2e39';
  if (change > -5) return '#7b2f3b';
  return '#5a1f2a';
}

function HeatMap({ assets }) {
  return (
    <section className="panel">
      <h3>Market Heat Map</h3>
      <div className="heat-grid">
        {assets.map((a) => (
          <div
            key={a.symbol}
            className="heat-cell"
            style={{
              backgroundColor: colorForChange(a.change24h),
              gridRowEnd: `span ${Math.max(1, Math.round(a.marketCap / 200000000000))}`,
            }}
            title={`${a.name} ${a.change24h.toFixed(2)}%`}
          >
            <strong>{a.symbol}</strong>
            <span>{a.change24h.toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeatMap;
