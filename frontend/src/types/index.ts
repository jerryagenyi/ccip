// Shared TypeScript interfaces and types for CCIP application

// =================================
// User & Authentication Types
// =================================

export type UserRole = 'super_admin' | 'admin' | 'sub_admin' | 'user';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarId?: string;
  role: UserRole;
  team?: string;
  status: UserStatus;
  organisation?: Organisation;
  profilePicture?: string;
  phoneNumber?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  phoneNumber?: string;
  organisation_id?: string;
  acceptTerms: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// =================================
// Organisation Types
// =================================

export type OrganisationCategory = 'Government' | 'NGO' | 'CSO' | 'Private';
export type OrganisationLevel = 'Federal' | 'State' | 'LGA';
export type OrganisationStatus = 'Active' | 'Pending' | 'Suspended';

export interface Organisation {
  id: string;
  name: string;
  category: OrganisationCategory;
  level: OrganisationLevel;
  status: OrganisationStatus;
  parent?: string;
  members: number;
  activities: number;
  description?: string;
  address?: string;
  state?: string;
  lga?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

// =================================
// Activity Types
// =================================

export type ActivityStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Completed';
export type ActivityType = 'Campaign' | 'Outreach' | 'Awareness' | 'Training' | 'Research';

export interface TargetContext {
  region: string;
  language: string;
  culture: string;
  demographics?: {
    ageRange: string;
    gender: string;
    education: string;
  };
}

export interface PlannedMessage {
  content: string;
  channels: string[];
  messengers: string[];
  tone: 'Formal' | 'Informal' | 'Technical' | 'Simple';
  keyMessages: string[];
}

export interface SemioticPattern {
  patternId: string;
  patternType: string;
  context: {
    region: string;
    language: string;
    culture: string;
  };
  failedElement: string;
  issue: string;
  recommendation: string;
  riskScore: number;
  confidence: number;
  probability: number;
}

export interface SemioticAssessment {
  id: string;
  riskScore: number;
  confidence: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  predictedFailures: {
    element: string;
    issue: string;
    probability: number;
    patternId: string;
  }[];
  recommendations: {
    priority: 'High' | 'Medium' | 'Low';
    action: string;
    expectedImpact: string;
  }[];
  culturalConsiderations: string[];
  messageOptimizations: {
    original: string;
    suggested: string;
    reason: string;
  }[];
  assessedAt: string;
  culturalAppropriateness?: {
    score: number;
    issues: {
      severity: 'high' | 'medium' | 'low';
      message: string;
      recommendation: string;
    }[];
  };
  linguisticEffectiveness?: {
    score: number;
    suggestions: string[];
  };
  visualCommunication?: {
    score: number;
    recommendations: {
      category: string;
      description: string;
    }[];
  };
}

export interface CommunicationEffectiveness {
  understandingScore: number;
  complianceRate: number;
  barriersEncountered: string[];
  messageResonance: 'high' | 'medium' | 'low';
  culturalAlignment: number;
  feedbackScore: number;
  engagementMetrics: {
    reach: number;
    impressions: number;
    interactions: number;
    shares: number;
  };
}

export interface SemioticValidation {
  predictedFailuresValidated: boolean[];
  recommendationsUsed: string[];
  actualOutcome: 'success' | 'partial' | 'failure';
  lessonsLearned: string[];
  unexpectedResults?: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  status: ActivityStatus;
  type: ActivityType;
  organization: string;
  organisationId?: string;
  location: string;
  state: string;
  lga: string;
  dateCreated: string;
  lastModified: string;
  startDate?: string;
  endDate?: string;
  targetContext: TargetContext;
  plannedMessage: PlannedMessage;
  semioticRiskScore?: number;
  semioticAssessment?: SemioticAssessment | null;
  communicationEffectiveness?: CommunicationEffectiveness;
  semioticValidation?: SemioticValidation;
  humanReviewCompleted?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  tags: string[];
  attachments: ActivityAttachment[];
  budget?: number;
  actualCost?: number;
  targetAudience: number;
  actualReach?: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignees: string[]; // User IDs
  createdBy: string;
  updatedBy: string;
}

export interface ActivityAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ActivityFilters {
  search?: string;
  status?: ActivityStatus[];
  type?: ActivityType[];
  organisation?: string[];
  state?: string[];
  lga?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  priority?: string[];
  assignee?: string[];
  tags?: string[];
}

// =================================
// Notification Types
// =================================

export type NotificationType =
  | 'Approval'
  | 'Assignment'
  | 'Alert'
  | 'System'
  | 'Comment'
  | 'Invitation';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon?: string;
  iconColor?: string;
  actionUrl?: string;
  actionText?: string;
  userId: string;
  metadata?: Record<string, any>;
}

