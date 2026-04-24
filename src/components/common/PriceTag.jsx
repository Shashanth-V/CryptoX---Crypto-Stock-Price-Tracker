import React from 'react';

function PriceTag({ value, change, large = false }) {
  const cls = change >= 0 ? 'price-tag price-tag--up' : 'price-tag price-tag--down';
  return (
    <span className={large ? `${cls} price-tag--large price-num` : `${cls} price-num`}>
      {change >= 0 ? '▲' : '▼'} ${Number(value).toLocaleString()}
    </span>
  );
}

export default PriceTag;
