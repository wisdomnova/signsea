'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconX, IconCheck, IconAlertCircle, IconInfoCircle, IconLoader2 } from '@tabler/icons-react'

export type ToastType = 'success' | 'error' | 'info' | 'loading'

interface CustomToastProps {
  isOpen: boolean
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export const CustomToast: React.FC<CustomToastProps> = ({
  isOpen,
  message,
  type,
  onClose,
  duration = 5000
}) => {
  useEffect(() => {
    if (isOpen && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, type, duration, onClose])

  const icons = {
    success: <IconCheck size={20} className="text-green-500" />,
    error: <IconAlertCircle size={20} className="text-red-500" />,
    info: <IconInfoCircle size={20} className="text-blue-500" />,
    loading: <IconLoader2 size={20} className="text-black animate-spin" />
  }

  const bgStyles = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100',
    loading: 'bg-white border-gray-100 shadow-xl'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 backdrop-blur-md ${bgStyles[type]}`}
          >
            <div className="flex-shrink-0">
              {icons[type]}
            </div>
            <p className="text-[14px] font-bold text-black flex-grow">
              {message}
            </p>
            {type !== 'loading' && (
              <button 
                onClick={onClose}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <IconX size={16} className="text-gray-400" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
