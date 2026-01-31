import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/services/api';

interface Notification {
  id: number;
  type: 'message' | 'activity' | 'system' | 'urgent';
  title: string;
  body: string;
  link?: string;
  read_at: string | null;
  created_at: string;
}

interface NotificationPreferences {
  email_enabled: boolean;
  in_app_enabled: boolean;
  message_email: boolean;
  message_in_app: boolean;
  activity_email: boolean;
  activity_in_app: boolean;
  urgent_email: boolean;
  urgent_in_app: boolean;
}

export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const preferences = ref<NotificationPreferences | null>(null);
  const loading = ref(false);

  // Getters
  const unreadNotifications = computed(() => notifications.value.filter(n => !n.read_at));
  const urgentNotifications = computed(() =>
    notifications.value.filter(n => n.type === 'urgent' && !n.read_at)
  );

  // Actions
  async function fetchNotifications(filters?: { limit?: number; unread_only?: boolean }) {
    loading.value = true;
    try {
      const response = await api.get('/notifications', { params: filters });
      notifications.value = response.data.data || response.data;
      return notifications.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      unreadCount.value = response.data.data?.count || response.data.count || 0;
      return unreadCount.value;
    } catch (error) {
      return 0;
    }
  }

  async function markAsRead(id: number) {
    await api.put(`/notifications/${id}/read`);
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read_at = new Date().toISOString();
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  }

  async function markAllAsRead() {
    await api.put('/notifications/read-all');
    notifications.value.forEach(n => {
      n.read_at = new Date().toISOString();
    });
    unreadCount.value = 0;
  }

  async function fetchPreferences() {
    loading.value = true;
    try {
      const response = await api.get('/notifications/preferences');
      preferences.value = response.data.data || response.data;
      return preferences.value;
    } finally {
      loading.value = false;
    }
  }

  async function updatePreferences(data: NotificationPreferences) {
    loading.value = true;
    try {
      const response = await api.put('/notifications/preferences', data);
      preferences.value = response.data.data || response.data;
      return preferences.value;
    } finally {
      loading.value = false;
    }
  }

  // Polling for new notifications (30-second interval)
  let pollingInterval: number | null = null;

  function startPolling() {
    if (pollingInterval) return;
    pollingInterval = window.setInterval(() => {
      fetchUnreadCount();
      fetchNotifications({ limit: 5 });
    }, 30000); // 30 seconds
  }

  function stopPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  return {
    // State
    notifications,
    unreadCount,
    preferences,
    loading,
    // Getters
    unreadNotifications,
    urgentNotifications,
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    fetchPreferences,
    updatePreferences,
    startPolling,
    stopPolling,
  };
});
