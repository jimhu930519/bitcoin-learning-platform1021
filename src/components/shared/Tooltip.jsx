import { useState, useRef, useEffect } from 'react'

/**
 * Tooltip 組件 - 類似 Wikipedia 的懸浮提示框
 *
 * @param {string} term - 要顯示的關鍵字
 * @param {string} definition - 關鍵字的解釋說明
 * @param {string} type - 樣式類型: 'info' | 'warning' | 'primary' (預設 'info')
 */
function Tooltip({ term, definition, type = 'info' }) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, showBelow: false })
  const termRef = useRef(null)

  // 不同類型的樣式配置
  const styles = {
    info: {
      text: 'text-blue-600 border-b-2 border-blue-300 border-dotted',
      tooltip: 'bg-blue-50 border-blue-300 text-blue-900',
      arrow: 'border-t-blue-300',
      arrowDown: 'border-b-blue-300'
    },
    warning: {
      text: 'text-orange-600 border-b-2 border-orange-300 border-dotted',
      tooltip: 'bg-orange-50 border-orange-300 text-orange-900',
      arrow: 'border-t-orange-300',
      arrowDown: 'border-b-orange-300'
    },
    primary: {
      text: 'text-purple-600 border-b-2 border-purple-300 border-dotted',
      tooltip: 'bg-purple-50 border-purple-300 text-purple-900',
      arrow: 'border-t-purple-300',
      arrowDown: 'border-b-purple-300'
    }
  }

  const currentStyle = styles[type] || styles.info

  // 計算 tooltip 位置
  useEffect(() => {
    if (isVisible && termRef.current) {
      const rect = termRef.current.getBoundingClientRect()
      const tooltipWidth = window.innerWidth < 640 ? 256 : 320 // w-64 = 256px, w-80 = 320px
      const tooltipHeight = 120 // 估計高度（考慮文字長度）
      const arrowHeight = 8 // 箭頭高度
      const gap = 8 // 關鍵字與 tooltip 之間的間距

      // 計算水平位置（置中對齊關鍵字）
      let left = rect.left + rect.width / 2

      // 確保不超出左右邊界
      const horizontalPadding = 16 // 左右邊界 padding
      if (left - tooltipWidth / 2 < horizontalPadding) {
        left = tooltipWidth / 2 + horizontalPadding
      } else if (left + tooltipWidth / 2 > window.innerWidth - horizontalPadding) {
        left = window.innerWidth - tooltipWidth / 2 - horizontalPadding
      }

      // 計算垂直位置
      const spaceAbove = rect.top
      const spaceBelow = window.innerHeight - rect.bottom
      const requiredSpace = tooltipHeight + arrowHeight + gap

      let top
      let showBelow = false

      // 優先顯示在上方，如果上方空間不足則顯示在下方
      if (spaceAbove >= requiredSpace) {
        // 顯示在上方
        top = rect.top - tooltipHeight - arrowHeight - gap
      } else if (spaceBelow >= requiredSpace) {
        // 顯示在下方
        top = rect.bottom + arrowHeight + gap
        showBelow = true
      } else {
        // 兩邊空間都不足，選擇較大的一邊
        if (spaceAbove > spaceBelow) {
          top = 16 // 距離頂部最小距離
        } else {
          top = rect.bottom + arrowHeight + gap
          showBelow = true
        }
      }

      setPosition({ top, left, showBelow })
    }
  }, [isVisible])

  const handleMouseEnter = () => {
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  return (
    <>
      <span
        ref={termRef}
        className={`cursor-help font-medium ${currentStyle.text} hover:border-solid transition-all duration-200`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {term}
      </span>

      {/* Tooltip 提示框 - 使用 fixed 定位 */}
      {isVisible && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className={`w-64 sm:w-80 p-3 rounded-lg border-2 shadow-xl ${currentStyle.tooltip} opacity-0 animate-tooltipFadeIn`}>
            <div className="text-sm leading-relaxed">
              {definition}
            </div>
          </div>
          {/* 箭頭 - 根據位置決定方向 */}
          {position.showBelow ? (
            // 顯示在下方時，箭頭向上
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 border-8 border-transparent ${currentStyle.arrowDown}`}
              style={{
                borderTopWidth: 0,
                bottom: '100%',
                marginBottom: '-1px'
              }}
            ></div>
          ) : (
            // 顯示在上方時，箭頭向下
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 border-8 border-transparent ${currentStyle.arrow}`}
              style={{
                borderBottomWidth: 0,
                top: '100%',
                marginTop: '-1px'
              }}
            ></div>
          )}
        </div>
      )}
    </>
  )
}

export default Tooltip
