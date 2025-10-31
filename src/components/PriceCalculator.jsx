import { useState, useEffect } from 'react'
import { useCryptoPrice } from '../hooks/useCryptoPrice'
import { Tooltip } from './shared'

function PriceCalculator() {
 // 使用自定義 Hook 獲取即時價格
 const { prices, loading, error, lastUpdate, refresh, apiSource, priceChange24h } = useCryptoPrice(30000) // 每 30 秒更新

 const [btcAmount, setBtcAmount] = useState('')
 const [calculatedUSDT, setCalculatedUSDT] = useState(0)
 const [calculatedTWD, setCalculatedTWD] = useState(0)
 const [calculatorMode, setCalculatorMode] = useState('btc') // 'btc' 或 'twd'
 const [twdAmount, setTwdAmount] = useState('')

 // 計算購幣金額 (BTC → TWD)
 useEffect(() => {
 if (calculatorMode === 'btc' && btcAmount && prices.btc.usd > 0) {
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
 } else if (calculatorMode === 'btc') {
 setCalculatedUSDT(0)
 setCalculatedTWD(0)
 }
 }, [btcAmount, prices, calculatorMode])

 // 反向計算 (TWD → BTC)
 useEffect(() => {
 if (calculatorMode === 'twd' && twdAmount && prices.btc.twd > 0) {
 const amount = parseFloat(twdAmount)
 if (!isNaN(amount) && amount > 0) {
 const btc = amount / prices.btc.twd
 const usdt = btc * prices.btc.usd
 setBtcAmount(btc.toFixed(8))
 setCalculatedUSDT(usdt)
 setCalculatedTWD(amount)
 }
 }
 }, [twdAmount, prices, calculatorMode])

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
 <span className="text-5xl mr-4"></span>
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
 {loading ? ' 更新中...' : ' 更新價格'}
 </button>
 </div>
 
 <p className="text-gray-600 text-lg leading-relaxed">
 查詢<Tooltip term="即時加密貨幣價格" definition="透過 API 連接交易所，獲取當前市場上加密貨幣的最新交易價格。價格會根據市場供需即時波動。" type="info" />，並估算購買比特幣所需的金額
 </p>
 
 <div className="flex flex-wrap items-center gap-2 mt-2">
 <p className="text-sm text-gray-500">
 最後更新：{lastUpdate ? lastUpdate.toLocaleString('zh-TW') : '載入中...'}
 </p>
 <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
 {error ? ' 備用數據' : ' 即時數據'}
 </span>
 {apiSource && !error && (
 <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
 API 來源: {apiSource}
 </span>
 )}
 </div>

 {/* 錯誤提示 */}
 {error && (
 <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
 <p className="text-sm text-yellow-800">
 {error}
 </p>
 <p className="text-xs text-gray-600 mt-1">
 已嘗試多個 API 來源，目前顯示快取或備用數據
 </p>
 </div>
 )}
 </div>

 {/* 即時價格卡片 */}
 <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10">
 {/* BTC 價格卡片 */}
 <div className="bg-gradient-to-br from-bitcoin-orange to-orange-600 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center">
 <span className="text-4xl mr-3"></span>
 <h3 className="text-2xl font-bold">Bitcoin</h3>
 </div>
 <div className="flex items-center gap-2">
 {priceChange24h !== null && (
 <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
 priceChange24h >= 0 ? 'bg-green-500' : 'bg-red-500'
 }`}>
 <span className="text-lg">
 {priceChange24h >= 0 ? '' : ''}
 </span>
 <span className="text-sm font-bold">
 {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
 </span>
 </div>
 )}
 {loading && <div className="animate-spin text-2xl"></div>}
 </div>
 </div>

 <div className="space-y-3">
 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <p className="text-sm opacity-80">BTC / USDT</p>
 {apiSource && !error && (
 <span className="text-xs px-2 py-0.5 bg-blue-400/30 text-blue-100 rounded font-semibold">
 Binance
 </span>
 )}
 </div>
 {priceChange24h !== null && (
 <span className={`text-xs font-bold px-2 py-1 rounded ${
 priceChange24h >= 0 ? 'bg-green-400/30' : 'bg-red-400/30'
 }`}>
 24h: {priceChange24h >= 0 ? '▲' : ''} {Math.abs(priceChange24h).toFixed(2)}%
 </span>
 )}
 </div>
 <p className="text-3xl font-bold">
 ${formatNumber(prices.btc.usd)}
 </p>
 </div>

 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <p className="text-sm opacity-80">BTC / TWD</p>
 {apiSource && !error && (
 <span className="text-xs px-2 py-0.5 bg-blue-400/30 text-blue-100 rounded font-semibold">
 Binance + ExRate
 </span>
 )}
 </div>
 </div>
 <p className="text-3xl font-bold">
 {formatCurrency(prices.btc.twd)}
 </p>
 <p className="text-xs opacity-70 mt-1">
 約 NT$ {Math.round(prices.btc.twd / 10000)} 萬
 </p>
 </div>
 </div>
 </div>

 {/* USDT 價格卡片 */}
 <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl transform hover:scale-105 transition-transform duration-300">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center">
 <span className="text-4xl mr-3"></span>
 <h3 className="text-2xl font-bold">Tether</h3>
 </div>
 {loading && <div className="animate-spin text-2xl"></div>}
 </div>
 
 <div className="space-y-3">
 <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <p className="text-sm opacity-80">USDT / TWD</p>
 {apiSource && !error && (
 <span className="text-xs px-2 py-0.5 bg-blue-400/30 text-blue-100 rounded font-semibold">
 ExchangeRate-API
 </span>
 )}
 </div>
 </div>
 <p className="text-3xl font-bold">
 ${new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
 }).format(prices.usdt.twd)}
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
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center">
 <span className="text-3xl mr-3"></span>
 <h3 className="text-2xl font-bold text-gray-800">購幣金額估算器</h3>
 </div>
 {/* 切換模式按鈕 */}
 <button
 onClick={() => {
 setCalculatorMode(calculatorMode === 'btc' ? 'twd' : 'btc')
 setBtcAmount('')
 setTwdAmount('')
 setCalculatedUSDT(0)
 setCalculatedTWD(0)
 }}
 className="bg-white hover:bg-gray-50 text-gray-700 px-3 sm:px-4 py-2 rounded-lg border-2 border-gray-300 text-sm sm:text-base font-semibold transition-colors"
 >
 切換
 </button>
 </div>

 <p className="text-gray-700 mb-6">
 {calculatorMode === 'btc'
 ? '輸入想購買的比特幣數量，系統會自動計算所需的 USDT 和 TWD 金額'
 : '輸入你有的台幣金額，系統會自動計算可購買的比特幣數量'
 }
 </p>

 {/* 輸入區 */}
 <div className="bg-white rounded-xl p-6 mb-6">
 {calculatorMode === 'btc' ? (
 <>
 <label className="block text-gray-700 font-bold mb-3 text-lg">
 想購買多少 BTC？
 </label>
 <div className="flex gap-2">
 <input
 type="number"
 value={btcAmount}
 onChange={(e) => setBtcAmount(e.target.value)}
 placeholder="0.00"
 step="0.001"
 min="0"
 disabled={loading}
 className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-lg sm:text-xl disabled:bg-gray-100"
 />
 <span className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-bitcoin-orange text-white rounded-xl font-bold text-lg sm:text-xl whitespace-nowrap">
 BTC
 </span>
 </div>

 {/* 快速選擇按鈕 */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
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
 </>
 ) : (
 <>
 <label className="block text-gray-700 font-bold mb-3 text-lg">
 你有多少台幣？
 </label>
 <div className="flex gap-2">
 <input
 type="number"
 value={twdAmount}
 onChange={(e) => setTwdAmount(e.target.value)}
 placeholder="0"
 step="1000"
 min="0"
 disabled={loading}
 className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-lg sm:text-xl disabled:bg-gray-100"
 />
 <span className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-bold text-lg sm:text-xl whitespace-nowrap">
 TWD
 </span>
 </div>

 {/* 快速選擇按鈕 */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
 <button
 onClick={() => setTwdAmount('10000')}
 disabled={loading}
 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
 >
 1 萬
 </button>
 <button
 onClick={() => setTwdAmount('50000')}
 disabled={loading}
 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
 >
 5 萬
 </button>
 <button
 onClick={() => setTwdAmount('100000')}
 disabled={loading}
 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
 >
 10 萬
 </button>
 <button
 onClick={() => setTwdAmount('1000000')}
 disabled={loading}
 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50"
 >
 100 萬
 </button>
 </div>
 </>
 )}
 </div>

 {/* 計算結果 */}
 {calculatedUSDT > 0 && (
 <div className="space-y-4">
 {calculatorMode === 'twd' && (
 <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-6 border-2 border-orange-300">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-gray-600 mb-1">可購買 BTC</p>
 <p className="text-3xl font-bold text-bitcoin-orange">
 {btcAmount} BTC
 </p>
 <p className="text-sm text-gray-600 mt-2">
 = {(parseFloat(btcAmount) * 100000000).toFixed(0)} Satoshis
 </p>
 </div>
 <span className="text-5xl"></span>
 </div>
 </div>
 )}

 <div className="bg-white rounded-xl p-6 border-2 border-green-300">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <p className="text-gray-600 mb-1">{calculatorMode === 'btc' ? '需要支付 (USDT)' : '等值 USDT'}</p>
 <p className="text-3xl font-bold text-green-600">
 ${formatNumber(calculatedUSDT)}
 </p>
 </div>
 <span className="text-5xl"></span>
 </div>
 </div>

 <div className="bg-white rounded-xl p-6 border-2 border-blue-300">
 <div className="flex items-center justify-between">
 <div className="flex-1">
 <p className="text-gray-600 mb-1">{calculatorMode === 'btc' ? '需要支付 (TWD)' : '輸入金額'}</p>
 <p className="text-3xl font-bold text-blue-600">
 {formatCurrency(calculatedTWD)}
 </p>
 </div>
 <span className="text-5xl"></span>
 </div>
 </div>

 {/* 額外資訊 */}
 <div className="grid sm:grid-cols-2 gap-3">
 <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
 <p className="text-xs text-gray-600 mb-1">預估手續費 (0.1%)</p>
 <p className="text-lg font-bold text-purple-600">
 {formatCurrency(calculatedTWD * 0.001)}
 </p>
 </div>
 <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
 <p className="text-xs text-gray-600 mb-1">建議準備金額 (+2%)</p>
 <p className="text-lg font-bold text-indigo-600">
 {formatCurrency(calculatedTWD * 1.02)}
 </p>
 </div>
 </div>

 {/* 說明提示 */}
 <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
 <p className="text-sm text-gray-700">
 <strong> 提示：</strong>
 實際購買時可能會有交易手續費和價格滑點，建議多準備 1-2% 的資金。
 {calculatorMode === 'twd' && ' 上方顯示的是理論可購買數量，實際會因手續費而略少。'}
 </p>
 </div>
 </div>
 )}
 </div>

 {/* 市場說明 */}
 <div className="mt-8 grid sm:grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
 <div className="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-xl">
 <h4 className="font-bold text-gray-800 mb-2"> 什麼是 BTC/USDT？</h4>
 <p className="text-sm text-gray-700">
 BTC/USDT 表示 1 顆比特幣可以兌換多少 USDT（穩定幣）。
 這是加密貨幣市場最常見的交易對之一。
 </p>
 </div>

 <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-xl">
 <h4 className="font-bold text-gray-800 mb-2"> 如何在台灣購買比特幣？</h4>
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