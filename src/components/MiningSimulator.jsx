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
  const [hashesPerSecond, setHashesPerSecond] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [recentAttempts, setRecentAttempts] = useState([])
  const [expandedInfo, setExpandedInfo] = useState(null)
  const [showReward, setShowReward] = useState(false)
  const [showFieldHelp, setShowFieldHelp] = useState(null)
  const [miningReward, setMiningReward] = useState({
    blockReward: 3.125,
    transactionFees: 0,
    totalReward: 0,
    usdValue: 0
  })
  
  const miningRef = useRef({
    shouldStop: false,
    currentAttempts: 0,
    startTime: null,
    lastUpdateTime: null
  })

  // 計算區塊的 Hash
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

  // 自動挖礦 - 加入視覺化
  const startMining = useCallback(async () => {
    setIsMining(true)
    setAttempts(0)
    setSuccess(false)
    setElapsedTime(0)
    setRecentAttempts([])
    miningRef.current.shouldStop = false
    miningRef.current.currentAttempts = 0
    miningRef.current.startTime = Date.now()
    miningRef.current.lastUpdateTime = Date.now()
    
    let currentNonce = 0
    let found = false
    
    const processBatch = async () => {
      const batchSize = 100
      const batchStartTime = Date.now()
      
      for (let i = 0; i < batchSize && !found && !miningRef.current.shouldStop; i++) {
        const testHash = await calculateHash(blockNumber, transactions, previousHash, currentNonce)
        miningRef.current.currentAttempts++
        
        // 加入最近嘗試列表（只保留最新10個）
        setRecentAttempts(prev => {
          const newAttempt = {
            nonce: currentNonce,
            hash: testHash,
            success: checkDifficulty(testHash),
            timestamp: Date.now()
          }
          return [newAttempt, ...prev].slice(0, 10)
        })
        
        if (checkDifficulty(testHash)) {
          found = true
          setNonce(currentNonce)
          setHash(testHash)
          setSuccess(true)
          setAttempts(miningRef.current.currentAttempts)
          setIsMining(false)
          
          const totalTime = (Date.now() - miningRef.current.startTime) / 1000
          setElapsedTime(totalTime)
          
          // 計算挖礦獎勵
          const fees = Math.random() * 0.3 + 0.1 // 0.1-0.4 BTC 隨機手續費
          const total = 3.125 + fees
          const btcPrice = 97000 // 假設 BTC 價格
          setMiningReward({
            blockReward: 3.125,
            transactionFees: fees,
            totalReward: total,
            usdValue: total * btcPrice
          })
          setShowReward(true)
          
          return true
        }
        
        currentNonce++
      }
      
      // 計算 Hashes per second
      const now = Date.now()
      const timeDiff = (now - miningRef.current.lastUpdateTime) / 1000
      if (timeDiff > 0) {
        const hps = batchSize / timeDiff
        setHashesPerSecond(Math.round(hps))
      }
      miningRef.current.lastUpdateTime = now
      
      // 更新顯示
      setNonce(currentNonce)
      setAttempts(miningRef.current.currentAttempts)
      setElapsedTime((now - miningRef.current.startTime) / 1000)
      
      return false
    }
    
    while (!found && !miningRef.current.shouldStop && currentNonce < MINING_CONFIG.MAX_NONCE_ATTEMPTS) {
      const shouldBreak = await processBatch()
      if (shouldBreak) break
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
    setHashesPerSecond(0)
    setElapsedTime(0)
    setRecentAttempts([])
    setShowReward(false)
    miningRef.current.currentAttempts = 0
  }, [])

  // 清理函數
  useEffect(() => {
    return () => {
      miningRef.current.shouldStop = true
    }
  }, [])

  // 難度統計數據
  const difficultyStats = [
    { zeros: 2, avgAttempts: '~100', time: '< 1秒', realWorld: '超級簡單' },
    { zeros: 3, avgAttempts: '~1,000', time: '~1秒', realWorld: '很簡單' },
    { zeros: 4, avgAttempts: '~10,000', time: '~10秒', realWorld: '簡單' },
    { zeros: 5, avgAttempts: '~100,000', time: '~2分鐘', realWorld: '中等' },
    { zeros: 19, avgAttempts: '~10²⁰', time: '需要超級電腦數年', realWorld: '真實比特幣難度' }
  ]

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
          體驗比特幣的工作量證明（PoW）機制，理解為什麼挖礦需要大量運算能力
        </p>
      </div>

      {/* 教育性卡片 */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* 卡片1 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <button
            onClick={() => setExpandedInfo(expandedInfo === 'why' ? null : 'why')}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-2">❓</span>
                <h4 className="font-bold text-gray-800">為什麼要挖礦？</h4>
              </div>
              <span className="text-bitcoin-orange">
                {expandedInfo === 'why' ? '▲' : '▼'}
              </span>
            </div>
          </button>
          {expandedInfo === 'why' && (
            <div className="px-4 pb-4 text-sm text-gray-700 border-t pt-3">
              <p className="mb-2">挖礦有兩個目的：</p>
              <p className="mb-1">1️⃣ <strong>驗證交易：</strong>確保沒有人作弊</p>
              <p>2️⃣ <strong>保護安全：</strong>讓駭客無法修改歷史記錄</p>
            </div>
          )}
        </div>

        {/* 卡片2 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <button
            onClick={() => setExpandedInfo(expandedInfo === 'real' ? null : 'real')}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🌍</span>
                <h4 className="font-bold text-gray-800">真實比特幣難度</h4>
              </div>
              <span className="text-bitcoin-orange">
                {expandedInfo === 'real' ? '▲' : '▼'}
              </span>
            </div>
          </button>
          {expandedInfo === 'real' && (
            <div className="px-4 pb-4 text-sm text-gray-700 border-t pt-3">
              <p className="mb-2">真實比特幣需要：</p>
              <p className="mb-1">🔢 開頭約 <strong>19個0</strong></p>
              <p className="mb-1">⏱️ 全球礦機每秒嘗試 <strong>數兆次</strong></p>
              <p>💡 平均 <strong>10分鐘</strong>找到一個區塊</p>
            </div>
          )}
        </div>

        {/* 卡片3 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <button
            onClick={() => setExpandedInfo(expandedInfo === 'power' ? null : 'power')}
            className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                <h4 className="font-bold text-gray-800">為何耗電？</h4>
              </div>
              <span className="text-bitcoin-orange">
                {expandedInfo === 'power' ? '▲' : '▼'}
              </span>
            </div>
          </button>
          {expandedInfo === 'power' && (
            <div className="px-4 pb-4 text-sm text-gray-700 border-t pt-3">
              <p className="mb-2">因為需要：</p>
              <p className="mb-1">🖥️ 大量電腦不停運算</p>
              <p className="mb-1">🔢 每秒嘗試數百萬次</p>
              <p>⚡ 比特幣全網耗電約等於一個中型國家！</p>
            </div>
          )}
        </div>
      </div>

      {/* 挖礦獎勵說明區 */}
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-yellow-300">
        <div className="flex items-center mb-6">
          <span className="text-4xl mr-3">🎁</span>
          <h3 className="text-2xl font-bold text-gray-800">挖礦可以得到什麼獎勵？</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 當前獎勵 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-400">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
              <span className="mr-2">💰</span> 當前區塊獎勵（2024-2028）
            </h4>
            <div className="space-y-3">
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-600 mb-1">區塊獎勵</p>
                <p className="text-3xl font-bold text-yellow-600">3.125 BTC</p>
                <p className="text-xs text-gray-500 mt-1">每個區塊固定獎勵</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-1">交易手續費</p>
                <p className="text-3xl font-bold text-green-600">0.1-0.5 BTC</p>
                <p className="text-xs text-gray-500 mt-1">用戶支付的小費</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-sm text-gray-600 mb-1">總計約</p>
                <p className="text-3xl font-bold text-orange-600">3.3-3.6 BTC</p>
                <p className="text-xs text-gray-500 mt-1">約 $320,000 - $350,000 美元</p>
              </div>
            </div>
          </div>

          {/* 減半歷史 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-400">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
              <span className="mr-2">📉</span> 比特幣減半歷史
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">2009-2012</span>
                <span className="font-bold text-gray-800">50 BTC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">2012-2016</span>
                <span className="font-bold text-gray-800">25 BTC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">2016-2020</span>
                <span className="font-bold text-gray-800">12.5 BTC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">2020-2024</span>
                <span className="font-bold text-gray-800">6.25 BTC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-100 rounded border-2 border-yellow-500">
                <span className="text-gray-800 font-semibold">2024-2028 ← 現在</span>
                <span className="font-bold text-yellow-600">3.125 BTC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span className="text-gray-500">2028-2032</span>
                <span className="font-bold text-gray-500">1.5625 BTC</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-gray-500">~2140 年</span>
                <span className="font-bold text-red-500">0 BTC</span>
              </div>
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-xs text-gray-700">
                <strong>💡 減半機制：</strong>每 210,000 個區塊（約 4 年）獎勵減半一次，
                確保比特幣總量永遠不超過 2100 萬枚。
              </p>
            </div>
          </div>
        </div>

        {/* 為什麼要挖礦 */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-400">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
            <span className="mr-2">🎯</span> 為什麼礦工願意花錢挖礦？
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <div className="text-2xl mb-2">💰</div>
              <h5 className="font-bold text-gray-800 mb-2">1. 賺取比特幣</h5>
              <p className="text-sm text-gray-700">
                每成功挖到一個區塊，立即獲得 3.125 BTC 獎勵，
                價值約 $300,000 美元！
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="text-2xl mb-2">💸</div>
              <h5 className="font-bold text-gray-800 mb-2">2. 收取手續費</h5>
              <p className="text-sm text-gray-700">
                每筆交易都會支付手續費給礦工，
                一個區塊可以收取 0.1-0.5 BTC 的小費。
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <div className="text-2xl mb-2">🚀</div>
              <h5 className="font-bold text-gray-800 mb-2">3. 看好未來</h5>
              <p className="text-sm text-gray-700">
                如果相信比特幣未來會漲價，
                現在挖到的幣以後會更值錢！
              </p>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>⚡ 成本與收益：</strong>
              挖礦需要購買礦機（$3,000-$10,000）和支付電費（每月 $200-$500），
              但成功挖到一個區塊的獎勵遠超成本。不過競爭非常激烈，
              需要強大的算力才有機會成功！
            </p>
          </div>
        </div>
      </div>

      {/* 成功挖礦獎勵彈窗 */}
      {showReward && (
        <div className="mb-8 bg-gradient-to-r from-yellow-100 via-yellow-50 to-orange-100 rounded-2xl p-6 sm:p-8 border-4 border-yellow-400 shadow-2xl animate-pulse">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              恭喜！成功挖到區塊！
            </h3>
            <p className="text-gray-600">你獲得了豐厚的挖礦獎勵</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl mb-2">💎</div>
              <p className="text-sm text-gray-600 mb-2">區塊獎勵</p>
              <p className="text-3xl font-bold text-yellow-600">
                {miningReward.blockReward.toFixed(3)} BTC
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl mb-2">💸</div>
              <p className="text-sm text-gray-600 mb-2">交易手續費</p>
              <p className="text-3xl font-bold text-green-600">
                {miningReward.transactionFees.toFixed(3)} BTC
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm text-gray-600 mb-2">總獎勵</p>
              <p className="text-3xl font-bold text-orange-600">
                {miningReward.totalReward.toFixed(3)} BTC
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
            <p className="text-lg mb-2">💵 總價值</p>
            <p className="text-4xl font-bold">
              ${miningReward.usdValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD
            </p>
          </div>

          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>💡 真實情況：</strong>在實際的比特幣網絡中，成功挖到一個區塊需要極其強大的算力。
              全球數百萬台礦機競爭，平均每 10 分鐘才有一個礦工成功。這就是為什麼挖礦需要專業設備和大量投資！
            </p>
          </div>
        </div>
      )}

      {/* 實時統計數據 */}
      {isMining && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-sm text-gray-600 mb-1">每秒嘗試次數</p>
            <p className="text-2xl font-bold text-blue-600">{hashesPerSecond.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">H/s</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
            <p className="text-sm text-gray-600 mb-1">總嘗試次數</p>
            <p className="text-2xl font-bold text-green-600">{attempts.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">次</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
            <p className="text-sm text-gray-600 mb-1">已花費時間</p>
            <p className="text-2xl font-bold text-purple-600">{elapsedTime.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-1">秒</p>
          </div>
        </div>
      )}

      {/* 最近嘗試列表 */}
      {recentAttempts.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">🔍</span>
            最近嘗試（即時顯示）
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentAttempts.map((attempt, index) => (
              <div
                key={`${attempt.nonce}-${attempt.timestamp}`}
                className={`p-3 rounded-lg border-2 ${
                  attempt.success
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-gray-700">
                    Nonce: {attempt.nonce}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    attempt.success
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {attempt.success ? '✓ 成功' : '✗ 失敗'}
                  </span>
                </div>
                <div className={`font-mono text-xs break-all ${
                  attempt.success ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {attempt.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 區塊資料區 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-bold mb-2 flex items-center">
            <span className="mr-2">📦</span>
            區塊編號（就像書的頁碼）
            <button
              onClick={() => setShowFieldHelp(showFieldHelp === 'blockNumber' ? null : 'blockNumber')}
              className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
            >
              ❓
            </button>
          </label>
          {showFieldHelp === 'blockNumber' && (
            <div className="mb-3 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>什麼是區塊編號？
              </h5>
              <p className="text-sm text-gray-700 mb-2">
                就像<strong>書的頁碼</strong>一樣！每個區塊都有自己的編號：
              </p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• 第 1 個區塊 = 第 1 頁</p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• 第 2 個區塊 = 第 2 頁</p>
              <p className="text-sm text-gray-700 pl-4 mb-2">• 依此類推...</p>
              <p className="text-sm text-gray-700">
                區塊依序排列，<strong>不能跳過或亂序</strong>，這樣才能確保區塊鏈的完整性！
              </p>
            </div>
          )}
          <input
            type="number"
            value={blockNumber}
            onChange={(e) => setBlockNumber(parseInt(e.target.value) || 1)}
            disabled={isMining}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2 flex items-center">
            <span className="mr-2">🔗</span>
            前一個雜湊值（連結上一頁）
            <button
              onClick={() => setShowFieldHelp(showFieldHelp === 'previousHash' ? null : 'previousHash')}
              className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
            >
              ❓
            </button>
          </label>
          {showFieldHelp === 'previousHash' && (
            <div className="mb-3 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>什麼是前一個雜湊值？
              </h5>
              <p className="text-sm text-gray-700 mb-2">
                就像<strong>書頁之間的鎖鏈</strong>！
              </p>
              <p className="text-sm text-gray-700 mb-2">
                每個區塊都包含前一個區塊的「指紋」（雜湊值），把所有區塊連在一起：
              </p>
              <p className="text-sm text-gray-700 pl-4 mb-1">📄 區塊 #1 的雜湊 → 存到區塊 #2</p>
              <p className="text-sm text-gray-700 pl-4 mb-1">📄 區塊 #2 的雜湊 → 存到區塊 #3</p>
              <p className="text-sm text-gray-700 pl-4 mb-2">📄 區塊 #3 的雜湊 → 存到區塊 #4</p>
              <p className="text-sm text-gray-700">
                <strong>⚠️ 如果有人想改區塊 #2，區塊 #3 和之後的所有區塊都會發現！</strong>
                這就是區塊鏈「防篡改」的關鍵！
              </p>
            </div>
          )}
          <input
            type="text"
            value={previousHash}
            onChange={(e) => setPreviousHash(e.target.value)}
            disabled={isMining}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none font-mono text-sm disabled:bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-bold mb-2 flex items-center">
            <span className="mr-2">💸</span>
            交易資料（這一頁記錄的轉帳）
            <button
              onClick={() => setShowFieldHelp(showFieldHelp === 'transactions' ? null : 'transactions')}
              className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
            >
              ❓
            </button>
          </label>
          {showFieldHelp === 'transactions' && (
            <div className="mb-3 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>什麼是交易資料？
              </h5>
              <p className="text-sm text-gray-700 mb-2">
                就像<strong>帳本上的轉帳記錄</strong>！
              </p>
              <p className="text-sm text-gray-700 mb-2">
                每個區塊都會記錄很多筆交易，例如：
              </p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• Alice 轉 1 BTC 給 Bob</p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• Charlie 轉 0.5 BTC 給 David</p>
              <p className="text-sm text-gray-700 pl-4 mb-2">• Eve 轉 2 BTC 給 Frank</p>
              <p className="text-sm text-gray-700">
                <strong>礦工的工作就是把這些交易打包到區塊裡</strong>，
                並且驗證這些交易是否合法（例如 Alice 真的有 1 BTC 可以轉）。
              </p>
            </div>
          )}
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
          <label className="block text-gray-700 font-bold mb-2 flex items-center">
            <span className="mr-2">🎲</span>
            Nonce 值（挖礦用的幸運數字）
            <button
              onClick={() => setShowFieldHelp(showFieldHelp === 'nonce' ? null : 'nonce')}
              className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
            >
              ❓
            </button>
          </label>
          {showFieldHelp === 'nonce' && (
            <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>什麼是 Nonce？
              </h5>
              <p className="text-sm text-gray-700 mb-2">
                就像<strong>樂透的號碼</strong>一樣！
              </p>
              <p className="text-sm text-gray-700 mb-2">
                礦工不斷嘗試不同的數字：
              </p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• 嘗試 Nonce = 0 → 雜湊不符合 ❌</p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• 嘗試 Nonce = 1 → 雜湊不符合 ❌</p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• 嘗試 Nonce = 2 → 雜湊不符合 ❌</p>
              <p className="text-sm text-gray-700 pl-4 mb-2">• ...嘗試到 Nonce = 12847 → 雜湊符合！✅</p>
              <p className="text-sm text-gray-700">
                <strong>找到「中獲」的 Nonce 就成功挖到區塊！</strong>
                這就是「挖礦」的過程 — 不斷嘗試不同的數字！
              </p>
            </div>
          )}
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
          <label className="block text-gray-700 font-bold mb-2 flex items-center">
            <span className="mr-2">⚙️</span>
            挖礦難度（謎題的困難程度）
            <button
              onClick={() => setShowFieldHelp(showFieldHelp === 'difficulty' ? null : 'difficulty')}
              className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
            >
              ❓
            </button>
          </label>
          {showFieldHelp === 'difficulty' && (
            <div className="mb-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <h5 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>什麼是挖礦難度？
              </h5>
              <p className="text-sm text-gray-700 mb-2">
                就像<strong>謎題的難度級別</strong>！
              </p>
              <p className="text-sm text-gray-700 mb-2">
                難度是由<strong>前導 0 的數量</strong>決定的：
              </p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• 2 個 0：超簡單（平均 100 次就找到）</p>
              <p className="text-sm text-gray-700 pl-4 mb-1">• 4 個 0：簡單（平均 10,000 次）</p>
              <p className="text-sm text-gray-700 pl-4 mb-2">• 19 個 0：超級難！（需要全球礦機每秒嘗試數兆次）</p>
              <p className="text-sm text-gray-700">
                <strong>前導 0 越多，難度越高，需要嘗試的次數越多！</strong>
                這就是為什麼真實比特幣挖礦需要強大的礦機！
              </p>
            </div>
          )}
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
        
        {attempts > 0 && !isMining && (
          <div className="mt-3 text-gray-600 text-center">
            總共嘗試了 <span className="font-bold text-bitcoin-orange">{attempts.toLocaleString()}</span> 次
            {elapsedTime > 0 && ` · 花費 ${elapsedTime.toFixed(2)} 秒`}
          </div>
        )}
      </div>

      {/* 控制按鈕 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      {/* 難度對比表 */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
        <h3 className="font-bold text-gray-800 mb-4 text-xl flex items-center">
          <span className="mr-2">📊</span>
          難度對比：理解為什麼真實挖礦這麼難
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-3 text-left">前導0數量</th>
                <th className="p-3 text-left">平均嘗試次數</th>
                <th className="p-3 text-left">預估時間</th>
                <th className="p-3 text-left">難度評級</th>
              </tr>
            </thead>
            <tbody>
              {difficultyStats.map((stat, index) => (
                <tr key={stat.zeros} className={`border-t ${index === difficultyStats.length - 1 ? 'bg-red-50 font-bold' : ''}`}>
                  <td className="p-3">{stat.zeros} 個 0</td>
                  <td className="p-3">{stat.avgAttempts}</td>
                  <td className="p-3">{stat.time}</td>
                  <td className="p-3">{stat.realWorld}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>💡 重點：</strong>真實比特幣需要約 19 個前導 0，這需要全球數百萬台礦機不停運算，
            每秒嘗試數兆次，才能在平均 10 分鐘內找到答案。這就是為什麼比特幣挖礦消耗大量電力！
          </p>
        </div>
      </div>
    </div>
  )
}

export default MiningSimulator
