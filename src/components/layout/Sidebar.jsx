import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MiniSparkline from '../common/MiniSparkline';

const buildMini = (price) => Array.from({ length: 12 }, (_, i) => Number((price * (1 + Math.sin(i / 2) * 0.01)).toFixed(2)));

function TokenLogo({ symbol, size = 24 }) {
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/${symbol.toLowerCase()}.png`}
      alt={symbol}
      style={{ width: size, height: size, borderRadius: '50%', marginRight: '8px', verticalAlign: 'middle' }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  );
}

function Sidebar({ assets, watchlist }) {
  // [React Router]
  const navigate = useNavigate();
  // [React Router]
  const { symbol } = useParams();
  // [useState]
  const [query, setQuery] = useState('');
  // [useState]
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const q = query.toLowerCase();
      const matchQ = !q || a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
      const matchT = tab === 'all' || a.type === tab || (tab === 'favorites' && watchlist.has(a.symbol));
      return matchQ && matchT;
    }).slice(0, 40);
  }, [assets, query, tab, watchlist]);

  return (
    <aside className="trade-sidebar">
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter assets" className="sidebar-search" />
      <div className="sidebar-tabs">
        {['all', 'crypto', 'stock', 'favorites'].map((t) => (
          <button key={t} type="button" className={tab === t ? 'tab-btn tab-btn--active' : 'tab-btn'} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div className="sidebar-list">
        {filtered.map((asset) => (
          <button
            key={asset.symbol}
            type="button"
            className={symbol === asset.symbol ? 'side-row side-row--active' : 'side-row'}
            onClick={() => navigate(`/trade/${asset.symbol}`)}
          >
            <div>
              <TokenLogo symbol={asset.symbol} size={18} />
              <strong>{asset.symbol}</strong>
              <span>{asset.name}</span>
            </div>
            <div>
              <span className="price-num">${asset.price.toLocaleString()}</span>
              <small className={asset.change24h >= 0 ? 'text-gain' : 'text-loss'}>{asset.change24h.toFixed(2)}%</small>
            </div>
            <MiniSparkline points={buildMini(asset.price)} positive={asset.change24h >= 0} />
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
