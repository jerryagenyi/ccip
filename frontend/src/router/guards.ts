import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

/**
 * Simple auth guard without Pinia dependency for E2E testing
 */
export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Public routes that don't require authentication
  const publicRoutes = ['auth-login', 'auth-register', 'auth-forgot-password', 'auth-reset-password'];

  // Check localStorage for auth token
  const isAuthenticated = !!localStorage.getItem('auth_token');

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    const redirect = to.fullPath !== '/auth/login' ? to.fullPath : undefined;
    next({
      name: 'auth-login',
      query: redirect ? { redirect } : undefined
    });
    return;
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && publicRoutes.includes(to.name as string)) {
    next({ name: 'dashboard' });
    return;
  }

  next();
}

/**
 * Guest guard - redirects authenticated users away from auth pages
 */
export function guestGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const isAuthenticated = !!localStorage.getItem('auth_token');

  if (isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
}

/**
 * Role guard - simplified version for E2E testing
 */
export function roleGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // For E2E testing, we'll skip role checks
  next();
}

/**
 * Global before each navigation guard
 * Combines all guards for comprehensive route protection
 */
export function globalGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('auth_token');
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Route navigation:', {
      to: to.name,
      path: to.path,
      authenticated: isAuthenticated,
      requiresAuth: to.meta.requiresAuth
    });
  }
  
  // If authenticated user visits landing page, redirect to dashboard
  if (to.name === 'home' && isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }
  
  // Allow landing page for unauthenticated users - bypass auth guard
  if (to.name === 'home' && !isAuthenticated) {
    next();
    return;
  }
  
  // Run auth guard - it handles authentication and redirects
  authGuard(to, from, next);
}