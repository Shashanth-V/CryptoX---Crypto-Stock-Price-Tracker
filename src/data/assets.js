const baseAssets = [
  {
    id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 67340.52, change24h: 2.41, change7d: -1.2,
    marketCap: 1320000000000, volume24h: 42000000000, high24h: 68900, low24h: 65200,
    high52w: 73800, low52w: 38500, supply: '19.7M', dominance: 52.4, type: 'crypto', rank: 1, color: '#F7931A',
  },
  {
    id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3512.12, change24h: -1.1, change7d: 3.8,
    marketCap: 421000000000, volume24h: 19300000000, high24h: 3615, low24h: 3454,
    high52w: 4100, low52w: 1780, supply: '120.2M', dominance: 17.1, type: 'crypto', rank: 2, color: '#627EEA',
  },
  {
    id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 589.31, change24h: 0.92, change7d: 5.4,
    marketCap: 88000000000, volume24h: 1800000000, high24h: 602, low24h: 577,
    high52w: 720, low52w: 300, supply: '149M', dominance: 3.2, type: 'crypto', rank: 3, color: '#F0B90B',
  },
  {
    id: 'solana', symbol: 'SOL', name: 'Solana', price: 172.44, change24h: 3.4, change7d: 11.1,
    marketCap: 78000000000, volume24h: 4300000000, high24h: 178.4, low24h: 164.2,
    high52w: 210, low52w: 78, supply: '440M', dominance: 2.8, type: 'crypto', rank: 4, color: '#00FFA3',
  },
  {
    id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.62, change24h: -0.6, change7d: 2.2,
    marketCap: 34000000000, volume24h: 1500000000, high24h: 0.65, low24h: 0.6,
    high52w: 0.92, low52w: 0.42, supply: '55B', dominance: 1.4, type: 'crypto', rank: 5, color: '#23292F',
  },
];

const symbols = [
  ['ADA', 'Cardano', 'crypto'], ['DOGE', 'Dogecoin', 'crypto'], ['AVAX', 'Avalanche', 'crypto'], ['MATIC', 'Polygon', 'crypto'],
  ['DOT', 'Polkadot', 'crypto'], ['LINK', 'Chainlink', 'crypto'], ['UNI', 'Uniswap', 'crypto'], ['ATOM', 'Cosmos', 'crypto'],
  ['LTC', 'Litecoin', 'crypto'], ['BCH', 'Bitcoin Cash', 'crypto'], ['ALGO', 'Algorand', 'crypto'], ['ICP', 'Internet Computer', 'crypto'],
  ['FIL', 'Filecoin', 'crypto'], ['SAND', 'The Sandbox', 'crypto'], ['MANA', 'Decentraland', 'crypto'], ['APE', 'ApeCoin', 'crypto'],
  ['AAVE', 'Aave', 'crypto'], ['COMP', 'Compound', 'crypto'], ['MKR', 'Maker', 'crypto'], ['SNX', 'Synthetix', 'crypto'],
  ['CRV', 'Curve DAO', 'crypto'], ['1INCH', '1inch', 'crypto'], ['ARB', 'Arbitrum', 'crypto'], ['OP', 'Optimism', 'crypto'],
  ['NEAR', 'NEAR Protocol', 'crypto'], ['TRX', 'TRON', 'crypto'], ['APT', 'Aptos', 'crypto'], ['HBAR', 'Hedera', 'crypto'],
  ['AAPL', 'Apple', 'stock'], ['TSLA', 'Tesla', 'stock'], ['NVDA', 'NVIDIA', 'stock'], ['MSFT', 'Microsoft', 'stock'],
  ['AMZN', 'Amazon', 'stock'], ['GOOGL', 'Alphabet', 'stock'], ['META', 'Meta', 'stock'], ['NFLX', 'Netflix', 'stock'],
  ['AMD', 'AMD', 'stock'], ['INTC', 'Intel', 'stock'], ['JPM', 'JPMorgan', 'stock'], ['BAC', 'Bank of America', 'stock'],
  ['V', 'Visa', 'stock'], ['MA', 'Mastercard', 'stock'], ['COIN', 'Coinbase', 'stock'], ['HOOD', 'Robinhood', 'stock'],
  ['SPY', 'SPDR S&P 500 ETF', 'stock'], ['QQQ', 'Invesco QQQ', 'stock'], ['PLTR', 'Palantir', 'stock'], ['UBER', 'Uber', 'stock'],
  ['SHOP', 'Shopify', 'stock'], ['PYPL', 'PayPal', 'stock'], ['SNOW', 'Snowflake', 'stock'], ['ORCL', 'Oracle', 'stock'],
];

const seeded = symbols.map(([symbol, name, type], index) => {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const base = type === 'crypto' ? 0.8 + (seed % 700) : 18 + (seed % 580);
  const price = Number((base * (type === 'crypto' ? 1.7 : 2.4)).toFixed(2));
  const change24h = Number((((seed % 120) - 60) / 10).toFixed(2));
  const change7d = Number((((seed % 180) - 90) / 10).toFixed(2));
  const marketCap = Math.round((type === 'crypto' ? 8e8 : 4e10) + seed * 5.5e7 + index * 2e9);
  const volume24h = Math.round((type === 'crypto' ? 5e7 : 8e8) + seed * 1.8e6);
  return {
    id: symbol.toLowerCase().replace(/[^a-z0-9]/g, ''),
    symbol,
    name,
    price,
    change24h,
    change7d,
    marketCap,
    volume24h,
    high24h: Number((price * 1.04).toFixed(2)),
    low24h: Number((price * 0.96).toFixed(2)),
    high52w: Number((price * 1.42).toFixed(2)),
    low52w: Number((price * 0.58).toFixed(2)),
    supply: type === 'crypto' ? `${(10 + (seed % 990)).toFixed(1)}M` : `${(1 + (seed % 20)).toFixed(1)}B`,
    dominance: Number((0.1 + (seed % 60) / 100).toFixed(2)),
    type,
    rank: index + 6,
    color: type === 'crypto' ? `hsl(${(seed % 360)}, 72%, 52%)` : `hsl(${(seed % 360)}, 46%, 52%)`,
  };
});

export const ASSETS = [...baseAssets, ...seeded];

export const TOP_SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN'];
