'use client'

import { createContext, useContext, ReactNode } from 'react'

const NotificationContext = createContext<any>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <NotificationContext.Provider value={{
      notifications: [],
      unreadCount: 0,
      markAsRead: () => {},
      markAllAsRead: () => {},
      isLoading: false,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  return useContext(NotificationContext) || {
    notifications: [],
    unreadCount: 0,
    markAsRead: () => {},
    markAllAsRead: () => {},
    isLoading: false,
  }
}
