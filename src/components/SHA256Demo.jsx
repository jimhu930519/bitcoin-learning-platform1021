import { useState } from 'react'

function SHA256Demo() {
  const [inputText, setInputText] = useState('')
  const [hash, setHash] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)

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

  const testExample = (text) => {
    setInputText(text)
    calculateHash(text)
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-100">
      {/* 標題區 */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-5xl mr-4">🔐</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
            SHA-256 雜湊體驗器
          </h2>
        </div>
        
        <p className="text-gray-600 text-lg leading-relaxed">
          SHA-256 是比特幣使用的核心加密演算法。它可以將任意長度的資料轉換成固定 64 字元的雜湊值。
        </p>
      </div>

      {/* 特性說明卡片 */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-5 rounded-xl">
          <div className="text-3xl mb-2">🔒</div>
          <h4 className="font-bold text-gray-800 mb-1">不可逆性</h4>
          <p className="text-sm text-gray-600">無法從雜湊值反推原始資料</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 p-5 rounded-xl">
          <div className="text-3xl mb-2">⚡</div>
          <h4 className="font-bold text-gray-800 mb-1">敏感性</h4>
          <p className="text-sm text-gray-600">改變一個字元，雜湊值完全不同</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-5 rounded-xl">
          <div className="text-3xl mb-2">📏</div>
          <h4 className="font-bold text-gray-800 mb-1">固定長度</h4>
          <p className="text-sm text-gray-600">輸出永遠是 64 字元</p>
        </div>
      </div>

      {/* 輸入區 */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-3 text-xl">
          ✍️ 輸入任何文字：
        </label>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="試試看輸入你的名字或任何文字..."
          className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-bitcoin-orange focus:outline-none text-lg transition-all duration-300 shadow-sm hover:shadow-md"
        />
      </div>

      {/* 輸出區 */}
      {hash && (
        <div className="mb-8 animate-fadeIn">
          <label className="block text-gray-700 font-bold mb-3 text-xl">
            🔢 SHA-256 雜湊值：
          </label>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 border-4 border-bitcoin-orange shadow-lg">
            <div className={`text-green-400 font-mono text-base break-all leading-relaxed transition-opacity duration-300 ${isCalculating ? 'opacity-50' : 'opacity-100'}`}>
              {hash}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">
              長度：<span className="font-bold text-bitcoin-orange">{hash.length}</span> 字元
            </span>
            <span className="text-gray-600">
              位元數：<span className="font-bold text-bitcoin-orange">256</span> bits
            </span>
          </div>
        </div>
      )}

      {/* 測試範例按鈕 */}
      <div className="border-t-2 border-gray-200 pt-6">
        <p className="text-gray-700 font-semibold mb-4 text-lg">🎮 快速測試範例：</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => testExample('Hello')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            試試 "Hello"
          </button>
          <button
            onClick={() => testExample('Bitcoin')}
            className="bg-gradient-to-r from-bitcoin-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            試試 "Bitcoin"
          </button>
          <button
            onClick={() => testExample('比特幣')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            試試 "比特幣"
          </button>
        </div>
      </div>
    </div>
  )
}

export default SHA256Demo