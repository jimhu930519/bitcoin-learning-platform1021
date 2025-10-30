import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

/**
 * K 線圖組件 - 使用 TradingView lightweight-charts
 * @param {Object} props
 * @param {Array} props.data - K 線數據 [{time, open, high, low, close}]
 * @param {string} props.height - 圖表高度（例如：'400px'）
 */
function CandlestickChart({ data = [], height = '400px' }) {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const candlestickSeriesRef = useRef(null)

  // 創建圖表並更新數據 - 合併到一個 useEffect
  useEffect(() => {
    if (!chartContainerRef.current) return

    const containerWidth = chartContainerRef.current.clientWidth
    if (containerWidth === 0) return

    try {
      // 創建圖表實例
      const chart = createChart(chartContainerRef.current, {
        width: containerWidth,
        height: parseInt(height),
        layout: {
          backgroundColor: '#ffffff',
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: 0,
        },
        rightPriceScale: {
          borderColor: '#cccccc',
        },
        timeScale: {
          borderColor: '#cccccc',
          timeVisible: true,
          secondsVisible: false,
        },
        localization: {
          locale: 'zh-TW',
        },
      })

      // 添加蠟燭圖系列
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        borderUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        wickUpColor: '#26a69a',
      })

      chartRef.current = chart
      candlestickSeriesRef.current = candlestickSeries

      // 如果有數據，立即設置
      if (data.length > 0) {
        candlestickSeries.setData(data)
        chart.timeScale().fitContent()
      }

      // 響應式處理
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          })
        }
      }

      window.addEventListener('resize', handleResize)

      // 清理函數
      return () => {
        window.removeEventListener('resize', handleResize)
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
          candlestickSeriesRef.current = null
        }
      }
    } catch (error) {
      console.error('❌ Failed to create chart:', error)
    }
  }, [height, data])

  if (data.length === 0) {
    return (
      <div
        className="w-full bg-white rounded-lg border border-gray-200 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500">載入中...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div ref={chartContainerRef} style={{ height }} />
    </div>
  )
}

export default CandlestickChart
