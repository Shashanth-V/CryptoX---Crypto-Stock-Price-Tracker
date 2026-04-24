import React from 'react';

function toCsv(rows) {
  const head = 'Asset,Holdings,Avg Buy,Current Price,Value,PnL,PnL%,Allocation';
  const body = rows.map((r) => `${r.symbol},${r.quantity},${r.avgPrice},${r.currentPrice},${r.value},${r.pnl},${r.pnlPct},${r.allocation}`).join('\n');
  return `${head}\n${body}`;
}

function TokenLogo({ symbol, size = 24 }) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/${symbol.toLowerCase()}.png`}
      alt={symbol}
      style={{ width: size, height: size, borderRadius: '50%', marginRight: '6px', verticalAlign: 'middle' }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}

function HoldingsTable({ rows, onRemove, onEdit }) {
  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'holdings.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel">
      <div className="table-head-tools"><h3>Holdings</h3><button type="button" className="tab-btn" onClick={exportCsv}>Export CSV</button></div>
      <div className="table-scroll">
        <table className="market-table">
          <thead><tr><th>Asset</th><th>Holdings</th><th>Avg Buy</th><th>Current</th><th>Value</th><th>P&L ($)</th><th>P&L %</th><th>Allocation</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="9" className="status-text">No holdings yet.</td>
              </tr>
            ) : rows.map((r) => (
              <tr key={r.id}>
                <td><TokenLogo symbol={r.symbol} size={18} />{r.symbol}</td>
                <td className="price-num">{r.quantity.toLocaleString()}</td>
                <td className="price-num">{r.avgPrice.toLocaleString()}</td>
                <td className="price-num">{r.currentPrice.toLocaleString()}</td>
                <td className="price-num">{r.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className={r.pnl >= 0 ? 'text-gain price-num' : 'text-loss price-num'}>{r.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                <td className={r.pnlPct >= 0 ? 'text-gain price-num' : 'text-loss price-num'}>{r.pnlPct.toFixed(2)}%</td>
                <td><div className="alloc-bar"><span style={{ width: `${Math.min(100, Math.max(2, r.allocation))}%` }} /></div></td>
                <td><button type="button" className="tab-btn" onClick={() => onEdit(r)}>Edit</button> <button type="button" className="tab-btn" onClick={() => onRemove(r.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default HoldingsTable;
