// Quasar boot file for Pinia initialization
// This MUST run before any other boot files that use stores

import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';

const pinia = createPinia();

export default boot(({ app }) => {
  // Install Pinia plugin
  app.use(pinia);

  // Make pinia instance available globally for store access outside components
  if (typeof window !== 'undefined') {
    window.__pinia = pinia;
  }
};
