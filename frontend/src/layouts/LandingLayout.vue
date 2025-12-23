<template>
  <q-layout view="hHh lpR fFf">
    <!-- Minimal header for landing page -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-toolbar-title class="text-primary text-weight-bold">
          CCIP
        </q-toolbar-title>
        <q-space />
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

    <!-- Simple footer -->
    <q-footer elevated class="bg-grey-1 text-grey-8">
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
import { ref, onMounted } from 'vue';

// Check authentication directly from localStorage to avoid Pinia initialization issues
const isAuthenticated = ref(false);

onMounted(() => {
  // Check if user is authenticated by checking localStorage
  isAuthenticated.value = !!localStorage.getItem('auth_token');
});
</script>

<style scoped lang="scss">
// Landing layout styles - minimal and clean
</style>

