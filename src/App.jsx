import React, { useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import Navbar from './components/layout/Navbar';
import StatusBar from './components/layout/StatusBar';
import TradingView from './pages/TradingView';
import Markets from './pages/Markets';
import Portfolio from './pages/Portfolio';
import Alerts from './pages/Alerts';
import News from './pages/News';
import useMarketData from './hooks/useMarketData';
import useLocalStorage from './hooks/useLocalStorage';
import useToast from './hooks/useToast';
import './styles/globals.css';
import './styles/Navbar.css';
import './styles/Trading.css';
import './styles/Markets.css';

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  CandlestickController,
  CandlestickElement
);

function ToastStack({ toasts, removeToast }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <article key={toast.id} className={`toast toast--${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => removeToast(toast.id)}>x</button>
          <span className="toast-progress" />
        </article>
      ))}
    </div>
  );
}

function App() {
  const { assets, loading, error, lastUpdated, refetch } = useMarketData();
  const { toasts, addToast, removeToast } = useToast();

  // [useState]
  const [watchlistRaw, setWatchlistRaw] = useLocalStorage('cryptox_watchlist', []);
  // [useState]
  const [portfolio, setPortfolio] = useLocalStorage('cryptox_portfolio', []);
  // [useState]
  const [alerts, setAlerts] = useLocalStorage('cryptox_alerts', []);
  // [useState]
  const [transactions, setTransactions] = useLocalStorage('cryptox_transactions', []);

  const watchlist = useMemo(() => new Set(watchlistRaw), [watchlistRaw]);

  const selectedAsset = assets[0];

  if (loading) {
    return <div className="full-center">Loading terminal data...</div>;
  }

  if (error) {
    return (
      <div className="full-center">
        <p>{error}</p>
        <button type="button" className="tab-btn tab-btn--active" onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar assets={assets} alertCount={alerts.filter((a) => a.status === 'Active').length} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/trade/BTC" replace />} />
            <Route
              path="/trade/:symbol"
              element={
                <TradingView
                  assets={assets}
                  watchlist={watchlist}
                  onToggleWatch={(symbol) => {
                    setWatchlistRaw((prev) => {
                      const next = new Set(prev);
                      if (next.has(symbol)) next.delete(symbol);
                      else next.add(symbol);
                      return Array.from(next);
                    });
                  }}
                  onOrderPlaced={(tx) => {
                    setTransactions((prev) => [tx, ...prev]);
                    if (tx.type === 'Buy') {
                      setPortfolio((prev) => {
                        const existing = prev.find((h) => h.symbol === tx.symbol);
                        if (existing) {
                          const newQty = existing.quantity + tx.quantity;
                          const newAvgPrice = (existing.quantity * existing.avgPrice + tx.quantity * tx.price) / newQty;
                          return prev.map((h) => h.symbol === tx.symbol ? { ...h, quantity: newQty, avgPrice: newAvgPrice } : h);
                        }
                        return [...prev, { id: `${Date.now()}`, symbol: tx.symbol, quantity: tx.quantity, avgPrice: tx.price, date: tx.date, notes: 'Purchased via trading' }];
                      });
                    } else if (tx.type === 'Sell') {
                      setPortfolio((prev) => {
                        const existing = prev.find((h) => h.symbol === tx.symbol);
                        if (!existing) return prev;
                        const remaining = existing.quantity - tx.quantity;
                        if (remaining <= 0) return prev.filter((h) => h.symbol !== tx.symbol);
                        return prev.map((h) => h.symbol === tx.symbol ? { ...h, quantity: remaining } : h);
                      });
                    }
                  }}
                  addToast={addToast}
                />
              }
            />
            <Route path="/markets" element={<Markets assets={assets} watchlist={watchlist} onToggleWatch={(symbol) => {
              setWatchlistRaw((prev) => {
                const next = new Set(prev);
                if (next.has(symbol)) next.delete(symbol);
                else next.add(symbol);
                return Array.from(next);
              });
            }} />} />
            <Route path="/portfolio" element={<Portfolio assets={assets} portfolio={portfolio} setPortfolio={setPortfolio} transactions={transactions} addToast={addToast} />} />
            <Route path="/alerts" element={<Alerts assets={assets} alerts={alerts} setAlerts={setAlerts} addToast={addToast} />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>
        <StatusBar selectedAsset={selectedAsset} lastUpdated={lastUpdated} />
        <ToastStack toasts={toasts} removeToast={removeToast} />
      </div>
    </BrowserRouter>
  );
}

export default App;
