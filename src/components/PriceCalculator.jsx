import { useState, useEffect } from 'react'
import { useCryptoPrice } from '../hooks/useCryptoPrice'

function PriceCalculator() {
  // 使用自定義 Hook 獲取即時價格
  const { prices, loading, error, lastUpdate, refresh } = useCryptoPrice(30000) // 每 30 秒更新
  
  const [btcAmount, setBtcAmount] = useState('')
  const [calculatedUSDT, setCalculatedUSDT] = useState(0)
  const [calculatedTWD, setCalculatedTWD] = useState(0)

  // 計算購幣金額
  useEffect(() => {
    if (btcAmount && prices.btc.usd > 0) {
      const amount = parseFloat(btcAmount)
      if (!isNaN(amount) && amount > 0) {
        const usdt = amount * prices.btc.usd
        const twd = amount * prices.btc.twd
        setCalculatedUSDT(usdt)
        setCalculatedTWD(twd)
      } else {
        setCalculatedUSDT(0)
        setCalculatedTWD(0)
      }
    } else {
      setCalculatedUSDT(0)
      setCalculatedTWD(0)
    }
  }, [btcAmount, prices])

  // 格式化數字
  const formatNumber = (num) => {
    return new Intl.NumberFormat('zh-TW', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
      {/* 標題區 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-5xl mr-4">💰</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
              即時價格查詢與估算
            </h2>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '⏳ 更新中...' : '🔄 更新價格'}
          </button>
        </div>
        
        <p className="text-gray-600 text-lg leading-relaxed">
          查詢即時加密貨幣價格，並估算購買比特幣所需的金額
        </p>
        
        <div className="flex items-center mt-2">
          <p className="text-sm text-gray-500">
            最後更新：{lastUpdate ? lastUpdate.toLocaleString('zh-TW') : '載入中...'}
          </p>
          <span className="ml-3 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
            {error ? '⚠️ 使用備用數據' : '✅ 即時數據'}
          </span>
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ {error} - 目前使用備用數據
            </p>
          </div>
        )}
      </div>

      {/* 即時價格卡片 */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* BTC 價格卡片 */}
        <div className="bg-gradient-to-br from-bitcoin-orange to-orange-600 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-4xl mr-3">₿</span>
              <h3 className="text-2xl font-bold">Bitcoin</h3>
            </div>
            {loading && <div className="animate-spin text-2xl">⏳</div>}
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80 mb-1">BTC / USDT</p>
              <p className="text-3xl font-bold">
                ${formatNumber(prices.btc.usd)}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80 mb-1">BTC / TWD</p>
              <p className="text-3xl font-bold">
                {formatCurrency(prices.btc.twd)}
              </p>
            </div>
          </div>
        </div>

        {/* USDT 價格卡片 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-4xl mr-3">💵</span>
              <h3 className="text-2xl font-bold">Tether</h3>
            </div>
            {loading && <div className="animate-spin text-2xl">⏳</div>}
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80 mb-1">USDT / TWD</p>
              <p className="text-3xl font-bold">
                {formatCurrency(prices.usdt.twd)}
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-sm opacity-80 mb-1">關於 USDT</p>
              <p className="text-sm leading-relaxed">
                USDT 是穩定幣，價值錨定美元 (1 USDT ≈ 1 USD)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 購幣金額估算器 */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-center mb-6">
          <span className="text-3xl mr-3">🧮</span>
          <h3 className="text-2xl font-bold text-gray-800">購幣金額估算器</h3>
        </div>

        <p className="text-gray-700 mb-6">
          輸入想購買的比特幣數量，系統會自動計算所需的 USDT 和 TWD 金額
        </p>

        {/* 輸入區 */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <label className="block text-gray-700 font-bold mb-3 text-lg">
            想購買多少 BTC？
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              value={btcAmount}
              onChange={(e) => setBtcAmount(e.target.value)}
              placeholder="0.00"
              step="0.001"
              min="0"
              disabled={loading}
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-xl disabled:bg-gray-100"
            />
            <span className="flex items-center px-6 py-4 bg-bitcoin-orange text-white rounded-xl font-bold text-xl">
              BTC
            </span>
          </div>

          {/* 快速選擇按鈕 */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <button
              onClick={() => setBtcAmount('0.001')}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
            >
              0.001
            </button>
            <button
              onClick={() => setBtcAmount('0.01')}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
            >
              0.01
            </button>
            <button
              onClick={() => setBtcAmount('0.1')}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
            >
              0.1
            </button>
            <button
              onClick={() => setBtcAmount('1')}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
            >
              1
            </button>
          </div>
        </div>

        {/* 計算結果 */}
        {calculatedUSDT > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-2 border-green-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">需要支付 (USDT)</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${formatNumber(calculatedUSDT)}
                  </p>
                </div>
                <span className="text-5xl">💵</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">需要支付 (TWD)</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(calculatedTWD)}
                  </p>
                </div>
                <span className="text-5xl">💰</span>
              </div>
            </div>

            {/* 說明提示 */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>💡 提示：</strong>
                實際購買時可能會有交易手續費和價格滑點，建議多準備 1-2% 的資金。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 市場說明 */}
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-2">📊 什麼是 BTC/USDT？</h4>
          <p className="text-sm text-gray-700">
            BTC/USDT 表示 1 顆比特幣可以兌換多少 USDT（穩定幣）。
            這是加密貨幣市場最常見的交易對之一。
          </p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-2">🏦 如何在台灣購買比特幣？</h4>
          <p className="text-sm text-gray-700">
            可透過台灣的交易所（如 MAX、ACE、BitoPro）用台幣購買，
            或先購買 USDT 再到國際交易所（如 Binance）交易。
          </p>
        </div>
      </div>
    </div>
  )
}

export default PriceCalculator