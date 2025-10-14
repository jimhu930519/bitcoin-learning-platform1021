import { createContext, useContext, useState } from 'react'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  // 錢包 A 的資產
  const [walletA, setWalletA] = useState({
    name: '錢包 A',
    address: {
      BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      USDT_ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      USDT_BSC: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3'
    },
    balance: {
      BTC: 0.5,
      ETH: 2.0,
      USDT: 1000
    }
  })

  // 錢包 B 的資產
  const [walletB, setWalletB] = useState({
    name: '錢包 B',
    address: {
      BTC: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy',
      ETH: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
      USDT_ETH: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
      USDT_BSC: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    },
    balance: {
      BTC: 0.3,
      ETH: 1.5,
      USDT: 500
    }
  })

  // 交易歷史
  const [transactionHistory, setTransactionHistory] = useState([])

  // 執行轉帳
  const transfer = (fromWallet, toAddress, amount, coin, chain) => {
    const from = fromWallet === 'A' ? walletA : walletB
    const to = fromWallet === 'A' ? walletB : walletA
    
    // 檢查餘額
    if (from.balance[coin] < amount) {
      return {
        success: false,
        message: '餘額不足！'
      }
    }

    // 檢查地址和鏈是否匹配
    const correctAddress = getCorrectAddress(to, coin, chain)
    
    if (toAddress !== correctAddress) {
      // 地址錯誤或鏈錯誤 - 資產消失
      if (fromWallet === 'A') {
        setWalletA(prev => ({
          ...prev,
          balance: {
            ...prev.balance,
            [coin]: prev.balance[coin] - amount
          }
        }))
      } else {
        setWalletB(prev => ({
          ...prev,
          balance: {
            ...prev.balance,
            [coin]: prev.balance[coin] - amount
          }
        }))
      }

      const transaction = {
        id: Date.now(),
        from: from.name,
        to: '未知地址 ❌',
        amount,
        coin,
        chain,
        status: 'lost',
        timestamp: new Date().toLocaleString('zh-TW')
      }
      setTransactionHistory(prev => [transaction, ...prev])

      return {
        success: false,
        message: '⚠️ 地址或公鏈錯誤！資產已消失！這就是為什麼轉帳前一定要仔細確認地址和公鏈。'
      }
    }

    // 正確轉帳
    if (fromWallet === 'A') {
      setWalletA(prev => ({
        ...prev,
        balance: {
          ...prev.balance,
          [coin]: prev.balance[coin] - amount
        }
      }))
      setWalletB(prev => ({
        ...prev,
        balance: {
          ...prev.balance,
          [coin]: prev.balance[coin] + amount
        }
      }))
    } else {
      setWalletB(prev => ({
        ...prev,
        balance: {
          ...prev.balance,
          [coin]: prev.balance[coin] - amount
        }
      }))
      setWalletA(prev => ({
        ...prev,
        balance: {
          ...prev.balance,
          [coin]: prev.balance[coin] + amount
        }
      }))
    }

    const transaction = {
      id: Date.now(),
      from: from.name,
      to: to.name,
      amount,
      coin,
      chain,
      status: 'success',
      timestamp: new Date().toLocaleString('zh-TW')
    }
    setTransactionHistory(prev => [transaction, ...prev])

    return {
      success: true,
      message: '✅ 轉帳成功！'
    }
  }

  // 獲取正確的地址
  const getCorrectAddress = (wallet, coin, chain) => {
    if (coin === 'BTC') {
      return wallet.address.BTC
    } else if (coin === 'ETH') {
      return wallet.address.ETH
    } else if (coin === 'USDT') {
      if (chain === 'Ethereum') return wallet.address.USDT_ETH
      if (chain === 'BSC') return wallet.address.USDT_BSC
      return wallet.address.USDT_ETH
    }
    return ''
  }

  const value = {
    walletA,
    walletB,
    transactionHistory,
    transfer,
    getCorrectAddress
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}