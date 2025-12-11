import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuasar } from 'quasar';

/**
 * Authentication guard - checks if user is authenticated
 */
export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // Public routes that don't require authentication
  const publicRoutes = ['auth-login', 'auth-register', 'auth-forgot-password', 'auth-reset-password'];

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Store the attempted route for redirect after login
    const redirect = to.fullPath !== '/auth/login' ? to.fullPath : undefined;
    next({
      name: 'auth-login',
      query: redirect ? { redirect } : undefined
    });
    return;
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (authStore.isAuthenticated && publicRoutes.includes(to.name as string)) {
    next({ name: 'dashboard' });
    return;
  }

  next();
}

/**
 * Guest guard - redirects authenticated users away from auth pages
 */
export function guestGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
}

/**
 * Role guard - checks if user has required role
 */
export function roleGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const $q = useQuasar();

  // Skip role check if no roles are required
  if (!to.meta.requiresRole) {
    next();
    return;
  }

  const requiredRoles = to.meta.requiresRole as string[] | string;

  // Convert to array if single role
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    next({
      name: 'auth-login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Check if user has any of the required roles
  if (authStore.hasRole && authStore.hasRole(roles)) {
    next();
    return;
  }

  // User doesn't have required role
  $q.notify({
    type: 'negative',
    message: 'Access denied. You do not have permission to access this page.',
    position: 'top'
  });

  // Redirect to appropriate page based on user role
  const redirectTo = getRedirectRoute(authStore.userRole);
  next({ name: redirectTo });
}

/**
 * Permission guard - checks if user has required permission
 */
export function permissionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const $q = useQuasar();

  // Skip permission check if no permissions are required
  if (!to.meta.requiresPermission) {
    next();
    return;
  }

  const requiredPermissions = to.meta.requiresPermission as string[] | string;

  // Convert to array if single permission
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    next({
      name: 'auth-login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  // Check if user has any of the required permissions
  const hasPermission = permissions.some(permission =>
    authStore.hasPermission && authStore.hasPermission(permission)
  );

  if (hasPermission) {
    next();
    return;
  }

  // User doesn't have required permission
  $q.notify({
    type: 'negative',
    message: 'Access denied. You do not have permission to perform this action.',
    position: 'top'
  });

  // Redirect to previous page or dashboard
  next(from.name || { name: 'dashboard' });
}

/**
 * Email verification guard - checks if user has verified email
 */
export function emailVerificationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // Skip verification check for certain routes
  const skipVerificationRoutes = [
    'auth-login',
    'auth-register',
    'auth-forgot-password',
    'auth-reset-password',
    'user-profile',
    'dashboard'
  ];

  if (skipVerificationRoutes.includes(to.name as string)) {
    next();
    return;
  }

  // If user is authenticated but email is not verified
  if (authStore.isAuthenticated && authStore.user?.emailVerified === false) {
    // Check if current route is already the verification page
    if (to.name === 'auth-verify-email') {
      next();
      return;
    }

    // Redirect to email verification page
    next({
      name: 'auth-verify-email',
      query: { redirect: to.fullPath }
    });
    return;
  }

  next();
}

/**
 * Organisation verification guard - checks if user belongs to a verified organisation
 */
export function organisationGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const $q = useQuasar();

  // Skip org check for certain routes
  const skipOrgRoutes = [
    'auth-login',
    'auth-register',
    'auth-forgot-password',
    'auth-reset-password',
    'user-profile',
    'organisations-create',
    'dashboard'
  ];

  if (skipOrgRoutes.includes(to.name as string)) {
    next();
    return;
  }

  // If user is authenticated
  if (authStore.isAuthenticated) {
    const user = authStore.user;

    // Check if user belongs to an organisation
    if (!user?.organisation) {
      // If route requires organisation, redirect to organisation creation
      if (to.meta.requiresOrganisation) {
        $q.notify({
          type: 'warning',
          message: 'You need to join or create an organisation to access this page.',
          position: 'top'
        });
        next({ name: 'organisations-create' });
        return;
      }
    }

    // Check if organisation is active
    if (user?.organisation && user.organisation.status !== 'Active') {
      $q.notify({
        type: 'negative',
        message: 'Your organisation is not active. Please contact an administrator.',
        position: 'top'
      });
      next({ name: 'user-profile' });
      return;
    }
  }

  next();
}

/**
 * Onboarding guard - checks if user has completed onboarding
 */
export function onboardingGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // Skip onboarding check for auth routes
  const skipOnboardingRoutes = [
    'auth-login',
    'auth-register',
    'auth-forgot-password',
    'auth-reset-password',
    'user-profile'
  ];

  if (skipOnboardingRoutes.includes(to.name as string)) {
    next();
    return;
  }

  // If user is authenticated but hasn't completed onboarding
  if (authStore.isAuthenticated && authStore.user?.onboardingCompleted === false) {
    // Check if current route is already onboarding
    if (to.name === 'user-onboarding') {
      next();
      return;
    }

    // Redirect to onboarding
    next({
      name: 'user-onboarding',
      query: { redirect: to.fullPath }
    });
    return;
  }

  next();
}

/**
 * Helper function to get redirect route based on user role
 */
function getRedirectRoute(userRole: string | null): string {
  const roleRedirects = {
    'super_admin': 'dashboard',
    'admin': 'dashboard',
    'sub_admin': 'dashboard',
    'user': 'activities-list'
  };

  return roleRedirects[userRole as keyof typeof roleRedirects] || 'dashboard';
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
  // Run guards in sequence
  authGuard(to, from, (redirect) => {
    if (redirect !== next) return next(redirect);

    roleGuard(to, from, (redirect) => {
      if (redirect !== next) return next(redirect);

      permissionGuard(to, from, (redirect) => {
        if (redirect !== next) return next(redirect);

        emailVerificationGuard(to, from, (redirect) => {
          if (redirect !== next) return next(redirect);

          organisationGuard(to, from, (redirect) => {
            if (redirect !== next) return next(redirect);

            onboardingGuard(to, from, (redirect) => {
              if (redirect !== next) return next(redirect);

              next();
            });
          });
        });
      });
    });
  });
}

