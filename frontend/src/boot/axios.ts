import { boot } from 'quasar/wrappers';
import { api } from '@/services/api';

export default boot(({ app }) => {
  // Make API instance available globally if needed
  app.config.globalProperties.$api = api;
});
