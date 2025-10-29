import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'

function TransferSimulator() {
  const { walletA, walletB, transactionHistory, transfer, getCorrectAddress } = useWallet()

  const [activeWallet, setActiveWallet] = useState('A')
  const [selectedCoin, setSelectedCoin] = useState('BTC')
  const [selectedChain, setSelectedChain] = useState('Bitcoin')
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState(null)
  const [showEducation, setShowEducation] = useState(false)
  const [showChainInfo, setShowChainInfo] = useState(false)
  const [addressValidation, setAddressValidation] = useState(null)
  const [isTransferring, setIsTransferring] = useState(false)

  const currentWallet = activeWallet === 'A' ? walletA : walletB
  const targetWallet = activeWallet === 'A' ? walletB : walletA

  // 鏈和幣種的對應關係
  const chainOptions = {
    BTC: ['Bitcoin'],
    ETH: ['Ethereum'],
    USDT: ['Ethereum', 'BSC', 'Polygon', 'Tron']
  }

  // 手續費資訊
  const feeInfo = {
    BTC: { Bitcoin: 0.0001 },
    ETH: { Ethereum: 0.002 },
    USDT: {
      Ethereum: 5,
      BSC: 0.5,
      Polygon: 0.1,
      Tron: 1
    }
  }

  const currentFee = feeInfo[selectedCoin][selectedChain]

  // 處理幣種改變
  const handleCoinChange = (coin) => {
    setSelectedCoin(coin)
    setSelectedChain(chainOptions[coin][0])
    setToAddress('')
    setMessage(null)
    setAddressValidation(null)
  }

  // 即時地址驗證
  useEffect(() => {
    if (!toAddress) {
      setAddressValidation(null)
      return
    }

    const correctAddr = getCorrectAddress(targetWallet, selectedCoin, selectedChain)

    if (toAddress === correctAddr) {
      setAddressValidation({ valid: true, message: '✓ 地址正確！' })
    } else if (toAddress.length > 10) {
      // 檢查是否是錯誤的鏈
      const allAddresses = chainOptions[selectedCoin].map(chain =>
        getCorrectAddress(targetWallet, selectedCoin, chain)
      )

      if (allAddresses.includes(toAddress)) {
        setAddressValidation({
          valid: false,
          message: '✗ 地址屬於其他鏈！資產將遺失',
          isWrongChain: true
        })
      } else {
        setAddressValidation({
          valid: false,
          message: '✗ 地址格式錯誤或不存在'
        })
      }
    } else {
      setAddressValidation(null)
    }
  }, [toAddress, selectedCoin, selectedChain, targetWallet, getCorrectAddress, chainOptions])

  // 一鍵填入正確地址
  const fillCorrectAddress = () => {
    const correctAddr = getCorrectAddress(targetWallet, selectedCoin, selectedChain)
    setToAddress(correctAddr)
    setMessage({ type: 'info', text: '✅ 已填入正確地址' })
  }

  // 快速設置金額
  const setQuickAmount = (percentage) => {
    const maxAmount = currentWallet.balance[selectedCoin]
    const quickAmount = (maxAmount * percentage).toFixed(4)
    setAmount(quickAmount)
  }

  // 處理轉帳
  const handleTransfer = async () => {
    if (!toAddress) {
      setMessage({ type: 'error', text: '請輸入接收地址！' })
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: '請輸入有效的轉帳金額！' })
      return
    }

    // 開始轉帳動畫
    setIsTransferring(true)
    setMessage({ type: 'info', text: '⏳ 交易處理中...' })

    // 模擬網路延遲
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 傳遞手續費參數
    const result = transfer(
      activeWallet,
      toAddress,
      parseFloat(amount),
      selectedCoin,
      selectedChain,
      currentFee
    )

    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message
    })

    setIsTransferring(false)

    if (result.success) {
      setToAddress('')
      setAmount('')
      setAddressValidation(null)
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
      <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-xl mb-6">
        <h3 className="font-bold text-red-800 mb-2 text-lg">⚠️ 重要提醒</h3>
        <p className="text-red-700">
          在真實的區塊鏈轉帳中，如果選錯公鏈或輸入錯誤地址，資產將無法找回！
          請務必在轉帳前仔細確認接收地址和公鏈。
        </p>
      </div>

      {/* 教育內容 - 可折疊 */}
      <div className="mb-6">
        <button
          onClick={() => setShowEducation(!showEducation)}
          className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl p-4 border-2 border-blue-200 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📚</span>
              <span className="font-bold text-gray-800 text-lg">區塊鏈轉帳知識</span>
            </div>
            <span className="text-xl transition-transform duration-300" style={{ transform: showEducation ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </div>
        </button>

        {showEducation && (
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
              <div className="text-3xl mb-2">🔗</div>
              <h4 className="font-bold text-gray-800 mb-2">什麼是公鏈？</h4>
              <p className="text-sm text-gray-700">
                公鏈是區塊鏈網路，不同的鏈有不同的地址格式。USDT 可以在多條鏈上運行，必須選對鏈才能成功轉帳。
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
              <div className="text-3xl mb-2">💸</div>
              <h4 className="font-bold text-gray-800 mb-2">什麼是手續費？</h4>
              <p className="text-sm text-gray-700">
                礦工或驗證者處理交易需要費用。不同鏈的手續費差異很大，Ethereum 通常較貴，BSC 和 Polygon 較便宜。
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
              <div className="text-3xl mb-2">⚠️</div>
              <h4 className="font-bold text-gray-800 mb-2">為什麼不可逆？</h4>
              <p className="text-sm text-gray-700">
                區塊鏈交易一旦確認就無法撤銷。沒有「客服」可以幫你找回錯誤轉帳的資金，這就是去中心化的代價。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 錢包選擇 */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
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
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 font-bold">選擇公鏈</label>
              <button
                onClick={() => setShowChainInfo(!showChainInfo)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                {showChainInfo ? '隱藏' : '查看'}手續費
              </button>
            </div>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none"
            >
              {chainOptions[selectedCoin].map(chain => (
                <option key={chain} value={chain}>{chain}</option>
              ))}
            </select>
            {showChainInfo && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-fadeIn">
                <p className="text-xs text-gray-700">
                  <span className="font-bold">預估手續費：</span>
                  {selectedCoin === 'USDT' ? `${currentFee} USDT` : `${currentFee} ${selectedCoin}`}
                </p>
              </div>
            )}
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
          <div className="relative">
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="輸入接收錢包的地址..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none font-mono text-sm transition-colors ${
                addressValidation?.valid
                  ? 'border-green-500 bg-green-50'
                  : addressValidation?.valid === false
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 focus:border-bitcoin-orange'
              }`}
            />
            {addressValidation && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {addressValidation.valid ? (
                  <span className="text-green-600 text-xl">✓</span>
                ) : (
                  <span className="text-red-600 text-xl">✗</span>
                )}
              </div>
            )}
          </div>
          {addressValidation && (
            <p className={`text-sm mt-2 font-semibold ${
              addressValidation.valid ? 'text-green-600' : 'text-red-600'
            }`}>
              {addressValidation.message}
            </p>
          )}
          {!addressValidation && (
            <p className="text-xs text-gray-500 mt-2">
              💡 提示：目標錢包的正確地址是 <code className="bg-gray-200 px-2 py-1 rounded">{getCorrectAddress(targetWallet, selectedCoin, selectedChain)}</code>
            </p>
          )}
        </div>

        {/* 轉帳金額 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">轉帳金額</label>
          <div className="flex space-x-2 mb-3">
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

          {/* 快速金額按鈕 */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setQuickAmount(0.25)}
              className="flex-1 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              25%
            </button>
            <button
              onClick={() => setQuickAmount(0.5)}
              className="flex-1 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              50%
            </button>
            <button
              onClick={() => setQuickAmount(0.75)}
              className="flex-1 bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 text-yellow-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              75%
            </button>
            <button
              onClick={() => setQuickAmount(1)}
              className="flex-1 bg-gradient-to-r from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              全部
            </button>
          </div>

          <p className="text-sm text-gray-600">
            可用餘額: <span className="font-bold text-bitcoin-orange">{currentWallet.balance[selectedCoin]}</span> {selectedCoin}
          </p>
        </div>

        {/* 交易摘要 */}
        {amount && parseFloat(amount) > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <h4 className="font-bold text-gray-800 mb-2">交易摘要</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">轉帳金額：</span>
                <span className="font-bold">{amount} {selectedCoin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">預估手續費：</span>
                <span className="font-bold text-orange-600">
                  {selectedCoin === 'USDT' ? `${currentFee} USDT` : `${currentFee} ${selectedCoin}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-blue-300 pt-1 mt-1">
                <span className="text-gray-700 font-semibold">總計：</span>
                <span className="font-bold text-lg">
                  {selectedCoin === 'USDT'
                    ? `${(parseFloat(amount) + currentFee).toFixed(2)} USDT`
                    : `${(parseFloat(amount) + currentFee).toFixed(4)} ${selectedCoin}`
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 發送按鈕 */}
        <button
          onClick={handleTransfer}
          disabled={isTransferring}
          className={`w-full px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg ${
            isTransferring
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-bitcoin-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transform hover:-translate-y-1'
          } text-white`}
        >
          {isTransferring ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              處理中...
            </span>
          ) : (
            '🚀 發送交易'
          )}
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
            {transactionHistory.map(tx => {
              // 只顯示轉帳類型的交易（排除交易所買賣）
              if (tx.type === 'trade') return null

              return (
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
                      {tx.fee > 0 && (
                        <p className="text-xs text-orange-600 font-semibold mt-1">
                          手續費: {tx.fee} {tx.coin}
                        </p>
                      )}
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
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default TransferSimulator