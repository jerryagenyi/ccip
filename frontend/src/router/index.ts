import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router';
import routes from './routes';
import { globalGuard } from './guards';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: (to, from, savedPosition) => {
      // Handle saved position (back/forward buttons)
      if (savedPosition) {
        return savedPosition;
      }

      // Handle hash anchors
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
        };
      }

      // Default scroll to top
      return { left: 0, top: 0 };
    },
    routes,

    // Leave this as is and make changes in quasar.config.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  // Apply global guard
  Router.beforeEach(globalGuard);

  // Add navigation tracking for analytics (optional)
  Router.afterEach((to) => {
    // Track page view in analytics
    if (process.env.CLIENT && typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: to.fullPath,
      });
    }

    // Update page title
    const appName = 'CCIP';
    const pageTitle = typeof to.meta.title === 'string'
      ? to.meta.title
      : to.meta.title instanceof Function
        ? to.meta.title(to)
        : to.name?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l.toUpperCase());

    if (pageTitle) {
      document.title = `${pageTitle} - ${appName}`;
    } else {
      document.title = appName;
    }
  });

  return Router;
});

