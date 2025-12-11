# CCIP Frontend Architecture Documentation

## Executive Summary

The CCIP frontend is a modern Vue 3 + Quasar web application designed for Crisis Communication Intelligence. It provides a responsive, user-friendly interface for managing crisis communications, with features including user management, activity tracking, dashboards, and real-time messaging.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|------------|---------|----------------|
| **Framework** | Vue.js | 3.4.21 | Reactive component framework with Composition API |
| **UI Library** | Quasar | 2.14.2 | Material Design components with mobile-first responsive design |
| **State Management** | Pinia | 2.1.7 | Official Vue 3 state management, TypeScript support |
| **Routing** | Vue Router | 4.3.0 | Declarative routing with route guards |
| **HTTP Client** | Axios | 1.6.7 | Promise-based HTTP client with interceptors |
| **Build Tool** | Vite | 5.1.0 | Fast development server and optimized builds |
| **Language** | TypeScript | - | Static typing and improved developer experience |
| **Testing** | Vitest + Playwright | 1.0.0 / 1.40.0 | Unit testing and end-to-end testing |

## Architecture Pattern

### Component-Based Architecture with Centralized State

The frontend follows Vue.js best practices with a component-based architecture:

1. **Components**: Reusable, self-contained UI elements
2. **Composition API**: Logic extraction and reuse
3. **Centralized State**: Pinia stores for global state
4. **Service Layer**: API abstraction and data transformation

## Data Architecture

### State Management Structure

```typescript
// Main Pinia Stores
stores/
├── useUserStore.ts        // User authentication and profile
├── useOrganisationStore.ts // Organization data
├── useDashboardStore.ts    // Dashboard state and analytics
├── useTemplateStore.ts     // Message templates
├── useActivityStore.ts     // Activity tracking
├── useReportStore.ts       // Report generation
├── useAnalyticsStore.ts    // Analytics data
├── useHelpStore.ts         // Help and documentation
├── useMessageStore.ts      // Messaging and notifications
├── useNotificationStore.ts // System notifications
└── useOnboardingStore.ts   // User onboarding flow
```

### Data Flow

1. **API Requests** → Service Layer → Pinia Store → Components
2. **User Actions** → Components → Store Actions → API Calls
3. **Real-time Updates** → WebSocket → Store → Reactive UI Updates

## Component Overview

### Page Components (Route-based)
- **Authentication**: Login, registration, password reset
- **Dashboard**: Main dashboard with analytics and quick actions
- **Messages**: Compose and view crisis communications
- **Templates**: Manage message templates
- **Analytics**: Reports and insights
- **Settings**: User and organization preferences

### Shared Components
- **Layout**: Header, sidebar, footer components
- **Forms**: Reusable form components with validation
- **Charts**: Data visualization components
- **Modals**: Dialog and overlay components
- **Common**: Utility components (loading, pagination, etc.)

## Development Workflow

### Local Development Setup

```bash
# Frontend development
cd frontend
npm install
npm run dev          # Development server on port 5173
npm run build        # Production build
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

### Code Organization

```
src/
├── assets/           # Static assets (images, fonts)
├── boot/            # Application initialization
├── components/      # Vue components
│   ├── common/     # Shared components
│   └── [feature]/   # Feature-specific components
├── css/             # Global styles
├── layouts/         # Layout components
├── pages/           # Page components (routes)
├── router/          # Router configuration
├── services/        # API service layer
├── stores/          # Pinia stores
└── types/           # TypeScript definitions
```

## Deployment Architecture

### Build Process

1. **Development**: Vite dev server with HMR
2. **Staging**: Production build with source maps
3. **Production**: Optimized build with tree-shaking

### Environment Configuration

- **Development**: Local API server (http://localhost:8000)
- **Staging**: Staging API endpoint
- **Production**: Production API endpoint with HTTPS

### Static Asset Management

- **Images**: Optimized and lazy-loaded
- **Icons**: Quasar icon system and custom SVGs
- **Fonts**: Google Fonts integrated via Quasar

## Testing Strategy

### Unit Testing (Vitest)
- **Components**: Mount and test Vue components
- **Stores**: Test Pinia store actions and state
- **Services**: Test API service functions
- **Utilities**: Test helper functions

### End-to-End Testing (Playwright)
- **User Flows**: Critical user journeys
- **Cross-browser**: Chrome, Firefox, Safari, Edge
- **Mobile**: Responsive design testing
- **Accessibility**: ARIA compliance testing

### Coverage Requirements
- **Target**: 80% code coverage minimum
- **Critical Paths**: 100% coverage for authentication and data flows

## Integration with Backend

### API Communication

```typescript
// API Service Structure
services/
├── api.ts          # Axios configuration and interceptors
├── auth.ts         # Authentication endpoints
├── users.ts        # User management
├── messages.ts     # Message operations
├── templates.ts    # Template CRUD
└── analytics.ts    # Analytics data
```

### Authentication Flow
1. **Login**: Credentials → JWT token → Store in Pinia
2. **API Calls**: Token attached via Axios interceptor
3. **Refresh**: Automatic token refresh on expiry
4. **Logout**: Token removal and state reset

### Real-time Features
- **WebSocket**: Connection for real-time updates
- **Notifications**: Live notification system
- **Activity Feed**: Real-time activity tracking

## Performance Considerations

### Optimization Strategies
1. **Code Splitting**: Route-based code splitting
2. **Lazy Loading**: Components and images loaded on demand
3. **Caching**: API response caching in stores
4. **Virtual Scrolling**: Large data lists optimization
5. **Image Optimization**: WebP format and responsive images

### Bundle Analysis
- **Tools**: Vite bundle analyzer
- **Target**: < 1MB initial load
- **Vendor**: External libraries in separate chunks

## Security Features

### Client-Side Security
- **XSS Protection**: Vue.js built-in protections
- **CSRF**: CSRF tokens for form submissions
- **Content Security**: CSP headers recommended
- **Authentication**: JWT tokens with expiry

### Data Protection
- **Sensitive Data**: Never stored in localStorage
- **API Keys**: Environment variables only
- **Encryption**: HTTPS enforced in production

## Accessibility

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and landmarks
- **Color Contrast**: WCAG AA contrast ratios
- **Focus Management**: Logical focus flow

### Quasar Accessibility Features
- Built-in accessibility components
- Screen reader support
- High contrast mode support