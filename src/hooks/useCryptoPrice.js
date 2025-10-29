import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * 自定義 Hook - 獲取加密貨幣即時價格
 * 多重備援 API + 重試機制 + 快取
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
  const [apiSource, setApiSource] = useState('primary')
  const [priceChange24h, setPriceChange24h] = useState(null)

  const retryCountRef = useRef(0)
  const cacheRef = useRef(null)
  const lastFetchTimeRef = useRef(0)

  // 備用數據
  const FALLBACK_PRICES = {
    btc: { usd: 97000, twd: 3150000 },
    usdt: { twd: 32.5 }
  }

  // API 列表（多重備援）- Binance 優先（更快速、即時）
  const API_SOURCES = [
    {
      name: 'Binance',
      fetchBTC: async () => {
        // 使用 Binance 24h ticker 獲取價格和變化百分比
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        const usd = parseFloat(data.lastPrice)
        const change24h = parseFloat(data.priceChangePercent)

        // 更新 24h 變化
        setPriceChange24h(change24h)

        // 使用固定匯率 32.5 (更快，避免額外 API 調用)
        const twdRate = 32.5
        const twd = usd * twdRate

        return { usd, twd }
      },
      fetchUSDT: async () => {
        // USDT 穩定幣匯率相對固定
        return { twd: 32.5 }
      }
    },
    {
      name: 'Binance (多幣對)',
      fetchBTC: async () => {
        // 備援方案：同時查詢 USDT 和 BUSD 價格取平均
        const responses = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCBUSD').catch(() => null)
        ])

        const usdtData = await responses[0].json()
        const busdData = responses[1] ? await responses[1].json() : null

        let usd = parseFloat(usdtData.price)
        if (busdData) {
          const busdPrice = parseFloat(busdData.price)
          usd = (usd + busdPrice) / 2 // 取平均提高準確度
        }

        return { usd, twd: usd * 32.5 }
      },
      fetchUSDT: async () => {
        return { twd: 32.5 }
      }
    },
    {
      name: 'CoinGecko',
      fetchBTC: async () => {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,twd',
          { headers: { 'Accept': 'application/json' } }
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        return {
          usd: data.bitcoin?.usd,
          twd: data.bitcoin?.twd
        }
      },
      fetchUSDT: async () => {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=twd',
          { headers: { 'Accept': 'application/json' } }
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        return { twd: data.tether?.twd }
      }
    }
  ]

  // 獲取價格數據（帶重試）
  const fetchPrices = useCallback(async (retryCount = 0) => {
    // 檢查快取（10秒內不重複請求）
    const now = Date.now()
    if (cacheRef.current && now - lastFetchTimeRef.current < 10000) {
      console.log('使用快取數據')
      setPrices(cacheRef.current)
      setLoading(false)
      return
    }

    try {
      setError(null)

      // 輪流嘗試不同的 API
      const apiIndex = retryCount % API_SOURCES.length
      const api = API_SOURCES[apiIndex]

      console.log(`嘗試使用 ${api.name} API (第 ${retryCount + 1} 次)`)
      setApiSource(api.name)

      // 設定超時（5秒）
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('請求超時')), 5000)
      )

      const [btcData, usdtData] = await Promise.race([
        Promise.all([api.fetchBTC(), api.fetchUSDT()]),
        timeout
      ])

      if (!btcData?.usd || !btcData?.twd || !usdtData?.twd) {
        throw new Error('數據格式錯誤')
      }

      const newPrices = {
        btc: {
          usd: btcData.usd,
          twd: btcData.twd
        },
        usdt: {
          twd: usdtData.twd
        }
      }

      setPrices(newPrices)
      cacheRef.current = newPrices
      lastFetchTimeRef.current = now
      setLastUpdate(new Date())
      setLoading(false)
      retryCountRef.current = 0

    } catch (err) {
      console.error(`${API_SOURCES[retryCount % API_SOURCES.length].name} 失敗:`, err.message)

      // 重試邏輯（最多重試 5 次，涵蓋所有 3 個 API）
      const maxRetries = API_SOURCES.length + 2 // 3個API + 2次額外重試

      if (retryCount < maxRetries) {
        // 快速重試前兩次，之後指數退避
        const delay = retryCount < 2 ? 500 : Math.min(1000 * Math.pow(2, retryCount - 2), 3000)
        console.log(`${delay}ms 後重試...`)
        setTimeout(() => fetchPrices(retryCount + 1), delay)
        setError(`連線中... (嘗試 ${retryCount + 1}/${maxRetries + 1})`)
      } else {
        // 所有 API 都失敗，使用快取或備用數據
        setError('無法連接到價格 API，使用備用數據')
        setLoading(false)

        if (cacheRef.current) {
          console.log('使用舊快取數據')
          setPrices(cacheRef.current)
        } else {
          console.log('使用備用數據')
          setPrices(FALLBACK_PRICES)
          cacheRef.current = FALLBACK_PRICES
        }
      }
    }
  }, [])

  // 初始加載和定期更新
  useEffect(() => {
    fetchPrices(0)

    const interval = setInterval(() => {
      fetchPrices(0)
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  // 手動刷新（忽略快取）
  const refresh = useCallback(() => {
    setLoading(true)
    lastFetchTimeRef.current = 0 // 重置快取時間
    fetchPrices(0)
  }, [fetchPrices])

  return {
    prices,
    loading,
    error,
    lastUpdate,
    refresh,
    apiSource,
    priceChange24h
  }
}