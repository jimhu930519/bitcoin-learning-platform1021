import { useState, useEffect } from 'react'

function MiningSimulator() {
  const [blockNumber, setBlockNumber] = useState(1)
  const [transactions, setTransactions] = useState('Alice -> Bob: 1 BTC')
  const [previousHash, setPreviousHash] = useState('0000000000000000')
  const [nonce, setNonce] = useState(0)
  const [difficulty, setDifficulty] = useState(4)
  const [hash, setHash] = useState('')
  const [isMining, setIsMining] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [success, setSuccess] = useState(false)

  // 計算區塊的 Hash
  const calculateHash = async (blockNum, trans, prevHash, nonceValue) => {
    const blockData = `${blockNum}${trans}${prevHash}${nonceValue}`
    const encoder = new TextEncoder()
    const data = encoder.encode(blockData)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  // 檢查 Hash 是否符合難度要求
  const checkDifficulty = (hashValue) => {
    const requiredPrefix = '0'.repeat(difficulty)
    return hashValue.startsWith(requiredPrefix)
  }

  // 更新 Hash
  useEffect(() => {
    const updateHash = async () => {
      const newHash = await calculateHash(blockNumber, transactions, previousHash, nonce)
      setHash(newHash)
      setSuccess(checkDifficulty(newHash))
    }
    updateHash()
  }, [blockNumber, transactions, previousHash, nonce, difficulty])

  // 自動挖礦
  const startMining = async () => {
    setIsMining(true)
    setAttempts(0)
    setSuccess(false)
    
    let currentNonce = 0
    let found = false
    
    while (!found && currentNonce < 1000000) {
      const testHash = await calculateHash(blockNumber, transactions, previousHash, currentNonce)
      setAttempts(prev => prev + 1)
      
      if (checkDifficulty(testHash)) {
        setNonce(currentNonce)
        setHash(testHash)
        setSuccess(true)
        found = true
        setIsMining(false)
      } else {
        currentNonce++
        // 每 100 次更新一次顯示，避免太頻繁
        if (currentNonce % 100 === 0) {
          setNonce(currentNonce)
          await new Promise(resolve => setTimeout(resolve, 1))
        }
      }
    }
    
    if (!found) {
      setIsMining(false)
    }
  }

  // 停止挖礦
  const stopMining = () => {
    setIsMining(false)
  }

  // 重置
  const reset = () => {
    setNonce(0)
    setAttempts(0)
    setSuccess(false)
    setIsMining(false)
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
      {/* 標題區 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-5xl mr-4">⛏️</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            挖礦模擬器
          </h2>
        </div>
        
        <p className="text-gray-600 text-lg leading-relaxed">
          體驗比特幣的工作量證明（PoW）機制。調整 Nonce 值來找到符合難度要求的雜湊值。
        </p>
      </div>

      {/* 說明卡片 */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6 rounded-xl mb-8">
        <h3 className="font-bold text-gray-800 mb-2 text-lg">💡 什麼是挖礦？</h3>
        <p className="text-gray-700">
          挖礦就是不斷調整 Nonce 值，直到找到一個雜湊值開頭有足夠多的 0。
          難度越高（需要越多 0），找到答案所需的運算次數就越多。
        </p>
      </div>

      {/* 區塊資料區 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            📦 區塊編號
          </label>
          <input
            type="number"
            value={blockNumber}
            onChange={(e) => setBlockNumber(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            🔗 前一個雜湊值
          </label>
          <input
            type="text"
            value={previousHash}
            onChange={(e) => setPreviousHash(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none font-mono text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-bold mb-2">
            💸 交易資料
          </label>
          <input
            type="text"
            value={transactions}
            onChange={(e) => setTransactions(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none"
          />
        </div>
      </div>

      {/* Nonce 和難度控制 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            🎲 Nonce 值
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setNonce(Math.max(0, nonce - 1))}
              disabled={isMining}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              -
            </button>
            <input
              type="number"
              value={nonce}
              onChange={(e) => setNonce(parseInt(e.target.value) || 0)}
              disabled={isMining}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-center font-bold text-xl disabled:bg-gray-100"
            />
            <button
              onClick={() => setNonce(nonce + 1)}
              disabled={isMining}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            ⚙️ 挖礦難度（前導 0 的數量）
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value))}
            disabled={isMining}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none disabled:bg-gray-100"
          >
            <option value={2}>簡單（2 個 0）</option>
            <option value={3}>普通（3 個 0）</option>
            <option value={4}>困難（4 個 0）</option>
            <option value={5}>非常困難（5 個 0）</option>
          </select>
        </div>
      </div>

      {/* Hash 顯示區 */}
      <div className="mb-8">
        <label className="block text-gray-700 font-bold mb-3 text-xl">
          🔢 當前區塊雜湊值：
        </label>
        <div className={`rounded-xl p-6 border-4 transition-all duration-300 ${
          success 
            ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-500' 
            : 'bg-gradient-to-r from-gray-900 to-gray-800 border-red-500'
        }`}>
          <div className={`font-mono text-base break-all leading-relaxed ${
            success ? 'text-green-800' : 'text-red-400'
          }`}>
            {hash || '等待計算...'}
          </div>
        </div>
        
        {success && (
          <div className="mt-4 bg-green-500 text-white p-4 rounded-xl text-center font-bold text-lg animate-pulse">
            🎉 成功！找到符合難度的雜湊值！
          </div>
        )}
        
        {attempts > 0 && (
          <div className="mt-3 text-gray-600 text-center">
            嘗試次數：<span className="font-bold text-bitcoin-orange">{attempts}</span>
          </div>
        )}
      </div>

      {/* 控制按鈕 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={startMining}
          disabled={isMining}
          className="bg-gradient-to-r from-bitcoin-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
        >
          {isMining ? '⛏️ 挖礦中...' : '⛏️ 開始自動挖礦'}
        </button>
        
        <button
          onClick={stopMining}
          disabled={!isMining}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
        >
          ⏸️ 停止挖礦
        </button>
        
        <button
          onClick={reset}
          disabled={isMining}
          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
        >
          🔄 重置
        </button>
      </div>

      {/* 提示 */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p className="text-sm text-gray-700">
          <strong>💡 提示：</strong>
          難度越高，找到符合條件的 Nonce 所需時間越長。這就是為什麼比特幣挖礦需要強大的運算能力！
        </p>
      </div>
    </div>
  )
}

export default MiningSimulator