# Source Tree Analysis

**Project Type:** Multi-part (Backend + Frontend)  
**Repository Structure:** Monorepo

## Project Root Structure

```
ccip/
├── backend/                    # Laravel 11 API Backend
├── frontend/                   # Vue 3 + Quasar Frontend
├── firebase-prototype/         # Next.js Prototype (reference/docs)
├── docs/                      # Documentation
├── _bmad-output/              # BMAD workflow artifacts
├── _bmad/                     # BMAD framework files
├── product/                    # Product documentation
├── data-templates/             # Test data templates
├── scripts/                    # Utility scripts
├── docker-compose.yml          # Development environment
├── docker-compose.production.yml
├── README.md
└── CLAUDE.md                   # AI assistant instructions
```

## Backend Structure

```
backend/
├── app/
│   ├── Console/
│   │   └── Kernel.php          # Console kernel
│   ├── Exceptions/
│   │   └── Handler.php         # Exception handler
│   ├── Exports/
│   │   └── ReportExport.php    # Excel export class
│   ├── Http/
│   │   ├── Controllers/         # API Controllers (17 files)
│   │   │   ├── ActivityController.php
│   │   │   ├── AIController.php
│   │   │   ├── AnalyticsController.php
│   │   │   ├── Auth/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── EmailVerificationController.php
│   │   │   │   └── PasswordResetController.php
│   │   │   ├── ContactController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── HelpController.php
│   │   │   ├── MessageController.php
│   │   │   ├── NotificationController.php
│   │   │   ├── OrganisationController.php
│   │   │   ├── ReportController.php
│   │   │   ├── UploadController.php
│   │   │   └── UserController.php
│   │   ├── Middleware/         # Custom middleware (10 files)
│   │   │   ├── Authenticate.php
│   │   │   ├── CorsMiddleware.php
│   │   │   └── ...
│   │   ├── Requests/            # Form Request validation (4 files)
│   │   │   └── Auth/
│   │   │       ├── LoginRequest.php
│   │   │       ├── RegisterRequest.php
│   │   │       └── ...
│   │   └── Resources/          # API Resources (3 files)
│   │       ├── ActivityResource.php
│   │       ├── UserResource.php
│   │       └── ActivityAttachmentResource.php
│   ├── Models/                 # Eloquent Models (13 files)
│   │   ├── Activity.php
│   │   ├── ActivityAttachment.php
│   │   ├── ActivityStatusHistory.php
│   │   ├── EngagementMetric.php
│   │   ├── HelpArticle.php
│   │   ├── Message.php
│   │   ├── Notification.php
│   │   ├── NotificationPreference.php
│   │   ├── Organisation.php
│   │   ├── Report.php
│   │   ├── ReportTemplate.php
│   │   ├── Role.php
│   │   └── User.php
│   ├── Providers/              # Service Providers (4 files)
│   │   ├── AppServiceProvider.php
│   │   ├── AuthServiceProvider.php
│   │   ├── EventServiceProvider.php
│   │   └── RouteServiceProvider.php
│   └── Services/               # Business Logic Services (3 files)
│       ├── AIService.php       # OpenAI integration with fallback
│       ├── NotificationService.php
│       └── ReportService.php
├── bootstrap/
│   └── app.php                 # Application bootstrap
├── config/                      # Configuration files (11 files)
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── cors.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── sanctum.php
│   ├── services.php
│   ├── session.php
│   └── view.php
├── database/
│   ├── factories/              # Model factories (3 files)
│   ├── migrations/             # Database migrations (28 files)
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_organisations_table.php
│   │   ├── 2024_01_01_000003_create_activities_table.php
│   │   └── ... (25 more migrations)
│   └── seeders/                # Database seeders (5 files)
├── public/
│   └── index.php               # Entry point
├── resources/
│   └── views/                  # Blade templates (3 files)
├── routes/
│   ├── api.php                 # API routes (62+ endpoints)
│   ├── console.php             # Console routes
│   └── web.php                 # Web routes
├── storage/                     # Storage (logs, cache)
├── tests/                       # PHPUnit tests (4 files)
├── artisan                      # Laravel CLI
├── composer.json                # PHP dependencies
├── Dockerfile                   # Development Dockerfile
├── Dockerfile.prod              # Production Dockerfile
├── nginx.conf                   # Nginx configuration
└── README.md
```

