import React, { useMemo, useState } from 'react';

function OrderForm({ symbol, price, onPlaced }) {
  // [useState]
  const [orderForm, setOrderForm] = useState({ type: 'Limit', side: 'Buy', price: price, amount: '' });
  // [useState]
  const [error, setError] = useState('');

  const total = useMemo(() => Number(orderForm.price || 0) * Number(orderForm.amount || 0), [orderForm]);
  const fee = total * 0.001;

  const update = (patch) => setOrderForm((prev) => ({ ...prev, ...patch }));

  const submit = (e) => {
    e.preventDefault();
    if (Number(orderForm.amount) <= 0 || Number(orderForm.price) <= 0) {
      setError('Enter valid price and amount');
      return;
    }
    setError('');
    onPlaced(orderForm, total, fee);
  };

  return (
    <section className="panel order-form-wrap">
      <div className="form-tabs">
        {['Limit', 'Market', 'Stop-Limit'].map((t) => (
          <button key={t} type="button" className={orderForm.type === t ? 'tab-btn tab-btn--active' : 'tab-btn'} onClick={() => update({ type: t })}>{t}</button>
        ))}
      </div>
      <div className="form-tabs">
        {['Buy', 'Sell'].map((s) => (
          <button key={s} type="button" className={orderForm.side === s ? `side-btn side-btn--${s.toLowerCase()}` : 'side-btn'} onClick={() => update({ side: s })}>{s}</button>
        ))}
      </div>
      <form className="order-form" onSubmit={submit}>
        <label>Price ({symbol})</label>
        <input className="price-num" disabled={orderForm.type === 'Market'} value={orderForm.type === 'Market' ? price : orderForm.price} onChange={(e) => update({ price: e.target.value })} />
        <label>Amount</label>
        <input className="price-num" value={orderForm.amount} onChange={(e) => update({ amount: e.target.value })} />
        <div className="slider-row">
          {[25, 50, 75, 100].map((p) => <button key={p} type="button" className="tab-btn" onClick={() => update({ amount: ((p / 100) * 1).toFixed(3) })}>{p}%</button>)}
        </div>
        <div className="form-metrics">
          <span>Total <strong className="price-num">${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
          <span>Fee <strong className="price-num">${fee.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></span>
        </div>
        {error ? <p className="status-message--error">{error}</p> : null}
        <button type="submit" className={orderForm.side === 'Buy' ? 'submit-order submit-order--buy' : 'submit-order submit-order--sell'}>{orderForm.side} {symbol}</button>
      </form>
    </section>
  );
}

export default OrderForm;
