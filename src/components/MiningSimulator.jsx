import { useState, useEffect, useRef, useCallback } from 'react'
import { MINING_CONFIG } from '../constants/config'
import { Button } from './shared/Button'
import { InfoBox } from './shared/InfoBox'

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
  
  // 使用 ref 來避免頻繁的狀態更新
  const miningRef = useRef({
    shouldStop: false,
    currentAttempts: 0
  })

  // 計算區塊的 Hash - 使用 useCallback 優化
  const calculateHash = useCallback(async (blockNum, trans, prevHash, nonceValue) => {
    const blockData = `${blockNum}${trans}${prevHash}${nonceValue}`
    const encoder = new TextEncoder()
    const data = encoder.encode(blockData)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }, [])

  // 檢查 Hash 是否符合難度要求
  const checkDifficulty = useCallback((hashValue) => {
    const requiredPrefix = '0'.repeat(difficulty)
    return hashValue.startsWith(requiredPrefix)
  }, [difficulty])

  // 更新當前顯示的 Hash
  useEffect(() => {
    if (!isMining) {
      const updateHash = async () => {
        const newHash = await calculateHash(blockNumber, transactions, previousHash, nonce)
        setHash(newHash)
        setSuccess(checkDifficulty(newHash))
      }
      updateHash()
    }
  }, [blockNumber, transactions, previousHash, nonce, difficulty, isMining, calculateHash, checkDifficulty])

  // 自動挖礦 - 優化版本
  const startMining = useCallback(async () => {
    setIsMining(true)
    setAttempts(0)
    setSuccess(false)
    miningRef.current.shouldStop = false
    miningRef.current.currentAttempts = 0
    
    let currentNonce = 0
    let found = false
    
    // 使用批次處理來減少狀態更新
    const processBatch = async () => {
      const batchSize = MINING_CONFIG.UPDATE_FREQUENCY
      
      for (let i = 0; i < batchSize && !found && !miningRef.current.shouldStop; i++) {
        const testHash = await calculateHash(blockNumber, transactions, previousHash, currentNonce)
        miningRef.current.currentAttempts++
        
        if (checkDifficulty(testHash)) {
          found = true
          setNonce(currentNonce)
          setHash(testHash)
          setSuccess(true)
          setAttempts(miningRef.current.currentAttempts)
          setIsMining(false)
          return true
        }
        
        currentNonce++
      }
      
      // 每個批次後更新顯示
      setNonce(currentNonce)
      setAttempts(miningRef.current.currentAttempts)
      
      return false
    }
    
    // 持續處理批次直到找到或停止
    while (!found && !miningRef.current.shouldStop && currentNonce < MINING_CONFIG.MAX_NONCE_ATTEMPTS) {
      const shouldBreak = await processBatch()
      if (shouldBreak) break
      
      // 給 UI 一個呼吸的時間
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    
    if (!found && !miningRef.current.shouldStop) {
      setIsMining(false)
    }
  }, [blockNumber, transactions, previousHash, difficulty, calculateHash, checkDifficulty])

  // 停止挖礦
  const stopMining = useCallback(() => {
    miningRef.current.shouldStop = true
    setIsMining(false)
  }, [])

  // 重置
  const reset = useCallback(() => {
    setNonce(0)
    setAttempts(0)
    setSuccess(false)
    setIsMining(false)
    miningRef.current.currentAttempts = 0
  }, [])

  // 清理函數
  useEffect(() => {
    return () => {
      miningRef.current.shouldStop = true
    }
  }, [])

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
      <InfoBox type="info" title="什麼是挖礦？" className="mb-8">
        挖礦就是不斷調整 Nonce 值，直到找到一個雜湊值開頭有足夠多的 0。
        難度越高（需要越多 0），找到答案所需的運算次數就越多。
      </InfoBox>

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
            disabled={isMining}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none disabled:bg-gray-100"
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
            disabled={isMining}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none font-mono text-sm disabled:bg-gray-100"
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
            disabled={isMining}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none disabled:bg-gray-100"
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
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors"
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
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors"
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
            {MINING_CONFIG.DIFFICULTY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
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
            嘗試次數：<span className="font-bold text-bitcoin-orange">{attempts.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* 控制按鈕 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={startMining}
          disabled={isMining}
          variant="primary"
        >
          {isMining ? '⛏️ 挖礦中...' : '⛏️ 開始自動挖礦'}
        </Button>
        
        <Button
          onClick={stopMining}
          disabled={!isMining}
          variant="danger"
        >
          ⏸️ 停止挖礦
        </Button>
        
        <Button
          onClick={reset}
          disabled={isMining}
          variant="secondary"
        >
          🔄 重置
        </Button>
      </div>

      {/* 提示 */}
      <InfoBox type="warning" className="mt-6">
        <strong>💡 提示：</strong>
        難度越高，找到符合條件的 Nonce 所需時間越長。這就是為什麼比特幣挖礦需要強大的運算能力！
      </InfoBox>
    </div>
  )
}

export default MiningSimulator
