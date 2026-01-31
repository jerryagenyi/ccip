import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api, API_ENDPOINTS } from '@/services/api';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthState,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
} from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  // Defer localStorage access to avoid issues during store definition
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const refreshTokenTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  // Initialize token from localStorage lazily
  if (typeof window !== 'undefined' && localStorage) {
    try {
      token.value = localStorage.getItem('auth_token');
    } catch (e) {
      // Ignore if localStorage is not available
    }
  }

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role || null);
  const userOrganisation = computed(() => user.value?.organisation || null);
  const userPermissions = computed(() => {
    const role = user.value?.role;
    if (!role) return [];

    const permissions = {
      super_admin: ['*'],
      admin: [
        'users.read',
        'users.create',
        'users.update',
        'users.delete',
        'activities.read',
        'activities.create',
        'activities.update',
        'activities.delete',
        'organisations.read',
        'organisations.create',
        'organisations.update',
        'organisations.delete',
        'reports.read',
        'reports.create',
        'reports.delete',
        'system.read',
        'system.update',
      ],
      sub_admin: [
        'activities.read',
        'activities.create',
        'activities.update',
        'users.read',
        'users.update',
        'reports.read',
        'reports.create',
        'organisations.read',
      ],
      user: [
        'activities.read',
        'activities.create',
        'activities.update',
        'profile.read',
        'profile.update',
        'reports.read',
      ],
    };

    return permissions[role] || [];
  });

  // Functions instead of computed to avoid Pinia access during definition
  const hasPermission = (permission: string) => {
    const perms = userPermissions.value;
    return perms.includes('*') || perms.includes(permission);
  };

  const hasRole = (role: string | string[]) => {
    if (!user.value?.role) return false;
    if (Array.isArray(role)) {
      return role.includes(user.value.role);
    }
    return user.value.role === role;
  };

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      const { user: userData, token: userToken } = response.data.data;

      // Store token and user data
      token.value = userToken;
      user.value = userData;
      localStorage.setItem('auth_token', userToken);

      // Set up auto refresh
      setupTokenRefresh();

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: RegisterData) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data
      );

      const { user: userData, token: userToken } = response.data.data;

      token.value = userToken;
      user.value = userData;
      localStorage.setItem('auth_token', userToken);

      setupTokenRefresh();

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;

    try {
      if (token.value) {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT);
      }
    } catch (err) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', err);
    } finally {
      // Clear all auth data
      clearAuthData();
      loading.value = false;
    }
  }

  async function fetchUser() {
    if (!token.value) return null;

    try {
      const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.USERS.ME);
      user.value = response.data.data;
      return response.data.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        clearAuthData();
      }
      throw err;
    }
  }

  async function refreshToken() {
    if (!token.value) throw new Error('No token to refresh');

    try {
      const response = await api.post<ApiResponse<{ token: string }>>(API_ENDPOINTS.AUTH.REFRESH);

      token.value = response.data.data.token;
      localStorage.setItem('auth_token', token.value);

      setupTokenRefresh();

      return response.data.data.token;
    } catch (err) {
      // If refresh fails, logout user
      await logout();
      throw err;
    }
  }

  async function forgotPassword(email: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to send reset email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(data: ResetPasswordRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reset password';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function verifyEmail(token: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });

      // Refresh user data after verification
      if (isAuthenticated.value) {
        await fetchUser();
      }

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to verify email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function resendVerificationEmail() {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to resend verification email';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Helper functions
  function clearAuthData() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');

    if (refreshTokenTimeout.value) {
      clearTimeout(refreshTokenTimeout.value);
      refreshTokenTimeout.value = null;
    }
  }

  function setupTokenRefresh() {
    // Clear existing timeout
    if (refreshTokenTimeout.value) {
      clearTimeout(refreshTokenTimeout.value);
    }

    // Set token to refresh 5 minutes before expiry
    // TODO: Read actual token expiry from JWT payload or backend config
    // Currently assumes 1-hour token expiry (Laravel Sanctum default)
    // Future improvement: Parse JWT to get actual expiry time
    const refreshInterval = 55 * 60 * 1000; // 55 minutes (5 min before 1-hour expiry)

    refreshTokenTimeout.value = setTimeout(async () => {
      try {
        await refreshToken();
      } catch (err) {
        console.error('Auto token refresh failed:', err);
        // If refresh fails, user will be logged out on next API call
      }
    }, refreshInterval);
  }

  async function updateProfile(profileData: Partial<User>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.put<ApiResponse<User>>(
        API_ENDPOINTS.USERS.UPDATE_PROFILE,
        profileData
      );

      user.value = response.data.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update profile';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function changePassword(
    currentPassword: string,
    password: string,
    passwordConfirmation: string
  ) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.put<ApiResponse<any>>(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
        currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to change password';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Initialize: fetch user if token exists
  async function initialize() {
    if (token.value && !user.value) {
      try {
        await fetchUser();
        setupTokenRefresh();
      } catch (err) {
        // Silent fail on init
        console.error('Auth initialization failed:', err);
      }
    }
  }

  // Don't auto-initialize - let components call this after Pinia is ready
  // initialize();

  return {
    // State
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    userOrganisation,
    userPermissions,
    hasPermission,
    hasRole,

    // Actions
    login,
    register,
    logout,
    fetchUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    updateProfile,
    changePassword,

    // Internal helpers
    clearAuthData,
    initialize,
  };
});
