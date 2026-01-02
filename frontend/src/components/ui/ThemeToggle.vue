<template>
  <q-btn
    flat
    dense
    round
    :icon="isDark ? 'light_mode' : 'dark_mode'"
    :label="themeMode === 'auto' ? 'Auto' : ''"
    @click="toggleTheme"
    class="theme-toggle"
  >
    <q-tooltip>
      {{ isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme' }}
      <span v-if="themeMode === 'auto'"> (Auto)</span>
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/stores/useThemeStore';

const themeStore = useThemeStore();

const isDark = computed(() => themeStore.isDark);
const themeMode = computed(() => themeStore.themeMode);

const toggleTheme = () => {
  themeStore.toggleTheme();
};
</script>

<style lang="scss">
.theme-toggle {
  transition: transform 0.2s ease;
  color: #FAFAFA !important;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  :deep(.q-icon) {
    color: inherit !important;
  }
}

body.body--light .theme-toggle {
  color: #7151B3 !important;

  &:hover {
    background-color: rgba(113, 81, 179, 0.1) !important;
  }
}
</style>
