import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/services/api';
import type { User, LoginCredentials, RegisterData } from '@/types';

// Mock the API service
vi.mock('@/services/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
    },
    USERS: {
      ME: '/users/me',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/change-password',
    },
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with null user and token', () => {
      const store = useAuthStore();
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it('should load token from localStorage on init', () => {
      localStorage.setItem('auth_token', 'test-token');
      const store = useAuthStore();
      expect(store.token).toBe('test-token');
    });
  });

  describe('Login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        isActive: true,
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Login successful',
          data: {
            user: mockUser,
            token: 'test-token-123',
          },
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await store.login(credentials);

      expect(store.user).toEqual(mockUser);
      expect(store.token).toBe('test-token-123');
      expect(store.isAuthenticated).toBe(true);
      expect(localStorage.getItem('auth_token')).toBe('test-token-123');
      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
    });

    it('should handle login errors', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      };

      vi.mocked(api.post).mockRejectedValue(mockError);

      const store = useAuthStore();
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(store.login(credentials)).rejects.toEqual(mockError);
      expect(store.error).toBe('Invalid credentials');
      expect(store.user).toBeNull();
      expect(store.isAuthenticated).toBe(false);
    });

    it('should set loading state during login', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: { id: '1', name: 'Test', email: 'test@example.com', role: 'user' },
            token: 'token',
          },
        },
      };

      vi.mocked(api.post).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
      );

      const store = useAuthStore();
      const loginPromise = store.login({ email: 'test@example.com', password: 'pass' });

      expect(store.loading).toBe(true);
      await loginPromise;
      expect(store.loading).toBe(false);
    });
  });

  describe('Register', () => {
    it('should register successfully with valid data', async () => {
      const mockUser: User = {
        id: '1',
        name: 'New User',
        email: 'new@example.com',
        role: 'user',
        isActive: true,
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Registration successful',
          data: {
            user: mockUser,
            token: 'new-token-123',
          },
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const registerData: RegisterData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        acceptTerms: true,
      };

      await store.register(registerData);

      expect(store.user).toEqual(mockUser);
      expect(store.token).toBe('new-token-123');
      expect(store.isAuthenticated).toBe(true);
      expect(localStorage.getItem('auth_token')).toBe('new-token-123');
    });

    it('should handle registration errors', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Email already exists',
          },
        },
      };

      vi.mocked(api.post).mockRejectedValue(mockError);

      const store = useAuthStore();
      const registerData: RegisterData = {
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        acceptTerms: true,
      };

      await expect(store.register(registerData)).rejects.toEqual(mockError);
      expect(store.error).toBe('Email already exists');
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Logged out successfully',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      store.token = 'test-token';
      store.user = { id: '1', name: 'Test', email: 'test@example.com', role: 'user' };
      localStorage.setItem('auth_token', 'test-token');

      await store.logout();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.isAuthenticated).toBe(false);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should clear auth data even if API call fails', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

      const store = useAuthStore();
      store.token = 'test-token';
      store.user = { id: '1', name: 'Test', email: 'test@example.com', role: 'user' };
      localStorage.setItem('auth_token', 'test-token');

      await store.logout();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });
  });

  describe('Forgot Password', () => {
    it('should send password reset email', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset link sent to your email',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const result = await store.forgotPassword('test@example.com');

      expect(result).toEqual(mockResponse.data);
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      });
    });

    it('should handle forgot password errors', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Email not found',
          },
        },
      };

      vi.mocked(api.post).mockRejectedValue(mockError);

      const store = useAuthStore();
      await expect(store.forgotPassword('nonexistent@example.com')).rejects.toEqual(mockError);
      expect(store.error).toBe('Email not found');
    });
  });

  describe('Reset Password', () => {
    it('should reset password successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password reset successfully',
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      const resetData = {
        token: 'reset-token',
        email: 'test@example.com',
        password: 'newpassword123',
        password_confirmation: 'newpassword123',
      };

      const result = await store.resetPassword(resetData);

      expect(result).toEqual(mockResponse.data);
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', resetData);
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            token: 'new-refreshed-token',
          },
        },
      };

      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const store = useAuthStore();
      store.token = 'old-token';

      const newToken = await store.refreshToken();

      expect(newToken).toBe('new-refreshed-token');
      expect(store.token).toBe('new-refreshed-token');
      expect(localStorage.getItem('auth_token')).toBe('new-refreshed-token');
    });

    it('should logout on refresh failure', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Token expired'));

      const store = useAuthStore();
      store.token = 'old-token';
      store.user = { id: '1', name: 'Test', email: 'test@example.com', role: 'user' };

      await expect(store.refreshToken()).rejects.toThrow();

      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
    });
  });

  describe('Permissions and Roles', () => {
    it('should check user permissions correctly', () => {
      const store = useAuthStore();
      store.user = {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
      };

      expect(store.hasPermission('users.read')).toBe(true);
      expect(store.hasPermission('users.create')).toBe(true);
      expect(store.hasPermission('nonexistent.permission')).toBe(false);
    });

    it('should check user roles correctly', () => {
      const store = useAuthStore();
      store.user = {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        role: 'admin',
        isActive: true,
      };

      expect(store.hasRole('admin')).toBe(true);
      expect(store.hasRole('user')).toBe(false);
      expect(store.hasRole(['admin', 'super_admin'])).toBe(true);
    });

    it('should return correct user role', () => {
      const store = useAuthStore();
      store.user = {
        id: '1',
        name: 'User',
        email: 'user@example.com',
        role: 'user',
        isActive: true,
      };

      expect(store.userRole).toBe('user');
    });
  });
});

