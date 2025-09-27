// cách để import file này: import NotificationToast from "@/components/feature/notification-toast.jsx"

import { AlertCircle, Check, Info, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function NotificationToast({ message, type = "success", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5" />
      case "error":
        return <X className="w-5 h-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5" />
      case "info":
        return <Info className="w-5 h-5" />
      default:
        return null
    }
  }

  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white"
      case "error":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-yellow-500 text-white"
      case "info":
        return "bg-blue-500 text-white"
      default:
        return ""
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`z-3 fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 ${getColorClasses()}`}
    >
      {getIcon()}
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="ml-2 hover:opacity-80 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
