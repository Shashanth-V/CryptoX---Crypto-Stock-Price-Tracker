# CryptoX - Crypto & Stock Price Tracker

A modern trading dashboard built with React + Vite for tracking crypto and stock assets, viewing charts, placing mock buy/sell orders, managing portfolio holdings, and monitoring alerts.

## Highlights

- Vite-powered React app with fast local development and production builds
- Multi-page terminal-style UI with routes for Trading, Markets, Portfolio, Alerts, and News
- Real-time style market refresh (polling) with graceful API fallback behavior
- Search with keyboard navigation (Arrow Up/Down, Enter, Escape)
- Watchlist support with local persistence
- Portfolio auto-updates when buy/sell orders are placed
- Transaction history and toast notifications
- Token logos with image fallback handling

## Tech Stack

- React 18
- Vite 8
- React Router DOM 6
- Chart.js + react-chartjs-2 + chartjs-chart-financial
- date-fns

## Project Structure

src/
- components/
	- layout/
	- market/
	- portfolio/
	- trading/
- data/
- hooks/
- pages/
- styles/
- App.jsx
- index.jsx

## Routes

- /trade/:symbol - Main trading view with chart, order form, and order book
- /markets - Asset list and market overview
- /portfolio - Holdings and transaction management
- /alerts - Price alert management
- /news - News view

## Data Source

The app uses CoinGecko public endpoints for market data where available:

- Simple price endpoint for core market fields
- Trending endpoint for top trending symbols

If an API request fails or is rate-limited, the app keeps running using local asset data and updates the timestamp, so the UI does not crash.

## Local Development

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Vite will start on port 3000 by default and auto-fallback to the next available port.

### Build for production

```bash
npm run build
```

Build output is generated in:

- dist/

### Preview production build locally

```bash
npm run preview
```

## Available Scripts

- npm run dev - Start Vite dev server
- npm start - Alias for Vite dev server
- npm run build - Create optimized production build in dist/
- npm run preview - Preview production build

## Configuration

Vite config:

- File: vite.config.js
- React plugin enabled
- Server starts from port 3000 and can fallback if occupied
- Sourcemaps disabled for production build

## State Persistence

The app stores key user data in browser localStorage:

- Watchlist
- Portfolio holdings
- Alerts
- Transactions

## Notes

- This project is intended for simulation/education and UI workflow practice.
- It does not execute real trades.
- API rate limits can affect live data freshness.

## License

No license file is currently defined. Add a LICENSE file if you plan to open-source this repository publicly.
