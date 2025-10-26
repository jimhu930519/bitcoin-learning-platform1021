// 這是修改後的 handleExecuteTrade 函數

const handleExecuteTrade = () => {
  const amountNum = parseFloat(amount)
  const currentPrice = getCurrentPrice()

  // 驗證輸入
  if (!amount || amountNum <= 0) {
    setMessage({ type: 'error', text: '請輸入有效的交易數量！' })
    return
  }

  if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
    setMessage({ type: 'error', text: '請輸入有效的限價！' })
    return
  }

  // 檢查價格數據是否已載入
  if (currentPrice === 0) {
    setMessage({ type: 'error', text: '價格數據載入中，請稍後再試...' })
    return
  }

  // 限價單邏輯檢查
  if (orderType === 'limit') {
    const limitPriceNum = parseFloat(limitPrice)
    
    // 限價買入：限價必須 >= 當前市價才能立即成交
    if (tradeAction === 'buy' && limitPriceNum < currentPrice) {
      // 創建掛單
      const newOrder = {
        id: Date.now(),
        wallet: selectedWallet,
        tradingPair,
        action: tradeAction,
        amount: amountNum,
        limitPrice: limitPriceNum,
        timestamp: new Date().toLocaleString('zh-TW')
      }
      
      setPendingOrders(prev => [newOrder, ...prev])
      
      setMessage({ 
        type: 'info', 
        text: `⌛ 限價買入掛單已創建！\n\n目前市價：${currentPrice.toFixed(2)}\n您的限價：${limitPriceNum.toFixed(2)}\n\n當市價降至 ${limitPriceNum.toFixed(2)} 或以下時將自動成交。\n\n💡 您可以在右側「掛單列表」查看和管理您的掛單。` 
      })
      
      // 清空表單
      setAmount('')
      setLimitPrice('')
      return
    }
    
    // 限價賣出：限價必須 <= 當前市價才能立即成交
    if (tradeAction === 'sell' && limitPriceNum > currentPrice) {
      // 創建掛單
      const newOrder = {
        id: Date.now(),
        wallet: selectedWallet,
        tradingPair,
        action: tradeAction,
        amount: amountNum,
        limitPrice: limitPriceNum,
        timestamp: new Date().toLocaleString('zh-TW')
      }
      
      setPendingOrders(prev => [newOrder, ...prev])
      
      setMessage({ 
        type: 'info', 
        text: `⌛ 限價賣出掛單已創建！\n\n目前市價：${currentPrice.toFixed(2)}\n您的限價：${limitPriceNum.toFixed(2)}\n\n當市價升至 ${limitPriceNum.toFixed(2)} 或以上時將自動成交。\n\n💡 您可以在右側「掛單列表」查看和管理您的掛單。` 
      })
      
      // 清空表單
      setAmount('')
      setLimitPrice('')
      return
    }
  }

  // 模擬交易處理
  setIsProcessing(true)
  
  setTimeout(() => {
    const executionPrice = orderType === 'limit' && limitPrice 
      ? parseFloat(limitPrice) 
      : getCurrentPrice()

    // 使用 Context 的 executeTrade 方法
    const result = executeTrade(
      selectedWallet,
      tradingPair,
      tradeAction,
      amountNum,
      executionPrice
    )

    if (result.success) {
      // 添加到訂單歷史
      setOrderHistory([result.transaction, ...orderHistory])
      
      const orderTypeText = orderType === 'market' ? '市價' : '限價'
      setMessage({
        type: 'success',
        text: `✅ ${orderTypeText}${tradeAction === 'buy' ? '買入' : '賣出'}成功！\n${amountNum.toFixed(6)} BTC @ ${executionPrice.toFixed(2)}`
      })

      // 清空表單
      setAmount('')
      setLimitPrice('')
    } else {
      setMessage({
        type: 'error',
        text: result.message
      })
    }

    setIsProcessing(false)
  }, TRADING_CONFIG.TRADE_PROCESSING_TIME)
}


// 掛單列表 UI (加在右側訂單歷史之前)
{pendingOrders.length > 0 && (
  <div className="bg-white rounded-2xl p-6 border-2 border-orange-300">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <span className="mr-2">⏳</span>
      掛單列表
      <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
        {pendingOrders.length}
      </span>
    </h3>
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {pendingOrders.map(order => (
        <div 
          key={order.id}
          className={`p-3 rounded-lg border-2 ${
            order.action === 'buy'
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`font-bold ${
              order.action === 'buy' ? 'text-green-700' : 'text-red-700'
            }`}>
              限價{order.action === 'buy' ? '買入' : '賣出'}
            </span>
            <button
              onClick={() => cancelOrder(order.id)}
              className="text-red-600 hover:text-red-800 text-xs font-semibold"
            >
              取消
            </button>
          </div>
          <p className="text-sm font-semibold">
            {order.amount.toFixed(6)} BTC @ {order.limitPrice.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {order.timestamp}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            {order.action === 'buy' 
              ? `等待市價降至 ${order.limitPrice.toFixed(2)} 或以下`
              : `等待市價升至 ${order.limitPrice.toFixed(2)} 或以上`}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
