import React from 'react';

function Tooltip({ text, children }) {
  return (
    <span className="tooltip-wrap">
      {children}
      <span className="tooltip-box">{text}</span>
    </span>
  );
}

export default Tooltip;
