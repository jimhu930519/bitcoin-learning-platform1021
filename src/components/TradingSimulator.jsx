import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useCryptoPrice } from '../hooks/useCryptoPrice'
import { TRADING_CONFIG } from '../constants/config'
import { Button } from './shared/Button'
import { InfoBox } from './shared/InfoBox'
import { Tooltip } from './shared'

function TradingSimulator() {
 const { walletA, walletB, executeTrade, getWallet } = useWallet()

 // 使用真實價格數據
 const { prices, loading: priceLoading, error: priceError, refresh, priceChange24h } = useCryptoPrice(30000)
 
 // 交易設定
 const [tradingPair, setTradingPair] = useState('BTC/USDT')
 const [orderType, setOrderType] = useState('market')
 const [tradeAction, setTradeAction] = useState('buy')
 const [amount, setAmount] = useState('')
 const [limitPrice, setLimitPrice] = useState('')
 const [selectedWallet, setSelectedWallet] = useState('A')
 
 // 交易狀態
 const [orderHistory, setOrderHistory] = useState([])
 const [pendingOrders, setPendingOrders] = useState([])
 const [message, setMessage] = useState(null)
 const [isProcessing, setIsProcessing] = useState(false)

 // 計算當前價格
 const getCurrentPrice = () => {
 if (tradingPair === 'BTC/USDT') {
 return prices.btc.usd
 } else {
 return prices.btc.twd
 }
 }

 // 計算總金額
 const calculateTotal = () => {
 if (!amount) return 0
 const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : getCurrentPrice()
 return parseFloat(amount) * price
 }

 // 計算手續費
 const calculateFee = () => {
 return calculateTotal() * TRADING_CONFIG.FEE_RATE
 }

 // 獲取當前錢包餘額
 const getCurrentWallet = () => {
 return getWallet(selectedWallet)
 }

 // 計算投資組合總價值 (以 USDT 計算)
 const calculatePortfolioValue = () => {
 const btcValue = balance.BTC * prices.btc.usd
 return btcValue + balance.USDT + (balance.TWD / 32.5) // TWD 轉換為 USDT
 }

 // 快速設置交易數量
 const setQuickAmount = (percentage) => {
 if (tradeAction === 'buy') {
 // 買入：根據可用資金計算可買數量
 const availableFunds = balance[tradingPair === 'BTC/USDT' ? 'USDT' : 'TWD']
 const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : getCurrentPrice()
 if (price > 0) {
 const maxBTC = (availableFunds * percentage) / (price * (1 + TRADING_CONFIG.FEE_RATE))
 setAmount(maxBTC.toFixed(6))
 }
 } else {
 // 賣出：根據持有 BTC 數量
 const maxBTC = balance.BTC * percentage
 setAmount(maxBTC.toFixed(6))
 }
 }

 // 監控價格變化，自動執行掛單
 useEffect(() => {
 if (pendingOrders.length === 0 || priceLoading) return

 const currentPrice = getCurrentPrice()
 if (currentPrice === 0) return

 // 檢查每個掛單是否達到執行條件
 const ordersToExecute = pendingOrders.filter(order => {
 if (order.action === 'buy') {
 // 買入：市價降至或低於限價
 return currentPrice <= order.limitPrice
 } else {
 // 賣出：市價升至或高於限價
 return currentPrice >= order.limitPrice
 }
 })

 // 執行達到條件的掛單
 if (ordersToExecute.length > 0) {
 ordersToExecute.forEach(order => {
 const result = executeTrade(
 order.wallet,
 order.tradingPair,
 order.action,
 order.amount,
 order.limitPrice
 )

 if (result.success) {
 // 加入成交記錄
 setOrderHistory(prev => [result.transaction, ...prev])
 
 // 從掛單列表移除
 setPendingOrders(prev => prev.filter(o => o.id !== order.id))
 
 // 顯示成交通知
 setMessage({
 type: 'success',
 text: ` 限價單自動成交！\n${order.amount.toFixed(6)} BTC @ ${order.limitPrice.toFixed(2)}`
 })
 }
 })
 }
 }, [prices, pendingOrders, executeTrade, priceLoading, tradingPair])

 // 取消掛單
 const cancelOrder = (orderId) => {
 setPendingOrders(prev => prev.filter(order => order.id !== orderId))
 setMessage({ 
 type: 'info', 
 text: ' 掛單已取消' 
 })
 }

 // 執行交易
 const handleExecuteTrade = () => {
 const amountNum = parseFloat(amount)
 const currentPrice = getCurrentPrice()

 // 驗證輸入
 if (!amount || amountNum <= 0) {
 setMessage({ type: 'error', text: '請輸入有效的交易數量！' })
 return
 }

 if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
 setMessage({ type: 'error', text: '請輸入有效的限價！' })
 return
 }

 // 檢查價格數據是否已載入
 if (currentPrice === 0) {
 setMessage({ type: 'error', text: '價格數據載入中，請稍後再試...' })
 return
 }

 // 限價單邏輯檢查
 if (orderType === 'limit') {
 const limitPriceNum = parseFloat(limitPrice)
 
 // 限價買入：限價必須 >= 當前市價才能立即成交
 if (tradeAction === 'buy' && limitPriceNum < currentPrice) {
 // 創建掛單
 const newOrder = {
 id: Date.now(),
 wallet: selectedWallet,
 tradingPair,
 action: tradeAction,
 amount: amountNum,
 limitPrice: limitPriceNum,
 timestamp: new Date().toLocaleString('zh-TW')
 }
 
 setPendingOrders(prev => [newOrder, ...prev])
 
 setMessage({ 
 type: 'info', 
 text: `⌛ 限價買入掛單已創建！\n\n目前市價：${currentPrice.toFixed(2)}\n您的限價：${limitPriceNum.toFixed(2)}\n\n當市價降至 ${limitPriceNum.toFixed(2)} 或以下時將自動成交。\n\n 您可以在右側「掛單列表」查看和管理您的掛單。` 
 })
 
 // 清空表單
 setAmount('')
 setLimitPrice('')
 return
 }
 
 // 限價賣出：限價必須 <= 當前市價才能立即成交
 if (tradeAction === 'sell' && limitPriceNum > currentPrice) {
 // 創建掛單
 const newOrder = {
 id: Date.now(),
 wallet: selectedWallet,
 tradingPair,
 action: tradeAction,
 amount: amountNum,
 limitPrice: limitPriceNum,
 timestamp: new Date().toLocaleString('zh-TW')
 }
 
 setPendingOrders(prev => [newOrder, ...prev])
 
 setMessage({ 
 type: 'info', 
 text: `⌛ 限價賣出掛單已創建！\n\n目前市價：${currentPrice.toFixed(2)}\n您的限價：${limitPriceNum.toFixed(2)}\n\n當市價升至 ${limitPriceNum.toFixed(2)} 或以上時將自動成交。\n\n 您可以在右側「掛單列表」查看和管理您的掛單。` 
 })
 
 // 清空表單
 setAmount('')
 setLimitPrice('')
 return
 }
 }

 // 模擬交易處理
 setIsProcessing(true)
 
 setTimeout(() => {
 const executionPrice = orderType === 'limit' && limitPrice 
 ? parseFloat(limitPrice) 
 : getCurrentPrice()

 // 使用 Context 的 executeTrade 方法
 const result = executeTrade(
 selectedWallet,
 tradingPair,
 tradeAction,
 amountNum,
 executionPrice
 )

 if (result.success) {
 // 添加到訂單歷史
 setOrderHistory([result.transaction, ...orderHistory])
 
 const orderTypeText = orderType === 'market' ? '市價' : '限價'
 setMessage({
 type: 'success',
 text: ` ${orderTypeText}${tradeAction === 'buy' ? '買入' : '賣出'}成功！\n${amountNum.toFixed(6)} BTC @ ${executionPrice.toFixed(2)}`
 })

 // 清空表單
 setAmount('')
 setLimitPrice('')
 } else {
 setMessage({
 type: 'error',
 text: result.message
 })
 }

 setIsProcessing(false)
 }, TRADING_CONFIG.TRADE_PROCESSING_TIME)
 }

 const currentPrice = getCurrentPrice()
 const total = calculateTotal()
 const fee = calculateFee()
 const balance = getCurrentWallet().balance

 return (
 <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
 {/* 標題 */}
 <div className="mb-8">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center">
 <span className="text-5xl mr-4"></span>
 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
 模擬交易系統
 </h2>
 </div>
 <button
 onClick={refresh}
 disabled={priceLoading}
 className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm ${
 priceLoading ? 'opacity-50 cursor-not-allowed' : ''
 }`}
 >
 {priceLoading ? '' : ''} 更新價格
 </button>
 </div>
 <p className="text-gray-600 text-lg leading-relaxed">
 體驗加密貨幣交易流程，包含<Tooltip term="市價單" definition="Market Order，以當前市場價格立即成交的訂單。優點是快速成交，缺點是價格可能因市場波動而不如預期。" type="info" />和<Tooltip term="限價單" definition="Limit Order，設定期望價格的掛單，只有當市場價格達到設定價格時才會成交。可以控制買賣價格，但不保證一定成交。" type="info" />操作
 </p>

 {/* 價格錯誤提示 */}
 {priceError && (
 <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
 <p className="text-sm text-yellow-800">
 {priceError} - 目前使用備用數據
 </p>
 </div>
 )}
 </div>

 {/* 說明卡片 */}
 <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
 <InfoBox type="info" title="市價單">
 以當前市場價格立即成交。優點是成交快速，缺點是無法控制成交價格。
 </InfoBox>
 <InfoBox type="info" title="限價單" icon="">
 設定目標價格，到達該價格才成交。可控制成交價，但可能無法立即成交。
 </InfoBox>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
 {/* 左側：交易表單 */}
 <div className="lg:col-span-2">
 {/* 當前價格顯示 */}
 <div className="bg-gradient-to-r from-bitcoin-orange to-orange-600 text-white rounded-2xl p-6 mb-6">
 <div className="flex justify-between items-center">
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-2">
 <p className="text-sm opacity-80">
 當前價格 ({tradingPair})
 </p>
 {priceChange24h !== null && (
 <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
 priceChange24h >= 0 ? 'bg-green-500' : 'bg-red-500'
 }`}>
 {priceChange24h >= 0 ? '▲' : ''} {Math.abs(priceChange24h).toFixed(2)}%
 </div>
 )}
 {priceLoading && <span className="text-xs animate-pulse">更新中...</span>}
 </div>
 <p className="text-4xl font-bold">
 {currentPrice > 0 ? (
 tradingPair === 'BTC/USDT'
 ? `$${currentPrice.toFixed(2)}`
 : `NT$${currentPrice.toFixed(0)}`
 ) : (
 <span className="text-2xl">載入中...</span>
 )}
 </p>
 <p className="text-xs opacity-70 mt-1">
 {priceError ? ' 使用備用數據' : ' 即時市場價格'}
 </p>
 </div>
 <span className="text-6xl"></span>
 </div>
 </div>

 {/* 選擇錢包 */}
 <div className="mb-6">
 <label className="block text-gray-700 font-bold mb-3">選擇錢包</label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <button
 onClick={() => setSelectedWallet('A')}
 className={`p-4 rounded-xl border-2 transition-all ${
 selectedWallet === 'A'
 ? 'border-bitcoin-orange bg-orange-50'
 : 'border-gray-300 hover:border-gray-400'
 }`}
 >
 <p className="font-bold">錢包 A</p>
 <p className="text-sm text-gray-600">BTC: {walletA.balance.BTC}</p>
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
 <p className="text-sm text-gray-600">BTC: {walletB.balance.BTC}</p>
 </button>
 </div>
 </div>

 {/* 交易對選擇 */}
 <div className="mb-6">
 <label className="block text-gray-700 font-bold mb-3">交易對</label>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
 disabled={priceLoading || currentPrice === 0}
 className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-xl disabled:bg-gray-100"
 />

 {/* 快速金額按鈕 */}
 <div className="flex gap-2 mt-3">
 <button
 onClick={() => setQuickAmount(0.25)}
 disabled={priceLoading || currentPrice === 0}
 className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
 >
 25%
 </button>
 <button
 onClick={() => setQuickAmount(0.5)}
 disabled={priceLoading || currentPrice === 0}
 className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
 >
 50%
 </button>
 <button
 onClick={() => setQuickAmount(0.75)}
 disabled={priceLoading || currentPrice === 0}
 className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
 >
 75%
 </button>
 <button
 onClick={() => setQuickAmount(1)}
 disabled={priceLoading || currentPrice === 0}
 className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
 >
 全部
 </button>
 </div>

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
 placeholder={currentPrice > 0 ? currentPrice.toFixed(2) : '載入中...'}
 step="0.01"
 min="0"
 disabled={priceLoading || currentPrice === 0}
 className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-xl disabled:bg-gray-100"
 />
 <p className="text-sm text-gray-600 mt-2">
 當前市價: {currentPrice > 0 ? currentPrice.toFixed(2) : '載入中...'}
 </p>
 </div>
 )}

 {/* 交易摘要 */}
 {amount && parseFloat(amount) > 0 && currentPrice > 0 && (
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
 <span className="text-gray-600">手續費 ({(TRADING_CONFIG.FEE_RATE * 100).toFixed(1)}%):</span>
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
 <Button
 onClick={handleExecuteTrade}
 disabled={isProcessing || priceLoading || currentPrice === 0}
 variant={tradeAction === 'buy' ? 'success' : 'danger'}
 className="w-full"
 >
 {isProcessing 
 ? '處理中...' 
 : priceLoading || currentPrice === 0
 ? '價格載入中...'
 : `${tradeAction === 'buy' ? '買入' : '賣出'} BTC`}
 </Button>

 {/* 訊息顯示 */}
 {message && (
 <div className={`mt-6 p-4 rounded-xl whitespace-pre-line ${
 message.type === 'success' 
 ? 'bg-green-100 border-2 border-green-500 text-green-800' 
 : message.type === 'info'
 ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
 : 'bg-red-100 border-2 border-red-500 text-red-800'
 }`}>
 <p className="font-semibold">{message.text}</p>
 </div>
 )}
 </div>

 {/* 右側：錢包餘額、掛單列表和訂單歷史 */}
 <div className="space-y-6">
 {/* 錢包餘額 */}
 <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
 <h3 className="text-xl font-bold text-gray-800 mb-4">
 錢包 {selectedWallet} 餘額
 </h3>

 {/* 投資組合總價值 */}
 {prices.btc.usd > 0 && (
 <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 mb-3 border-2 border-purple-300">
 <p className="text-xs text-gray-600 mb-1">投資組合總價值</p>
 <p className="text-2xl font-bold text-purple-700">
 ${calculatePortfolioValue().toFixed(2)} USDT
 </p>
 <p className="text-xs text-gray-500 mt-1">
 ≈ NT${(calculatePortfolioValue() * 32.5).toFixed(0)}
 </p>
 </div>
 )}

 <div className="space-y-3">
 <div className="bg-white rounded-lg p-4">
 <div className="flex items-center justify-between mb-1">
 <p className="text-sm text-gray-600">BTC</p>
 {prices.btc.usd > 0 && (
 <p className="text-xs text-gray-500">
 ≈ ${(balance.BTC * prices.btc.usd).toFixed(2)}
 </p>
 )}
 </div>
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
 <p className="text-xs text-gray-500 mt-1">
 ≈ ${(balance.TWD / 32.5).toFixed(2)} USDT
 </p>
 </div>
 </div>
 </div>

 {/* 掛單列表 */}
 {pendingOrders.length > 0 && (
 <div className="bg-white rounded-2xl p-6 border-2 border-orange-300">
 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
 <span className="mr-2"></span>
 掛單列表
 <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
 {pendingOrders.length}
 </span>
 </h3>
 <div className="space-y-3 max-h-96 overflow-y-auto">
 {pendingOrders.map(order => (
 <div 
 key={order.id}
 className={`p-3 rounded-lg border-2 ${
 order.action === 'buy'
 ? 'bg-green-50 border-green-300'
 : 'bg-red-50 border-red-300'
 }`}
 >
 <div className="flex justify-between items-start mb-2">
 <span className={`font-bold ${
 order.action === 'buy' ? 'text-green-700' : 'text-red-700'
 }`}>
 限價{order.action === 'buy' ? '買入' : '賣出'}
 </span>
 <button
 onClick={() => cancelOrder(order.id)}
 className="text-red-600 hover:text-red-800 text-xs font-semibold"
 >
 取消
 </button>
 </div>
 <p className="text-sm font-semibold">
 {order.amount.toFixed(6)} BTC @ {order.limitPrice.toFixed(2)}
 </p>
 <p className="text-xs text-gray-600 mt-1">
 {order.timestamp}
 </p>
 <div className="mt-2 text-xs text-gray-500">
 {order.action === 'buy' 
 ? `等待市價降至 ${order.limitPrice.toFixed(2)} 或以下`
 : `等待市價升至 ${order.limitPrice.toFixed(2)} 或以上`}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* 訂單歷史 */}
 {orderHistory.length > 0 && (
 <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
 <h3 className="text-xl font-bold text-gray-800 mb-4">
 最近訂單
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
 已成交
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
