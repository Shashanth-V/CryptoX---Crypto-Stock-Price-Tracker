import React from 'react';
import { useNavigate } from 'react-router-dom';
import MiniSparkline from '../common/MiniSparkline';

const spark = (base) => Array.from({ length: 22 }, (_, i) => base * (1 + Math.sin(i / 2.4) * 0.02));

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

function AssetRow({ asset, index, isWatched, onToggleWatch }) {
  // [React Router]
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(`/trade/${asset.symbol}`)}>
      <td>{index}</td>
      <td><button type="button" className="ghost" onClick={(e) => { e.stopPropagation(); onToggleWatch(asset.symbol); }}>{isWatched ? '★' : '☆'}</button> <TokenLogo symbol={asset.symbol} size={20} />{asset.name} ({asset.symbol})</td>
      <td className="price-num">${asset.price.toLocaleString()}</td>
      <td className={asset.change24h >= 0 ? 'text-gain' : 'text-loss'}>{asset.change24h.toFixed(2)}%</td>
      <td className={asset.change7d >= 0 ? 'text-gain' : 'text-loss'}>{asset.change7d.toFixed(2)}%</td>
      <td className="price-num">${asset.marketCap.toLocaleString()}</td>
      <td className="price-num">${asset.volume24h.toLocaleString()}</td>
      <td>{asset.supply}</td>
      <td><MiniSparkline points={spark(asset.price)} positive={asset.change7d >= 0} /></td>
      <td><button type="button" className="trade-btn" onClick={(e) => { e.stopPropagation(); navigate(`/trade/${asset.symbol}`); }}>Trade</button></td>
    </tr>
  );
}

export default AssetRow;
