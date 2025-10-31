import { useState } from 'react'

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-card border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - 增強互動效果 */}
          <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
            <div className="relative">
              {/* 淡橙色背景光暈 - 懸停時增強 */}
              <div className="absolute inset-0 bg-bitcoin-600/20 blur-lg rounded-full group-hover:bg-bitcoin-600/40 transition-all duration-300"></div>
              <span className="relative text-3xl sm:text-4xl transform group-hover:rotate-12 transition-transform duration-300">₿</span>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-bitcoin-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                比特幣學習平台
              </span>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                Bitcoin Learning Platform
              </p>
            </div>
          </div>

          {/* 右側狀態指示器 */}
          <div className="flex items-center gap-3">
            {/* 即時數據狀態 */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-success-50 rounded-full border border-success-200 animate-fadeIn">
              <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-success-700 font-medium">即時數據</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部漸層裝飾線 - 增強效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-bitcoin-600/50 to-transparent"></div>
    </nav>
  )
}

export default Navbar