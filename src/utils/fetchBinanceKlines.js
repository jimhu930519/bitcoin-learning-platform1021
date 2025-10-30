/**
 * 從 Binance API 獲取真實的 K 線歷史數據
 * @param {string} symbol - 交易對（例如：'BTCUSDT'）
 * @param {string} interval - 時間週期 ('1m', '5m', '15m', '1h', '4h', '1d')
 * @param {number} limit - 要獲取的 K 線數量（最大 1000）
 * @returns {Promise<Array>} K 線數據陣列
 */
export async function fetchBinanceKlines(symbol = 'BTCUSDT', interval = '1h', limit = 100) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`)
    }

    const data = await response.json()

    // 將 Binance 的數據格式轉換為我們的格式
    // Binance 返回格式: [開盤時間, 開盤價, 最高價, 最低價, 收盤價, ...]
    const formattedData = data.map(kline => ({
      time: Math.floor(kline[0] / 1000), // 轉換為秒
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4])
    }))

    return formattedData
  } catch (error) {
    console.error('Failed to fetch Binance klines:', error)
    // 如果 API 失敗，返回空陣列
    return []
  }
}

/**
 * 將我們的時間週期格式轉換為 Binance 格式
 * @param {string} timeframe - 我們的格式 ('1m', '5m', '15m', '1h', '4h', '1d')
 * @returns {string} Binance 格式
 */
export function convertTimeframeToBinance(timeframe) {
  // 我們的格式已經和 Binance 一致，直接返回
  return timeframe
}
