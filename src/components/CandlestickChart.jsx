import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

/**
 * K 線圖組件
 * @param {Object} props
 * @param {Array} props.data - K 線數據 [{time, open, high, low, close}]
 * @param {string} props.height - 圖表高度（例如：'400px'）
 */
function CandlestickChart({ data = [], height = '400px' }) {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const candlestickSeriesRef = useRef(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // 創建圖表
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: parseInt(height),
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
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
        priceFormatter: (price) => {
          return price.toLocaleString('zh-TW', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        },
      },
    })

    // 創建 K 線系列
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

    // 響應式調整大小
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
      }
    }
  }, [height])

  // 更新數據
  useEffect(() => {
    if (candlestickSeriesRef.current && data.length > 0) {
      candlestickSeriesRef.current.setData(data)

      // 自動調整視圖以顯示所有數據
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent()
      }
    }
  }, [data])

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  )
}

export default CandlestickChart
