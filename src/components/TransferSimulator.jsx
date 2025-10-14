import { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'

function TransferSimulator() {
  const { walletA, walletB, transactionHistory, transfer, getCorrectAddress } = useWallet()
  
  const [activeWallet, setActiveWallet] = useState('A')
  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [selectedChain, setSelectedChain] = useState('Bitcoin')
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState(null)

  const currentWallet = activeWallet === 'A' ? walletA : walletB
  const targetWallet = activeWallet === 'A' ? walletB : walletA

  // 鏈和幣種的對應關係
  const chainOptions = {
    BTC: ['Bitcoin'],
    ETH: ['Ethereum'],
    USDT: ['Ethereum', 'BSC', 'Polygon', 'Tron']
  }

  // 處理幣種改變
  const handleCoinChange = (coin) => {
    setSelectedCoin(coin)
    setSelectedChain(chainOptions[coin][0])
    setToAddress('')
    setMessage(null)
  }

  // 一鍵填入正確地址
  const fillCorrectAddress = () => {
    const correctAddr = getCorrectAddress(targetWallet, selectedCoin, selectedChain)
    setToAddress(correctAddr)
    setMessage({ type: 'info', text: '✅ 已填入正確地址' })
  }

  // 處理轉帳
  const handleTransfer = () => {
    if (!toAddress) {
      setMessage({ type: 'error', text: '請輸入接收地址！' })
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: '請輸入有效的轉帳金額！' })
      return
    }

    const result = transfer(activeWallet, toAddress, parseFloat(amount), selectedCoin, selectedChain)
    
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    })

    if (result.success) {
      setToAddress('')
      setAmount('')
    }
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
      {/* 標題 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-5xl mr-4">💸</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            區塊鏈轉帳模擬器
          </h2>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">
          體驗加密貨幣轉帳流程。選錯公鏈或地址，資產將永久消失！
        </p>
      </div>

      {/* 警告提示 */}
      <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-xl mb-8">
        <h3 className="font-bold text-red-800 mb-2 text-lg">⚠️ 重要提醒</h3>
        <p className="text-red-700">
          在真實的區塊鏈轉帳中，如果選錯公鏈或輸入錯誤地址，資產將無法找回！
          請務必在轉帳前仔細確認接收地址和公鏈。
        </p>
      </div>

      {/* 錢包選擇 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* 錢包 A */}
        <div 
          onClick={() => setActiveWallet('A')}
          className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 ${
            activeWallet === 'A' 
              ? 'border-bitcoin-orange bg-orange-50 shadow-lg scale-105' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              👛 錢包 A {activeWallet === 'A' && '(發送中)'}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">BTC:</span>
              <span className="font-bold text-bitcoin-orange">{walletA.balance.BTC}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ETH:</span>
              <span className="font-bold text-blue-600">{walletA.balance.ETH}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">USDT:</span>
              <span className="font-bold text-green-600">{walletA.balance.USDT}</span>
            </div>
          </div>
        </div>

        {/* 錢包 B */}
        <div 
          onClick={() => setActiveWallet('B')}
          className={`p-6 rounded-2xl border-4 cursor-pointer transition-all duration-300 ${
            activeWallet === 'B' 
              ? 'border-bitcoin-orange bg-orange-50 shadow-lg scale-105' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-gray-800">
              👛 錢包 B {activeWallet === 'B' && '(發送中)'}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">BTC:</span>
              <span className="font-bold text-bitcoin-orange">{walletB.balance.BTC}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ETH:</span>
              <span className="font-bold text-blue-600">{walletB.balance.ETH}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">USDT:</span>
              <span className="font-bold text-green-600">{walletB.balance.USDT}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 轉帳表單 */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📤 發送交易</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 選擇幣種 */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">選擇幣種</label>
            <select
              value={selectedCoin}
              onChange={(e) => handleCoinChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none"
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
            </select>
          </div>

          {/* 選擇公鏈 */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">選擇公鏈</label>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none"
            >
              {chainOptions[selectedCoin].map(chain => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 接收地址 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-bold">接收地址</label>
            <button
              onClick={fillCorrectAddress}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors"
            >
              一鍵填入正確地址
            </button>
          </div>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="輸入接收錢包的地址..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 提示：目標錢包的正確地址是 <code className="bg-gray-200 px-2 py-1 rounded">{getCorrectAddress(targetWallet, selectedCoin, selectedChain)}</code>
          </p>
        </div>

        {/* 轉帳金額 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">轉帳金額</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none"
            />
            <span className="flex items-center px-4 py-3 bg-gray-200 rounded-xl font-bold">
              {selectedCoin}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            可用餘額: <span className="font-bold text-bitcoin-orange">{currentWallet.balance[selectedCoin]}</span> {selectedCoin}
          </p>
        </div>

        {/* 發送按鈕 */}
        <button
          onClick={handleTransfer}
          className="w-full bg-gradient-to-r from-bitcoin-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          🚀 發送交易
        </button>
      </div>

      {/* 訊息顯示 */}
      {message && (
        <div className={`p-4 rounded-xl mb-6 ${
          message.type === 'success' ? 'bg-green-100 border-2 border-green-500 text-green-800' :
          message.type === 'error' ? 'bg-red-100 border-2 border-red-500 text-red-800' :
          'bg-blue-100 border-2 border-blue-500 text-blue-800'
        }`}>
          <p className="font-semibold">{message.text}</p>
        </div>
      )}

      {/* 交易歷史 */}
      {transactionHistory.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">📜 交易歷史</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactionHistory.map(tx => (
              <div 
                key={tx.id}
                className={`p-4 rounded-xl border-2 ${
                  tx.status === 'success' 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-800">
                      {tx.from} → {tx.to}
                    </p>
                    <p className="text-sm text-gray-600">
                      {tx.amount} {tx.coin} ({tx.chain})
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    tx.status === 'success' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {tx.status === 'success' ? '✓ 成功' : '✗ 失敗'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{tx.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TransferSimulator