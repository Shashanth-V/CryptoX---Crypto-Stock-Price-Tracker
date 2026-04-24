import React, { useMemo, useState } from 'react';
import Badge from '../components/common/Badge';

const categories = ['All', 'Bitcoin', 'Ethereum', 'DeFi', 'Stocks', 'Regulation'];

const newsItems = Array.from({ length: 24 }, (_, i) => {
  const cats = ['Bitcoin', 'Ethereum', 'DeFi', 'Stocks', 'Regulation'];
  const sentiment = ['Bullish', 'Bearish', 'Neutral'][i % 3];
  return {
    id: i + 1,
    headline: `Market Update ${i + 1}: Liquidity shifts across major sectors`,
    source: ['CryptoWire', 'CoinDesk', 'Bloomberg', 'Reuters'][i % 4],
    time: `${i + 1}h ago`,
    category: cats[i % cats.length],
    sentiment,
    url: '#',
    summary: 'Analysts note continued rotation between majors and high-beta names as risk appetite evolves.',
    tags: [cats[i % cats.length], ['BTC', 'ETH', 'SOL', 'AAPL'][i % 4]],
  };
});

function News() {
  // [useState]
  const [category, setCategory] = useState('All');
  // [useState]
  const [query, setQuery] = useState('');

  const visible = useMemo(() => newsItems.filter((n) => {
    const byCat = category === 'All' || n.category === category;
    const q = query.toLowerCase();
    const byQ = !q || n.headline.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.tags.join(' ').toLowerCase().includes(q);
    return byCat && byQ;
  }), [category, query]);

  return (
    <section className="page">
      <div className="market-controls">
        <input className="market-controls__search" placeholder="Search news" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="market-controls__tabs">{categories.map((c) => <button key={c} type="button" className={category === c ? 'tab-btn tab-btn--active' : 'tab-btn'} onClick={() => setCategory(c)}>{c}</button>)}</div>
      </div>
      <div className="news-grid">
        {visible.map((item) => (
          <article key={item.id} className="panel news-card">
            <div className="table-head-tools"><strong>{item.source}</strong><span>{item.time}</span></div>
            <h3>{item.headline}</h3>
            <p>{item.summary}</p>
            <div className="table-head-tools">
              <div>{item.tags.map((tag) => <button key={tag} type="button" className="tab-btn" onClick={() => setQuery(tag)}>{tag}</button>)}</div>
              <Badge tone={item.sentiment === 'Bullish' ? 'success' : item.sentiment === 'Bearish' ? 'danger' : 'neutral'}>{item.sentiment}</Badge>
            </div>
            <a href={item.url}>Read More</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default News;
