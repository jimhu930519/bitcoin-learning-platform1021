import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-4xl">₿</span>
            <span className="text-2xl font-bold text-bitcoin-orange">
              比特幣學習平台
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <a href="#bitcoin" className="text-white hover:text-bitcoin-orange transition-colors">
              比特幣簡介
            </a>
            <a href="#sha256" className="text-white hover:text-bitcoin-orange transition-colors">
              SHA-256
            </a>
            <a href="#mining" className="text-white hover:text-bitcoin-orange transition-colors">
              挖礦模擬
            </a>
            <a href="#transfer" className="text-white hover:text-bitcoin-orange transition-colors">
              轉帳模擬
            </a>
            <a href="#price" className="text-white hover:text-bitcoin-orange transition-colors">
              價格查詢
            </a>
            <a href="#trading" className="text-white hover:text-bitcoin-orange transition-colors">
              模擬交易
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4">
            <a href="#bitcoin" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-white/10 rounded">
              比特幣簡介
            </a>
            <a href="#sha256" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-white/10 rounded">
              SHA-256
            </a>
            <a href="#mining" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-white/10 rounded">
              挖礦模擬
            </a>
            <a href="#transfer" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-white/10 rounded">
              轉帳模擬
            </a>
            <a href="#price" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-white/10 rounded">
              價格查詢
            </a>
            <a href="#trading" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-white hover:bg-white/10 rounded">
              模擬交易
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar