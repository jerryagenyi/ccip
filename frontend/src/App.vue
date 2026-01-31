<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useThemeStore } from '@/stores/useThemeStore';

// Initialize theme store after Pinia is ready (lazy initialization)
onMounted(() => {
  const themeStore = useThemeStore();
  themeStore.initTheme();
  themeStore.setupListeners();
});
</script>
