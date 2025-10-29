# 比特幣學習平台 - 完整系統架構圖

## 📋 專案概覽

**專案名稱**: Bitcoin Learning Platform (比特幣學習平台)
**技術棧**: React 19.1.1 + Vite 7.1.14 (Rolldown) + Tailwind CSS 3.4.1
**部署平台**: Vercel
**專案目標**: 提供互動式的比特幣學習體驗，透過模擬器幫助用戶理解區塊鏈核心概念

---

## 🏗️ 系統架構層級

```
┌─────────────────────────────────────────────────────────────────┐
│                        用戶界面層 (UI Layer)                      │
│                    基於 React 19.1.1 + Tailwind CSS              │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                     組件層 (Component Layer)                      │
│    - 導覽列 (Navbar)                                              │
│    - 六大功能模組組件                                              │
│    - 共享組件庫 (Button, InfoBox, LoadingSpinner)                 │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                  狀態管理層 (State Management)                    │
│    - React Context API (WalletContext)                          │
│    - Custom Hooks (useCryptoPrice)                              │
│    - 本地狀態管理 (useState, useCallback, useRef)                 │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    外部 API 層 (External APIs)                    │
│    - Binance API (主要價格來源)                                   │
│    - CoinGecko API (備用價格來源)                                 │
│    - Web Crypto API (SHA-256 雜湊運算)                           │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                      配置層 (Configuration)                       │
│    - 常量配置 (config.js)                                         │
│    - Tailwind 主題配置                                            │
│    - Vite 建置配置                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 檔案系統結構

```
bitcoin-learning-platform/
│
├── public/                        # 靜態資源
│
├── src/                           # 原始碼目錄
│   │
│   ├── components/                # React 組件
│   │   ├── shared/                # 共享組件庫
│   │   │   ├── Button.jsx         # 通用按鈕組件
│   │   │   ├── InfoBox.jsx        # 資訊框組件
│   │   │   ├── LoadingSpinner.jsx # 載入動畫組件
│   │   │   └── index.js           # 統一匯出
│   │   │
│   │   ├── ErrorBoundary.jsx      # 錯誤邊界組件
│   │   ├── Navbar.jsx             # 頂部導覽列
│   │   ├── SHA256Demo.jsx         # SHA-256 雜湊演示
│   │   ├── MiningSimulator.jsx    # 挖礦模擬器
│   │   ├── TransferSimulator.jsx  # 轉帳模擬器
│   │   ├── PriceCalculator.jsx    # 價格查詢計算器
│   │   └── TradingSimulator.jsx   # 交易模擬器
│   │
│   ├── contexts/                  # React Context
│   │   └── WalletContext.jsx      # 錢包全域狀態管理
│   │
│   ├── hooks/                     # 自定義 Hooks
│   │   └── useCryptoPrice.js      # 價格獲取 Hook
│   │
│   ├── constants/                 # 常量配置
│   │   └── config.js              # 應用配置常量
│   │
│   ├── App.jsx                    # 主應用組件
│   └── main.jsx                   # 應用程式入口
│
├── index.html                     # HTML 模板
├── package.json                   # 依賴管理
├── vite.config.js                 # Vite 建置配置
├── tailwind.config.js             # Tailwind CSS 配置
├── postcss.config.js              # PostCSS 配置
└── eslint.config.js               # ESLint 配置
```

---

## 🧩 核心組件架構

### 1. **App.jsx** - 主應用程式
```
App (根組件)
│
├── Navbar (固定導覽列)
│
├── Tab Navigation (頁籤切換)
│   ├── 比特幣簡介 (intro)
│   ├── SHA-256 (sha256)
│   ├── 挖礦模擬 (mining)
│   ├── 轉帳模擬 (transfer)
│   ├── 價格查詢 (price)
│   └── 模擬交易 (trading)
│
└── Content Area (動態內容區)
    ├── 條件渲染對應 Tab 的組件
    └── WalletContext.Provider 包裹
