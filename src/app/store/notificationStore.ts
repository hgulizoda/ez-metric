import { create } from 'zustand';
import type { AppNotification } from '@/types';

interface NotificationStore {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [
    {
      id: '1',
      title: 'Overtime Alert',
      message: 'Garcia, Jesus is approaching 40 hours this week (38.5 hrs)',
      type: 'warning',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: '2',
      title: 'Missed Punch Detected',
      message: '5 employees have missed punch-out records today',
      type: 'error',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: '3',
      title: 'Device Online',
      message: 'Biometric device B-001 came online at 7:02 AM',
      type: 'success',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: '4',
      title: 'Pay Period Reminder',
      message: 'Current pay period ends on 03/20/2026. Review timesheets.',
      type: 'info',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ],
  unreadCount: 3,

  addNotification: (notification) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id: string) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id: string) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
