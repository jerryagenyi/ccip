import { config } from '@vue/test-utils';
import { Quasar } from 'quasar';
import { beforeAll, vi } from 'vitest';

// Mock Quasar plugins
beforeAll(() => {
  config.global.plugins = [Quasar];
  
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock fetch
  global.fetch = vi.fn();
});

