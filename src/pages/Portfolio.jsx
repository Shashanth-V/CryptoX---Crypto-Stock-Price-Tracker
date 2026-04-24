import React, { useMemo, useState } from 'react';
import Modal from '../components/common/Modal';
import PortfolioStats from '../components/portfolio/PortfolioStats';
import PortfolioPieChart from '../components/portfolio/PortfolioPieChart';
import PnLChart from '../components/portfolio/PnLChart';
import HoldingsTable from '../components/portfolio/HoldingsTable';

function Portfolio({ assets, portfolio, setPortfolio, transactions, addToast }) {
  // [useState]
  const [draft, setDraft] = useState({ symbol: 'BTC', quantity: '', avgPrice: '', date: '', notes: '' });
  // [useState]
  const [editing, setEditing] = useState(null);
  // [useState]
  const [txFilter, setTxFilter] = useState('All');

  const rows = useMemo(() => {
    const totalValue = portfolio.reduce((sum, h) => {
      const a = assets.find((x) => x.symbol === h.symbol);
      return sum + (a ? h.quantity * a.price : 0);
    }, 0);

    return portfolio.map((h) => {
      const asset = assets.find((x) => x.symbol === h.symbol);
      const currentPrice = asset?.price || h.avgPrice;
      const value = currentPrice * h.quantity;
      const pnl = value - h.avgPrice * h.quantity;
      const pnlPct = (pnl / (h.avgPrice * h.quantity || 1)) * 100;
      const allocation = totalValue ? (value / totalValue) * 100 : 0;
      return { ...h, currentPrice, value, pnl, pnlPct, allocation };
    });
  }, [portfolio, assets]);

  const submit = (e) => {
    e.preventDefault();
    if (Number(draft.quantity) <= 0 || Number(draft.avgPrice) <= 0) return;
    setPortfolio((prev) => [...prev, { id: `${Date.now()}`, symbol: draft.symbol, quantity: Number(draft.quantity), avgPrice: Number(draft.avgPrice), date: draft.date, notes: draft.notes }]);
    setDraft((p) => ({ ...p, quantity: '', avgPrice: '', date: '', notes: '' }));
    addToast('Holding added', 'success');
  };

  const filteredTx = transactions.filter((t) => txFilter === 'All' || t.type === txFilter || t.symbol === txFilter);

  return (
    <section className="page">
      <PortfolioStats holdings={portfolio} assets={assets} />
      <div className="portfolio-layout">
        <PortfolioPieChart holdings={portfolio} assets={assets} />
        <PnLChart baseValue={rows.reduce((s, r) => s + r.value, 10000)} />
      </div>

      <section className="panel">
        <h3>Add Holding</h3>
        <form className="portfolio-form" onSubmit={submit}>
          <select value={draft.symbol} onChange={(e) => setDraft((p) => ({ ...p, symbol: e.target.value }))}>{assets.slice(0, 55).map((a) => <option key={a.symbol}>{a.symbol}</option>)}</select>
          <input className="price-num" placeholder="Quantity" value={draft.quantity} onChange={(e) => setDraft((p) => ({ ...p, quantity: e.target.value }))} />
          <input className="price-num" placeholder="Avg Buy Price" value={draft.avgPrice} onChange={(e) => setDraft((p) => ({ ...p, avgPrice: e.target.value }))} />
          <input type="date" value={draft.date} onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))} />
          <input placeholder="Notes" value={draft.notes} onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))} />
          <button type="submit">Add</button>
        </form>
      </section>

      <HoldingsTable
        rows={rows}
        onRemove={(id) => {
          if (window.confirm('Remove holding?')) {
            setPortfolio((prev) => prev.filter((r) => r.id !== id));
          }
        }}
        onEdit={(row) => setEditing(row)}
      />

      <section className="panel">
        <div className="table-head-tools">
          <h3>Transaction History</h3>
          <select value={txFilter} onChange={(e) => setTxFilter(e.target.value)}>
            <option>All</option><option>Buy</option><option>Sell</option>
            {Array.from(new Set(transactions.map((t) => t.symbol))).map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="table-scroll">
          <table className="market-table"><thead><tr><th>Date</th><th>Asset</th><th>Type</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>
            {filteredTx.length === 0 ? (
              <tr><td colSpan="6" className="status-text">No transactions yet.</td></tr>
            ) : filteredTx.map((t) => <tr key={t.id}><td>{new Date(t.date).toLocaleString()}</td><td>{t.symbol}</td><td>{t.type}</td><td className="price-num">{t.quantity.toLocaleString()}</td><td className="price-num">{Number(t.price || 0).toLocaleString()}</td><td className="price-num">{Number(t.total || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td></tr>)}
          </tbody></table>
        </div>
      </section>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit Holding">
        {editing ? (
          <form className="alert-form" onSubmit={(e) => {
            e.preventDefault();
            setPortfolio((prev) => prev.map((p) => p.id === editing.id ? editing : p));
            setEditing(null);
          }}>
            <label>Quantity</label>
            <input className="price-num" value={editing.quantity} onChange={(e) => setEditing((p) => ({ ...p, quantity: Number(e.target.value) }))} />
            <label>Avg Price</label>
            <input className="price-num" value={editing.avgPrice} onChange={(e) => setEditing((p) => ({ ...p, avgPrice: Number(e.target.value) }))} />
            <button type="submit" className="submit-order submit-order--buy">Save</button>
          </form>
        ) : null}
      </Modal>
    </section>
  );
}

export default Portfolio;
