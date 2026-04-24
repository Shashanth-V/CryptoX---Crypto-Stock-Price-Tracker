import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import IndicatorBar from '../components/trading/IndicatorBar';
import CandlestickChart from '../components/trading/CandlestickChart';
import OrderBook from '../components/trading/OrderBook';
import TradeHistory from '../components/trading/TradeHistory';
import OrderForm from '../components/trading/OrderForm';
import PriceTag from '../components/common/PriceTag';
import useOrderBook from '../hooks/useOrderBook';
import useCandleData from '../hooks/useCandleData';

function TradingView({ assets, watchlist, onToggleWatch, onOrderPlaced, addToast }) {
  // [React Router]
  const { symbol } = useParams();
  // [React Router]
  const navigate = useNavigate();

  const selected = useMemo(() => assets.find((a) => a.symbol === symbol) || assets[0], [assets, symbol]);

  // [useState]
  const [chartRange, setChartRange] = useState('15m');
  // [useState]
  const [activeIndicators, setActiveIndicators] = useState(['MA7', 'MA25', 'Volume']);
  // [useState]
  const [flashClass, setFlashClass] = useState('');
  // [useState]
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { bids, asks, spread } = useOrderBook(selected?.symbol, selected?.price);
  const { candles, volume } = useCandleData(selected?.symbol, chartRange, selected?.price);

  useEffect(() => {
    // [useEffect]
    console.log(`Mounted: TradingView for ${symbol}`);
  }, [symbol]);

  useEffect(() => {
    // [useEffect]
    if (!selected) return;
    document.title = `${selected.symbol} $${selected.price.toLocaleString()} | CryptoX`;
    setFlashClass(selected.change24h >= 0 ? 'flash-up' : 'flash-down');
    const id = setTimeout(() => setFlashClass(''), 500);
    return () => clearTimeout(id);
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    if (symbol !== selected.symbol) navigate(`/trade/${selected.symbol}`);
  }, [navigate, selected, symbol]);

  if (!selected) return null;

  return (
    <section className="trade-page">
      <button type="button" className="drawer-toggle" onClick={() => setSidebarOpen((v) => !v)}>☰ Markets</button>
      <div className={sidebarOpen ? 'sidebar-drawer sidebar-drawer--open' : 'sidebar-drawer'}>
        <Sidebar assets={assets} watchlist={watchlist} />
      </div>
      <div className="trade-grid">
        <Sidebar assets={assets} watchlist={watchlist} />

        <main className="trade-main">
          <header className="price-header panel">
            <div>
              <img
                src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/${selected.symbol.toLowerCase()}.png`}
                alt={selected.symbol}
                style={{ width: 32, height: 32, borderRadius: '50%', marginRight: '12px', verticalAlign: 'middle' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h2 style={{ display: 'inline-block' }}>{selected.symbol}/USDT</h2>
              <p>{selected.name}</p>
            </div>
            <div className={`price-head-price ${flashClass}`}>
              <span className="price-num">${selected.price.toLocaleString()}</span>
              <PriceTag value={selected.price} change={selected.change24h} />
            </div>
            <div><span>24h High / Low</span><strong className="price-num">{selected.high24h} / {selected.low24h}</strong></div>
            <div><span>24h Volume</span><strong className="price-num">${selected.volume24h.toLocaleString()}</strong></div>
            <div><span>Market Cap</span><strong className="price-num">${selected.marketCap.toLocaleString()}</strong></div>
          </header>

          <div className="range-row">
            {['1m', '5m', '15m', '1H', '4H', '1D', '1W'].map((r) => (
              <button key={r} type="button" className={chartRange === r ? 'tab-btn tab-btn--active' : 'tab-btn'} onClick={() => setChartRange(r)}>{r}</button>
            ))}
          </div>

          <CandlestickChart candles={candles} volume={volume} activeIndicators={activeIndicators} />

          <IndicatorBar activeIndicators={activeIndicators} setActiveIndicators={setActiveIndicators} />

          <OrderForm
            symbol={selected.symbol}
            price={selected.price}
            onPlaced={(orderForm, total, fee) => {
              onOrderPlaced({
                id: `${Date.now()}`,
                date: new Date().toISOString(),
                symbol: selected.symbol,
                type: orderForm.side,
                quantity: Number(orderForm.amount),
                price: Number(orderForm.price),
                total,
                fee,
              });
              addToast(`${orderForm.side} ${selected.symbol} order submitted`, 'success');
            }}
          />
        </main>

        <aside className="trade-right">
          <OrderBook bids={bids} asks={asks} spread={spread} />
          <TradeHistory basePrice={selected.price} />
          <button type="button" className={watchlist.has(selected.symbol) ? 'tab-btn tab-btn--active' : 'tab-btn'} onClick={() => onToggleWatch(selected.symbol)}>
            {watchlist.has(selected.symbol) ? '★ In Watchlist' : '☆ Add to Watchlist'}
          </button>
        </aside>
      </div>
    </section>
  );
}

export default TradingView;
