import api from './apiService'
import { Notification } from '@/types/notification'
import * as mockService from './mockService'

// Get all notifications for the current user
export const getNotifications = async (): Promise<Notification[]> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getNotifications()
  }

  try {
    const response = await api.get('/notifications')
    return response.data.data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

// Get unread notification count
export const getUnreadCount = async (): Promise<number> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getUnreadCount()
  }

  try {
    const response = await api.get('/notifications/unread/count')
    return response.data.data.count
  } catch (error) {
    console.error('Error fetching unread notification count:', error)
    return 0
  }
}

// Mark a notification as read
export const markAsRead = async (notificationId: number): Promise<boolean> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.markAsRead(notificationId)
  }

  try {
    await api.put(`/notifications/${notificationId}/read`)
    return true
  } catch (error) {
    console.error(
      `Error marking notification ${notificationId} as read:`,
      error
    )
    return false
  }
}

// Mark all notifications as read
export const markAllAsRead = async (): Promise<boolean> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.markAllAsRead()
  }

  try {
    await api.put('/notifications/read-all')
    return true
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }
}
