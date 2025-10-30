# Tooltip 組件使用指南

## 📚 概述

Tooltip 是一個類似 Wikipedia 的懸浮提示框組件，當用戶將滑鼠移到關鍵字上時，會顯示補充說明。非常適合用於解釋專有名詞、技術術語等。

## 🎯 功能特點

- ✅ 滑鼠懸停時自動顯示
- ✅ 淡入動畫效果
- ✅ 三種樣式類型（info、warning、primary）
- ✅ 響應式設計（手機、平板、桌面）
- ✅ 虛線底線標示可互動文字
- ✅ 箭頭指向關鍵字

## 📦 基本用法

### 1. 導入組件

```jsx
import { Tooltip } from './components/shared'
```

### 2. 使用 Tooltip

```jsx
<p>
  比特幣使用 <Tooltip
    term="工作量證明"
    definition="一種共識機制，要求礦工通過大量運算來證明他們完成了工作。"
    type="info"
  /> 來保護網絡安全。
</p>
```

## 🎨 樣式類型

### Type: `info` (預設 - 藍色)
用於一般資訊性說明

```jsx
<Tooltip
  term="區塊鏈"
  definition="一種分散式數據庫技術，將交易記錄打包成區塊並串連成鏈。"
  type="info"
/>
```

**視覺效果**:
- 文字顏色: 藍色 (blue-600)
- 虛線: 藍色 (blue-300)
- 提示框背景: 淡藍色 (blue-50)

---

### Type: `warning` (警告 - 橙色)
用於需要注意的重要資訊

```jsx
<Tooltip
  term="2100 萬枚"
  definition="比特幣的總供應量永久限制在 2100 萬枚，預計將在 2140 年左右全部挖完。"
  type="warning"
/>
```

**視覺效果**:
- 文字顏色: 橙色 (orange-600)
- 虛線: 橙色 (orange-300)
- 提示框背景: 淡橙色 (orange-50)

---

### Type: `primary` (主要 - 紫色)
用於核心概念或主要術語

```jsx
<Tooltip
  term="中本聰"
  definition="比特幣的創始人，真實身份至今不明。於 2008 年發表比特幣白皮書。"
  type="primary"
/>
```

**視覺效果**:
- 文字顏色: 紫色 (purple-600)
- 虛線: 紫色 (purple-300)
- 提示框背景: 淡紫色 (purple-50)

## 📝 參數說明

| 參數 | 類型 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `term` | string | ✅ | - | 要顯示的關鍵字 |
| `definition` | string | ✅ | - | 關鍵字的解釋說明 |
| `type` | string | ❌ | 'info' | 樣式類型：'info' \| 'warning' \| 'primary' |

## 💡 使用範例

### 範例 1: 在段落文字中使用

```jsx
<p className="text-gray-700">
  比特幣是一種基於 <Tooltip
    term="點對點技術"
    definition="P2P (Peer-to-Peer) 技術允許用戶直接連接和交易，無需中間機構。"
    type="info"
  /> 的數位貨幣。
</p>
```

### 範例 2: 在標題中使用

```jsx
<h3 className="text-xl font-bold">
  什麼是 <Tooltip
    term="挖礦"
    definition="通過運算解決複雜的數學問題來驗證交易並獲得新比特幣的過程。"
    type="warning"
  />？
</h3>
```

### 範例 3: 在列表中使用

```jsx
<ul>
  <li>
    <Tooltip
      term="私鑰"
      definition="一串密碼，用於證明比特幣的所有權。絕對不能洩露給他人。"
      type="warning"
    />：證明所有權的密碼
  </li>
  <li>
    <Tooltip
      term="公鑰"
      definition="從私鑰生成的公開地址，可以安全地分享給他人用於接收比特幣。"
      type="info"
    />：用於接收比特幣的地址
  </li>
</ul>
```

### 範例 4: 連續使用多個 Tooltip

