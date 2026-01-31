// API specific types and endpoints

export const API_ENDPOINTS = {
  // Authentication
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

  // User Management
  USERS: {
    ME: '/users/me',
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
    UPDATE_PROFILE: '/users/update-profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/upload-avatar',
  },

  // Organisations
  ORGANISATIONS: {
    LIST: '/organisations',
    CREATE: '/organisations',
    DETAIL: (id: string) => `/organisations/${id}`,
    UPDATE: (id: string) => `/organisations/${id}`,
    DELETE: (id: string) => `/organisations/${id}`,
    MEMBERS: (id: string) => `/organisations/${id}/members`,
    INVITE_MEMBERS: (id: string) => `/organisations/${id}/invite-members`,
    ACTIVITIES: (id: string) => `/organisations/${id}/activities`,
  },

  // Activities
  ACTIVITIES: {
    LIST: '/activities',
    CREATE: '/activities',
    DETAIL: (id: string) => `/activities/${id}`,
    UPDATE: (id: string) => `/activities/${id}`,
    DELETE: (id: string) => `/activities/${id}`,
    SUBMIT: (id: string) => `/activities/${id}/submit`,
    APPROVE: (id: string) => `/activities/${id}/approve`,
    REJECT: (id: string) => `/activities/${id}/reject`,
    COMPLETE: (id: string) => `/activities/${id}/complete`,
    DUPLICATE: (id: string) => `/activities/${id}/duplicate`,
    UPLOAD_FILES: (id: string) => `/activities/${id}/upload-files`,
    DELETE_FILE: (id: string, fileId: string) => `/activities/${id}/files/${fileId}`,
  },

  // AI Services
  AI: {
    SEMIOTIC_ANALYZE: '/ai/semiotic-analyze',
    GENERATE_REPORT: '/ai/generate-report',
    INSIGHTS: '/ai/insights',
    OPTIMIZE_MESSAGE: '/ai/optimize-message',
    PREDICT_OUTCOMES: '/ai/predict-outcomes',
  },

  // Reports
  REPORTS: {
    TEMPLATES: '/reports/templates',
    GENERATE: '/reports/generate',
    LIST: '/reports',
    DETAIL: (id: string) => `/reports/${id}`,
    DELETE: (id: string) => `/reports/${id}`,
    EXPORT: (id: string, format: string) => `/reports/${id}/export/${format}`,
  },

  // Messages
  MESSAGES: {
    INBOX: '/messages/inbox',
    SENT: '/messages/sent',
    COMPOSE: '/messages/compose',
    CONVERSATION: (id: string) => `/messages/conversations/${id}`,
    MARK_READ: (id: string) => `/messages/${id}/read`,
    DELETE: (id: string) => `/messages/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    SETTINGS: '/notifications/settings',
    UPDATE_SETTINGS: '/notifications/settings',
  },

  // File Uploads
  UPLOADS: {
    SINGLE: '/uploads/single',
    MULTIPLE: '/uploads/multiple',
    PRESIGNED_URL: '/uploads/presigned-url',
    DELETE: (id: string) => `/uploads/${id}`,
  },

  // Dashboard & Analytics
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    ACTIVITY_SUMMARY: '/dashboard/activity-summary',
    PERFORMANCE: '/dashboard/performance',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
    UPCOMING_DEADLINES: '/dashboard/upcoming-deadlines',
  },

  // Search & Filters
  SEARCH: {
    GLOBAL: '/search',
    ACTIVITIES: '/search/activities',
    ORGANISATIONS: '/search/organisations',
    USERS: '/search/users',
  },

  // System
  SYSTEM: {
    HEALTH: '/system/health',
    INFO: '/system/info',
    CONFIG: '/system/config',
    MAINTENANCE: '/system/maintenance',
  },
} as const;

// API Request/Response Payload Types
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  phoneNumber?: string;
  organisation_id?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  type: string;
  organization: string;
  location: string;
  state: string;
  lga: string;
  targetContext: {
    region: string;
    language: string;
    culture: string;
  };
  plannedMessage: {
    content: string;
    channels: string[];
    messengers: string[];
    tone: string;
    keyMessages: string[];
  };
  startDate?: string;
  endDate?: string;
  budget?: number;
  targetAudience: number;
  priority: string;
  tags: string[];
  assignees: string[];
}

export interface UpdateActivityRequest extends Partial<CreateActivityRequest> {
  status?: string;
  humanReviewCompleted?: boolean;
  reviewedAt?: string;
}

export interface SemioticAnalysisRequest {
  activityId: string;
  messageType: string;
  targetAudience: {
    region: string;
    language: string;
    culture: string;
  };
  plannedMessage: {
    content: string;
    channels: string[];
    messengers: string[];
  };
}

export interface GenerateReportRequest {
  templateId: string;
  title: string;
  filters: {
    dateRange?: {
      start: string;
      end: string;
    };
    organisations?: string[];
    statuses?: string[];
    types?: string[];
  };
  includeAI?: boolean;
  format: 'pdf' | 'excel' | 'json';
}

export interface ComposeMessageRequest {
  to: string[];
  subject: string;
  content: string;
  attachments?: File[];
}

export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  profilePicture?: File;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  password: string;
  password_confirmation: string;
}

export interface InviteMembersRequest {
  emails?: string[];
  csvFile?: File;
  role: string;
  message?: string;
}

export interface UpdateNotificationSettingsRequest {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: string[];
}

// HTTP Header Types
export interface RequestHeaders {
  'Content-Type'?: string;
  Accept?: string;
  Authorization?: string;
  'X-Requested-With'?: string;
}

// Query Parameter Types
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface ActivityQueryParams extends PaginationParams {
  search?: string;
  status?: string[];
  type?: string[];
  organisation?: string[];
  state?: string[];
  lga?: string[];
  priority?: string[];
  assignee?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  q: string;
  type?: string;
  filters?: Record<string, any>;
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
}

export interface NotificationWebSocketEvent extends WebSocketEvent {
  type: 'notification';
  payload: {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconColor: string;
  };
}

export interface ActivityUpdateEvent extends WebSocketEvent {
  type: 'activity_update';
  payload: {
    id: string;
    status: string;
    updatedBy: string;
  };
}

// Error Response Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  errors?: ValidationError[];
  stack?: string; // Only in development
}

export interface NetworkError {
  message: string;
  code: string;
  status?: number;
  statusText?: string;
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Cache Types
export interface CacheConfig {
  ttl: number; // Time to live in seconds
  key: string;
  version?: string;
}

export interface CachedResponse<T = any> {
  data: T;
  cachedAt: string;
  expiresAt: string;
  key: string;
}

// Export type guards
export const isApiError = (error: any): error is ErrorResponse => {
  return error && typeof error === 'object' && 'success' in error && error.success === false;
};

export const isValidationError = (error: any): error is ValidationError => {
  return error && typeof error === 'object' && 'field' in error && 'message' in error;
};

// Export API configuration
export const API_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;
