import React from 'react';

function depthWidth(row, max) {
  return `${Math.max(8, (row.qty / (max || 1)) * 100).toFixed(1)}%`;
}

function OrderBook({ bids, asks, spread }) {
  const maxBid = Math.max(...bids.map((b) => b.qty), 1);
  const maxAsk = Math.max(...asks.map((a) => a.qty), 1);

  return (
    <section className="panel">
      <h3>Order Book</h3>
      <div className="book-head"><span>Price</span><span>Qty</span><span>Total</span></div>
      {asks.map((row) => (
        <div key={`ask-${row.price}`} className="book-row book-row--ask" style={{ background: `linear-gradient(to left, var(--red-dim) ${depthWidth(row, maxAsk)}, transparent 0)` }}>
          <span className="price-num text-loss">{row.price}</span><span className="price-num">{row.qty}</span><span className="price-num">{row.total}</span>
        </div>
      ))}
      <div className="book-spread">Spread <span className="price-num">{spread}</span></div>
      {bids.map((row) => (
        <div key={`bid-${row.price}`} className="book-row book-row--bid" style={{ background: `linear-gradient(to left, var(--green-dim) ${depthWidth(row, maxBid)}, transparent 0)` }}>
          <span className="price-num text-gain">{row.price}</span><span className="price-num">{row.qty}</span><span className="price-num">{row.total}</span>
        </div>
      ))}
    </section>
  );
}

export default OrderBook;
