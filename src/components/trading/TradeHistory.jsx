import React, { useEffect, useState } from 'react';

const makeTrade = (price) => {
  const side = Math.random() > 0.5 ? 'buy' : 'sell';
  const p = Number((price * (1 + (Math.random() - 0.5) * 0.006)).toFixed(2));
  return {
    id: `${Date.now()}-${Math.random()}`,
    time: new Date().toLocaleTimeString(),
    price: p,
    amount: Number((Math.random() * 1.8 + 0.02).toFixed(4)),
    side,
  };
};

function TradeHistory({ basePrice }) {
  // [useState]
  const [trades, setTrades] = useState(() => Array.from({ length: 18 }, () => makeTrade(basePrice)));

  useEffect(() => {
    // [useEffect]
    let alive = true;
    let timeout;
    const loop = () => {
      const delay = 1000 + Math.floor(Math.random() * 2000);
      timeout = setTimeout(() => {
        if (!alive) return;
        setTrades((prev) => [makeTrade(basePrice), ...prev].slice(0, 30));
        loop();
      }, delay);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(timeout);
    };
  }, [basePrice]);

  return (
    <section className="panel">
      <h3>Recent Trades</h3>
      <div className="trade-head"><span>Time</span><span>Price</span><span>Amount</span><span>Side</span></div>
      <div className="trade-feed">
        {trades.map((t) => (
          <div key={t.id} className="trade-row fade-in">
            <span>{t.time}</span>
            <span className={`price-num ${t.side === 'buy' ? 'text-gain' : 'text-loss'}`}>{t.price}</span>
            <span className="price-num">{t.amount}</span>
            <span>{t.side}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TradeHistory;
