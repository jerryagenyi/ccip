import { boot } from 'quasar/wrappers';
import { Router } from 'vue-router';
import { globalGuard } from '@/router/guards';

export default boot(({ router }: { router: Router }) => {
  // Apply global guard which handles all routing logic
  router.beforeEach(globalGuard);
});
