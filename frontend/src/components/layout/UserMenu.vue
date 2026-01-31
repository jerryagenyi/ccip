<template>
  <div>
    <q-btn flat round dense :icon="user?.profile_picture ? undefined : 'account_circle'">
      <q-avatar v-if="user?.profile_picture" size="32px">
        <img :src="user.profile_picture" :alt="user.name" />
      </q-avatar>
    </q-btn>

    <q-menu v-model="showMenu" anchor="bottom right" self="top right" :offset="[0, 8]">
      <q-list style="min-width: 200px">
        <!-- User Info -->
        <q-item>
          <q-item-section avatar>
            <q-avatar v-if="user?.profile_picture" size="48px">
              <img :src="user.profile_picture" :alt="user.name" />
            </q-avatar>
            <q-avatar v-else color="primary" text-color="white" size="48px">
              {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ user?.name }}</q-item-label>
            <q-item-label caption>{{ user?.email }}</q-item-label>
            <q-item-label caption>
              <q-chip
                size="sm"
                :color="getRoleColor(user?.role)"
                text-color="white"
                :label="user?.role"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <!-- Menu Items -->
        <q-item clickable @click="goToProfile">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-item clickable @click="goToSettings">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-item clickable @click="goToHelp">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>Help & Support</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable @click="handleLogout">
          <q-item-section avatar>
            <q-icon name="logout" color="negative" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-negative">Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const showMenu = ref(false);

const user = computed(() => authStore.user);

function getRoleColor(role?: string): string {
  const colors: Record<string, string> = {
    super_admin: 'red',
    admin: 'purple',
    sub_admin: 'blue',
    user: 'grey',
  };
  return colors[role?.toLowerCase() || 'user'] || 'grey';
}

function goToProfile() {
  router.push('/profile');
  showMenu.value = false;
}

function goToSettings() {
  router.push('/settings');
  showMenu.value = false;
}

function goToHelp() {
  router.push('/help');
  showMenu.value = false;
}

async function handleLogout() {
  $q.dialog({
    title: 'Confirm Logout',
    message: 'Are you sure you want to logout?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await authStore.logout();
      router.push('/auth/login');
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to logout',
      });
    }
  });
  showMenu.value = false;
}
</script>
