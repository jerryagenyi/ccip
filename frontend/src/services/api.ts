import axios, { AxiosInstance, AxiosError } from 'axios';
import { Notify } from 'quasar';
import { API_ENDPOINTS, API_CONFIG } from '@/types/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth_token');
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }
          break;

        case 403:
          // Forbidden
          Notify.create({
            type: 'negative',
            message: data.message || 'You do not have permission to perform this action',
          });
          break;

        case 422:
          // Validation error
          const errors = data.errors || {};
          const firstError = Object.values(errors)[0] as string[];
          Notify.create({
            type: 'negative',
            message: firstError?.[0] || data.message || 'Validation error',
          });
          break;

        case 500:
          // Server error
          Notify.create({
            type: 'negative',
            message: 'Server error. Please try again later.',
          });
          break;

        default:
          // Other errors
          Notify.create({
            type: 'negative',
            message: data.message || 'An error occurred',
          });
      }
    } else if (error.request) {
      // Network error
      Notify.create({
        type: 'negative',
        message: 'Network error. Please check your connection.',
      });
    }

    return Promise.reject(error);
  }
);

// Export API utilities
export { api, API_ENDPOINTS };
export default api;