**Entry Points:**
- `public/index.php` - HTTP entry point
- `artisan` - CLI entry point
- `routes/api.php` - API route definitions

**Critical Directories:**
- `app/Http/Controllers/` - All API endpoints
- `app/Models/` - Data models with relationships
- `app/Services/` - Business logic layer
- `database/migrations/` - Database schema
- `routes/api.php` - API routing

## Frontend Structure

```
frontend/
├── src/
│   ├── components/             # Vue Components (15+ files)
│   │   ├── activities/         # Activity-specific components (3)
│   │   │   ├── LocationSelector.vue
│   │   │   ├── SemioticAnalysis.vue
│   │   │   └── StateLgaSelector.vue
│   │   ├── layout/             # Layout components (2)
│   │   │   ├── NotificationCenter.vue
│   │   │   └── UserMenu.vue
│   │   ├── reports/            # Report components (1)
│   │   │   └── AIReportGenerator.vue
│   │   ├── ui/                 # Base UI components (12)
│   │   │   ├── BaseBadge.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseCheckbox.vue
│   │   │   ├── BaseDialog.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── DataTable.vue
│   │   │   ├── FileUpload.vue
│   │   │   ├── FormWizard.vue
│   │   │   ├── PDFExportButton.vue
│   │   │   └── ThemeToggle.vue
│   │   └── AppFooter.vue
│   ├── pages/                  # Route pages (20+ files)
│   │   ├── ActivityCreate.vue
│   │   ├── ActivityDetail.vue
│   │   ├── ActivityList.vue
│   │   ├── ActivityTimeline.vue
│   │   ├── Analytics.vue
│   │   ├── AuthForgotPassword.vue
│   │   ├── AuthLogin.vue
│   │   ├── AuthRegister.vue
│   │   ├── AuthResetPassword.vue
│   │   ├── Dashboard.vue
│   │   ├── ErrorNotFound.vue
│   │   ├── HelpArticle.vue
│   │   ├── HelpSearch.vue
│   │   ├── IndexPage.vue
│   │   ├── MessageCompose.vue
│   │   ├── MessageDetail.vue
│   │   ├── MessageInbox.vue
│   │   ├── OrganisationCreate.vue
│   │   ├── OrganisationDetail.vue
│   │   ├── OrganisationList.vue
│   │   ├── ReportsList.vue
│   │   ├── Settings.vue
│   │   └── UserProfile.vue
│   ├── layouts/                # Layout components (3)
│   │   ├── AuthLayout.vue
│   │   ├── LandingLayout.vue
│   │   └── MainLayout.vue
│   ├── stores/                 # Pinia stores (13 files)
│   │   ├── useActivityStore.ts
│   │   ├── useAnalyticsStore.ts
│   │   ├── useAuthStore.ts
│   │   ├── useDashboardStore.ts
│   │   ├── useHelpStore.ts
│   │   ├── useMessageStore.ts
│   │   ├── useNotificationStore.ts
│   │   ├── useOnboardingStore.ts
│   │   ├── useOrganisationStore.ts
│   │   ├── useReportStore.ts
│   │   ├── useTemplateStore.ts
│   │   ├── useThemeStore.ts
│   │   └── useUserStore.ts
│   ├── services/               # API services (2 files)
│   │   ├── api.ts              # Axios instance with interceptors
│   │   └── pdfExport.ts        # PDF generation
│   ├── router/                 # Vue Router (3 files)
│   │   ├── index.ts            # Router instance
│   │   ├── routes.ts           # Route definitions
│   │   └── guards.ts           # Route guards
│   ├── composables/            # Vue composables (1 file)
│   │   └── usePDFExport.ts
│   ├── types/                  # TypeScript types (2 files)
│   │   ├── api.ts              # API type definitions
│   │   └── index.ts            # Shared types
│   ├── data/                   # Static data (1 file)
│   │   └── reportTemplates.ts
│   ├── boot/                   # Quasar boot files (2 files)
│   │   ├── axios.ts            # Axios setup
│   │   └── router.ts           # Router setup
│   ├── css/                    # Styles (1 file)
│   │   └── app.scss
│   ├── App.vue                 # Root component
│   ├── main.ts                 # Application entry point
│   ├── app.scss                # Global styles
│   └── quasar-variables.sass   # Quasar theme variables
├── tests/                       # Tests (19 files)
│   ├── e2e/                    # Playwright E2E tests (18 files)
│   │   └── auth-production.spec.ts
│   └── unit/                   # Vitest unit tests
├── dist/                        # Build output
├── index.html                   # HTML entry point
├── package.json                 # NPM dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite configuration
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
├── quasar.config.cjs             # Quasar configuration
├── Dockerfile                    # Development Dockerfile
├── Dockerfile.prod               # Production Dockerfile
├── nginx.conf                    # Nginx configuration
└── README.md
```

