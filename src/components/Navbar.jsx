import { useState } from 'react'

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-3xl sm:text-4xl">₿</span>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-bitcoin-orange to-bitcoin-gold bg-clip-text text-transparent">
              比特幣學習平台
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar