/**
 * 統一的提示框組件
 */
export const InfoBox = ({ 
  type = 'info', 
  title, 
  children,
  icon,
  className = '',
}) => {
  const types = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800',
      icon: '💡',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      icon: '✅',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      icon: '⚠️',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: '❌',
    },
  }
  
  const config = types[type]
  
  return (
    <div className={`${config.bg} border-l-4 ${config.border} p-5 rounded-xl ${className}`}>
      {title && (
        <h4 className={`font-bold ${config.text} mb-2 text-lg`}>
          {icon || config.icon} {title}
        </h4>
      )}
      <p className={`text-sm ${config.text}`}>
        {children}
      </p>
    </div>
  )
}