// =================================
// Report Types
// =================================

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  fields: ReportField[];
  isDefault: boolean;
  isActive: boolean;
}

export interface ReportField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'chart' | 'table';
  label: string;
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  title: string;
  data: Record<string, any>;
  aiGenerated: boolean;
  aiInsights?: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
  };
  generatedBy: string;
  generatedAt: string;
  format: 'pdf' | 'excel' | 'json';
  fileUrl?: string;
  status: 'Generating' | 'Completed' | 'Failed';
}

// =================================
// Message Types
// =================================

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
  replyTo?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Conversation {
  id: string;
  subject: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  messages: Message[];
  isRead: boolean;
  lastMessageTimestamp: string;
  createdAt: string;
  updatedAt: string;
  type: 'Direct' | 'Group' | 'System';
  tags: string[];
}

export interface MessageDraft {
  to: string[];
  subject: string;
  content: string;
  attachments: File[];
}

// =================================
// API Response Types
// =================================

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    total?: number;
    page?: number;
    lastPage?: number;
    perPage?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    perPage: number;
    from: number;
    to: number;
  };
}

// =================================
// UI State Types
// =================================

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  perPage: number;
  total: number;
}

// =================================
// Chart Data Types
// =================================

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface MetricCard {
  id: string;
  title: string;
  value: number | string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: string;
  color: string;
  format?: 'number' | 'currency' | 'percentage';
}

// =================================
// Filter & Search Types
// =================================

export interface SearchConfig {
  query: string;
  fields: string[];
  filters: Record<string, any>;
  sort: SortConfig;
  pagination: PaginationConfig;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// =================================
// Form Validation Types
// =================================

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  email?: boolean;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  value: any;
  rules?: ValidationRule[];
  options?: { label: string; value: string }[];
  placeholder?: string;
  helper?: string;
}

// =================================
// Utility Types
// =================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// =================================
// Navigation Types
// =================================

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  label?: string;
  badge?: number;
  children?: NavItem[];
  external?: boolean;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

// =================================
// File Upload Types
// =================================

export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// =================================
// AI Analysis Types
// =================================

export interface AIAnalysisRequest {
  activityId: string;
  messageType: string;
  targetAudience: TargetContext;
  plannedMessage: PlannedMessage;
}

export interface AIAnalysisResult {
  id: string;
  riskScore: number;
  confidence: number;
  patterns: SemioticPattern[];
  recommendations: string[];
  culturalInsights: string[];
  optimizedMessage: string;
  processingTime: number;
  model: string;
  version: string;
}

// =================================
// Settings Types
// =================================

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    types: NotificationType[];
  };
  privacy: {
    profileVisibility: 'public' | 'organisation' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
  };
}

export interface SystemSettings {
  maintenance: boolean;
  maintenanceMessage?: string;
  version: string;
  features: {
    aiAnalysis: boolean;
    realTimeUpdates: boolean;
    fileUploads: boolean;
    notifications: boolean;
  };
  limits: {
    maxFileSize: number;
    maxFilesPerActivity: number;
    maxActivitiesPerUser: number;
  };
}

export * from './api'; // Export any API-specific types
