<template>
  <q-layout view="hHh lpR fFf">
    <!-- Minimal header for landing page (theme-aware) -->
    <q-header elevated class="bg-card text-primary">
      <q-toolbar>
        <q-toolbar-title class="text-primary text-weight-bold">
          CCIP
        </q-toolbar-title>
        <q-space />
        <!-- ThemeToggle temporarily disabled due to Pinia initialization timing issue -->
        <!-- <ThemeToggle /> -->
        <q-btn
          v-if="!isAuthenticated"
          flat
          dense
          label="Sign In"
          color="primary"
          @click="$router.push('/auth/login')"
        />
        <q-btn
          v-else
          flat
          dense
          label="Dashboard"
          color="primary"
          @click="$router.push('/dashboard')"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Simple footer (theme-aware) -->
    <q-footer elevated class="bg-card text-secondary">
      <q-toolbar>
        <q-toolbar-title class="text-caption">
          © 2025 CCIP. All rights reserved.
        </q-toolbar-title>
        <q-btn
          flat
          dense
          no-caps
          label="Privacy Policy"
          color="grey-7"
          size="sm"
          class="q-mx-xs"
        />
        <q-btn
          flat
          dense
          no-caps
          label="Terms"
          color="grey-7"
          size="sm"
          class="q-mx-xs"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/useAuthStore';

// ThemeToggle temporarily disabled due to Pinia initialization timing issue
// import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
</script>

<style scoped lang="scss">
// Landing layout styles - minimal and clean
</style>

