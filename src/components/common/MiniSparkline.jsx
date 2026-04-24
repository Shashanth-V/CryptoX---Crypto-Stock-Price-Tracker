import React from 'react';

function MiniSparkline({ points = [], positive = true }) {
  if (!points.length) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const w = 90;
  const h = 26;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1 || 1)) * w;
      const y = h - ((p - min) / ((max - min) || 1)) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mini-sparkline">
      <path d={path} stroke={positive ? 'var(--green)' : 'var(--red)'} fill="none" strokeWidth="1.8" />
    </svg>
  );
}

export default MiniSparkline;
