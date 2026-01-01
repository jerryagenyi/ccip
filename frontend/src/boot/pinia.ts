import { boot } from 'quasar/wrappers';
import { createPinia, setActivePinia } from 'pinia';

// Initialize Pinia in a boot file to ensure it's available before stores are used
let piniaInstance: ReturnType<typeof createPinia> | null = null;

export default boot(({ app }) => {
  if (!piniaInstance) {
    piniaInstance = createPinia();
    app.use(piniaInstance);
    // Set as active Pinia instance for the app
    setActivePinia(piniaInstance);
  }
});