```

### 2. **Navbar.jsx** - 導覽列組件
- **特點**: 固定於頂部 (fixed top)
- **樣式**: 白色背景 + 橙色漸層裝飾線
- **內容**:
  - 比特幣 Logo (₿) 帶光暈效果
  - 平台名稱 (中英雙語)
- **響應式**: 在不同螢幕尺寸自動調整

### 3. **SHA256Demo.jsx** - SHA-256 演示
- **功能**:
  - 即時 SHA-256 雜湊計算
  - 支援自訂輸入文字
  - 雜湊值比對功能
  - 視覺化雜湊過程
- **技術**: Web Crypto API

### 4. **MiningSimulator.jsx** - 挖礦模擬器
```
MiningSimulator
│
├── 教育內容區 (可摺疊)
│   ├── 為什麼要挖礦
│   ├── 真實比特幣難度
│   └── 為何耗電
│
├── 挖礦獎勵說明 (可摺疊)
│   ├── 當前區塊獎勵 (3.125 BTC)
│   ├── 交易手續費
│   └── 減半歷史
│
├── 參數設置區
│   ├── 區塊編號
│   ├── 交易內容
│   ├── 前一個區塊雜湊
│   ├── Nonce 值
│   └── 難度選擇 (2-5 個前導零)
│
├── 實時統計 (挖礦中顯示)
│   ├── 嘗試次數
│   ├── 算力 (H/s)
│   ├── 已花費時間
│   └── 預估時間 + 進度條
│
├── 控制按鈕區
│   ├── 開始挖礦 / 挖礦中
│   ├── 暫停 / 繼續
│   ├── 停止
│   └── 重置
│
├── 挖礦成功卡片 (緊湊型)
│   ├── 快速統計 (嘗試、時間、算力、獎勵)
│   └── 展開詳情 (模擬 vs 真實對比、獎勵說明)
│
├── 算力對比 (可摺疊)
│   └── 瀏覽器 vs 真實比特幣網絡
│
└── 快速填入範例
    ├── 簡單 (難度 2)
    ├── 普通 (難度 3)
    └── 困難 (難度 4)
```

**挖礦邏輯**:
- 使用 SHA-256 不斷嘗試不同 Nonce
- 批次處理 (100-1000 次/批)
- 支援暫停/繼續功能
- 即時更新算力和進度

### 5. **TransferSimulator.jsx** - 轉帳模擬器
```
TransferSimulator
│
├── 教育卡片區 (可摺疊)
│   ├── 什麼是鏈？
│   ├── 為何選錯鏈會遺失資產
│   └── 什麼是手續費
│
├── 錢包餘額顯示
│   ├── 錢包 A
│   └── 錢包 B
│
├── 轉帳表單
│   ├── 選擇加密貨幣 (BTC/ETH/USDT)
│   ├── 選擇區塊鏈 (Bitcoin/Ethereum/BSC/Polygon/Tron)
│   ├── 目標錢包選擇
│   ├── 接收地址 (自動填入 + 即時驗證)
│   │   ├── ✓ 地址正確
│   │   └── ✗ 地址錯誤/屬於其他鏈
│   ├── 轉帳金額
│   │   └── 快速金額按鈕 (25%/50%/75%/100%)
│   └── 手續費顯示 (依鏈自動計算)
│
├── 交易摘要
│   ├── 發送金額
│   ├── 手續費
│   └── 總計
│
├── 確認轉帳按鈕 (帶動畫)
│
└── 交易歷史記錄
    └── 時間、類型、金額、手續費
```

**轉帳邏輯**:
- 即時地址驗證 (檢查是否匹配正確鏈)
- 自動扣除手續費
- 更新雙方錢包餘額
- 記錄交易歷史

### 6. **PriceCalculator.jsx** - 價格查詢器
```
PriceCalculator
│
├── 即時價格顯示
│   ├── BTC 價格 (USD/TWD)
│   ├── 24h 漲跌幅 (綠色/紅色 Badge)
│   └── 最後更新時間
│
├── 雙向計算器
│   ├── BTC → TWD 模式
│   │   ├── 輸入 BTC 數量
│   │   ├── 自動計算 USDT 價值
│   │   ├── 自動計算 TWD 價值
│   │   └── Satoshi 單位顯示
│   │
│   └── TWD → BTC 模式 (反向計算)
│       ├── 輸入 TWD 金額
│       └── 自動計算可購買 BTC
│
├── 購買估算
│   ├── 預估手續費 (0.1%)
│   └── 建議準備金額 (+2%)
│
└── 手動刷新按鈕
```

**價格獲取邏輯**:
- 使用 `useCryptoPrice` Hook
- Binance API 優先 (24h ticker)
- 10 秒快取機制
- 失敗時自動重試 + 備用 API

### 7. **TradingSimulator.jsx** - 交易模擬器
```
TradingSimulator
│
├── 投資組合總價值
│   ├── USDT 總價值
│   └── TWD 等值
│
├── 錢包餘額顯示
│   ├── BTC (+ USDT 等值)
│   ├── USDT
│   └── TWD
│
├── 即時價格區
│   ├── 當前價格
│   ├── 24h 漲跌幅
│   └── 自動更新 (5 秒間隔)
│
├── 交易表單
│   ├── 交易對選擇 (BTC/USDT, BTC/TWD)
│   ├── 交易類型
│   │   ├── 買入 / 賣出
│   │   └── 市價單 / 限價單
│   ├── 數量輸入
│   │   └── 快速金額按鈕 (25%/50%/75%/100%)
│   ├── 限價價格 (限價單時顯示)
│   └── 手續費計算 (0.1%)
│
├── 交易按鈕 (帶處理動畫)
│
└── 交易歷史
    └── 時間、類型、金額、價格、手續費
