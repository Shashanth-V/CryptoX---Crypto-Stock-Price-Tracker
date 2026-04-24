import React from 'react';
import Badge from '../common/Badge';

function AlertList({ alerts, onDelete }) {
  return (
    <section className="panel">
      <h3>Active Alerts</h3>
      <table className="market-table">
        <thead><tr><th>Asset</th><th>Condition</th><th>Target</th><th>Current</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id}>
              <td>{a.symbol}</td>
              <td>{a.type}</td>
              <td className="price-num">{a.target}</td>
              <td className="price-num">{a.currentPrice.toLocaleString()}</td>
              <td><Badge tone={a.status === 'Triggered' ? 'success' : a.status === 'Paused' ? 'neutral' : 'warning'}>{a.status}</Badge></td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
              <td><button type="button" className="tab-btn" onClick={() => onDelete(a.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default AlertList;
