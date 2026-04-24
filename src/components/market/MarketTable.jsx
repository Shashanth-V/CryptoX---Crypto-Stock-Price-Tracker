import React, { useMemo, useState } from 'react';
import AssetRow from './AssetRow';

const filters = ['All', 'Top Gainers', 'Top Losers', 'New Listings', 'DeFi', 'Stocks'];

function sortAssets(items, sortConfig) {
  const sorted = [...items].sort((a, b) => {
    const left = a[sortConfig.key];
    const right = b[sortConfig.key];
    if (left < right) return sortConfig.direction === 'asc' ? -1 : 1;
    if (left > right) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  return sorted;
}

function MarketTable({ assets, watchlist, onToggleWatch }) {
  // [useState]
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'desc' });
  // [useState]
  const [activeFilter, setActiveFilter] = useState('All');
  // [useState]
  const [page, setPage] = useState(1);

  const view = useMemo(() => {
    let filtered = [...assets];
    if (activeFilter === 'Top Gainers') filtered = filtered.filter((a) => a.change24h > 0).sort((a, b) => b.change24h - a.change24h);
    if (activeFilter === 'Top Losers') filtered = filtered.filter((a) => a.change24h < 0).sort((a, b) => a.change24h - b.change24h);
    if (activeFilter === 'Stocks') filtered = filtered.filter((a) => a.type === 'stock');
    if (activeFilter === 'DeFi') filtered = filtered.filter((a) => ['UNI', 'AAVE', 'MKR', 'SNX', 'CRV', '1INCH'].includes(a.symbol));
    if (activeFilter === 'New Listings') filtered = filtered.slice().sort((a, b) => b.rank - a.rank);
    return sortAssets(filtered, sortConfig);
  }, [assets, activeFilter, sortConfig]);

  const perPage = 20;
  const maxPage = Math.max(1, Math.ceil(view.length / perPage));
  const paged = view.slice((page - 1) * perPage, page * perPage);

  const sortBy = (key) => {
    setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc' }));
  };

  return (
    <section className="panel">
      <div className="table-filters">
        {filters.map((f) => <button key={f} type="button" className={activeFilter === f ? 'tab-btn tab-btn--active' : 'tab-btn'} onClick={() => { setActiveFilter(f); setPage(1); }}>{f}</button>)}
      </div>
      <table className="market-table">
        <thead>
          <tr>
            <th onClick={() => sortBy('rank')}>#</th>
            <th onClick={() => sortBy('name')}>Name</th>
            <th onClick={() => sortBy('price')}>Price</th>
            <th onClick={() => sortBy('change24h')}>24h %</th>
            <th onClick={() => sortBy('change7d')}>7d %</th>
            <th onClick={() => sortBy('marketCap')}>Market Cap</th>
            <th onClick={() => sortBy('volume24h')}>Volume</th>
            <th>Circulating Supply</th>
            <th>7d Chart</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((asset, idx) => (
            <AssetRow key={asset.symbol} asset={asset} index={(page - 1) * perPage + idx + 1} isWatched={watchlist.has(asset.symbol)} onToggleWatch={onToggleWatch} />
          ))}
        </tbody>
      </table>
      <div className="pager">
        <button type="button" className="tab-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>{page} / {maxPage}</span>
        <button type="button" className="tab-btn" disabled={page >= maxPage} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </section>
  );
}

export default MarketTable;
