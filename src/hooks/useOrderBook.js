import { useEffect, useMemo, useState } from 'react';

const buildBook = (price) => {
  const bids = [];
  const asks = [];
  for (let i = 0; i < 15; i += 1) {
    const bidPrice = Number((price * (1 - 0.0005 * (i + 1))).toFixed(2));
    const askPrice = Number((price * (1 + 0.0005 * (i + 1))).toFixed(2));
    const bidQty = Number((Math.random() * 2.4 + 0.05).toFixed(4));
    const askQty = Number((Math.random() * 2.4 + 0.05).toFixed(4));
    bids.push({ price: bidPrice, qty: bidQty, total: Number((bidPrice * bidQty).toFixed(2)) });
    asks.push({ price: askPrice, qty: askQty, total: Number((askPrice * askQty).toFixed(2)) });
  }
  return { bids, asks };
};

export function useOrderBook(symbol, price = 100) {
  // [useState]
  const [orderBook, setOrderBook] = useState(() => buildBook(price));
  // [useState]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // [useEffect]
    setLoading(true);
    setOrderBook(buildBook(price));
    const id = setInterval(() => {
      const drift = (Math.random() - 0.5) * 0.004;
      setOrderBook(buildBook(price * (1 + drift)));
      setLoading(false);
    }, 2000);
    return () => clearInterval(id);
  }, [symbol, price]);

  const spread = useMemo(() => {
    if (!orderBook.asks.length || !orderBook.bids.length) return 0;
    return Number((orderBook.asks[0].price - orderBook.bids[0].price).toFixed(2));
  }, [orderBook]);

  return { bids: orderBook.bids, asks: orderBook.asks, spread, loading };
}

export default useOrderBook;
