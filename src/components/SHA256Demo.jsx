import { useState } from 'react'
import { BookOpen, ChevronDown } from 'lucide-react'
import { Tooltip } from './shared'

function SHA256Demo() {
 const [inputText, setInputText] = useState('')
 const [hash, setHash] = useState('')
 const [isCalculating, setIsCalculating] = useState(false)

 // 比對模式
 const [compareMode, setCompareMode] = useState(false)
 const [inputText2, setInputText2] = useState('')
 const [hash2, setHash2] = useState('')

 // 教育性展示
 const [showEducation, setShowEducation] = useState(false)
 const [highlightDiff, setHighlightDiff] = useState(true)

 // 計算 SHA-256 雜湊值
 const calculateHash = async (text) => {
 if (!text) {
 setHash('')
 return
 }

 setIsCalculating(true)
 
 // 使用 Web Crypto API
 const encoder = new TextEncoder()
 const data = encoder.encode(text)
 const hashBuffer = await crypto.subtle.digest('SHA-256', data)
 const hashArray = Array.from(new Uint8Array(hashBuffer))
 const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
 
 setTimeout(() => {
 setHash(hashHex)
 setIsCalculating(false)
 }, 100)
 }

 const handleInputChange = (e) => {
 const text = e.target.value
 setInputText(text)
 calculateHash(text)
 }

 const handleInputChange2 = async (text) => {
 setInputText2(text)
 if (!text) {
 setHash2('')
 return
 }

 const encoder = new TextEncoder()
 const data = encoder.encode(text)
 const hashBuffer = await crypto.subtle.digest('SHA-256', data)
 const hashArray = Array.from(new Uint8Array(hashBuffer))
 const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
 setHash2(hashHex)
 }

 const testExample = (text) => {
 setInputText(text)
 calculateHash(text)
 }

 // 快速示例
 const loadExample = (example) => {
 setInputText(example.text1)
 calculateHash(example.text1)
 setInputText2(example.text2)
 handleInputChange2(example.text2)
 setCompareMode(true)
 }

 // 預設差異示例
 const examples = [
 {
 id: 1,
 name: '增加1字元',
 text1: 'Bitcoin',
 text2: 'Bitcoinx',
 description: '在結尾增加一個字元'
 },
 {
 id: 2,
 name: '修改1字元',
 text1: 'Bitcoin',
 text2: 'Bitc0in',
 description: 'o改為0'
 },
 {
 id: 3,
 name: '相同長度',
 text1: 'ABC',
 text2: 'ABD',
 description: '長度相同但內容不同'
 },
 {
 id: 4,
 name: '大小寫',
 text1: 'bitcoin',
 text2: 'Bitcoin',
 description: '只改變大小寫'
 },
 {
 id: 5,
 name: '長度差異大',
 text1: 'BTC',
 text2: 'Bitcoin',
 description: '長度差異較大'
 }
 ]

 // 計算輸入文字差異（區分長度和內容）
 const calculateInputDifference = () => {
 if (!inputText || !inputText2) return { lengthDiff: 0, contentDiff: 0, total: 0 }

 const lengthDiff = Math.abs(inputText.length - inputText2.length)
 const minLength = Math.min(inputText.length, inputText2.length)

 let contentDiff = 0
 for (let i = 0; i < minLength; i++) {
 if (inputText[i] !== inputText2[i]) {
 contentDiff++
 }
 }

 return {
 lengthDiff,
 contentDiff,
 total: contentDiff + lengthDiff
 }
 }

 // 計算兩個 hash 的不同字元數
 const countDifferences = () => {
 if (!hash || !hash2) return 0
 let diff = 0
 for (let i = 0; i < Math.min(hash.length, hash2.length); i++) {
 if (hash[i] !== hash2[i]) diff++
 }
 return diff
 }

 // 高亮顯示不同的字元
 const renderHashWithDiff = (hash1, hash2) => {
 if (!highlightDiff || !hash2) {
 return <span>{hash1}</span>
 }

 return hash1.split('').map((char, i) => (
 <span
 key={i}
 className={char !== hash2[i] ? 'bg-yellow-300 text-red-700' : ''}
 >
 {char}
 </span>
 ))
 }

 return (
 <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
 {/* 標題區 */}
 <div className="mb-8">
 <div className="flex items-center mb-4">
 <span className="text-5xl mr-4"></span>
 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
 SHA-256 雜湊體驗器
 </h2>
 </div>
 
 <p className="text-gray-600 text-lg leading-relaxed">
 <Tooltip term="SHA-256" definition="Secure Hash Algorithm 256-bit，一種密碼學雜湊函數。比特幣使用它來創建區塊和交易的唯一識別碼，具有不可逆、抗碰撞、雪崩效應等特性。" type="primary" /> 是比特幣使用的核心加密演算法。它可以將任意長度的資料轉換成固定 64 字元的<Tooltip term="雜湊值" definition="Hash Value，通過雜湊函數計算得出的固定長度字串，作為數據的唯一指紋。相同輸入永遠產生相同雜湊值，即使輸入稍有變化，雜湊值也會完全不同。" type="info" />。
 </p>
 </div>

 {/* 精簡特性卡片 */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
 <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
 <div className="flex items-center">
 <span className="text-2xl mr-2"></span>
 <div>
 <h4 className="font-bold text-gray-800 text-sm"><Tooltip term="不可逆性" definition="單向函數特性，只能從輸入計算雜湊值，無法從雜湊值反推回原始輸入。這確保了比特幣地址和交易的安全性。" type="info" /></h4>
 <p className="text-xs text-gray-600">無法反推原始資料</p>
 </div>
 </div>
 </div>

 <div className="bg-orange-50 rounded-lg p-3 border-2 border-orange-200">
 <div className="flex items-center">
 <span className="text-2xl mr-2"></span>
 <div>
 <h4 className="font-bold text-gray-800 text-sm"><Tooltip term="雪崩效應" definition="Avalanche Effect，輸入的微小變化（哪怕只改一個字母）會導致輸出的雜湊值完全不同，平均改變約50%的位元。這使得任何篡改都會被立即發現。" type="warning" /></h4>
 <p className="text-xs text-gray-600">改一字元，完全不同</p>
 </div>
 </div>
 </div>

 <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
 <div className="flex items-center">
 <span className="text-2xl mr-2"></span>
 <div>
 <h4 className="font-bold text-gray-800 text-sm">固定長度</h4>
 <p className="text-xs text-gray-600">永遠 64 字元</p>
 </div>
 </div>
 </div>
 </div>

 {/* 差異示例選擇 */}
 <div className="mb-6">
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-lg font-bold text-gray-800">體驗不同差異情境</h3>
 <button
 onClick={() => setCompareMode(!compareMode)}
 className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
 compareMode
 ? 'bg-red-500 hover:bg-red-600 text-white'
 : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
 }`}
 >
 {compareMode ? '關閉比對' : '開啟比對'}
 </button>
 </div>
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
 {examples.map(example => (
 <button
 key={example.id}
 onClick={() => loadExample(example)}
 className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
 title={example.description}
 >
 <div className="font-bold">{example.name}</div>
 <div className="text-xs opacity-80 mt-1">{example.description}</div>
 </button>
 ))}
 </div>
 </div>

 {/* 輸入輸出區 */}
 <div className={`grid ${compareMode ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6 mb-6`}>
 {/* 第一組輸入輸出 */}
 <div>
 <label className="block text-gray-700 font-bold mb-2 text-lg">
 ✍️ 輸入 {compareMode && '1'}：
 </label>
 <input
 type="text"
 value={inputText}
 onChange={handleInputChange}
 placeholder="試試看輸入你的名字..."
 className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-base transition-all duration-300 shadow-sm hover:shadow-md mb-3"
 />

 {hash && (
 <div className="animate-fadeIn">
 <label className="block text-gray-700 font-semibold mb-2 text-sm">
 Hash 1：
 </label>
 <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 border-2 border-bitcoin-orange shadow-md">
 <div className={`text-green-400 font-mono text-sm break-all leading-relaxed ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
 {compareMode && hash2 ? renderHashWithDiff(hash, hash2) : hash}
 </div>
 </div>
 {!compareMode && (
 <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
 <span>長度：<span className="font-bold text-bitcoin-orange">{hash.length}</span> 字元</span>
 <span>256 bits</span>
 </div>
 )}
 </div>
 )}
 </div>

 {/* 第二組輸入輸出（比對模式） */}
 {compareMode && (
 <div className="animate-fadeIn">
 <label className="block text-gray-700 font-bold mb-2 text-lg">
 ✍️ 輸入 2：
 </label>
 <input
 type="text"
 value={inputText2}
 onChange={(e) => handleInputChange2(e.target.value)}
 placeholder="修改一個字元試試..."
 className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-base transition-all duration-300 shadow-sm hover:shadow-md mb-3"
 />

 {hash2 && (
 <div className="animate-fadeIn">
 <label className="block text-gray-700 font-semibold mb-2 text-sm">
 Hash 2：
 </label>
 <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 border-2 border-purple-500 shadow-md">
 <div className="text-purple-400 font-mono text-sm break-all leading-relaxed">
 {renderHashWithDiff(hash2, hash)}
 </div>
 </div>
 </div>
 )}
 </div>
 )}
 </div>

 {/* 比對統計 - 改进版 */}
 {compareMode && hash && hash2 && (() => {
 const inputDiff = calculateInputDifference()
 const hashDiffCount = countDifferences()
 const changeRate = ((hashDiffCount / 64) * 100).toFixed(0)

 return (
 <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300 animate-fadeIn">
 <div className="flex items-center justify-between mb-4">
 <h4 className="font-bold text-gray-800 text-xl">差異分析</h4>
 <label className="flex items-center cursor-pointer">
 <input
 type="checkbox"
 checked={highlightDiff}
 onChange={(e) => setHighlightDiff(e.target.checked)}
 className="mr-2"
 />
 <span className="text-sm text-gray-700">高亮差異</span>
 </label>
 </div>

 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {/* 輸入差異 */}
 <div className="bg-white rounded-xl p-4 border-2 border-blue-300 shadow-sm">
 <p className="text-sm text-gray-600 mb-2">輸入差異</p>
 <p className="text-3xl font-bold text-blue-600 mb-1">
 {inputDiff.total}
 </p>
 <div className="text-xs text-gray-500 space-y-1">
 {inputDiff.lengthDiff > 0 && (
 <p>長度: +{inputDiff.lengthDiff} 字元</p>
 )}
 {inputDiff.contentDiff > 0 && (
 <p>內容: {inputDiff.contentDiff} 字元不同</p>
 )}
 {inputDiff.lengthDiff === 0 && inputDiff.contentDiff === 0 && (
 <p>完全相同</p>
 )}
 </div>
 </div>

 {/* Hash 差異數字 */}
 <div className="bg-white rounded-xl p-4 border-2 border-red-300 shadow-sm">
 <p className="text-sm text-gray-600 mb-2">Hash 差異</p>
 <p className="text-3xl font-bold text-red-600 mb-1">
 {hashDiffCount}
 </p>
 <p className="text-xs text-gray-500">共 64 字元</p>
 </div>

 {/* 改變率 */}
 <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-sm">
 <p className="text-sm text-gray-600 mb-2">改變率</p>
 <p className="text-3xl font-bold text-orange-600 mb-1">
 {changeRate}%
 </p>
 <p className="text-xs text-gray-500">
 {changeRate > 40 ? '高度變化' : changeRate > 20 ? '中度變化' : '輕微變化'}
 </p>
 </div>

 {/* 雪崩效應確認 */}
 <div className="bg-white rounded-xl p-4 border-2 border-green-300 shadow-sm">
 <p className="text-sm text-gray-600 mb-2">雪崩效應</p>
 <p className="text-3xl font-bold text-green-600 mb-1">
 {changeRate >= 40 ? '✓' : '—'}
 </p>
 <p className="text-xs text-gray-500">
 {changeRate >= 40 ? '已觸發' : '未達標準'}
 </p>
 </div>
 </div>

 {/* 說明文字 */}
 <div className="mt-4 bg-white/50 rounded-lg p-4 border border-yellow-400">
 <p className="text-sm text-gray-700 leading-relaxed">
 <strong>💡 雪崩效應：</strong>
 輸入只改變 <span className="font-bold text-blue-600">{inputDiff.total}</span> 個字元
 {inputDiff.lengthDiff > 0 && inputDiff.contentDiff > 0 &&
 `（${inputDiff.contentDiff} 個內容差異 + ${inputDiff.lengthDiff} 個長度差異）`}
 ，卻造成 Hash 值 <span className="font-bold text-red-600">{hashDiffCount}/64</span> 字元改變
 （<span className="font-bold text-orange-600">{changeRate}%</span>）！
 這就是 SHA-256 的「敏感性」特性。
 </p>
 </div>
 </div>
 )
 })()}

 {/* 測試範例按鈕 */}
 <div className="border-t-2 border-gray-200 pt-6 mb-6">
 <p className="text-gray-700 font-semibold mb-3 text-base"> 快速測試範例：</p>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
 <button
 onClick={() => testExample('Hello')}
 className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
 >
 Hello
 </button>
 <button
 onClick={() => testExample('Bitcoin')}
 className="bg-gradient-to-r from-bitcoin-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
 >
 Bitcoin
 </button>
 <button
 onClick={() => testExample('比特幣')}
 className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
 >
 比特幣
 </button>
 <button
 onClick={() => testExample('Satoshi Nakamoto')}
 className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
 >
 Satoshi
 </button>
 <button
 onClick={() => testExample('區塊鏈')}
 className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-lg"
 >
 區塊鏈
 </button>
 </div>
 </div>

 {/* 教育說明區 - 可摺疊 */}
 <div>
 <button
 onClick={() => setShowEducation(!showEducation)}
 className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl p-4 border-2 border-indigo-200 transition-all duration-300 flex items-center justify-between"
 >
 <div className="flex items-center">
 <BookOpen className="w-6 h-6 text-indigo-600 mr-3" />
 <span className="font-bold text-gray-800 text-lg">SHA-256 在比特幣中的應用</span>
 </div>
 <ChevronDown
 className={`w-6 h-6 text-indigo-600 transition-transform duration-300 ${showEducation ? 'rotate-180' : ''}`}
 />
 </button>

 {showEducation && (
 <div className="mt-4 space-y-6 animate-fadeIn">
 {/* 卡片 1: 區塊鏈接 */}
 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-300 shadow-lg">
 <div className="mb-6">
 <div className="flex items-center mb-3">
 <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
 1
 </div>
 <h4 className="font-bold text-gray-800 text-xl sm:text-2xl">
 區塊鏈接（Block Chaining）
 </h4>
 </div>
 <p className="text-gray-700 text-base leading-relaxed">
 就像<strong>連鎖扣環</strong>一樣，每個區塊都緊緊扣住前一個區塊！
 </p>
 </div>

 {/* 視覺化說明 */}
 <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm">
 <p className="text-sm text-gray-600 mb-4 font-semibold">📌 運作方式：</p>
 <div className="space-y-4">
 {/* 區塊流程 */}
 <div className="flex flex-col sm:flex-row items-center gap-3">
 {/* 區塊 #1 */}
 <div className="flex-1 bg-blue-100 rounded-lg p-4 border-2 border-blue-400">
 <p className="text-sm font-bold text-blue-800 mb-3">📦 區塊 #1</p>
 <div className="space-y-2 text-xs">
 <div className="bg-white rounded px-2 py-1.5">
 <p className="text-gray-600 text-xs mb-0.5">📝 交易內容</p>
 <p className="text-gray-800 font-medium">Alice→Bob</p>
 </div>
 <div className="bg-blue-50 rounded px-2 py-1.5 border border-blue-300">
 <p className="text-gray-600 text-xs mb-0.5">🔐 本區塊 Hash</p>
 <p className="font-mono text-blue-600 font-bold">abc123...</p>
 </div>
 </div>
 </div>

 <div className="flex flex-col items-center justify-center">
 <div className="text-2xl font-bold text-blue-500">→</div>
 <p className="text-xs text-gray-500 mt-1 hidden sm:block">使用此Hash</p>
 </div>

 {/* 區塊 #2 */}
 <div className="flex-1 bg-green-100 rounded-lg p-4 border-2 border-green-400">
 <p className="text-sm font-bold text-green-800 mb-3">📦 區塊 #2</p>
 <div className="space-y-2 text-xs">
 <div className="bg-white rounded px-2 py-1.5">
 <p className="text-gray-600 text-xs mb-0.5">📝 交易內容</p>
 <p className="text-gray-800 font-medium">Charlie→David</p>
 </div>
 <div className="bg-yellow-50 rounded px-2 py-1.5 border border-yellow-400">
 <p className="text-gray-600 text-xs mb-0.5">🔗 前一個 Hash</p>
 <p className="font-mono text-green-700 font-bold">abc123...</p>
 </div>
 <div className="bg-green-50 rounded px-2 py-1.5 border border-green-300">
 <p className="text-gray-600 text-xs mb-0.5">🔐 本區塊 Hash</p>
 <p className="font-mono text-green-600 font-bold">def456...</p>
 </div>
 </div>
 </div>

 <div className="flex flex-col items-center justify-center">
 <div className="text-2xl font-bold text-green-500">→</div>
 <p className="text-xs text-gray-500 mt-1 hidden sm:block">使用此Hash</p>
 </div>

 {/* 區塊 #3 */}
 <div className="flex-1 bg-purple-100 rounded-lg p-4 border-2 border-purple-400">
 <p className="text-sm font-bold text-purple-800 mb-3">📦 區塊 #3</p>
 <div className="space-y-2 text-xs">
 <div className="bg-white rounded px-2 py-1.5">
 <p className="text-gray-600 text-xs mb-0.5">📝 交易內容</p>
 <p className="text-gray-800 font-medium">Eve→Frank</p>
 </div>
 <div className="bg-yellow-50 rounded px-2 py-1.5 border border-yellow-400">
 <p className="text-gray-600 text-xs mb-0.5">🔗 前一個 Hash</p>
 <p className="font-mono text-purple-700 font-bold">def456...</p>
 </div>
 <div className="bg-purple-50 rounded px-2 py-1.5 border border-purple-300">
 <p className="text-gray-600 text-xs mb-0.5">🔐 本區塊 Hash</p>
 <p className="font-mono text-purple-600 font-bold">ghi789...</p>
 </div>
 </div>
 </div>
 </div>

 {/* 說明 */}
 <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
 <p className="text-sm text-gray-800 leading-relaxed">
 💡 <strong>為什麼不能篡改？</strong><br/>
 如果有人想修改區塊 #1 的內容，它的 Hash 就會改變。
 但區塊 #2 記錄的是<strong>舊的 Hash</strong>，馬上就會被發現！
 就像多米諾骨牌，動一個就全部倒！
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* 卡片 2: 工作量證明 */}
 <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 sm:p-8 border-2 border-orange-300 shadow-lg">
 <div className="mb-6">
 <div className="flex items-center mb-3">
 <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
 2
 </div>
 <h4 className="font-bold text-gray-800 text-xl sm:text-2xl">
 工作量證明（Proof of Work）
 </h4>
 </div>
 <p className="text-gray-700 text-base leading-relaxed">
 就像<strong>抽獎遊戲</strong>一樣，礦工要不斷嘗試找到「幸運數字」！
 </p>
 </div>

 {/* 視覺化說明 */}
 <div className="bg-white rounded-xl p-5 border-2 border-orange-200 shadow-sm">
 <p className="text-sm text-gray-600 mb-4 font-semibold">📌 挖礦過程：</p>

 {/* 目標說明 */}
 <div className="bg-orange-50 rounded-lg p-4 mb-4 border-l-4 border-orange-400">
 <p className="text-sm font-bold text-orange-800 mb-2">🎯 目標：找到開頭有很多 0 的 Hash</p>
 <p className="text-xs text-gray-700">例如: 需要找到 <span className="font-mono font-bold text-orange-600">0000abc...</span> 這樣的 Hash</p>
 </div>

 {/* 嘗試過程 */}
 <div className="space-y-3">
 <div className="flex items-center bg-red-50 rounded-lg p-3 border-l-4 border-red-400">
 <span className="text-2xl mr-3">❌</span>
 <div className="flex-1">
 <p className="text-sm font-mono text-gray-800">
 嘗試 Nonce: <span className="font-bold">1</span> → Hash:
 <span className="text-red-600 ml-2">3a7f2b...</span>
 </p>
 <p className="text-xs text-gray-600">開頭不是 0，繼續嘗試...</p>
 </div>
 </div>

 <div className="flex items-center bg-red-50 rounded-lg p-3 border-l-4 border-red-400">
 <span className="text-2xl mr-3">❌</span>
 <div className="flex-1">
 <p className="text-sm font-mono text-gray-800">
 嘗試 Nonce: <span className="font-bold">2</span> → Hash:
 <span className="text-red-600 ml-2">8c5d9e...</span>
 </p>
 <p className="text-xs text-gray-600">還是不對，繼續...</p>
 </div>
 </div>

 <div className="text-center text-gray-400 text-sm">... 嘗試了 12343 次 ...</div>

 <div className="flex items-center bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
 <span className="text-2xl mr-3">✅</span>
 <div className="flex-1">
 <p className="text-sm font-mono text-gray-800">
 嘗試 Nonce: <span className="font-bold">12345</span> → Hash:
 <span className="text-green-600 font-bold ml-2">0000abc...</span>
 </p>
 <p className="text-xs text-green-700 font-semibold">成功！可以獲得獎勵了！</p>
 </div>
 </div>
 </div>

 {/* 說明 */}
 <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400 mt-4">
 <p className="text-sm text-gray-800 leading-relaxed">
 💡 <strong>真實情況：</strong><br/>
 真正的比特幣挖礦需要<strong>19個前導0</strong>，
 全球礦工每秒要嘗試<strong>數兆次</strong>，
 平均<strong>10分鐘</strong>才有一個礦工成功！
 </p>
 </div>
 </div>
 </div>

 {/* 卡片 3: 交易驗證與地址生成 */}
 <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border-2 border-green-300 shadow-lg">
 <div className="mb-6">
 <div className="flex items-center mb-3">
 <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
 3
 </div>
 <h4 className="font-bold text-gray-800 text-xl sm:text-2xl">
 交易驗證與地址生成
 </h4>
 </div>
 <p className="text-gray-700 text-base leading-relaxed">
 SHA-256 就像<strong>身份證製造機</strong>，幫每個地址和交易製作獨一無二的ID！
 </p>
 </div>

 {/* 視覺化說明 */}
 <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-sm">
 <p className="text-sm text-gray-600 mb-4 font-semibold">📌 兩種用途：</p>

 <div className="grid sm:grid-cols-2 gap-4">
 {/* 地址生成 */}
 <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300">
 <p className="font-bold text-blue-800 mb-4 text-center">🔐 生成比特幣地址</p>

 <div className="space-y-3">
 <div className="bg-white rounded-lg p-3 border border-blue-200">
 <p className="text-xs text-gray-600 mb-1">① 你的公鑰</p>
 <p className="text-xs font-mono text-gray-800 break-all bg-gray-50 p-2 rounded">
 04a1b2c3d4e5f6...
 </p>
 </div>

 <div className="text-center">
 <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
 ↓ SHA-256 加密 ↓
 </div>
 </div>

 <div className="bg-white rounded-lg p-3 border-2 border-blue-400">
 <p className="text-xs text-gray-600 mb-1">② 你的比特幣地址</p>
 <p className="text-xs font-mono text-blue-600 font-bold break-all bg-blue-50 p-2 rounded">
 1A1zP1eP5Q...
 </p>
 </div>
 </div>

 <p className="text-xs text-gray-600 mt-3 text-center">
 就像你的<strong>銀行帳號</strong>
 </p>
 </div>

 {/* 交易ID */}
 <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-300">
 <p className="font-bold text-green-800 mb-4 text-center">📝 生成交易 ID</p>

 <div className="space-y-3">
 <div className="bg-white rounded-lg p-3 border border-green-200">
 <p className="text-xs text-gray-600 mb-1">① 交易內容</p>
 <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded">
 Alice 轉 1 BTC 給 Bob
 </p>
 </div>

 <div className="text-center">
 <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
 ↓ SHA-256 加密 ↓
 </div>
 </div>

 <div className="bg-white rounded-lg p-3 border-2 border-green-400">
 <p className="text-xs text-gray-600 mb-1">② 交易 ID</p>
 <p className="text-xs font-mono text-green-600 font-bold break-all bg-green-50 p-2 rounded">
 5f3a8b7c9d...
 </p>
 </div>
 </div>

 <p className="text-xs text-gray-600 mt-3 text-center">
 就像你的<strong>轉帳收據</strong>
 </p>
 </div>
 </div>

 {/* 說明 */}
 <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400 mt-4">
 <p className="text-sm text-gray-800 leading-relaxed">
 💡 <strong>為什麼安全？</strong><br/>
 因為 SHA-256 是<strong>單向加密</strong>，
 別人看到你的地址（1A1zP1eP5Q...），
 也<strong>無法反推</strong>出你的公鑰或私鑰！
 就像看到身份證號碼，無法知道你的指紋一樣！
 </p>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 )
}

export default SHA256Demo