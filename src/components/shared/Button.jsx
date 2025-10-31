/**
 * 統一的按鈕組件 - 增強微互動版本
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  // 基礎樣式：增加點擊效果和更流暢的過渡
  const baseStyles = 'rounded-xl font-bold transition-all duration-300 shadow-card hover:shadow-card-hover transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden'

  // 漸層變體：使用新色彩系統
  const variants = {
    primary: 'bg-gradient-to-r from-bitcoin-600 to-orange-600 hover:from-bitcoin-700 hover:to-orange-700 text-white hover:shadow-glow',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white',
    success: 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-4 text-lg',
    lg: 'px-8 py-5 text-xl',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {/* 內容 */}
      <span className="relative z-10">{children}</span>

      {/* 點擊波紋效果層 */}
      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
    </button>
  )
}
