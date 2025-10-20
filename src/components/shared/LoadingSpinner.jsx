/**
 * 載入中指示器組件
 */
export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizes[size]} border-bitcoin-orange border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  )
}