```

**交易邏輯**:
- 市價單: 使用當前市場價格
- 限價單: 使用用戶設定價格
- 自動扣除 0.1% 手續費
- 即時更新錢包餘額

---

## 🔄 狀態管理架構

### **WalletContext** - 全域錢包狀態
```javascript
WalletContext
│
├── 狀態 (State)
│   ├── walletA { name, address, balance }
│   ├── walletB { name, address, balance }
│   └── transactionHistory []
│
├── 方法 (Methods)
│   ├── getWallet(walletId)
│   ├── getCorrectAddress(wallet, coin, chain)
│   ├── updateWalletBalance(walletId, newBalance)
│   ├── transfer(from, to, amount, coin, chain, fee)
│   ├── executeTrade(tradeType, amount, price, pair)
│   └── resetWallets()
│
└── 使用範圍
    ├── TransferSimulator
    └── TradingSimulator
```

### **useCryptoPrice Hook** - 價格獲取
```javascript
useCryptoPrice(updateInterval)
│
├── 狀態
│   ├── prices { btc: {usd, twd}, usdt: {twd} }
│   ├── loading
│   ├── error
│   ├── lastUpdate
│   ├── apiSource
│   └── priceChange24h
│
├── API 策略
│   ├── Primary: Binance API
│   ├── Secondary: Binance Multi-pair API
│   ├── Fallback: CoinGecko API
│   └── Cache: 10 秒快取
│
├── 重試機制
│   ├── 指數退避 (500ms, 1s, 2s, 3s)
│   ├── API 輪換
│   └── 最多重試 4 次
│
└── 使用範圍
    ├── PriceCalculator
    └── TradingSimulator
```

---

## 🎨 樣式系統

### **Tailwind CSS 配置**
```javascript
主題擴展:
- 顏色
  ├── bitcoin-orange: #F7931A
  ├── bitcoin-gold: #FFB800
  └── navy-900: #1A202C

- 字體
  └── sans: Inter, system-ui, Avenir, Helvetica, Arial

- 動畫
  ├── fadeIn (淡入)
  ├── slideUp (上滑)
  └── pulse (脈衝)

- 響應式斷點
  ├── sm: 640px
  ├── md: 768px
  ├── lg: 1024px
  └── xl: 1280px
```

### **設計風格**
- **亮色系統一**: 白色背景 + 淡色邊框
- **邊界清晰**: 所有卡片使用 2px 實體邊框
- **顏色系統**:
  - 主色: 比特幣橙 (#F7931A)
  - 成功: 綠色系 (green-50 → green-600)
  - 警告: 黃色系 (yellow-50 → yellow-600)
  - 危險: 紅色系 (red-50 → red-600)
  - 資訊: 藍色系 (blue-50 → blue-600)

---

## 🔌 外部 API 整合

### **1. Binance API** (主要價格源)
```
端點:
- GET /api/v3/ticker/24hr?symbol=BTCUSDT
- GET /api/v3/ticker/price?symbols=["BTCUSDT","USDTTWD"]

特點:
- 毫秒級更新
- 提供 24h 漲跌幅
- 無需 API Key
- 高可用性

使用位置:
- useCryptoPrice Hook
```

### **2. CoinGecko API** (備用價格源)
```
端點:
- GET /api/v3/simple/price?ids=bitcoin&vs_currencies=usd

特點:
- 免費層限制 50 次/分鐘
- 更新間隔較長 (分鐘級)
- 作為備用方案

使用位置:
- useCryptoPrice Hook (fallback)
```

### **3. Web Crypto API** (雜湊運算)
```
方法:
- crypto.subtle.digest('SHA-256', data)

特點:
- 瀏覽器原生支援
- 高效能
- 安全性高

使用位置:
- SHA256Demo
- MiningSimulator
```

---

## ⚙️ 配置文件詳解

### **config.js** - 應用常量
```javascript
配置項目:

1. TRADING_CONFIG
   - FEE_RATE: 0.001 (0.1%)
   - PRICE_UPDATE_INTERVAL: 5000ms
   - TRADE_PROCESSING_TIME: 1500ms
   - MIN_TRADE_AMOUNT: 0.00001 BTC
   - MAX_TRADE_AMOUNT: 100 BTC

2. MINING_CONFIG
   - MAX_NONCE_ATTEMPTS: 1,000,000
   - UPDATE_FREQUENCY: 500
   - DIFFICULTY_OPTIONS: [2, 3, 4, 5]

