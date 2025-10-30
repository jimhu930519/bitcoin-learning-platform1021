/**
 * 生成模擬的 K 線數據
 * @param {number} basePrice - 基礎價格（例如：當前 BTC 價格）
 * @param {number} count - 要生成的 K 線數量
 * @param {string} interval - 時間週期 ('1m', '5m', '1h', '1d')
 * @returns {Array} K 線數據陣列
 */
export function generateCandleData(basePrice, count = 100, interval = '1h') {
  const data = []
  let currentPrice = basePrice
  const now = Date.now()

  // 根據時間週期設定間隔（毫秒）
  const intervalMap = {
    '1m': 60 * 1000,           // 1分鐘
    '5m': 5 * 60 * 1000,       // 5分鐘
    '15m': 15 * 60 * 1000,     // 15分鐘
    '1h': 60 * 60 * 1000,      // 1小時
    '4h': 4 * 60 * 60 * 1000,  // 4小時
    '1d': 24 * 60 * 60 * 1000  // 1天
  }

  const timeInterval = intervalMap[interval] || intervalMap['1h']

  // 從過去往現在生成數據
  for (let i = count - 1; i >= 0; i--) {
    const time = Math.floor((now - i * timeInterval) / 1000) // 轉換為秒

    // 隨機波動（±3%）
    const volatility = 0.03
    const change = (Math.random() - 0.5) * 2 * volatility
    const open = currentPrice

    // 計算 high, low, close
    const trend = Math.random() - 0.5
    const close = open * (1 + change + trend * 0.01)

    // high 和 low 應該在 open 和 close 之間或稍微超出
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)

    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2))
    })

    // 更新當前價格為這根 K 線的收盤價
    currentPrice = close
  }

  return data
}

/**
 * 添加新的 K 線數據點（用於實時更新）
 * @param {Array} existingData - 現有的 K 線數據
 * @param {number} currentPrice - 當前價格
 * @param {string} interval - 時間週期
 * @returns {Array} 更新後的 K 線數據
 */
export function addNewCandle(existingData, currentPrice, interval = '1h') {
  if (existingData.length === 0) {
    return generateCandleData(currentPrice, 100, interval)
  }

  const lastCandle = existingData[existingData.length - 1]
  const now = Math.floor(Date.now() / 1000)

  const intervalMap = {
    '1m': 60,
    '5m': 5 * 60,
    '15m': 15 * 60,
    '1h': 60 * 60,
    '4h': 4 * 60 * 60,
    '1d': 24 * 60 * 60
  }

  const timeInterval = intervalMap[interval] || intervalMap['1h']

  // 檢查是否需要新的 K 線
  if (now - lastCandle.time >= timeInterval) {
    // 創建新的 K 線
    const newCandle = {
      time: now,
      open: lastCandle.close,
      high: Math.max(lastCandle.close, currentPrice),
      low: Math.min(lastCandle.close, currentPrice),
      close: currentPrice
    }

    return [...existingData, newCandle]
  } else {
    // 更新最後一根 K 線
    const updatedData = [...existingData]
    updatedData[updatedData.length - 1] = {
      ...lastCandle,
      high: Math.max(lastCandle.high, currentPrice),
      low: Math.min(lastCandle.low, currentPrice),
      close: currentPrice
    }

    return updatedData
  }
}