```jsx
<p>
  <Tooltip term="礦工" definition="運行專門硬體來驗證交易的參與者。" type="info" />
  通過
  <Tooltip term="工作量證明" definition="一種需要大量運算的共識機制。" type="primary" />
  來競爭
  <Tooltip term="區塊獎勵" definition="成功挖出新區塊的礦工獲得的比特幣獎勵。" type="warning" />。
</p>
```

## 🎨 CSS 類別說明

Tooltip 組件使用的主要 CSS 類別：

- `cursor-help`: 滑鼠懸停時顯示問號圖示
- `border-b-2 border-dotted`: 虛線底線標示
- `animate-fadeIn`: 淡入動畫效果
- `z-50`: 確保提示框在最上層

## 📱 響應式設計

- **桌面 (≥ 640px)**: 提示框寬度 320px (w-80)
- **手機 (< 640px)**: 提示框寬度 256px (w-64)

提示框會自動置中對齊關鍵字，並在上方顯示。

## ⚠️ 注意事項

### 1. 文字長度
建議 `definition` 文字控制在 100 字以內，保持簡潔易讀。

❌ **不好**:
```jsx
<Tooltip
  term="比特幣"
  definition="比特幣是一種去中心化的數位貨幣，由中本聰在2008年創造，它使用區塊鏈技術來記錄所有交易，並通過工作量證明機制來保護網絡安全，礦工通過運算來驗證交易並獲得獎勵..."
/>
```

✅ **好**:
```jsx
<Tooltip
  term="比特幣"
  definition="一種去中心化的數位貨幣，使用區塊鏈技術記錄交易。"
/>
```

### 2. 避免嵌套
不要在 Tooltip 內部再嵌套其他 Tooltip。

❌ **錯誤**:
```jsx
<Tooltip
  term="區塊鏈"
  definition={<span>使用 <Tooltip term="雜湊" definition="..." /> 連接</span>}
/>
```

### 3. 使用時機
只在真正需要解釋的專有名詞上使用，避免過度使用導致頁面雜亂。

## 🔧 自訂樣式

如果需要自訂樣式，可以修改 `Tooltip.jsx` 中的 `styles` 對象：

```jsx
const styles = {
  custom: {
    text: 'text-green-600 border-b-2 border-green-300 border-dotted',
    tooltip: 'bg-green-50 border-green-300 text-green-900',
    arrow: 'border-t-green-300'
  }
}
```

然後使用：
```jsx
<Tooltip term="自訂" definition="自訂樣式範例" type="custom" />
```

## 📊 建議的專有名詞列表

以下是比特幣學習平台中建議添加 Tooltip 的關鍵字：

### 核心概念
- 區塊鏈
- 去中心化
- 點對點 (P2P)
- 工作量證明 (PoW)
- 共識機制

### 技術術語
- 雜湊 (Hash)
- SHA-256
- Nonce
- 難度 (Difficulty)
- 挖礦 (Mining)
- 礦工

### 經濟相關
- 區塊獎勵
- 減半 (Halving)
- 手續費
- 2100 萬枚
- Satoshi (聰)

### 安全相關
- 私鑰
- 公鑰
- 錢包地址
- 數位簽章

### 網絡相關
- 節點 (Node)
- 礦池
- 確認數
- 分叉 (Fork)

## 🚀 最佳實踐

1. **一致性**: 同一個術語在整個網站使用相同的定義
2. **簡潔性**: 定義文字簡短精確，避免冗長解釋
3. **層次性**: 核心概念用 `primary`，警告用 `warning`，一般說明用 `info`
4. **適度使用**: 不是每個專有名詞都需要 Tooltip，選擇最重要的
5. **用戶友善**: 確保虛線底線清楚可見，提示用戶可以懸停查看

## 📈 未來優化方向

- [ ] 添加點擊固定功能（手機端友善）
- [ ] 支援更多位置（左、右、下）
- [ ] 添加圖片支援
- [ ] 支援超連結
- [ ] 添加「了解更多」按鈕

---

**版本**: 1.0
**最後更新**: 2025-10-30
**維護者**: Bitcoin Learning Platform Team