**Entry Points:**
- `src/main.ts` - Application bootstrap
- `index.html` - HTML entry point
- `src/router/index.ts` - Router initialization

**Critical Directories:**
- `src/pages/` - Route components
- `src/components/` - Reusable components
- `src/stores/` - State management
- `src/services/` - API client
- `src/router/` - Routing configuration

## Firebase Prototype Structure

```
firebase-prototype/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication routes
│   │   ├── (public)/           # Public routes
│   │   └── dashboard/          # Dashboard routes
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # ShadCN UI components
│   ├── contexts/               # React contexts
│   ├── firebase/                # Firebase integration
│   ├── hooks/                   # React hooks
│   └── lib/                     # Utilities
├── docs/                        # Prototype documentation
│   ├── UX_DESIGN_SPECIFICATION.md
│   ├── MIGRATION_GUIDE.md
│   ├── backend.json
│   └── schema.sql
├── package.json
└── README.md
```

**Purpose:** Reference documentation and design specifications for production implementation

## Integration Points

### Frontend → Backend
- **API Base URL:** `http://localhost:8000/api/v1` (dev) or `https://ccip-api.jerryagenyi.xyz/api/v1` (prod)
- **Authentication:** Bearer token via `Authorization` header
- **HTTP Client:** Axios instance in `frontend/src/services/api.ts`
- **Error Handling:** Centralized in Axios interceptors

### Backend → Database
- **Connection:** PostgreSQL via Laravel Eloquent
- **ORM:** Eloquent models in `backend/app/Models/`
- **Migrations:** `backend/database/migrations/`

### Backend → Storage
- **S3-Compatible:** MinIO (dev) or AWS S3 (prod)
- **Configuration:** `backend/config/filesystems.php`
- **Service:** Laravel Storage facade

### Backend → Cache
- **Redis:** Session and application cache
- **Configuration:** `backend/config/cache.php`, `backend/config/session.php`

## File Organization Patterns

### Backend
- **Controllers:** One per resource (RESTful)
- **Models:** One per database table
- **Services:** Business logic separation
- **Resources:** API response transformation
- **Requests:** Form validation classes

### Frontend
- **Pages:** One per route
- **Components:** Organized by feature (`activities/`, `ui/`, `layout/`)
- **Stores:** One per domain (`useActivityStore`, `useAuthStore`)
- **Services:** API client and external services
- **Types:** Centralized TypeScript definitions

## Critical Files

### Backend
- `routes/api.php` - All API endpoints (62+)
- `app/Http/Controllers/Controller.php` - Base controller with response methods
- `app/Services/AIService.php` - AI integration with fallback
- `app/Models/Activity.php` - Core activity model
- `database/migrations/` - Complete database schema

### Frontend
- `src/main.ts` - Application entry
- `src/router/routes.ts` - All routes
- `src/services/api.ts` - API client
- `src/stores/useAuthStore.ts` - Authentication state
- `src/stores/useActivityStore.ts` - Activity management

## Build & Configuration Files

### Backend
- `composer.json` - PHP dependencies
- `Dockerfile` - Container configuration
- `nginx.conf` - Web server config

### Frontend
- `package.json` - NPM dependencies
- `vite.config.ts` - Build configuration
- `quasar.config.cjs` - Quasar framework config
- `tsconfig.json` - TypeScript configuration
- `playwright.config.ts` - E2E test configuration

## Test Files

### Backend
- `tests/` - PHPUnit tests
- `phpunit.xml.dist` - PHPUnit configuration

### Frontend
- `tests/e2e/` - Playwright E2E tests
- `tests/unit/` - Vitest unit tests
- `vitest.config.ts` - Unit test configuration

