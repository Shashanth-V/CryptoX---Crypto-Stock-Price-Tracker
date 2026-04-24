import React from 'react';

const options = ['MA7', 'MA25', 'MA99', 'Bollinger Bands', 'RSI', 'MACD', 'Volume'];

function IndicatorBar({ activeIndicators, setActiveIndicators }) {
  const toggle = (item) => {
    setActiveIndicators((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));
  };

  return (
    <div className="indicator-bar">
      {options.map((item) => (
        <button key={item} type="button" className={activeIndicators.includes(item) ? 'pill pill--active' : 'pill'} onClick={() => toggle(item)}>{item}</button>
      ))}
    </div>
  );
}

export default IndicatorBar;
