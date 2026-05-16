'use client'

import { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { NotificationProvider } from '@/components/notification-provider'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const UIContext = createContext<any>(null)

function UIProviderContent({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const confirm = useCallback((options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDestructive?: boolean
  }): Promise<boolean> => {
    // Use browser's native confirm for now
    const confirmed = window.confirm(`${options.title}\n\n${options.message}`)
    return Promise.resolve(confirmed)
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  return (
    <UIContext.Provider value={{ confirm, showToast }}>
      <NotificationProvider>
        {children}
      </NotificationProvider>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`px-4 py-3 rounded-lg font-medium text-sm pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : toast.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </UIContext.Provider>
  )
}

export function UIProvider({ children }: { children: ReactNode }) {
  return <UIProviderContent>{children}</UIProviderContent>
}

export function useUI() {
  return useContext(UIContext) || { confirm: undefined, showToast: undefined }
}
