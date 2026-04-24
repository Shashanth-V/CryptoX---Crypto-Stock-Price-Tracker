import React, { useEffect, useMemo, useState } from 'react';
import AlertModal from '../components/alerts/AlertModal';
import AlertList from '../components/alerts/AlertList';

function Alerts({ assets, alerts, setAlerts, addToast }) {
  // [useState]
  const [open, setOpen] = useState(false);
  // [useState]
  const [history, setHistory] = useState([]);

  const assetBySymbol = useMemo(() => Object.fromEntries(assets.map((a) => [a.symbol, a])), [assets]);

  // [useEffect]
  useEffect(() => {
    const id = setInterval(() => {
      setAlerts((prev) =>
        prev.map((a) => {
          if (a.status === 'Triggered') return a;
          const current = assetBySymbol[a.symbol]?.price || a.currentPrice;
          let triggered = false;
          if (a.type === 'Price Above' && current >= Number(a.target)) triggered = true;
          if (a.type === 'Price Below' && current <= Number(a.target)) triggered = true;
          if (a.type === '% Change Up' && (assetBySymbol[a.symbol]?.change24h || 0) >= Number(a.target)) triggered = true;
          if (a.type === '% Change Down' && (assetBySymbol[a.symbol]?.change24h || 0) <= -Math.abs(Number(a.target))) triggered = true;
          if (a.type === 'Volume Spike' && (assetBySymbol[a.symbol]?.volume24h || 0) >= Number(a.target)) triggered = true;

          if (triggered) {
            addToast(`Alert triggered for ${a.symbol}`, 'warning');
            setHistory((h) => [{ ...a, status: 'Triggered', triggeredAt: Date.now() }, ...h]);
            return { ...a, currentPrice: current, status: 'Triggered' };
          }
          return { ...a, currentPrice: current };
        })
      );
    }, 5000);
    return () => clearInterval(id);
  }, [addToast, assetBySymbol, setAlerts]);

  return (
    <section className="page">
      <div className="table-head-tools"><h2>Price Alerts</h2><button type="button" className="tab-btn tab-btn--active" onClick={() => setOpen(true)}>Create Alert</button></div>
      <AlertList alerts={alerts} onDelete={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))} />
      <section className="panel">
        <h3>Alert History</h3>
        <table className="market-table"><thead><tr><th>Asset</th><th>Condition</th><th>Target</th><th>Triggered</th></tr></thead><tbody>
          {history.map((h) => <tr key={`${h.id}-${h.triggeredAt}`}><td>{h.symbol}</td><td>{h.type}</td><td>{h.target}</td><td>{new Date(h.triggeredAt).toLocaleString()}</td></tr>)}
        </tbody></table>
      </section>
      <AlertModal
        open={open}
        onClose={() => setOpen(false)}
        assets={assets}
        onCreate={(draft) => {
          setAlerts((prev) => [
            ...prev,
            { id: `${Date.now()}`, ...draft, target: Number(draft.target || 0), currentPrice: assetBySymbol[draft.symbol]?.price || 0, status: 'Active', createdAt: Date.now() },
          ]);
          addToast('Alert created', 'success');
        }}
      />
    </section>
  );
}

export default Alerts;
