import React, { useState } from 'react';
import Modal from '../common/Modal';

function AlertModal({ open, onClose, assets, onCreate }) {
  const [draft, setDraft] = useState({ symbol: 'BTC', type: 'Price Above', target: '', method: 'In-App', repeat: 'Once' });
  const update = (k, v) => setDraft((p) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title="Create Alert">
      <div className="alert-form">
        <label>Asset</label>
        <select value={draft.symbol} onChange={(e) => update('symbol', e.target.value)}>{assets.slice(0, 50).map((a) => <option key={a.symbol}>{a.symbol}</option>)}</select>
        <label>Type</label>
        <select value={draft.type} onChange={(e) => update('type', e.target.value)}>{['Price Above', 'Price Below', '% Change Up', '% Change Down', 'Volume Spike'].map((t) => <option key={t}>{t}</option>)}</select>
        <label>Target</label>
        <input value={draft.target} onChange={(e) => update('target', e.target.value)} />
        <label>Method</label>
        <select value={draft.method} onChange={(e) => update('method', e.target.value)}><option>In-App</option></select>
        <label>Repeat</label>
        <select value={draft.repeat} onChange={(e) => update('repeat', e.target.value)}><option>Once</option><option>Every time</option></select>
        <button type="button" className="submit-order submit-order--buy" onClick={() => { onCreate(draft); onClose(); }}>Create Alert</button>
      </div>
    </Modal>
  );
}

export default AlertModal;
