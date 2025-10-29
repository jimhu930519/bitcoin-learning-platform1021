import { useState } from 'react'

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-md border-b-2 border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              {/* 淡橙色背景光暈 */}
              <div className="absolute inset-0 bg-bitcoin-orange/20 blur-lg rounded-full"></div>
              <span className="relative text-3xl sm:text-4xl">₿</span>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-bitcoin-orange via-orange-500 to-orange-600 bg-clip-text text-transparent">
                比特幣學習平台
              </span>
              <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                Bitcoin Learning Platform
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 底部漸層裝飾線 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
    </nav>
  )
}

export default Navbar