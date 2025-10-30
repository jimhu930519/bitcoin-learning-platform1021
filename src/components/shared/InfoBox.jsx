import { Lightbulb, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

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
      IconComponent: Lightbulb,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800',
      IconComponent: CheckCircle,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-800',
      IconComponent: AlertTriangle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      IconComponent: XCircle,
    },
  }

  const config = types[type]
  const IconComponent = config.IconComponent

  return (
    <div className={`${config.bg} border-l-4 ${config.border} p-5 rounded-xl ${className}`}>
      {title && (
        <h4 className={`font-bold ${config.text} mb-2 text-lg flex items-center gap-2`}>
          {icon || <IconComponent className="w-5 h-5" />} {title}
        </h4>
      )}
      <p className={`text-sm ${config.text}`}>
        {children}
      </p>
    </div>
  )
}
