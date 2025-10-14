import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'

function TradingSimulator() {
  const { walletA, walletB } = useWallet()
  
  // 模擬價格數據
  const [btcPrice, setBtcPrice] = useState(97000)
  const [usdtTwdRate, setUsdtTwdRate] = useState(32.5)
  
  // 交易設定
  const [tradingPair, setTradingPair] = useState('BTC/USDT') // BTC/USDT 或 BTC/TWD
  const [orderType, setOrderType] = useState('market') // market 或 limit
  const [tradeAction, setTradeAction] = useState('buy') // buy 或 sell
  const [amount, setAmount] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [selectedWallet, setSelectedWallet] = useState('A')
  
  // 交易狀態
  const [orderHistory, setOrderHistory] = useState([])
  const [message, setMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // 錢包餘額（本地模擬）
  const [localBalances, setLocalBalances] = useState({
    A: { BTC: 0.5, USDT: 10000, TWD: 300000 },
    B: { BTC: 0.3, USDT: 5000, TWD: 150000 }
  })

  // 模擬價格波動
  useEffect(() => {
    const interval = setInterval(() => {
      setBtcPrice(prev => prev * (1 + (Math.random() - 0.5) * 0.002))
      setUsdtTwdRate(prev => prev * (1 + (Math.random() - 0.5) * 0.001))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // 計算當前價格
  const getCurrentPrice = () => {
    if (tradingPair === 'BTC/USDT') {
      return btcPrice
    } else {
      return btcPrice * usdtTwdRate
    }
  }

  // 計算總金額
  const calculateTotal = () => {
    if (!amount) return 0
    const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : getCurrentPrice()
    return parseFloat(amount) * price
  }

  // 計算手續費 (0.1%)
  const calculateFee = () => {
    return calculateTotal() * 0.001
  }

  // 獲取當前餘額
  const getCurrentBalance = () => {
    return localBalances[selectedWallet]
  }

  // 執行交易
  const executeTrade = () => {
    const balance = getCurrentBalance()
    const total = calculateTotal()
    const fee = calculateFee()
    const amountNum = parseFloat(amount)

    // 驗證輸入
    if (!amount || amountNum <= 0) {
      setMessage({ type: 'error', text: '請輸入有效的交易數量！' })
      return
    }

    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      setMessage({ type: 'error', text: '請輸入有效的限價！' })
      return
    }

    // 檢查餘額
    if (tradeAction === 'buy') {
      const currency = tradingPair === 'BTC/USDT' ? 'USDT' : 'TWD'
      const required = total + fee
      
      if (balance[currency] < required) {
        setMessage({ 
          type: 'error', 
          text: `${currency} 餘額不足！需要 ${required.toFixed(2)}，但只有 ${balance[currency].toFixed(2)}` 
        })
        return
      }
    } else {
      if (balance.BTC < amountNum) {
        setMessage({ 
          type: 'error', 
          text: `BTC 餘額不足！需要 ${amountNum}，但只有 ${balance.BTC}` 
        })
        return
      }
    }

    // 模擬交易處理
    setIsProcessing(true)
    setTimeout(() => {
      const executionPrice = getCurrentPrice()
      const currency = tradingPair === 'BTC/USDT' ? 'USDT' : 'TWD'

      // 更新餘額
      const newBalances = { ...localBalances }
      if (tradeAction === 'buy') {
        newBalances[selectedWallet].BTC += amountNum
        newBalances[selectedWallet][currency] -= (total + fee)
      } else {
        newBalances[selectedWallet].BTC -= amountNum
        newBalances[selectedWallet][currency] += (total - fee)
      }
      setLocalBalances(newBalances)

      // 記錄訂單
      const order = {
        id: Date.now(),
        type: orderType,
        action: tradeAction,
        pair: tradingPair,
        amount: amountNum,
        price: executionPrice,
        total: total,
        fee: fee,
        timestamp: new Date().toLocaleString('zh-TW'),
        wallet: `錢包 ${selectedWallet}`
      }
      setOrderHistory([order, ...orderHistory])

      setMessage({
        type: 'success',
        text: `✅ ${tradeAction === 'buy' ? '買入' : '賣出'}成功！${amountNum} BTC @ ${executionPrice.toFixed(2)}`
      })

      // 清空表單
      setAmount('')
      setLimitPrice('')
      setIsProcessing(false)
    }, 1500)
  }

  const currentPrice = getCurrentPrice()
  const total = calculateTotal()
  const fee = calculateFee()
  const balance = getCurrentBalance()

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
      {/* 標題 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-5xl mr-4">📊</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            模擬交易系統
          </h2>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          體驗加密貨幣交易流程，包含市價單和限價單操作
        </p>
      </div>

      {/* 說明卡片 */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-2">💡 市價單</h4>
          <p className="text-sm text-gray-700">
            以當前市場價格立即成交。優點是成交快速，缺點是無法控制成交價格。
          </p>
        </div>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-5 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-2">🎯 限價單</h4>
          <p className="text-sm text-gray-700">
            設定目標價格，到達該價格才成交。可控制成交價，但可能無法立即成交。
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 左側：交易表單 */}
        <div className="lg:col-span-2">
          {/* 當前價格顯示 */}
          <div className="bg-gradient-to-r from-bitcoin-orange to-orange-600 text-white rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80 mb-1">當前價格 ({tradingPair})</p>
                <p className="text-4xl font-bold">
                  {tradingPair === 'BTC/USDT' 
                    ? `$${currentPrice.toFixed(2)}` 
                    : `NT$${currentPrice.toFixed(0)}`}
                </p>
              </div>
              <span className="text-6xl">₿</span>
            </div>
          </div>

          {/* 選擇錢包 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3">選擇錢包</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedWallet('A')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedWallet === 'A'
                    ? 'border-bitcoin-orange bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">錢包 A</p>
                <p className="text-sm text-gray-600">BTC: {balance.BTC}</p>
              </button>
              <button
                onClick={() => setSelectedWallet('B')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedWallet === 'B'
                    ? 'border-bitcoin-orange bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">錢包 B</p>
                <p className="text-sm text-gray-600">BTC: {balance.BTC}</p>
              </button>
            </div>
          </div>

          {/* 交易對選擇 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3">交易對</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTradingPair('BTC/USDT')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tradingPair === 'BTC/USDT'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">BTC / USDT</p>
              </button>
              <button
                onClick={() => setTradingPair('BTC/TWD')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tradingPair === 'BTC/TWD'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">BTC / TWD</p>
              </button>
            </div>
          </div>

          {/* 訂單類型 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3">訂單類型</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOrderType('market')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  orderType === 'market'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">市價單</p>
                <p className="text-xs text-gray-600">立即成交</p>
              </button>
              <button
                onClick={() => setOrderType('limit')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  orderType === 'limit'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold">限價單</p>
                <p className="text-xs text-gray-600">設定目標價</p>
              </button>
            </div>
          </div>

          {/* 買入/賣出 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3">交易方向</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTradeAction('buy')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tradeAction === 'buy'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold text-green-600">買入 BTC</p>
              </button>
              <button
                onClick={() => setTradeAction('sell')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tradeAction === 'sell'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-bold text-red-600">賣出 BTC</p>
              </button>
            </div>
          </div>

          {/* 數量輸入 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-3">
              {tradeAction === 'buy' ? '買入數量' : '賣出數量'} (BTC)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.001"
              min="0"
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-xl"
            />
            <p className="text-sm text-gray-600 mt-2">
              可用: {tradeAction === 'buy' 
                ? `${balance[tradingPair === 'BTC/USDT' ? 'USDT' : 'TWD'].toFixed(2)} ${tradingPair === 'BTC/USDT' ? 'USDT' : 'TWD'}`
                : `${balance.BTC} BTC`}
            </p>
          </div>

          {/* 限價輸入 */}
          {orderType === 'limit' && (
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-3">
                限價 ({tradingPair === 'BTC/USDT' ? 'USDT' : 'TWD'})
              </label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder={currentPrice.toFixed(2)}
                step="0.01"
                min="0"
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-xl"
              />
              <p className="text-sm text-gray-600 mt-2">
                當前市價: {currentPrice.toFixed(2)}
              </p>
            </div>
          )}

          {/* 交易摘要 */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-gray-800 mb-4">交易摘要</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">數量:</span>
                  <span className="font-semibold">{parseFloat(amount).toFixed(6)} BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">價格:</span>
                  <span className="font-semibold">
                    {(orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : currentPrice).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">小計:</span>
                  <span className="font-semibold">{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">手續費 (0.1%):</span>
                  <span className="font-semibold">{fee.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-2 mt-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-bold">總計:</span>
                  <span className="text-xl font-bold text-bitcoin-orange">
                    {(total + (tradeAction === 'buy' ? fee : -fee)).toFixed(2)} 
                    {tradingPair === 'BTC/USDT' ? ' USDT' : ' TWD'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 執行按鈕 */}
          <button
            onClick={executeTrade}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-xl transition-all duration-300 ${
              tradeAction === 'buy'
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            } text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none`}
          >
            {isProcessing 
              ? '處理中...' 
              : `${tradeAction === 'buy' ? '買入' : '賣出'} BTC`}
          </button>

          {/* 訊息顯示 */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-100 border-2 border-green-500 text-green-800' 
                : 'bg-red-100 border-2 border-red-500 text-red-800'
            }`}>
              <p className="font-semibold">{message.text}</p>
            </div>
          )}
        </div>

        {/* 右側：錢包餘額和訂單歷史 */}
        <div className="space-y-6">
          {/* 錢包餘額 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              💼 錢包 {selectedWallet} 餘額
            </h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">BTC</p>
                <p className="text-2xl font-bold text-bitcoin-orange">
                  {balance.BTC.toFixed(6)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">USDT</p>
                <p className="text-2xl font-bold text-green-600">
                  ${balance.USDT.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600">TWD</p>
                <p className="text-2xl font-bold text-blue-600">
                  NT${balance.TWD.toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* 訂單歷史 */}
          {orderHistory.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📋 最近訂單
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orderHistory.slice(0, 5).map(order => (
                  <div 
                    key={order.id}
                    className={`p-3 rounded-lg border-2 ${
                      order.action === 'buy'
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-bold ${
                        order.action === 'buy' ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {order.action === 'buy' ? '買入' : '賣出'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.type === 'market' ? '市價' : '限價'}
                      </span>
                    </div>
                    <p className="text-sm">
                      {order.amount} BTC @ {order.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {order.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TradingSimulator