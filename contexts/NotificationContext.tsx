import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import * as notificationService from '@/services/notificationService'
import { Notification } from '@/types/notification'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  refreshNotifications: () => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  refreshNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  // Load notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshNotifications()

      // Set up a polling interval to check for new notifications
      const interval = setInterval(async () => {
        try {
          const count = await notificationService.getUnreadCount()
          setUnreadCount(count)
        } catch (error) {
          console.error('Error polling notifications:', error)
        }
      }, 60000) // Check every minute

      return () => clearInterval(interval)
    } else {
      // Reset state when user is not authenticated
      setNotifications([])
      setUnreadCount(0)
    }
  }, [isAuthenticated])

  const refreshNotifications = async () => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)

    try {
      const data = await notificationService.getNotifications()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.is_read).length)
    } catch (error: any) {
      setError(error.message || 'Failed to load notifications')
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const success = await notificationService.markAsRead(notificationId)
      if (success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const success = await notificationService.markAllAsRead()
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
