import { useState, useEffect, useCallback } from 'react'

/**
 * 自定義 Hook - 獲取加密貨幣即時價格
 * 使用 CoinGecko API
 */
export const useCryptoPrice = (updateInterval = 30000) => {
  const [prices, setPrices] = useState({
    btc: {
      usd: 0,
      twd: 0
    },
    usdt: {
      twd: 0
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // 獲取價格數據
  const fetchPrices = useCallback(async () => {
    try {
      setError(null)
      
      // 同時獲取 BTC 和 USDT 的價格
      const [btcResponse, usdtResponse] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,twd'),
        fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=twd')
      ])

      if (!btcResponse.ok || !usdtResponse.ok) {
        throw new Error('API 請求失敗')
      }

      const btcData = await btcResponse.json()
      const usdtData = await usdtResponse.json()

      setPrices({
        btc: {
          usd: btcData.bitcoin?.usd || 0,
          twd: btcData.bitcoin?.twd || 0
        },
        usdt: {
          twd: usdtData.tether?.twd || 0
        }
      })
      
      setLastUpdate(new Date())
      setLoading(false)
      
    } catch (err) {
      console.error('獲取價格失敗:', err)
      setError(err.message)
      setLoading(false)
      
      // 如果失敗，使用備用的模擬數據
      if (prices.btc.usd === 0) {
        setPrices({
          btc: {
            usd: 97000,
            twd: 3150000
          },
          usdt: {
            twd: 32.5
          }
        })
      }
    }
  }, [])

  // 初始加載和定期更新
  useEffect(() => {
    fetchPrices()
    
    const interval = setInterval(() => {
      fetchPrices()
    }, updateInterval)

    return () => clearInterval(interval)
  }, [fetchPrices, updateInterval])

  // 手動刷新
  const refresh = useCallback(() => {
    setLoading(true)
    fetchPrices()
  }, [fetchPrices])

  return {
    prices,
    loading,
    error,
    lastUpdate,
    refresh
  }
}