// 應用程式配置常量

// 交易相關常量
export const TRADING_CONFIG = {
  // 手續費率 (0.1%)
  FEE_RATE: 0.001,
  
  // 價格更新間隔 (毫秒)
  PRICE_UPDATE_INTERVAL: 5000,
  
  // 模擬交易處理時間 (毫秒)
  TRADE_PROCESSING_TIME: 1500,
  
  // 最小交易金額
  MIN_TRADE_AMOUNT: 0.00001,
  
  // 最大交易金額
  MAX_TRADE_AMOUNT: 100,
}

// 挖礦配置
export const MINING_CONFIG = {
  // 最大 nonce 嘗試次數
  MAX_NONCE_ATTEMPTS: 1000000,
  
  // 狀態更新頻率 (每 N 次更新一次顯示)
  UPDATE_FREQUENCY: 500,
  
  // 難度選項
  DIFFICULTY_OPTIONS: [
    { value: 2, label: '簡單（2 個 0）' },
    { value: 3, label: '普通（3 個 0）' },
    { value: 4, label: '困難（4 個 0）' },
    { value: 5, label: '非常困難（5 個 0）' },
  ],
}

// 初始錢包餘額
export const INITIAL_WALLET_BALANCES = {
  A: {
    BTC: 0.5,
    ETH: 2.0,
    USDT: 10000,
    TWD: 300000,
  },
  B: {
    BTC: 0.3,
    ETH: 1.5,
    USDT: 5000,
    TWD: 150000,
  },
}

// 錢包地址
export const WALLET_ADDRESSES = {
  A: {
    BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    USDT_ETH: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    USDT_BSC: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
  },
  B: {
    BTC: '3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy',
    ETH: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
    USDT_ETH: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
    USDT_BSC: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  },
}

// 支援的區塊鏈網路
export const CHAIN_OPTIONS = {
  BTC: ['Bitcoin'],
  ETH: ['Ethereum'],
  USDT: ['Ethereum', 'BSC', 'Polygon', 'Tron'],
}
