<template>
  <div>
    <q-btn
      flat
      round
      dense
      icon="notifications"
      class="notification-btn"
    >
      <q-badge
        v-if="unreadCount > 0"
        color="red"
        floating
        :label="unreadCount > 99 ? '99+' : unreadCount"
      />
    </q-btn>

    <q-menu
      v-model="showMenu"
      anchor="bottom right"
      self="top right"
      :offset="[0, 8]"
      class="notification-menu"
      style="min-width: 350px; max-width: 400px"
    >
      <q-list style="max-height: 500px" class="scroll">
        <!-- Header -->
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Notifications</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-if="unreadCount > 0"
              flat
              dense
              size="sm"
              label="Mark all read"
              @click="markAllAsRead"
            />
          </q-item-section>
        </q-item>
        <q-separator />

        <!-- Loading State -->
        <q-item v-if="loading">
          <q-item-section avatar>
            <q-spinner color="primary" size="20px" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Loading notifications...</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Notifications List -->
        <template v-else-if="notifications.length > 0">
          <q-item
            v-for="notification in notifications"
            :key="notification.id"
            clickable
            :class="{ 'notification-unread': !notification.read_at }"
            @click="handleNotificationClick(notification)"
          >
            <q-item-section avatar>
              <q-avatar
                :color="getNotificationColor(notification.type)"
                text-color="white"
                size="40px"
              >
                <q-icon :name="getNotificationIcon(notification.type)" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span class="text-weight-bold">{{ notification.title }}</span>
                <q-icon
                  v-if="!notification.read_at"
                  name="fiber_manual_record"
                  color="primary"
                  size="8px"
                  class="q-ml-xs"
                />
              </q-item-label>
              <q-item-label caption lines="2">
                {{ notification.body }}
              </q-item-label>
              <q-item-label caption>
                {{ formatTime(notification.created_at) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <!-- Empty State -->
        <q-item v-else>
          <q-item-section>
            <q-item-label class="text-center text-grey-6">
              <q-icon name="notifications_off" size="32px" class="q-mb-sm" />
              <div>No notifications</div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Footer -->
        <q-item clickable @click="viewAllNotifications">
          <q-item-section class="text-center">
            <q-item-label>View All Notifications</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/useNotificationStore';

const router = useRouter();
const notificationStore = useNotificationStore();

const showMenu = ref(false);

const loading = computed(() => notificationStore.loading);
const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    message: 'mail',
    activity: 'assignment',
    system: 'info',
    urgent: 'warning',
  };
  return icons[type] || 'notifications';
}

function getNotificationColor(type: string): string {
  const colors: Record<string, string> = {
    message: 'blue',
    activity: 'purple',
    system: 'grey',
    urgent: 'red',
  };
  return colors[type] || 'primary';
}

function formatTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

async function handleNotificationClick(notification: any) {
  if (!notification.read_at) {
    await notificationStore.markAsRead(notification.id);
  }

  if (notification.link) {
    router.push(notification.link);
    showMenu.value = false;
  }
}

async function markAllAsRead() {
  try {
    await notificationStore.markAllAsRead();
  } catch (error) {
    console.error('Failed to mark all as read:', error);
  }
}

function viewAllNotifications() {
  router.push('/notifications');
  showMenu.value = false;
}

onMounted(async () => {
  await notificationStore.fetchUnreadCount();
  await notificationStore.fetchNotifications({ limit: 10 });
  notificationStore.startPolling();
});

onUnmounted(() => {
  notificationStore.stopPolling();
});
</script>

<style scoped lang="scss">
.notification-btn {
  position: relative;
}

.notification-unread {
  background-color: rgba(123, 44, 191, 0.05);
  border-left: 3px solid #7b2cbf;
}
</style>

