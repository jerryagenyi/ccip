<template>
  <q-layout view="hHh lpR fFf">
    <!-- Minimal header for landing page (theme-aware) -->
    <q-header elevated class="header-theme">
      <q-toolbar class="toolbar-theme">
        <q-toolbar-title class="text-weight-bold header-title"> CCIP </q-toolbar-title>
        <q-space />
        <ThemeToggle />
        <q-btn
          v-if="!isAuthenticated"
          flat
          dense
          label="Sign In"
          class="sign-in-btn"
          @click="$router.push('/auth/login')"
        />
        <q-btn
          v-else
          flat
          dense
          label="Dashboard"
          class="sign-in-btn"
          @click="$router.push('/dashboard')"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Simple footer (theme-aware) -->
    <q-footer elevated class="footer-theme">
      <q-toolbar>
        <q-toolbar-title class="text-caption footer-text">
          © 2025 CCIP. All rights reserved.
        </q-toolbar-title>
        <q-btn flat dense no-caps label="Privacy Policy" size="sm" class="q-mx-xs footer-link" />
        <q-btn flat dense no-caps label="Terms" size="sm" class="q-mx-xs footer-link" />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

// Check authentication directly from localStorage to avoid Pinia initialization issues
const isAuthenticated = ref(false);

onMounted(() => {
  // Check if user is authenticated by checking localStorage
  isAuthenticated.value = !!localStorage.getItem('auth_token');
});
</script>

<style lang="scss">
// Landing layout styles - minimal and clean (using global styles for body class targeting)

.header-theme {
  background-color: #1d283a !important;
}

body.body--light .header-theme {
  background-color: #ffffff !important;
  border-bottom: 1px solid #e5e7eb;
}

.toolbar-theme {
  min-height: 50px;
}

.header-title {
  color: #fafafa !important;
}

body.body--light .header-title {
  color: #1d283a !important;
}

.sign-in-btn {
  color: #fafafa !important;
}

body.body--light .sign-in-btn {
  color: #7151b3 !important;
}

.sign-in-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

body.body--light .sign-in-btn:hover {
  background-color: rgba(113, 81, 179, 0.1) !important;
}

.footer-theme {
  background-color: #1d283a !important;
}

body.body--light .footer-theme {
  background-color: #ffffff !important;
  border-top: 1px solid #e5e7eb;
}

.footer-text {
  color: #fafafa !important;
}

body.body--light .footer-text {
  color: #6b7280 !important;
}

.footer-link {
  color: #fafafa !important;
}

body.body--light .footer-link {
  color: #6b7280 !important;
}

.footer-link:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

body.body--light .footer-link:hover {
  background-color: rgba(113, 81, 179, 0.1) !important;
  color: #7151b3 !important;
}
</style>
