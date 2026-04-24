import React from 'react';

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <section className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h3>{title}</h3>
          <button type="button" onClick={onClose}>×</button>
        </header>
        <div className="modal__body">{children}</div>
      </section>
    </div>
  );
}

export default Modal;
