// Quasar boot file for theme initialization
// This runs after Pinia is initialized via boot/pinia.ts

import { boot } from 'quasar/wrappers';
import { useThemeStore } from '@/stores/useThemeStore';

export default boot(async () => {
  // Initialize theme store to set dark theme as default
  // This runs after Pinia is ready thanks to boot file ordering
  const themeStore = useThemeStore();

  // initTheme() is already called on store creation, but we ensure it's initialized
  themeStore.initTheme();
});
