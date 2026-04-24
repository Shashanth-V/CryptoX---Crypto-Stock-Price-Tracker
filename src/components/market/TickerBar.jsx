import React from 'react';
import PriceTag from '../common/PriceTag';

function TickerBar({ assets = [] }) {
  const tape = [...assets, ...assets].slice(0, 24);
  return (
    <div className="ticker-bar">
      <div className="ticker-bar__track">
        {tape.map((asset, idx) => (
          <div key={`${asset.symbol}-${idx}`} className="ticker-item">
            <strong>{asset.symbol}</strong>
            <PriceTag value={asset.price} change={asset.change24h} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TickerBar;
