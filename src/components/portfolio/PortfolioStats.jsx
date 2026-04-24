import React, { useMemo } from 'react';

function PortfolioStats({ holdings, assets }) {
  const metrics = useMemo(() => {
    const rows = holdings.map((h) => {
      const a = assets.find((x) => x.symbol === h.symbol);
      if (!a) return null;
      const value = h.quantity * a.price;
      const cost = h.quantity * h.avgPrice;
      return { symbol: h.symbol, value, cost, pnl: value - cost };
    }).filter(Boolean);

    const totalValue = rows.reduce((s, r) => s + r.value, 0);
    const totalCost = rows.reduce((s, r) => s + r.cost, 0);
    const pnl = totalValue - totalCost;
    const best = rows.sort((a, b) => b.pnl - a.pnl)[0];
    const worst = rows.sort((a, b) => a.pnl - b.pnl)[0];
    return { totalValue, pnl, all: pnl, best, worst };
  }, [holdings, assets]);

  return (
    <div className="portfolio-grid">
      <article className="panel"><span>Total Portfolio Value</span><strong className="price-num">${metrics.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></article>
      <article className="panel"><span>24h P&L</span><strong className={metrics.pnl >= 0 ? 'text-gain price-num' : 'text-loss price-num'}>${metrics.pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></article>
      <article className="panel"><span>All-time P&L</span><strong className={metrics.all >= 0 ? 'text-gain price-num' : 'text-loss price-num'}>${metrics.all.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></article>
      <article className="panel"><span>Best / Worst</span><strong>{metrics.best?.symbol || '-'} / {metrics.worst?.symbol || '-'}</strong></article>
    </div>
  );
}

export default PortfolioStats;
