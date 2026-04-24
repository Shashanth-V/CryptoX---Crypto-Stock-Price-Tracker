import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function Navbar({ assets, alertCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);

  const handleSearch = (query) => {
    setSearch(query);
    setSelectedIndex(-1);
    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const q = query.toLowerCase();
    const results = assets.filter((a) => a.symbol.toLowerCase().startsWith(q) || a.name.toLowerCase().includes(q)).slice(0, 6);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const goToAsset = (symbol) => {
    navigate(`/trade/${symbol}`);
    setSearch('');
    setShowSearchResults(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSearchResults) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        goToAsset(searchResults[selectedIndex].symbol);
      }
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <header className="top-nav">
      <button
        type="button"
        className="top-nav__brand"
        onClick={() => navigate('/trade/BTC')}
        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontWeight: 'bold' }}
      >
        ₿ CryptoX
      </button>
      <div className="top-nav__right">
        <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
          <input
            ref={searchInputRef}
            className="top-nav__search"
            placeholder="Search symbol..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => search.trim() && setShowSearchResults(true)}
          />
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '8px', zIndex: 100, maxHeight: '300px', overflowY: 'auto', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              {searchResults.map((asset, idx) => (
                <button
                  key={asset.symbol}
                  type="button"
                  onClick={() => goToAsset(asset.symbol)}
                  style={{ width: '100%', padding: '10px 12px', textAlign: 'left', border: 'none', background: selectedIndex === idx ? 'rgba(255,255,255,0.1)' : 'none', cursor: 'pointer', color: 'inherit', borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onMouseLeave={() => setSelectedIndex(-1)}
                >
                  <img src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@master/128/${asset.symbol.toLowerCase()}.png`} alt={asset.symbol} style={{ width: '18px', height: '18px', marginRight: '8px', verticalAlign: 'middle', borderRadius: '50%' }} onError={(e) => (e.target.style.display = 'none')} />
                  <strong>{asset.symbol}</strong> <span style={{ opacity: 0.6, fontSize: '0.85em' }}>{asset.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="icon-btn" onClick={() => navigate('/alerts')}>
          🔔 {alertCount}
        </button>
        <nav className="top-nav__links">
          <NavLink to="/markets" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Markets
          </NavLink>
          <NavLink to="/portfolio" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Portfolio
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            Alerts
          </NavLink>
          <NavLink to="/news" className={({ isActive }) => (isActive ? 'nav-link nav-link--active' : 'nav-link')}>
            News
          </NavLink>
        </nav>
        <span className="theme-chip">{location.pathname.includes('/trade') ? 'Trading' : 'Explorer'}</span>
      </div>
    </header>
  );
}

export default Navbar;
