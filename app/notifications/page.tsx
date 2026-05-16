'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconArrowLeft,
  IconBell,
  IconCheck,
  IconAlertCircle,
  IconCreditCard,
  IconGift,
  IconX
} from '@tabler/icons-react'
import { Shell } from '@/components/dashboard-shell'
import { apiClient } from '@/lib/api-client'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  related_invoice_id?: string
  related_project_id?: string
  read_at?: string | null
  created_at: string
}

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unread || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`http://localhost:3001/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('http://localhost:3001/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment_received':
        return <IconCreditCard size={16} className="text-green-600" />
      case 'escrow_released':
        return <IconGift size={16} className="text-blue-600" />
      case 'invoice_sent':
        return <IconBell size={16} className="text-purple-600" />
      case 'milestone_completed':
        return <IconCheck size={16} className="text-orange-600" />
      case 'alert':
        return <IconAlertCircle size={16} className="text-red-600" />
      default:
        return <IconBell size={16} className="text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment_received':
        return 'bg-green-50 border-green-100'
      case 'escrow_released':
        return 'bg-blue-50 border-blue-100'
      case 'invoice_sent':
        return 'bg-purple-50 border-purple-100'
      case 'milestone_completed':
        return 'bg-orange-50 border-orange-100'
      case 'alert':
        return 'bg-red-50 border-red-100'
      default:
        return 'bg-gray-50 border-gray-100'
    }
  }

  return (
    <Shell title="Notifications">
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <a 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-black uppercase tracking-widest mb-2 transition-colors"
            >
              <IconArrowLeft size={14} />
              Back to Account
            </a>
            <h2 className="text-[28px] font-bold tracking-tight text-black">Notifications</h2>
            <p className="text-[14px] text-gray-500 font-medium">
              {unreadCount > 0 ? `${unreadCount} new notification${unreadCount !== 1 ? 's' : ''}` : 'You\'re all caught up!'}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-[12px] font-bold text-black bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse" />
                ))}
              </motion.div>
            ) : notifications.length > 0 ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {notifications.map((notification) => (
                  <motion.div 
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`p-5 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                      notification.read_at ? 'bg-white border-gray-100' : `${getNotificationColor(notification.type)}`
                    }`}
                    onClick={() => !notification.read_at && markAsRead(notification.id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-bold text-black mb-1">{notification.title}</h4>
                        <p className="text-[12px] text-gray-600 line-clamp-2">{notification.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">
                          {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    
                    {!notification.read_at && (
                      <div className="shrink-0 w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="text-gray-400 mb-2">
                  <IconBell size={48} className="mx-auto mb-4 opacity-50" />
                </div>
                <h4 className="text-[16px] font-bold text-black mb-2">No notifications yet</h4>
                <p className="text-[13px] text-gray-400 font-medium">
                  You're all caught up! Check back later for updates on payments and project activity.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Shell>
  )
}
