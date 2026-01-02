import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { Dark } from 'quasar';

export type ThemeMode = 'light' | 'dark' | 'auto';

export const useThemeStore = defineStore('theme', () => {
  // Default to dark theme as per UX specification
  const getStoredTheme = (): ThemeMode => {
    if (typeof window !== 'undefined' && localStorage) {
      const stored = localStorage.getItem('theme-mode');
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored as ThemeMode;
      }
    }
    return 'dark';
  };
  
  const themeMode = ref<ThemeMode>(getStoredTheme());
  const isDark = ref(Dark.isActive);

  // Initialize theme on store creation
  const initTheme = () => {
    if (themeMode.value === 'auto') {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      Dark.set(prefersDark);
    } else {
      Dark.set(themeMode.value === 'dark');
    }
    isDark.value = Dark.isActive;
    updateDocumentClass();
  };

  // Update document class for CSS variable support
  // Note: Quasar's Dark.set() automatically manages body--dark/body--light classes
  // This function only handles custom documentElement classes for CSS variables
  const updateDocumentClass = () => {
    if (typeof document === 'undefined') return;
    
    // Update documentElement for custom CSS variables (if needed in future)
    if (Dark.isActive) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  };

  // Set theme mode
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode;
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('theme-mode', mode);
    }
    
    if (mode === 'auto') {
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        Dark.set(prefersDark);
      }
    } else {
      Dark.set(mode === 'dark');
    }
    
    isDark.value = Dark.isActive;
    updateDocumentClass();
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    if (themeMode.value === 'auto') {
      // If auto, switch to opposite of current
      setThemeMode(Dark.isActive ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setThemeMode(Dark.isActive ? 'light' : 'dark');
    }
  };

  // Watch for system theme changes when in auto mode
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (themeMode.value === 'auto') {
        Dark.set(e.matches);
        isDark.value = Dark.isActive;
        updateDocumentClass();
      }
    });
  }

  // Initialize on store creation
  initTheme();

  return {
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
    initTheme,
  };
});

