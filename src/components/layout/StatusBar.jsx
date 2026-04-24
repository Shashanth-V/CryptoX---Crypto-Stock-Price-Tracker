import React, { useEffect, useMemo, useState } from 'react';

function StatusBar({ selectedAsset }) {
  // [useState]
  const [serverTime, setServerTime] = useState(new Date());

  // [useEffect]
  useEffect(() => {
    const id = setInterval(() => setServerTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const priceText = useMemo(() => {
    if (!selectedAsset) return 'N/A';
    return `${selectedAsset.symbol} $${selectedAsset.price.toLocaleString()}`;
  }, [selectedAsset]);

  return (
    <footer className="status-bar">
      <span>Server: {serverTime.toLocaleTimeString()}</span>
      <span>API: <i className="dot dot--live" /> Live</span>
      <span>WebSocket: <i className="dot dot--live" /> Connected</span>
      <span className="price-num">{priceText}</span>
    </footer>
  );
}

export default StatusBar;
