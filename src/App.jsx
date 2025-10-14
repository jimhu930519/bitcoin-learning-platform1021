import { useState } from 'react'
import Navbar from './components/Navbar'
import SHA256Demo from './components/SHA256Demo'
import MiningSimulator from './components/MiningSimulator'
import TransferSimulator from './components/TransferSimulator'
import PriceCalculator from './components/PriceCalculator'
import TradingSimulator from './components/TradingSimulator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* 主要內容區 */}
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mt-16 sm:mt-20">
        
        {/* Hero 區 - 比特幣簡介 */}
        <section id="bitcoin" className="mb-20">
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
              
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold mb-3">💡 什麼是比特幣？</h3>
                  <p className="text-lg leading-relaxed">
                    比特幣（Bitcoin, BTC）是一種去中心化的數位貨幣，由中本聰在 2009 年創建。
                    它使用區塊鏈技術記錄所有交易，總量限制為 2100 萬枚。
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold mb-3">🎯 為何稱為數位黃金？</h3>
                  <p className="text-lg leading-relaxed">
                    如同黃金稀缺且難以偽造，比特幣總量固定、無法篡改，
                    被視為對抗通膨的避險工具。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHA-256 體驗區 */}
        <section id="sha256" className="mb-20">
          <SHA256Demo />
        </section>

        {/* 挖礦模擬區 */}
        <section id="mining" className="mb-20">
          <MiningSimulator />
        </section>

        {/* 轉帳模擬區 */}
        <section id="transfer" className="mb-20">
          <TransferSimulator />
        </section>
        {/* 價格查詢區 */}
        <section id="price" className="mb-20">
          <PriceCalculator />
        </section>
        {/* 交易系統區 */}
        <section id="trading" className="mb-20">
          <TradingSimulator />
        </section>
      </main>

      {/* 頁尾 */}
      <footer className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-2">比特幣入門與視覺化互動平台</p>
          <p className="text-gray-400">© 2025 - 打造你的加密貨幣知識之旅</p>
        </div>
      </footer>
    </div>
  )
}

export default App