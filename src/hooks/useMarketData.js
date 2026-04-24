import { useCallback, useEffect, useState } from 'react';
import { ASSETS } from '../data/assets';

const PRICE_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true';
const TRENDING_URL = 'https://api.coingecko.com/api/v3/search/trending';

const geckoToId = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  solana: 'solana',
  binancecoin: 'binancecoin',
  ripple: 'ripple',
};

export function useMarketData() {
  // [useState]
  const [assets, setAssets] = useState(ASSETS);
  // [useState]
  const [trending, setTrending] = useState([]);
  // [useState]
  const [loading, setLoading] = useState(false);
  // [useState]
  const [error, setError] = useState('');
  // [useState]
  const [lastUpdated, setLastUpdated] = useState(null);

  // [API]
  const fetchMarket = useCallback(async () => {
    try {
      setError('');
      const priceRes = await fetch(PRICE_URL).catch(() => null);
      const trendRes = await fetch(TRENDING_URL).catch(() => null);
      
      if (!priceRes || !priceRes.ok) {
        setLastUpdated(new Date());
        return;
      }
      
      const priceData = await priceRes.json();
      const trendData = trendRes && trendRes.ok ? await trendRes.json() : { coins: [] };

      setAssets((prev) =>
        prev.map((asset) => {
          const geckoEntry = Object.entries(geckoToId).find(([, id]) => id === asset.id);
          if (!geckoEntry) return asset;
          const apiObj = priceData[geckoEntry[0]];
          if (!apiObj) return asset;
          return {
            ...asset,
            price: Number((apiObj.usd ?? asset.price).toFixed(2)),
            change24h: Number((apiObj.usd_24h_change ?? asset.change24h).toFixed(2)),
            marketCap: Math.round(apiObj.usd_market_cap ?? asset.marketCap),
            volume24h: Math.round(apiObj.usd_24h_vol ?? asset.volume24h),
          };
        })
      );

      setTrending(
        (trendData.coins || []).slice(0, 7).map((entry) => ({
          symbol: entry.item.symbol,
          name: entry.item.name,
          score: entry.item.score,
        }))
      );
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('Market data fetch error:', err.message);
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    // [useEffect]
    fetchMarket();
    const id = setInterval(fetchMarket, 60000);
    return () => clearInterval(id);
  }, [fetchMarket]);

  return { assets, loading, error, lastUpdated, trending, refetch: fetchMarket };
}

export default useMarketData;
