import { useState } from 'react'
import Navbar from './components/Navbar'
import SHA256Demo from './components/SHA256Demo'
import MiningSimulator from './components/MiningSimulator'
import TransferSimulator from './components/TransferSimulator'
import PriceCalculator from './components/PriceCalculator'
import TradingSimulator from './components/TradingSimulator'
import { Tooltip } from './components/shared'

function App() {
 const [activeTab, setActiveTab] = useState('intro')
 const [expandedCard, setExpandedCard] = useState(null)

 // 切換 Tab 並滾動到頂部
 const handleTabChange = (tabId) => {
 setActiveTab(tabId)
 window.scrollTo({ top: 0, behavior: 'smooth' })
 }

 // 切換卡片展開狀態
 const toggleCard = (cardId) => {
 setExpandedCard(expandedCard === cardId ? null : cardId)
 }

 const tabs = [
 { id: 'intro', label: '比特幣簡介', icon: '' },
 { id: 'sha256', label: 'SHA-256', icon: '' },
 { id: 'mining', label: '挖礦模擬', icon: '' },
 { id: 'transfer', label: '轉帳模擬', icon: '' },
 { id: 'price', label: '價格查詢', icon: '' },
 { id: 'trading', label: '模擬交易', icon: '' }
 ]

 return (
 <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
 <Navbar />
 
 {/* Tab 導覽 - 增強版 */}
 <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-card border-b border-gray-200/50">
 <div className="container mx-auto px-4">
 <div className="flex overflow-x-auto hide-scrollbar">
 {tabs.map((tab) => (
 <button
 key={tab.id}
 onClick={() => handleTabChange(tab.id)}
 className={`relative flex items-center justify-center px-3 sm:px-6 py-4 font-semibold transition-all duration-300 whitespace-nowrap text-sm sm:text-base group ${
 activeTab === tab.id
 ? 'text-bitcoin-600'
 : 'text-gray-600 hover:text-bitcoin-500 hover:bg-bitcoin-50/50'
 }`}
 >
 {/* 圖標區 - 可選 */}
 <span className="mr-2 transform group-hover:scale-110 transition-transform duration-300">
 {tab.icon}
 </span>

 <span>{tab.label}</span>

 {/* 底部指示器 - 增強版 */}
 {activeTab === tab.id && (
 <>
 {/* 主線 */}
 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-bitcoin-600 via-orange-500 to-orange-600 shadow-md animate-scaleIn"></div>
 {/* 發光效果 */}
 <div className="absolute bottom-0 left-0 right-0 h-1 bg-bitcoin-600 blur-sm opacity-50"></div>
 </>
 )}

 {/* 懸停效果 */}
 {activeTab !== tab.id && (
 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-bitcoin-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
 )}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* 主要內容區 */}
 <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-48 pb-8 sm:pb-12 max-w-[1400px]">
 
 {/* 比特幣簡介 */}
{activeTab === 'intro' && (
 <div className="animate-fadeIn space-y-6">
 {/* 頂部橫幅 - 簡化版 */}
 <div className="relative bg-gradient-to-br from-bitcoin-orange via-orange-500 to-bitcoin-gold rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-white shadow-2xl overflow-hidden">
 {/* 裝飾性背景 */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
 <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>

 <div className="relative z-10">
 <div className="flex flex-col items-center text-center">
 <span className="text-6xl sm:text-7xl mb-4"></span>
 <h1 className="text-3xl sm:text-5xl font-bold mb-3">歡迎來到比特幣世界</h1>
 <p className="text-lg sm:text-xl font-light max-w-2xl">從零開始，透過互動式學習探索<Tooltip term="區塊鏈技術" definition="區塊鏈是一種去中心化的分散式帳本技術，由多個節點共同維護，每個區塊包含多筆交易記錄並通過密碼學連接，形成不可篡改的鏈式結構。" type="primary" />的奧秘</p>
 </div>
 </div>
 </div>


 {/* 投資風險警示 */}
 <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-5 border-2 border-red-300 shadow-lg">
 <div className="flex items-start space-x-4">
 <div className="flex-shrink-0">
 <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
 <span className="text-white text-2xl">⚠️</span>
 </div>
 </div>
 <div>
 <h3 className="font-bold text-red-900 text-lg mb-2">投資風險警示</h3>
 <p className="text-red-800 text-sm leading-relaxed mb-2">
 <strong>本平台僅供教育學習使用</strong>，不構成任何投資建議。
 比特幣及加密貨幣投資具有<strong>極高風險</strong>，價格波動劇烈（年化波動率 65-70%），
 可能導致重大損失。
 </p>
 <p className="text-red-700 text-xs">
 投資前請充分了解風險，並根據自身財務狀況謹慎評估。過去表現不代表未來結果。
 </p>
 </div>
 </div>
 </div>

 {/* 學習進度提示 */}
 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center">
 <h3 className="font-bold text-gray-800 text-lg">學習路徑</h3>
 </div>
 <span className="text-sm text-gray-600">建議順序</span>
 </div>
 <div className="flex items-center gap-2 overflow-x-auto pb-2">
 <div className="flex-shrink-0 bg-white rounded-lg px-3 py-2 border-2 border-blue-400">
 <span className="text-sm font-semibold text-blue-600">1. 閱讀簡介</span>
 </div>
 <span className="text-gray-400">→</span>
 <div className="flex-shrink-0 bg-white rounded-lg px-3 py-2 border border-gray-300">
 <span className="text-sm font-semibold text-gray-600">2. SHA-256</span>
 </div>
 <span className="text-gray-400">→</span>
 <div className="flex-shrink-0 bg-white rounded-lg px-3 py-2 border border-gray-300">
 <span className="text-sm font-semibold text-gray-600">3. 挖礦模擬</span>
 </div>
 <span className="text-gray-400">→</span>
 <div className="flex-shrink-0 bg-white rounded-lg px-3 py-2 border border-gray-300">
 <span className="text-sm font-semibold text-gray-600">4. 轉帳體驗</span>
 </div>
 <span className="text-gray-400">→</span>
 <div className="flex-shrink-0 bg-white rounded-lg px-3 py-2 border border-gray-300">
 <span className="text-sm font-semibold text-gray-600">5. 模擬交易</span>
 </div>
 </div>
 </div>

 {/* 精簡核心概念卡片 */}
 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200 hover:shadow-lg transition-shadow">
 <h4 className="font-bold text-gray-800 mb-2 text-xl">去中心化</h4>
 <p className="text-base text-gray-700">沒有銀行或政府控制，由全球電腦共同維護</p>
 </div>

 <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border-2 border-yellow-200 hover:shadow-lg transition-shadow">
 <h4 className="font-bold text-gray-800 mb-2 text-xl">數位黃金</h4>
 <p className="text-base text-gray-700">總量限制 <Tooltip term="2100 萬枚" definition="比特幣的總供應量永久限制在 2100 萬枚，這是由中本聰在代碼中設定的，無法更改。預計將在 2140 年左右全部挖完。" type="warning" />，稀缺性帶來保值性</p>
 </div>

 <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200 hover:shadow-lg transition-shadow">
 <h4 className="font-bold text-gray-800 mb-2 text-xl"><Tooltip term="區塊鏈" definition="一種分散式數據庫技術，將交易記錄打包成「區塊」，並用密碼學方法將區塊串連成「鏈」。一旦寫入就無法修改，確保數據的安全性和透明性。" type="info" /></h4>
 <p className="text-base text-gray-700">不可篡改的分散式帳本，確保交易安全</p>
 </div>

 <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200 hover:shadow-lg transition-shadow">
 <h4 className="font-bold text-gray-800 mb-2 text-xl">快速轉帳</h4>
 <p className="text-base text-gray-700">無需銀行，幾分鐘內完成全球轉帳</p>
 </div>
 </div>

 {/* 詳細教學卡片 - 改為緊湊設計 */}
 <div className="space-y-4">
 {/* 標題區 */}
 <div className="bg-white rounded-xl p-4 border border-gray-200">
 <div className="flex items-center">
 <h2 className="text-xl font-bold text-gray-800">深入了解比特幣</h2>
 <span className="ml-auto text-xs text-gray-500">點擊卡片展開</span>
 </div>
 </div>

 {/* 可展開教育式卡片 */}
 <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
 {/* 卡片 1：什麼是比特幣？ */}
 <div className="bg-white rounded-2xl shadow-xl transition-all duration-300">
 <button
 onClick={() => toggleCard('bitcoin')}
 className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
 >
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center">
 <span className="text-3xl mr-3"></span>
 <h3 className="text-2xl font-bold text-gray-800">什麼是比特幣？</h3>
 </div>
 <span className="text-2xl text-bitcoin-orange transition-transform duration-300" style={{ transform: expandedCard === 'bitcoin' ? 'rotate(180deg)' : 'rotate(0deg)' }}></span>
 </div>
 <p className="text-lg leading-relaxed text-gray-700">
 比特幣是一種數位貨幣，就像你手機裡的數位錢包。
 </p>
 </button>
 
 {/* 展開的詳細內容 */}
 <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
 expandedCard === 'bitcoin' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
 }`}>
 <div className="px-6 pb-6 space-y-4 border-t-2 border-gray-100 pt-4">
 <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 給完全新手的說明
 </h4>
 <p className="text-gray-700 leading-relaxed">
 想像一下，你有一個<Tooltip term="數位錢包" definition="用於儲存、發送和接收加密貨幣的軟體或硬體。它不存放實際的幣，而是存放用於操作比特幣的私鑰。" type="info" />，裡面的錢<strong>不是由銀行管理</strong>，而是由<strong>全世界的電腦一起記帳</strong>。這就是比特幣！
 </p>
 </div>

 <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 什麼是「去中心化」？
 </h4>
 <div className="text-gray-700 leading-relaxed space-y-2">
 <p><strong>傳統銀行（中心化）：</strong></p>
 <p className="pl-4">• 所有交易由銀行記帳</p>
 <p className="pl-4">• 銀行說了算</p>
 <p className="pl-4">• 銀行可能倒閉</p>
 
 <p className="mt-2"><strong>比特幣（去中心化）：</strong></p>
 <p className="pl-4">• 全世界的電腦一起記帳</p>
 <p className="pl-4">• 沒有任何人可以控制</p>
 <p className="pl-4">• 更安全、更透明</p>
 </div>

                <div className="bg-blue-100 border-l-4 border-blue-500 p-3 rounded mt-3">
                  <div className="flex items-start">
                    <span className="text-blue-600 text-xl mr-2 flex-shrink-0">ℹ️</span>
                    <div className="text-sm text-blue-800">
                      <p className="font-bold mb-1">實際運作說明：</p>
                      <p className="leading-relaxed">
                        雖然比特幣技術上去中心化，但實務中仍面臨一些挑戰：少數大型礦池控制大部分算力、
                        多數用戶透過中心化交易所交易、各國監管政策影響使用。完全的去中心化仍在持續演進中。
                      </p>
                    </div>
                  </div>
                </div>
 </div>

 <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 誰是「中本聰」？
 </h4>
 <p className="text-gray-700 leading-relaxed">
 <Tooltip term="中本聰" definition="比特幣的創始人，於 2008 年發表比特幣白皮書。真實身份至今成謎，可能是個人或團隊。在 2010 年從社群消失，留下約 100 萬枚比特幣從未動用。" type="primary" />是在 2009 年創造比特幣的神秘人物（或團隊）。至今沒有人知道他的真實身分，就像蒙面俠一樣！他創造比特幣後就消失了，留下這個改變世界的發明。
 </p>
 </div>

 <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 為什麼只有 2100 萬枚？
 </h4>
 <p className="text-gray-700 leading-relaxed">
 就像地球上的黃金數量有限一樣，比特幣也設定了上限。<strong>永遠只會有 2100 萬枚</strong>，不會再多了！這讓比特幣很稀有，也是它保值的原因之一。
 </p>
 </div>

 <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 什麼是「區塊鏈」？
 </h4>
 <p className="text-gray-700 leading-relaxed">
 想像一本<strong>永遠不能塗改的帳本</strong>，每一頁（區塊）都記錄了交易，而且頁與頁之間用鎖鏈連在一起。一旦寫上去，就無法修改或刪除。這就是區塊鏈！
 </p>
 </div>
 </div>
 </div>
 </div>
 
 {/* 卡片 2：為何稱為數位黃金？ */}
 <div className="bg-white rounded-2xl shadow-xl transition-all duration-300">
 <button
 onClick={() => toggleCard('gold')}
 className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
 >
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center">
 <span className="text-3xl mr-3"></span>
 <h3 className="text-2xl font-bold text-gray-800">為何稱為數位黃金？</h3>
 </div>
 <span className="text-2xl text-bitcoin-orange transition-transform duration-300" style={{ transform: expandedCard === 'gold' ? 'rotate(180deg)' : 'rotate(0deg)' }}></span>
 </div>
 <p className="text-lg leading-relaxed text-gray-700">
 因為比特幣和黃金有很多相似之處！
 </p>
 </button>
 
 {/* 展開的詳細內容 */}
 <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
 expandedCard === 'gold' ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
 }`}>
 <div className="px-6 pb-6 space-y-4 border-t-2 border-gray-100 pt-4">
 <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 黃金的特性
 </h4>
 <div className="text-gray-700 leading-relaxed space-y-1">
 <p>• <strong>稀缺性：</strong>地球上黃金數量有限</p>
 <p>• <strong>難以偽造：</strong>真金不怕火煉</p>
 <p>• <strong>保值性：</strong>幾千年來都很值錢</p>
 <p>• <strong>全球認可：</strong>到哪都有價值</p>
 </div>
 </div>

 <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 比特幣的相似之處
 </h4>
 <div className="text-gray-700 leading-relaxed space-y-1">
 <p>• <strong>稀缺性：</strong>只有 2100 萬枚，永不增加</p>
 <p>• <strong>難以偽造：</strong>密碼學保護，無法複製</p>
 <p>• <strong>保值性：</strong>不受政府控制</p>
 <p>• <strong>全球認可：</strong>全世界都能使用</p>
 </div>
 </div>

 <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 對比表格
 </h4>
 <div className="overflow-x-auto">
 <table className="w-full text-sm text-gray-700">
 <thead className="bg-gray-100">
 <tr>
 <th className="p-2 text-left">特性</th>
 <th className="p-2 text-left">黃金</th>
 <th className="p-2 text-left">比特幣</th>
 </tr>
 </thead>
 <tbody>
 <tr className="border-t">
 <td className="p-2 font-semibold">總量</td>
 <td className="p-2">有限（地球上）</td>
 <td className="p-2">2100 萬枚</td>
 </tr>
 <tr className="border-t">
 <td className="p-2 font-semibold">分割</td>
 <td className="p-2">可以融化切割</td>
 <td className="p-2">可分到小數點 8 位</td>
 </tr>
 <tr className="border-t">
 <td className="p-2 font-semibold">攜帶</td>
 <td className="p-2">很重，不方便</td>
 <td className="p-2">數位的，超輕鬆</td>
 </tr>
 <tr className="border-t">
 <td className="p-2 font-semibold">轉帳</td>
 <td className="p-2">需要實體運送</td>
 <td className="p-2">幾分鐘內全球轉帳</td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 如何對抗通膨？
 </h4>
 <p className="text-gray-700 leading-relaxed mb-2">
 <strong>通膨</strong>就是錢越來越不值錢。例如 10 年前 100 元可以買的東西，現在可能要 150 元。
 </p>
 <p className="text-gray-700 leading-relaxed mb-3">
 因為比特幣<strong>數量固定</strong>，政府無法像印鈔票一樣增加比特幣數量，所以它<strong>理論上具有抗通膨潛力</strong>，類似黃金的特性。
 </p>

                {/* 風險提示 */}
                <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded">
                  <div className="flex items-start">
                    <span className="text-red-600 text-xl mr-2 flex-shrink-0">⚠️</span>
                    <div className="text-sm text-red-800">
                      <p className="font-bold mb-1">重要風險提示：</p>
                      <p className="leading-relaxed">
                        比特幣價格<strong>波動性極高</strong>（年化波動率約 65-70%），短期內可能大幅漲跌。
                        <strong>並非保證保值</strong>，投資前請充分了解風險並謹慎評估自身承受能力。
                      </p>
                    </div>
                  </div>
                </div>
 </div>

 <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
 <h4 className="font-bold text-gray-800 mb-2 flex items-center">
 <span className="mr-2"></span> 生活化比喻
 </h4>
 <p className="text-gray-700 leading-relaxed">
 <strong>傳統貨幣：</strong>就像遊樂園的代幣，遊樂園想印多少就印多少，代幣會越來越不值錢。
 </p>
 <p className="text-gray-700 leading-relaxed mt-2">
 <strong>比特幣：</strong>就像限量版的收藏卡，只有 2100 萬張，永遠不會再印，所以會越來越珍貴！
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* 開始探索區塊 - 統一風格設計 */}
 <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 sm:p-8 border-2 border-orange-200">
 {/* 標題區 */}
 <div className="text-center mb-6">
 <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">開始學習</h3>
 <p className="text-gray-600 text-sm sm:text-base">按照順序逐步探索比特幣的核心概念</p>
 </div>

 {/* 學習步驟卡片 */}
 <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
 {tabs.slice(1).map((tab, index) => (
 <button
 key={tab.id}
 onClick={() => handleTabChange(tab.id)}
 className="group bg-white hover:bg-orange-50 rounded-xl p-4 sm:p-5 transition-all duration-200 border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg"
 >
 <div className="flex flex-col items-center text-center">
 {/* 步驟編號 */}
 <div className="w-10 h-10 sm:w-12 sm:h-12 mb-3 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center group-hover:bg-orange-200 group-hover:border-orange-400 transition-colors">
 <span className="text-lg sm:text-xl font-bold text-orange-600 group-hover:text-orange-700">
 {index + 1}
 </span>
 </div>

 {/* 標題 */}
 <div className="text-sm sm:text-base font-semibold text-gray-800 mb-1">
 {tab.label}
 </div>

 {/* 說明文字 */}
 <div className="text-xs text-gray-500">
 第 {index + 1} 步
 </div>
 </div>
 </button>
 ))}
 </div>

 {/* 底部提示 */}
 <div className="mt-6 pt-4 border-t-2 border-orange-200">
 <p className="text-center text-sm text-gray-600">
 <span className="font-semibold text-orange-600">提示：</span>
 建議依照順序完成每個學習模組，循序漸進掌握比特幣知識
 </p>
 </div>
 </div>
 </div>
 )}

 {/* SHA-256 體驗 */}
 {activeTab === 'sha256' && (
 <div className="animate-fadeIn">
 <SHA256Demo />
 </div>
 )}

 {/* 挖礦模擬 */}
 {activeTab === 'mining' && (
 <div className="animate-fadeIn">
 <MiningSimulator />
 </div>
 )}

 {/* 轉帳模擬 */}
 {activeTab === 'transfer' && (
 <div className="animate-fadeIn">
 <TransferSimulator />
 </div>
 )}

 {/* 價格查詢 */}
 {activeTab === 'price' && (
 <div className="animate-fadeIn">
 <PriceCalculator />
 </div>
 )}

 {/* 模擬交易 */}
 {activeTab === 'trading' && (
 <div className="animate-fadeIn">
 <TradingSimulator />
 </div>
 )}

 </main>

 {/* 頁尾 */}
 <footer className="bg-gradient-to-r from-navy-900 to-navy-800 text-white py-8 mt-12">
 <div className="container mx-auto px-6 text-center">
 <p className="text-lg mb-2">比特幣入門與視覺化互動平台</p>
 <p className="text-gray-400">© 2025 - 打造你的加密貨幣知識之旅</p>
 {/* 免責聲明 */}
 <div className="bg-orange-900/30 border-t border-orange-700/50 py-6 mt-8">
 <div className="container mx-auto px-6">
 <div className="max-w-4xl mx-auto">
 <div className="flex items-start space-x-3">
 <span className="text-yellow-400 text-2xl flex-shrink-0">⚠️</span>
 <div className="text-sm text-gray-300 leading-relaxed">
 <p className="font-bold text-white mb-2">投資風險聲明與免責事項</p>
 <p className="mb-2">
 本平台<strong className="text-yellow-400">僅供教育與學習用途</strong>，不構成任何形式的投資建議、財務諮詢或交易推薦。
 </p>
 <p className="mb-2">
 比特幣及其他加密貨幣投資具有<strong className="text-red-400">極高風險</strong>，價格波動劇烈，
 可能導致部分或全部本金損失。過去的表現不代表未來的結果。
 </p>
 <p>
 在進行任何投資決策前，請充分了解相關風險，並根據自身財務狀況、投資目標和風險承受能力謹慎評估。
 如有需要，請諮詢專業的金融顧問。
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>

 </div>
 </footer>
 </div>
 )
}

export default App