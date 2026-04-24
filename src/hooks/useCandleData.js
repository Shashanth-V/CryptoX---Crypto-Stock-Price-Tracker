import { useEffect, useMemo, useState } from 'react';

const intervalMinutes = {
  '1m': 1,
  '5m': 5,
  '15m': 15,
  '1H': 60,
  '4H': 240,
  '1D': 1440,
  '1W': 10080,
};

const createCandles = (seedPrice, range) => {
  const points = 200;
  const mins = intervalMinutes[range] || 15;
  const now = Date.now();
  let current = seedPrice;
  const rows = [];

  for (let i = points - 1; i >= 0; i -= 1) {
    const t = now - i * mins * 60000;
    const open = current;
    const move = (Math.random() - 0.47) * 0.018;
    const close = open * (1 + move);
    const high = Math.max(open, close) * (1 + Math.random() * 0.006);
    const low = Math.min(open, close) * (1 - Math.random() * 0.006);
    const volume = Math.round((Math.random() * 0.85 + 0.15) * 1000000);
    rows.push({ x: t, o: Number(open.toFixed(2)), h: Number(high.toFixed(2)), l: Number(low.toFixed(2)), c: Number(close.toFixed(2)), v: volume });
    current = close;
  }

  return rows;
};

export function useCandleData(symbol, range, seedPrice) {
  // [useState]
  const [candles, setCandles] = useState([]);

  useEffect(() => {
    // [useEffect]
    setCandles(createCandles(seedPrice || 100, range));
  }, [symbol, range, seedPrice]);

  const volume = useMemo(() => candles.map((c) => ({ x: c.x, y: c.v })), [candles]);

  return { candles, volume };
}

export default useCandleData;