3. INITIAL_WALLET_BALANCES
   錢包 A: 0.5 BTC, 2 ETH, 10000 USDT, 300000 TWD
   錢包 B: 0.3 BTC, 1.5 ETH, 5000 USDT, 150000 TWD

4. WALLET_ADDRESSES
   - Bitcoin 地址
   - Ethereum 地址
   - USDT 多鏈地址 (ETH/BSC)

5. CHAIN_OPTIONS
   - BTC: [Bitcoin]
   - ETH: [Ethereum]
   - USDT: [Ethereum, BSC, Polygon, Tron]
```

---

## 🚀 建置與部署流程

### **開發環境**
```bash
# 安裝依賴
npm install

# 啟動開發伺服器 (Vite HMR)
npm run dev
# → http://localhost:5173

# 程式碼檢查
npm run lint
```

### **生產環境建置**
```bash
# 執行建置
npm run build

# 輸出目錄: dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].css
# │   └── index-[hash].js

# 預覽建置結果
npm run preview
```

### **部署平台: Vercel**
```json
配置: .vercel/project.json
- 自動偵測 Vite 專案
- Git push 觸發自動部署
- 支援自訂域名
- CDN 全球加速
```

---

## 🧪 技術特點與優化

### **效能優化**
1. **程式碼分割**: Vite 自動進行 Tree-shaking
2. **快取策略**:
   - 價格資料 10 秒快取
   - Static assets 長期快取
3. **批次運算**: 挖礦模擬使用批次處理 (100-1000 次/批)
4. **React 優化**:
   - useCallback 避免不必要重新渲染
   - useMemo 快取運算結果
   - useRef 避免狀態更新觸發重渲染

### **用戶體驗優化**
1. **即時反饋**:
   - 地址驗證即時顯示
   - 價格自動更新
   - 挖礦進度即時顯示
2. **錯誤處理**:
   - API 失敗自動重試
   - 多重備援 API
   - 友善的錯誤訊息
3. **響應式設計**:
   - Mobile-first 設計
   - 所有組件完整支援手機/平板/桌面
4. **可摺疊內容**:
   - 減少滾動需求
   - 保持介面整潔

### **教育性設計**
1. **分步引導**: 從基礎到進階的學習路徑
2. **視覺化呈現**:
   - 雜湊過程視覺化
   - 挖礦嘗試即時顯示
   - 交易流程動畫
3. **對比說明**:
   - 模擬 vs 真實比特幣差異
   - 難度對比視覺化
4. **互動學習**: 所有功能都可實際操作

---

## 📊 資料流向圖

```
用戶操作
    ↓
React 組件 (UI)
    ↓
狀態管理 (Context/Hook)
    ↓
業務邏輯處理
    ↓
    ├─→ 本地運算 (SHA-256, 交易驗證)
    │
    └─→ 外部 API 呼叫
         ├─→ Binance API (價格)
         ├─→ CoinGecko API (備用)
         └─→ Web Crypto API (雜湊)
              ↓
         資料回傳
              ↓
         更新狀態
              ↓
         UI 重新渲染
              ↓
         用戶看到結果
```

---

## 🔐 安全性考量

1. **無後端儲存**: 所有資料僅存於客戶端記憶體
2. **模擬環境**: 不涉及真實交易，無金融風險
3. **API 安全**:
   - 使用公開 API，無需身份驗證
   - HTTPS 加密傳輸
4. **輸入驗證**:
   - 金額範圍檢查
   - 地址格式驗證
   - 防止無效交易

---

## 📈 未來擴展方向

1. **新增功能模組**:
   - 區塊鏈瀏覽器模擬
   - 智能合約簡介
   - DeFi 協議說明

2. **技術優化**:
   - 引入 React Query 進行資料管理
   - 添加單元測試 (Vitest)
   - PWA 支援 (離線使用)

3. **教育內容**:
   - 更多互動教學關卡
   - 成就系統
   - 學習進度追蹤

---

## 📝 總結

這是一個完整的 **前端單頁應用 (SPA)**，採用 **React 19 + Vite + Tailwind CSS** 技術棧，透過 **互動式模擬器** 和 **視覺化設計** 幫助用戶學習比特幣與區塊鏈核心概念。

**核心特色**:
- ✅ 六大學習模組 (SHA-256、挖礦、轉帳、價格、交易、簡介)
- ✅ 真實 API 整合 (Binance 即時價格)
- ✅ 完整的狀態管理 (Context + Custom Hooks)
- ✅ 響應式設計 (支援所有裝置)
- ✅ 亮色系統一風格 (清晰的視覺層次)
- ✅ 教育性優先 (模擬與真實對比說明)

---

**文件版本**: 1.0
**最後更新**: 2025-10-30
**維護者**: Bitcoin Learning Platform Team
