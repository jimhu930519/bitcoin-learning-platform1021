import { useState } from 'react'
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

 // 微調演示：改變一個字元
 const demonstrateSensitivity = () => {
 const text = 'Bitcoin'
 setInputText(text)
 calculateHash(text)
 setInputText2(text + 'x') // 加一個字元
 handleInputChange2(text + 'x')
 setCompareMode(true)
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

 {/* 敏感性演示按鈕 */}
 <div className="mb-6 flex gap-3">
 <button
 onClick={demonstrateSensitivity}
 className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
 >
 演示敏感性（改一個字）
 </button>
 <button
 onClick={() => setCompareMode(!compareMode)}
 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
 compareMode
 ? 'bg-red-500 hover:bg-red-600 text-white'
 : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
 }`}
 >
 {compareMode ? '關閉比對' : '開啟比對'}
 </button>
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

 {/* 比對統計 */}
 {compareMode && hash && hash2 && (
 <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-300 animate-fadeIn">
 <div className="flex items-center justify-between mb-3">
 <h4 className="font-bold text-gray-800 text-lg"> 差異分析</h4>
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
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">輸入差異</p>
 <p className="text-2xl font-bold text-blue-600">
 {Math.abs(inputText.length - inputText2.length) === 0
 ? '1 字元'
 : `${Math.abs(inputText.length - inputText2.length)} 字元`}
 </p>
 </div>
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">Hash 差異</p>
 <p className="text-2xl font-bold text-red-600">{countDifferences()}/64</p>
 </div>
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">改變率</p>
 <p className="text-2xl font-bold text-orange-600">
 {((countDifferences() / 64) * 100).toFixed(0)}%
 </p>
 </div>
 <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
 <p className="text-xs text-gray-600 mb-1">雪崩效應</p>
 <p className="text-2xl font-bold text-green-600"></p>
 </div>
 </div>
 <p className="text-sm text-gray-700 mt-3">
 <strong> 雪崩效應：</strong>只改變 1 個字元，卻造成約 {((countDifferences() / 64) * 100).toFixed(0)}% 的 Hash 值改變！
 這就是 SHA-256 的「敏感性」特性。
 </p>
 </div>
 )}

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
 <span className="text-2xl mr-3"></span>
 <span className="font-bold text-gray-800 text-lg">SHA-256 在比特幣中的應用</span>
 </div>
 <span className="text-2xl text-indigo-600 transition-transform duration-300" style={{ transform: showEducation ? 'rotate(180deg)' : 'rotate(0deg)' }}>
 
 </span>
 </button>

 {showEducation && (
 <div className="mt-4 space-y-4 animate-fadeIn">
 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
 <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
 <span className="mr-2"></span>
 1. 區塊鏈接（Block Chaining）
 </h4>
 <p className="text-gray-700 text-sm mb-3">
 每個區塊的 Hash 會被包含在下一個區塊中，形成不可篡改的鏈條。
 </p>
 <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
 <div className="flex items-center justify-between text-sm">
 <div className="text-center flex-1">
 <p className="text-gray-600 mb-1">區塊 #1</p>
 <p className="text-xs font-mono text-blue-600">hash: abc123...</p>
 </div>
 <span className="text-2xl mx-2">→</span>
 <div className="text-center flex-1">
 <p className="text-gray-600 mb-1">區塊 #2</p>
 <p className="text-xs font-mono text-green-600">prev: abc123...</p>
 </div>
 <span className="text-2xl mx-2">→</span>
 <div className="text-center flex-1">
 <p className="text-gray-600 mb-1">區塊 #3</p>
 <p className="text-xs font-mono text-purple-600">prev: def456...</p>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
 <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
 <span className="mr-2"></span>
 2. 工作量證明（Proof of Work）
 </h4>
 <p className="text-gray-700 text-sm mb-3">
 礦工必須找到一個 Nonce 值，使得區塊的 Hash 開頭有足夠多的 0。
 </p>
 <div className="bg-white rounded-lg p-4 border-2 border-orange-300">
 <p className="text-sm text-gray-700 mb-2"><strong>範例：</strong></p>
 <div className="space-y-2 text-xs font-mono">
 <div className="flex items-center">
 <span className="text-red-600 mr-2"></span>
 <span>Nonce: 1 → Hash: 3a7f2b...</span>
 </div>
 <div className="flex items-center">
 <span className="text-red-600 mr-2"></span>
 <span>Nonce: 2 → Hash: 8c5d9e...</span>
 </div>
 <div className="flex items-center">
 <span className="text-green-600 mr-2"></span>
 <span className="text-green-700 font-bold">Nonce: 12345 → Hash: 0000abc...</span>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
 <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
 <span className="mr-2"></span>
 3. 交易驗證與地址生成
 </h4>
 <p className="text-gray-700 text-sm mb-3">
 SHA-256 也用於生成比特幣地址和驗證交易簽名。
 </p>
 <div className="grid sm:grid-cols-2 gap-3">
 <div className="bg-white rounded-lg p-3 border border-green-300">
 <p className="text-xs text-gray-600 mb-1">公鑰</p>
 <p className="text-xs font-mono text-gray-800">04a1b2c3d4...</p>
 <p className="text-center text-lg my-1">↓ SHA-256 ↓</p>
 <p className="text-xs text-gray-600 mb-1">地址</p>
 <p className="text-xs font-mono text-green-600">1A1zP1eP5Q...</p>
 </div>
 <div className="bg-white rounded-lg p-3 border border-green-300">
 <p className="text-xs text-gray-600 mb-1">交易資料</p>
 <p className="text-xs font-mono text-gray-800">Alice→Bob...</p>
 <p className="text-center text-lg my-1">↓ SHA-256 ↓</p>
 <p className="text-xs text-gray-600 mb-1">交易 ID</p>
 <p className="text-xs font-mono text-green-600">5f3a8b7c...</p>
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