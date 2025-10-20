import { useState } from 'react'
import Navbar from './components/Navbar'
import SHA256Demo from './components/SHA256Demo'
import MiningSimulator from './components/MiningSimulator'
import TransferSimulator from './components/TransferSimulator'
import PriceCalculator from './components/PriceCalculator'
import TradingSimulator from './components/TradingSimulator'

function App() {
  const [activeTab, setActiveTab] = useState('intro')

  const tabs = [
    { id: 'intro', label: '比特幣簡介', icon: '₿' },
    { id: 'sha256', label: 'SHA-256', icon: '🔐' },
    { id: 'mining', label: '挖礦模擬', icon: '⛏️' },
    { id: 'transfer', label: '轉帳模擬', icon: '💸' },
    { id: 'price', label: '價格查詢', icon: '💰' },
    { id: 'trading', label: '模擬交易', icon: '📊' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Tab 導覽 */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white shadow-lg border-b-2 border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-bitcoin-orange border-b-4 border-bitcoin-orange'
                    : 'text-gray-600 hover:text-bitcoin-orange hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主要內容區 */}
      <main className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 max-w-7xl">
        
        {/* 比特幣簡介 */}
        {/* 比特幣簡介 */}
{/* 比特幣簡介 */}
{/* 比特幣簡介 */}
{activeTab === 'intro' && (
  <div className="animate-fadeIn">
    <div className="relative bg-gradient-to-br from-bitcoin-orange via-orange-500 to-bitcoin-gold rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white shadow-2xl overflow-hidden">
      {/* 裝飾性背景 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <span className="text-6xl mr-4">₿</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">比特幣入門與視覺化互動平台</h1>
        </div>
        
        <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 font-light">
          透過互動式學習，理解區塊鏈技術與比特幣的核心原理
        </p>
        
        {/* 柔和優化的資訊卡片 */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/40 shadow-xl hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">
              💡 什麼是比特幣？
            </h3>
            <p className="text-lg leading-relaxed text-white/95 drop-shadow-md">
              比特幣（Bitcoin, BTC）是一種去中心化的數位貨幣，由中本聰在 2009 年創建。
              它使用區塊鏈技術記錄所有交易，總量限制為 2100 萬枚。
            </p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/40 shadow-xl hover:bg-white/25 hover:border-white/60 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">
              🎯 為何稱為數位黃金？
            </h3>
            <p className="text-lg leading-relaxed text-white/95 drop-shadow-md">
              如同黃金稀缺且難以偽造，比特幣總量固定、無法篡改，
              被視為對抗通膨的避險工具。
            </p>
          </div>
        </div>

        {/* 快速導覽卡片 */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold mb-4">🚀 開始探索</h3>
          <p className="text-lg mb-4">點擊上方標籤，體驗各項互動功能：</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tabs.slice(1).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl mb-2">{tab.icon}</div>
                <div className="text-sm font-semibold">{tab.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
        {/* SHA-256 體驗 */}
        {activeTab === 'sha256' && (
          <div className="animate-fadeIn">
            <SHA256Demo />
          </div>
        )}

        {/* 挖礦模擬 */}
        {activeTab === 'mining' && (
          <div className="animate-fadeIn">
            <MiningSimulator />
          </div>
        )}

        {/* 轉帳模擬 */}
        {activeTab === 'transfer' && (
          <div className="animate-fadeIn">
            <TransferSimulator />
          </div>
        )}

        {/* 價格查詢 */}
        {activeTab === 'price' && (
          <div className="animate-fadeIn">
            <PriceCalculator />
          </div>
        )}

        {/* 模擬交易 */}
        {activeTab === 'trading' && (
          <div className="animate-fadeIn">
            <TradingSimulator />
          </div>
        )}

      </main>

      {/* 頁尾 */}
      <footer className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-2">比特幣入門與視覺化互動平台</p>
          <p className="text-gray-400">© 2025 - 打造你的加密貨幣知識之旅</p>
        </div>
      </footer>
    </div>
  )
}

export default App