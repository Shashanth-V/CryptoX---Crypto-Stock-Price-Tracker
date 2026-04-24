import React, { useMemo } from 'react';
import MarketTable from '../components/market/MarketTable';

function Markets({ assets, watchlist, onToggleWatch }) {
  const stats = useMemo(() => {
    const cap = assets.filter((a) => a.type === 'crypto').reduce((s, a) => s + a.marketCap, 0);
    const vol = assets.filter((a) => a.type === 'crypto').reduce((s, a) => s + a.volume24h, 0);
    const btc = assets.find((a) => a.symbol === 'BTC');
    const dom = btc ? ((btc.marketCap / cap) * 100).toFixed(2) : '0.00';
    return { cap, vol, dom };
  }, [assets]);

  return (
    <section className="page">
      <div className="stats-bar">
        <article className="stats-bar__item"><span>Market Cap</span><strong className="price-num">${(stats.cap / 1e12).toFixed(2)}T</strong></article>
        <article className="stats-bar__item"><span>BTC Dominance</span><strong>{stats.dom}%</strong></article>
        <article className="stats-bar__item"><span>24h Volume</span><strong className="price-num">${(stats.vol / 1e9).toFixed(2)}B</strong></article>
      </div>
      <MarketTable assets={assets} watchlist={watchlist} onToggleWatch={onToggleWatch} />
    </section>
  );
}

export default Markets;
