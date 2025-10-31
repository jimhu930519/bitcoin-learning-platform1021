import { createContext, useContext, useState, useCallback } from 'react'
import { INITIAL_WALLET_BALANCES, WALLET_ADDRESSES, TRADING_CONFIG } from '../constants/config'

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
    address: WALLET_ADDRESSES.A,
    balance: { ...INITIAL_WALLET_BALANCES.A }
  })

  // 錢包 B 的資產
  const [walletB, setWalletB] = useState({
    name: '錢包 B',
    address: WALLET_ADDRESSES.B,
    balance: { ...INITIAL_WALLET_BALANCES.B }
  })

  // 交易歷史
  const [transactionHistory, setTransactionHistory] = useState([])

  // 獲取錢包對象
  const getWallet = useCallback((walletId) => {
    return walletId === 'A' ? walletA : walletB
  }, [walletA, walletB])

  // 獲取正確的地址
  const getCorrectAddress = useCallback((wallet, coin, chain) => {
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
  }, [])

  // 更新錢包餘額 (通用方法)
  const updateWalletBalance = useCallback((walletId, updates) => {
    const setWallet = walletId === 'A' ? setWalletA : setWalletB
    
    setWallet(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        ...updates
      }
    }))
  }, [])

  // 執行轉帳
  const transfer = useCallback((fromWalletId, toAddress, amount, coin, chain, fee = 0) => {
    const fromWallet = getWallet(fromWalletId)
    const toWalletId = fromWalletId === 'A' ? 'B' : 'A'
    const toWallet = getWallet(toWalletId)

    // 計算總支出（轉帳金額 + 手續費）
    const totalCost = amount + fee

    // 檢查餘額（需要包含手續費）
    if (fromWallet.balance[coin] < totalCost) {
      return {
        success: false,
        message: `餘額不足！需要 ${totalCost.toFixed(4)} ${coin}（含手續費），但只有 ${fromWallet.balance[coin]} ${coin}`
      }
    }

    // 檢查地址和鏈是否匹配
    const correctAddress = getCorrectAddress(toWallet, coin, chain)

    if (toAddress !== correctAddress) {
      // 地址錯誤 - 資產消失（包括手續費）
      updateWalletBalance(fromWalletId, {
        [coin]: fromWallet.balance[coin] - totalCost
      })

      const transaction = {
        id: Date.now(),
        from: fromWallet.name,
        to: '未知地址 ❌',
        amount,
        fee,
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

    // 正確轉帳 - 從發送方扣除（轉帳金額 + 手續費）
    updateWalletBalance(fromWalletId, {
      [coin]: fromWallet.balance[coin] - totalCost
    })

    // 增加到接收方（只有轉帳金額，不包含手續費）
    updateWalletBalance(toWalletId, {
      [coin]: toWallet.balance[coin] + amount
    })

    const transaction = {
      id: Date.now(),
      from: fromWallet.name,
      to: toWallet.name,
      amount,
      fee,
      coin,
      chain,
      status: 'success',
      timestamp: new Date().toLocaleString('zh-TW')
    }
    setTransactionHistory(prev => [transaction, ...prev])

    return {
      success: true,
      message: `✅ 轉帳成功！已發送 ${amount} ${coin}，手續費 ${fee} ${coin}`
    }
  }, [getWallet, getCorrectAddress, updateWalletBalance])

  // 執行交易 (買入/賣出) - 僅支援 BTC/USDT
  const executeTrade = useCallback((
    walletId,
    tradingPair,
    action,
    amount,
    price
  ) => {
    const wallet = getWallet(walletId)
    const currency = 'USDT' // 僅支援 USDT 交易
    const fee = amount * price * TRADING_CONFIG.FEE_RATE
    const total = amount * price

    // 驗證餘額
    if (action === 'buy') {
      const required = total + fee
      if (wallet.balance[currency] < required) {
        return {
          success: false,
          message: `${currency} 餘額不足！需要 ${required.toFixed(2)}，但只有 ${wallet.balance[currency].toFixed(2)}`
        }
      }
    } else {
      if (wallet.balance.BTC < amount) {
        return {
          success: false,
          message: `BTC 餘額不足！需要 ${amount}，但只有 ${wallet.balance.BTC}`
        }
      }
    }

    // 執行交易
    if (action === 'buy') {
      updateWalletBalance(walletId, {
        BTC: wallet.balance.BTC + amount,
        [currency]: wallet.balance[currency] - (total + fee)
      })
    } else {
      updateWalletBalance(walletId, {
        BTC: wallet.balance.BTC - amount,
        [currency]: wallet.balance[currency] + (total - fee)
      })
    }

    // 記錄交易
    const transaction = {
      id: Date.now(),
      type: 'trade',
      action,
      pair: tradingPair,
      amount,
      price,
      total,
      fee,
      timestamp: new Date().toLocaleString('zh-TW'),
      wallet: `錢包 ${walletId}`
    }
    setTransactionHistory(prev => [transaction, ...prev])

    return {
      success: true,
      message: `✅ ${action === 'buy' ? '買入' : '賣出'}成功！${amount} BTC @ ${price.toFixed(2)}`,
      transaction
    }
  }, [getWallet, updateWalletBalance])

  const value = {
    walletA,
    walletB,
    transactionHistory,
    getWallet,
    transfer,
    executeTrade, // 新增的交易方法
    getCorrectAddress,
    updateWalletBalance
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}
