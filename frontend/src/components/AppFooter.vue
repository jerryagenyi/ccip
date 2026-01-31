<template>
  <footer class="app-footer">
    <p class="footer-text">
      © {{ currentYear }}
      <template v-if="organisationName">
        {{ organisationName }} • Powered by CCIP v{{ appVersion }}
      </template>
      <template v-else> Powered by CCIP v{{ appVersion }} </template>
    </p>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

const authStore = useAuthStore();

// Get current year
const currentYear = computed(() => new Date().getFullYear());

// Get organisation name from current user
const organisationName = computed(() => {
  return authStore.userOrganisation?.name || null;
});

// App version - can be from config or package.json
// For now, using a constant. In production, this could come from:
// - import.meta.env.VITE_APP_VERSION
// - package.json version
const appVersion = '1.0.0';
</script>

<style scoped>
.app-footer {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fafafa;
}

.footer-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* Dark mode support (if using Quasar dark mode) */
.body--dark .app-footer {
  background-color: #1a1a1a;
  border-top-color: rgba(255, 255, 255, 0.1);
}

.body--dark .footer-text {
  color: #9ca3af;
}
</style>
