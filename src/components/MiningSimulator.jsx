import { useState, useEffect, useRef, useCallback } from 'react'
import { BookOpen, ChevronDown, Gift, Coins, Gauge, TrendingUp, Hash, Link2, FileText, Dices, Target, HelpCircle } from 'lucide-react'
import { MINING_CONFIG } from '../constants/config'
import { Button } from './shared/Button'
import { InfoBox } from './shared/InfoBox'
import { Tooltip } from './shared'

function MiningSimulator() {
 const [blockNumber, setBlockNumber] = useState(0)
 const [transactions, setTransactions] = useState('Coinbase: Genesis Block')
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
 const [isPaused, setIsPaused] = useState(false)
 const [estimatedTime, setEstimatedTime] = useState(null)
 const [showEducation, setShowEducation] = useState(false)
 const [showRewardInfo, setShowRewardInfo] = useState(false)
 const [showComparison, setShowComparison] = useState(false)
 const [showSuccessDetail, setShowSuccessDetail] = useState(false)
 const [miningReward, setMiningReward] = useState({
 blockReward: 3.125,
 transactionFees: 0,
 totalReward: 0,
 usdValue: 0
 })
 
 const miningRef = useRef({
 shouldStop: false,
 isPaused: false,
 currentAttempts: 0,
 startTime: null,
 lastUpdateTime: null,
 pausedTime: 0
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

 // 計算預估時間
 const calculateEstimatedTime = useCallback(() => {
 const avgAttempts = Math.pow(16, difficulty)
 const estimatedSeconds = avgAttempts / 1000 // 假設每秒 1000 次
 setEstimatedTime(estimatedSeconds)
 }, [difficulty])

 // 自動挖礦 - 加入視覺化
 const startMining = useCallback(async () => {
 setIsMining(true)
 setAttempts(0)
 setSuccess(false)
 setElapsedTime(0)
 setRecentAttempts([])
 setIsPaused(false)
 miningRef.current.shouldStop = false
 miningRef.current.isPaused = false
 miningRef.current.currentAttempts = 0
 miningRef.current.startTime = Date.now()
 miningRef.current.lastUpdateTime = Date.now()
 miningRef.current.pausedTime = 0

 // 計算預估時間
 calculateEstimatedTime()
 
 let currentNonce = 0
 let found = false
 
 const processBatch = async () => {
 // 動態調整批次大小：難度越高，批次越大
 const batchSize = difficulty <= 3 ? 100 : difficulty === 4 ? 500 : 1000
 const batchStartTime = Date.now()

 // 檢查是否暫停
 while (miningRef.current.isPaused && !miningRef.current.shouldStop) {
 await new Promise(resolve => setTimeout(resolve, 100))
 }

 for (let i = 0; i < batchSize && !found && !miningRef.current.shouldStop; i++) {
 const testHash = await calculateHash(blockNumber, transactions, previousHash, currentNonce)
 miningRef.current.currentAttempts++
 
 // 只在每 50 次嘗試時更新一次最近嘗試列表（優化性能）
 if (i % 50 === 0 || checkDifficulty(testHash)) {
 setRecentAttempts(prev => {
 const newAttempt = {
 nonce: currentNonce,
 hash: testHash,
 success: checkDifficulty(testHash),
 timestamp: Date.now()
 }
 return [newAttempt, ...prev].slice(0, 10)
 })
 }
 
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
 }, [blockNumber, transactions, previousHash, difficulty, calculateHash, checkDifficulty, calculateEstimatedTime])

 // 暫停/繼續挖礦
 const togglePause = useCallback(() => {
 if (isPaused) {
 // 繼續
 miningRef.current.isPaused = false
 setIsPaused(false)
 } else {
 // 暫停
 miningRef.current.isPaused = true
 setIsPaused(true)
 }
 }, [isPaused])

 // 停止挖礦
 const stopMining = useCallback(() => {
 miningRef.current.shouldStop = true
 miningRef.current.isPaused = false
 setIsMining(false)
 setIsPaused(false)
 }, [])

 // 快速填入範例
 const fillExample = useCallback((example) => {
 setBlockNumber(example.blockNumber)
 setTransactions(example.transactions)
 setPreviousHash(example.previousHash)
 setNonce(0)
 setDifficulty(example.difficulty)
 }, [])

 // 重置
 const reset = useCallback(() => {
 setNonce(0)
 setAttempts(0)
 setSuccess(false)
 setIsMining(false)
 setIsPaused(false)
 setHashesPerSecond(0)
 setElapsedTime(0)
 setRecentAttempts([])
 setShowReward(false)
 setEstimatedTime(null)
 miningRef.current.currentAttempts = 0
 miningRef.current.isPaused = false
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
 <span className="text-5xl mr-4"></span>
 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
 挖礦模擬器
 </h2>
 </div>
 
 <p className="text-gray-600 text-lg leading-relaxed">
 體驗比特幣的<Tooltip term="工作量證明（PoW）" definition="Proof of Work，一種共識機制，要求礦工通過大量運算來證明他們完成了工作，從而獲得記帳權和獎勵。這種機制確保了區塊鏈的安全性。" type="primary" />機制，理解為什麼<Tooltip term="挖礦" definition="通過運算解決複雜的數學問題來驗證交易並獲得新比特幣的過程。礦工需要找到符合難度要求的雜湊值。" type="info" />需要大量運算能力
 </p>
 </div>

 {/* 精簡的教育卡片 */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
 <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
 <div className="flex items-center mb-2">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">為什麼要挖礦？</h4>
 </div>
 <p className="text-sm text-gray-700">驗證交易並保護<Tooltip term="區塊鏈" definition="一種分散式數據庫技術，將交易記錄打包成區塊並串連成鏈，形成不可篡改的帳本。" type="info" />安全</p>
 </div>

 <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
 <div className="flex items-center mb-2">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">真實比特幣</h4>
 </div>
 <p className="text-sm text-gray-700">需要約 <Tooltip term="19個前導0" definition="真實比特幣網絡的難度要求雜湊值開頭必須有約19個連續的0，這需要全球礦機每秒嘗試數兆次才能在平均10分鐘內找到。" type="warning" />，平均10分鐘</p>
 </div>

 <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
 <div className="flex items-center mb-2">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">當前獎勵</h4>
 </div>
 <p className="text-sm text-gray-700"><Tooltip term="3.125 BTC" definition="2024年第四次減半後的區塊獎勵。每21萬個區塊（約4年）獎勵減半一次，最初為50 BTC，直到2140年完全停止發行。" type="warning" /> + <Tooltip term="手續費" definition="用戶為加快交易確認速度而支付給礦工的小費，通常為0.1-0.5 BTC每區塊。" type="info" /> ≈ $300k</p>
 </div>
 </div>

 {/* 詳細教育內容 - 可摺疊 */}
 <div className="mb-6">
 <button
 onClick={() => setShowEducation(!showEducation)}
 className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-xl p-4 border-2 border-purple-200 transition-all duration-300 flex items-center justify-between"
 >
 <div className="flex items-center">
 <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
 <span className="font-bold text-gray-800 text-lg">詳細教學內容</span>
 </div>
 <ChevronDown
 className={`w-6 h-6 text-purple-600 transition-transform duration-300 ${showEducation ? 'rotate-180' : ''}`}
 />
 </button>

 {showEducation && (
 <div className="mt-4 space-y-4 animate-fadeIn">
 <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
 <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4">
 <div className="flex items-center mb-3">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">為什麼要挖礦？</h4>
 </div>
 <div className="text-sm text-gray-700 space-y-2">
 <p>1️⃣ <strong>驗證交易：</strong>確保沒有人作弊</p>
 <p>2️⃣ <strong>保護安全：</strong>讓駭客無法修改歷史記錄</p>
 </div>
 </div>

 <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4">
 <div className="flex items-center mb-3">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">真實比特幣難度</h4>
 </div>
 <div className="text-sm text-gray-700 space-y-2">
 <p> 開頭約 <strong>19個0</strong></p>
 <p> 全球礦機每秒嘗試 <strong>數兆次</strong></p>
 <p> 平均 <strong>10分鐘</strong>找到一個區塊</p>
 </div>
 </div>

 <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-4">
 <div className="flex items-center mb-3">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">為何耗電？</h4>
 </div>
 <div className="text-sm text-gray-700 space-y-2">
 <p> 大量電腦不停運算</p>
 <p> 每秒嘗試數百萬次</p>
 <p> 耗電約等於一個中型國家</p>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* 挖礦獎勵說明區 - 可摺疊 */}
 <div className="mb-6">
 <button
 onClick={() => setShowRewardInfo(!showRewardInfo)}
 className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 rounded-xl p-4 border-2 border-yellow-300 transition-all duration-300 flex items-center justify-between"
 >
 <div className="flex items-center">
 <Gift className="w-6 h-6 text-yellow-600 mr-3" />
 <span className="font-bold text-gray-800 text-lg">挖礦獎勵詳細說明</span>
 </div>
 <ChevronDown
 className={`w-6 h-6 text-yellow-600 transition-transform duration-300 ${showRewardInfo ? 'rotate-180' : ''}`}
 />
 </button>

 {showRewardInfo && (
 <div className="mt-4 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-yellow-300 animate-fadeIn">
 <div className="flex items-center mb-6">
 <Coins className="w-10 h-10 text-orange-600 mr-3" />
 <h3 className="text-2xl font-bold text-gray-800">挖礦可以得到什麼獎勵？</h3>
 </div>

 <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6">
 {/* 當前獎勵 */}
 <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-400">
 <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
 <span className="mr-2"></span> 當前區塊獎勵（2024-2028 年）
 </h4>
 <div className="space-y-3">
 <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
 <p className="text-sm text-gray-600 mb-1"><Tooltip term="區塊獎勵" definition="成功挖出新區塊的礦工獲得的比特幣獎勵。這是比特幣新幣發行的唯一方式，每21萬個區塊減半一次。" type="warning" /></p>
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
 <p className="text-xs text-gray-500 mt-1">約 $300,000 - $360,000 美元 (2025年價格)</p>
 </div>
 </div>
 </div>

 {/* 減半歷史 */}
 <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-400">
 <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
 <span className="mr-2"></span> <Tooltip term="比特幣減半" definition="Halving，每產生21萬個區塊（約4年）區塊獎勵減半一次的機制。這確保比特幣總量永遠不超過2100萬枚，賦予比特幣稀缺性。" type="primary" />歷史
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
 <span className="text-gray-800 font-semibold">2024-2028 ← 現在 (2025)</span>
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
 <strong> 減半機制：</strong>每 210,000 個區塊（約 4 年）獎勵減半一次，
 確保比特幣總量永遠不超過 2100 萬枚。
 </p>
 </div>
 </div>
 </div>

 {/* 為什麼要挖礦 */}
 <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-400">
 <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
 <span className="mr-2"></span> 為什麼礦工願意花錢挖礦？
 </h4>
 <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
 <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
 <div className="text-2xl mb-2"></div>
 <h5 className="font-bold text-gray-800 mb-2">1. 賺取比特幣</h5>
 <p className="text-sm text-gray-700">
 每成功挖到一個區塊，立即獲得 3.125 BTC 獎勵，
 價值約 $300,000 美元！
 </p>
 </div>
 <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
 <div className="text-2xl mb-2"></div>
 <h5 className="font-bold text-gray-800 mb-2">2. 收取手續費</h5>
 <p className="text-sm text-gray-700">
 每筆交易都會支付手續費給礦工，
 一個區塊可以收取 0.1-0.5 BTC 的小費。
 </p>
 </div>
 <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
 <div className="text-2xl mb-2"></div>
 <h5 className="font-bold text-gray-800 mb-2">3. 看好未來</h5>
 <p className="text-sm text-gray-700">
 如果相信比特幣未來會漲價，
 現在挖到的幣以後會更值錢！
 </p>
 </div>
 </div>
 <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
 <p className="text-sm text-gray-700">
 <strong> 成本與收益：</strong>
 挖礦需要購買礦機（$3,000-$10,000）和支付電費（每月 $200-$500），
 但成功挖到一個區塊的獎勵遠超成本。不過競爭非常激烈，
 需要強大的算力才有機會成功！
 </p>
 </div>
 </div>
 </div>
 )}
 </div>


 {/* 實時統計數據 */}
 {isMining && (
 <div className="mb-8">
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

 {estimatedTime && (
 <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
 <p className="text-sm text-gray-600 mb-1">預估時間</p>
 <p className="text-2xl font-bold text-orange-600">
 {estimatedTime < 60 ? `${estimatedTime.toFixed(1)}s` : `${(estimatedTime / 60).toFixed(1)}m`}
 </p>
 <p className="text-xs text-gray-500 mt-1">平均值</p>
 </div>
 )}
 </div>

 {/* 進度條 */}
 {estimatedTime && estimatedTime > 0 && (
 <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
 <div
 className="bg-gradient-to-r from-bitcoin-orange to-orange-600 h-full transition-all duration-300 flex items-center justify-end pr-2"
 style={{ width: `${Math.min((elapsedTime / estimatedTime) * 100, 100)}%` }}
 >
 {elapsedTime / estimatedTime > 0.1 && (
 <span className="text-xs text-white font-bold">
 {Math.min(Math.round((elapsedTime / estimatedTime) * 100), 100)}%
 </span>
 )}
 </div>
 </div>
 )}

 {/* 暫停狀態提示 */}
 {isPaused && (
 <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded animate-pulse">
 <p className="text-yellow-800 font-semibold flex items-center">
 <span className="mr-2"></span>
 挖礦已暫停 - 點擊「繼續」按鈕恢復挖礦
 </p>
 </div>
 )}
 </div>
 )}

 {/* 最近嘗試列表 */}
 {recentAttempts.length > 0 && (
 <div className="mb-8">
 <h3 className="font-bold text-gray-800 mb-3 flex items-center">
 <span className="mr-2"></span>
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
 {attempt.success ? ' 成功' : ' 失敗'}
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

 {/* 快速填入範例 */}
 <div className="mb-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
 <h3 className="font-bold text-gray-800 mb-4 text-xl flex items-center">
 <span className="mr-2"></span>
 快速填入範例
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
 <button
 onClick={() => fillExample({
 blockNumber: 0,
 transactions: 'Coinbase: Genesis Block - 50 BTC Reward',
 previousHash: '0000000000000000',
 difficulty: 2
 })}
 disabled={isMining}
 className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
 >
 簡單範例 (2個0)
 </button>
 <button
 onClick={() => fillExample({
 blockNumber: 100,
 transactions: 'Charlie -> David: 0.5 BTC, Eve -> Frank: 2 BTC',
 previousHash: 'a1b2c3d4e5f6g7h8',
 difficulty: 3
 })}
 disabled={isMining}
 className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
 >
 中等範例 (3個0)
 </button>
 <button
 onClick={() => fillExample({
 blockNumber: 1000,
 transactions: 'Alice -> Bob: 1.5 BTC, Charlie -> David: 0.8 BTC, Eve -> Frank: 2.3 BTC',
 previousHash: '00000a1b2c3d4e5f',
 difficulty: 4
 })}
 disabled={isMining}
 className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
 >
 困難範例 (4個0)
 </button>
 </div>
 </div>

 {/* 區塊資料區 */}
 <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
 <div>
 <label className="block text-gray-700 font-bold mb-2 flex items-center">
 <Hash className="w-5 h-5 text-blue-600 mr-2" />
 區塊編號（就像書的頁碼）
 <button
 onClick={() => setShowFieldHelp(showFieldHelp === 'blockNumber' ? null : 'blockNumber')}
 className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
 >
 <HelpCircle className="w-5 h-5" />
 </button>
 </label>
 {showFieldHelp === 'blockNumber' && (
 <div className="mb-3 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
 <h5 className="font-bold text-gray-800 mb-2 flex items-center">
 <Hash className="w-5 h-5 text-blue-600 mr-2" />什麼是區塊編號？
 </h5>
 <p className="text-sm text-gray-700 mb-2">
 就像<strong>書的頁碼</strong>一樣！每個區塊都有自己的編號：
 </p>
 <div className="bg-blue-100 rounded-lg p-3 mb-2">
 <p className="text-sm text-gray-800 font-semibold mb-1">🌟 特別注意：創世區塊</p>
 <p className="text-xs text-gray-700">真實的比特幣從 <strong>Block #0</strong> 開始！</p>
 </div>
 <p className="text-sm text-gray-700 pl-4 mb-1">• 區塊 #0 = 創世區塊 (Genesis Block)</p>
 <p className="text-sm text-gray-700 pl-4 mb-1">• 區塊 #1 = 第二個區塊</p>
 <p className="text-sm text-gray-700 pl-4 mb-1">• 區塊 #2 = 第三個區塊</p>
 <p className="text-sm text-gray-700 pl-4 mb-2">• 依此類推...</p>
 <p className="text-sm text-gray-700">
 區塊依序排列，<strong>不能跳過或亂序</strong>，這樣才能確保區塊鏈的完整性！
 </p>
 </div>
 )}
 <input
 type="number"
 value={blockNumber}
 onChange={(e) => setBlockNumber(Math.max(0, parseInt(e.target.value) || 0))}
 min="0"
 disabled={isMining}
 className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none disabled:bg-gray-100"
 />
 </div>

 <div>
 <label className="block text-gray-700 font-bold mb-2 flex items-center">
 <Link2 className="w-5 h-5 text-purple-600 mr-2" />
 前一個雜湊值（連結上一頁）
 <button
 onClick={() => setShowFieldHelp(showFieldHelp === 'previousHash' ? null : 'previousHash')}
 className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
 >
 <HelpCircle className="w-5 h-5" />
 </button>
 </label>
 {showFieldHelp === 'previousHash' && (
 <div className="mb-3 bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
 <h5 className="font-bold text-gray-800 mb-2 flex items-center">
 <Link2 className="w-5 h-5 text-purple-600 mr-2" />什麼是前一個雜湊值？
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
 <strong> 如果有人想改區塊 #2，區塊 #3 和之後的所有區塊都會發現！</strong>
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
 <FileText className="w-5 h-5 text-green-600 mr-2" />
 交易資料（這一頁記錄的轉帳）
 <button
 onClick={() => setShowFieldHelp(showFieldHelp === 'transactions' ? null : 'transactions')}
 className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
 >
 <HelpCircle className="w-5 h-5" />
 </button>
 </label>
 {showFieldHelp === 'transactions' && (
 <div className="mb-3 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
 <h5 className="font-bold text-gray-800 mb-2 flex items-center">
 <FileText className="w-5 h-5 text-green-600 mr-2" />什麼是交易資料？
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
 <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
 <div>
 <label className="block text-gray-700 font-bold mb-2 flex items-center">
 <Dices className="w-5 h-5 text-yellow-600 mr-2" />
 <Tooltip term="Nonce" definition="Number used Once 的縮寫，是礦工不斷變更的隨機數。礦工通過嘗試不同的 Nonce 值來尋找符合難度要求的雜湊值。" type="primary" /> 值（挖礦用的幸運數字）
 <button
 onClick={() => setShowFieldHelp(showFieldHelp === 'nonce' ? null : 'nonce')}
 className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
 >
 <HelpCircle className="w-5 h-5" />
 </button>
 </label>
 {showFieldHelp === 'nonce' && (
 <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
 <h5 className="font-bold text-gray-800 mb-2 flex items-center">
 <Dices className="w-5 h-5 text-yellow-600 mr-2" />什麼是 Nonce？
 </h5>
 <p className="text-sm text-gray-700 mb-2">
 就像<strong>樂透的號碼</strong>一樣！
 </p>
 <p className="text-sm text-gray-700 mb-2">
 礦工不斷嘗試不同的數字：
 </p>
 <p className="text-sm text-gray-700 pl-4 mb-1">• 嘗試 Nonce = 0 → 雜湊不符合 </p>
 <p className="text-sm text-gray-700 pl-4 mb-1">• 嘗試 Nonce = 1 → 雜湊不符合 </p>
 <p className="text-sm text-gray-700 pl-4 mb-1">• 嘗試 Nonce = 2 → 雜湊不符合 </p>
 <p className="text-sm text-gray-700 pl-4 mb-2">• ...嘗試到 Nonce = 12847 → 雜湊符合！</p>
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
 <Target className="w-5 h-5 text-red-600 mr-2" />
 <Tooltip term="挖礦難度" definition="決定雜湊值需要多少個前導0的參數。前導0越多，找到符合要求的雜湊值就越困難。比特幣網絡每2016個區塊（約2週）自動調整一次難度。" type="primary" />（謎題的困難程度）
 <button
 onClick={() => setShowFieldHelp(showFieldHelp === 'difficulty' ? null : 'difficulty')}
 className="ml-2 text-bitcoin-orange hover:text-orange-600 text-xl"
 >
 <HelpCircle className="w-5 h-5" />
 </button>
 </label>
 {showFieldHelp === 'difficulty' && (
 <div className="mb-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
 <h5 className="font-bold text-gray-800 mb-2 flex items-center">
 <Target className="w-5 h-5 text-red-600 mr-2" />什麼是挖礦難度？
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
 當前<Tooltip term="區塊雜湊值" definition="通過 SHA-256 演算法計算區塊內容（包含區塊編號、交易、前一個雜湊值和 Nonce）產生的64位十六進制數字。這是區塊的唯一識別碼。" type="info" />：
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
 成功！找到符合難度的雜湊值！
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
 <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
 <Button
 onClick={startMining}
 disabled={isMining}
 variant="primary"
 >
 {isMining ? ' 挖礦中...' : ' 開始挖礦'}
 </Button>

 <Button
 onClick={togglePause}
 disabled={!isMining}
 variant="secondary"
 >
 {isPaused ? ' 繼續' : ' 暫停'}
 </Button>

 <Button
 onClick={stopMining}
 disabled={!isMining}
 variant="danger"
 >
 停止
 </Button>

 <Button
 onClick={reset}
 disabled={isMining}
 variant="secondary"
 >
 重置
 </Button>
 </div>

 {/* 成功挖礦結果 - 緊湊型顯示 */}
 {showReward && (
 <div className="mb-6">
 {/* 簡潔成功提示 */}
 <div className="bg-gradient-to-r from-green-100 via-green-50 to-emerald-100 rounded-xl p-5 border-2 border-green-400">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center">
 <div className="text-4xl mr-3"></div>
 <div>
 <h3 className="text-xl font-bold text-gray-800">
 模擬挖礦成功！
 </h3>
 <p className="text-sm text-gray-600">難度 {difficulty} · {attempts.toLocaleString()} 次嘗試 · {elapsedTime.toFixed(2)}s</p>
 </div>
 </div>
 <button
 onClick={() => setShowSuccessDetail(!showSuccessDetail)}
 className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border-2 border-green-300 transition-all duration-300 font-semibold text-sm flex items-center"
 >
 <span className="mr-2">{showSuccessDetail ? '隱藏' : '查看'}詳情</span>
 <span className="transition-transform duration-300" style={{ transform: showSuccessDetail ? 'rotate(180deg)' : 'rotate(0deg)' }}>
 
 </span>
 </button>
 </div>

 {/* 快速統計（一行顯示） */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
 <div className="bg-white rounded-lg p-2 border border-green-200">
 <p className="text-xs text-gray-600">嘗試</p>
 <p className="text-sm font-bold text-green-600">{attempts.toLocaleString()}</p>
 </div>
 <div className="bg-white rounded-lg p-2 border border-blue-200">
 <p className="text-xs text-gray-600">時間</p>
 <p className="text-sm font-bold text-blue-600">{elapsedTime.toFixed(2)}s</p>
 </div>
 <div className="bg-white rounded-lg p-2 border border-purple-200">
 <p className="text-xs text-gray-600">算力</p>
 <p className="text-sm font-bold text-purple-600">{hashesPerSecond.toLocaleString()} H/s</p>
 </div>
 <div className="bg-white rounded-lg p-2 border border-orange-200">
 <p className="text-xs text-gray-600">假設獎勵</p>
 <p className="text-sm font-bold text-orange-600">${(miningReward.usdValue / 1000).toFixed(0)}k</p>
 </div>
 </div>
 </div>

 {/* 展開的詳細內容 */}
 {showSuccessDetail && (
 <div className="mt-4 space-y-4 animate-fadeIn">

 {/* 模擬 vs 真實對比 */}
 <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-300">
 <div className="flex items-center mb-4">
 <span className="text-3xl mr-3"></span>
 <h3 className="text-xl font-bold text-gray-800">
 這只是模擬！真實挖礦完全不同
 </h3>
 </div>

 <div className="grid md:grid-cols-2 gap-6 mb-6">
 {/* 你的模擬 */}
 <div className="bg-white rounded-xl p-5 border-2 border-green-300">
 <div className="flex items-center mb-4">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">你的模擬挖礦</h4>
 </div>
 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-gray-600">難度:</span>
 <span className="font-semibold text-green-600">{difficulty} 個前導 0</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">嘗試次數:</span>
 <span className="font-semibold text-green-600">{attempts.toLocaleString()} 次</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">花費時間:</span>
 <span className="font-semibold text-green-600">{elapsedTime.toFixed(2)} 秒</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">設備:</span>
 <span className="font-semibold text-green-600">瀏覽器模擬</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">競爭對手:</span>
 <span className="font-semibold text-green-600">0 人</span>
 </div>
 </div>
 </div>

 {/* 真實比特幣 */}
 <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-5 border-2 border-red-400">
 <div className="flex items-center mb-4">
 <span className="text-2xl mr-2"></span>
 <h4 className="font-bold text-gray-800">真實比特幣挖礦</h4>
 </div>
 <div className="space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-gray-600">難度:</span>
 <span className="font-semibold text-red-600">約 19 個前導 0</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">嘗試次數:</span>
 <span className="font-semibold text-red-600">數兆兆次</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">花費時間:</span>
 <span className="font-semibold text-red-600">平均 10 分鐘</span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">設備:</span>
 <span className="font-semibold text-red-600">專業 <Tooltip term="ASIC 礦機" definition="Application-Specific Integrated Circuit，專門為比特幣挖礦設計的晶片。相比普通電腦，ASIC 礦機的挖礦效率高出數千倍，但只能用於挖礦。" type="info" /></span>
 </div>
 <div className="flex justify-between">
 <span className="text-gray-600">競爭對手:</span>
 <span className="font-semibold text-red-600">全球數百萬台礦機</span>
 </div>
 </div>
 </div>
 </div>

 {/* 難度對比 */}
 <div className="bg-white rounded-xl p-5 border-2 border-yellow-300">
 <h4 className="font-bold text-gray-800 mb-4 flex items-center text-lg">
 <span className="mr-2"></span>
 難度差距有多大？
 </h4>

 {/* 你的難度 */}
 <div className="mb-4">
 <div className="flex justify-between items-center mb-2">
 <span className="text-sm font-semibold text-gray-700">你的難度 ({difficulty} 個 0)</span>
 <span className="text-sm font-bold text-green-600">約 {Math.pow(16, difficulty).toLocaleString()} 次</span>
 </div>
 <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
 <div className="bg-green-500 h-full flex items-center justify-center text-xs text-white font-bold" style={{ width: '8%' }}>
 你的難度
 </div>
 </div>
 <p className="text-xs text-gray-500 mt-1">瀏覽器幾秒鐘就能完成</p>
 </div>

 {/* 真實比特幣難度 */}
 <div className="mb-4">
 <div className="flex justify-between items-center mb-2">
 <span className="text-sm font-semibold text-gray-700">真實比特幣 (約 19-20 個 0)</span>
 <span className="text-sm font-bold text-red-600">約 10²³ 次嘗試</span>
 </div>
 <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
 <div className="bg-gradient-to-r from-red-500 to-red-700 h-full flex items-center justify-center text-xs text-white font-bold" style={{ width: '100%' }}>
 真實難度
 </div>
 </div>
 <p className="text-xs text-gray-500 mt-1">全球礦機全天候不停運轉，平均 10 分鐘找到一個</p>
 </div>

 {/* 差距說明 */}
 <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-red-500">
 <p className="text-sm font-bold text-gray-800 mb-2">
 💡 差距倍數：約 10¹⁸ 倍 (1,000,000,000,000,000,000 倍)
 </p>
 <p className="text-xs text-gray-700 leading-relaxed">
 如果你的瀏覽器挖礦速度是「<strong>1滴水</strong>」，<br/>
 那真實比特幣網絡的算力就是「<strong>整個太平洋的水量</strong>」！
 </p>
 </div>
 </div>

 {/* 教育總結 */}
 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-4">
 <p className="text-sm text-gray-700 font-semibold mb-2">
 重要觀念：
 </p>
 <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
 <li>你剛才的模擬只是為了學習原理，難度僅為真實比特幣的極小一部分</li>
 <li>真實比特幣需要專業 ASIC 礦機，每秒可嘗試數百兆次</li>
 <li>個人電腦或瀏覽器<strong>永遠無法</strong>獨自挖到真實比特幣</li>
 <li>礦工必須加入礦池，並使用數萬美元的設備才有機會獲利</li>
 <li>全球礦工每天消耗的電力約等於一個中型國家的用電量</li>
 </ul>
 </div>
 </div>

 {/* 模擬獎勵顯示（較小且明確標示為模擬） */}
 <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-300">
 <div className="flex items-center mb-4">
 <span className="text-2xl mr-2"></span>
 <div>
 <h4 className="font-bold text-gray-800">假設獎勵（僅供參考）</h4>
 <p className="text-xs text-gray-600">如果這是真實的比特幣區塊</p>
 </div>
 </div>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">區塊獎勵</p>
 <p className="text-lg font-bold text-yellow-600">{miningReward.blockReward.toFixed(3)}</p>
 <p className="text-xs text-gray-500">BTC</p>
 </div>
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">手續費</p>
 <p className="text-lg font-bold text-green-600">{miningReward.transactionFees.toFixed(3)}</p>
 <p className="text-xs text-gray-500">BTC</p>
 </div>
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">總計</p>
 <p className="text-lg font-bold text-orange-600">{miningReward.totalReward.toFixed(3)}</p>
 <p className="text-xs text-gray-500">BTC</p>
 </div>
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">價值</p>
 <p className="text-lg font-bold text-green-600">${(miningReward.usdValue / 1000).toFixed(0)}k</p>
 <p className="text-xs text-gray-500">USD</p>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 {/* 真實比特幣網絡算力對比 - 可摺疊 */}
 <div className="mb-6">
 <button
 onClick={() => setShowComparison(!showComparison)}
 className="w-full bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 rounded-xl p-4 border-2 border-red-300 transition-all duration-300 flex items-center justify-between"
 >
 <div className="flex items-center">
 <Gauge className="w-6 h-6 text-red-600 mr-3" />
 <span className="font-bold text-gray-800 text-lg">算力對比與難度說明</span>
 </div>
 <ChevronDown
 className={`w-6 h-6 text-red-600 transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`}
 />
 </button>

 {showComparison && (
 <div className="mt-4 space-y-6 animate-fadeIn">
 {/* 真實比特幣網絡算力對比 */}
 <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-red-300">
 <h3 className="font-bold text-gray-800 mb-4 text-xl flex items-center">
 <TrendingUp className="w-7 h-7 text-red-600 mr-2" />
 你的瀏覽器 vs 真實比特幣網絡
 </h3>
 <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
 <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-300">
 <h4 className="font-bold text-gray-800 mb-4 flex items-center">
 <span className="mr-2"></span> 你的瀏覽器算力
 </h4>
 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <span className="text-gray-600">挖礦速度:</span>
 <span className="font-bold text-blue-600">~1,000 H/s</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-gray-600">難度 4 所需時間:</span>
 <span className="font-bold text-blue-600">~10-30 秒</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-gray-600">設備:</span>
 <span className="font-bold text-blue-600">一般電腦</span>
 </div>
 </div>
 </div>

 <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-400">
 <h4 className="font-bold text-gray-800 mb-4 flex items-center">
 <span className="mr-2"></span> 真實比特幣網絡
 </h4>
 <div className="space-y-3">
 <div className="flex justify-between items-center">
 <span className="text-gray-600"><Tooltip term="全網算力" definition="Hash Rate，整個比特幣網絡所有礦工算力的總和。以每秒能計算多少次雜湊值衡量，單位有 H/s、KH/s、MH/s、GH/s、TH/s、PH/s、EH/s。" type="info" />:</span>
 <span className="font-bold text-red-600">~600 EH/s</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-gray-600">一個區塊時間:</span>
 <span className="font-bold text-red-600">~10 分鐘</span>
 </div>
 <div className="flex justify-between items-center">
 <span className="text-gray-600">設備:</span>
 <span className="font-bold text-red-600">專業礦機</span>
 </div>
 </div>
 </div>
 </div>

 <div className="mt-6 bg-red-100 border-l-4 border-red-500 p-4 rounded">
 <p className="text-sm text-gray-700 mb-2">
 <strong> 算力差距：</strong>
 </p>
 <p className="text-sm text-gray-700">
 1 EH/s (Exahash) = 1,000,000,000,000,000,000 H/s (100京次/秒)
 </p>
 <p className="text-sm text-gray-700 mt-2">
 <strong>真實比特幣網絡的算力是你瀏覽器的 600,000,000,000,000,000 倍！</strong>
 </p>
 <p className="text-sm text-gray-700 mt-2">
 這就是為什麼個人電腦無法獨自挖到比特幣，必須使用專業礦機加入<Tooltip term="礦池" definition="Mining Pool，多個礦工聯合挖礦的組織。礦池將所有成員的算力集中起來，找到區塊後按算力貢獻比例分配獎勵，讓小礦工也能獲得穩定收益。" type="info" />才有機會！
 </p>
 </div>
 </div>

 {/* 難度對比表 */}
 <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
 <h3 className="font-bold text-gray-800 mb-4 text-xl flex items-center">
 <span className="mr-2"></span>
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
 <strong> 重點：</strong>真實比特幣需要約 19 個前導 0，這需要全球數百萬台礦機不停運算，
 每秒嘗試數兆次，才能在平均 10 分鐘內找到答案。這就是為什麼比特幣挖礦消耗大量電力！
 </p>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 )
}

export default MiningSimulator
