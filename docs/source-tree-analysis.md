# CCIP Source Tree Analysis

## Project Structure

CCIP is a **multi-part** project consisting of:
- Frontend: Vue 3 + Quasar web application
- Backend: Laravel RESTful API

```
ccip/
├── frontend/                 # Vue 3 + Quasar Frontend Application
│   ├── src/
│   │   ├── boot/           # Application bootstrapping
│   │   │   ├── axios.ts   # HTTP client configuration
│   │   │   └── router.ts  # Router initialization
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── router/         # Router configuration and guards
│   │   ├── services/       # API service layer
│   │   ├── stores/         # Pinia state management
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.vue         # Root Vue component
│   │   └── main.ts         # Application entry point
│   ├── tests/              # Test files (unit/integration)
│   ├── package.json        # Dependencies and scripts
│   ├── vite.config.ts      # Vite build configuration
│   └── tsconfig.json       # TypeScript configuration
│
├── backend/                 # Laravel RESTful API Backend
│   ├── app/                # Application logic
│   │   ├── Http/          # Controllers and middleware
│   │   ├── Models/        # Eloquent models
│   │   ├── Services/      # Business logic services
│   │   └── Repositories/  # Data access layer
│   ├── config/            # Application configuration
│   │   ├── database.php   # Database connections
│   │   ├── cors.php       # CORS configuration
│   │   └── services.php   # External services
│   ├── database/          # Database schemas and migrations
│   │   ├── migrations/    # Migration files
│   │   ├── seeders/       # Database seeders
│   │   └── factories/     # Model factories
│   ├── routes/            # API route definitions
│   │   └── api.php        # API routes
│   ├── storage/           # Application storage
│   ├── tests/             # Test suites
│   ├── composer.json      # PHP dependencies
│   └── .env               # Environment configuration
│
├── docs/                   # Project documentation
│   ├── technical/         # Technical documentation
│   ├── development/       # Development guides
│   ├── testing/          # Testing documentation
│   └── planning/         # Project planning documents
│
├── .specify/              # Specification management
│   ├── specs/            # Feature specifications
│   └── templates/        # Document templates
│
├── scripts/              # Utility scripts
└── product/              # Product documentation
```

## Critical Directories Summary

### Frontend Critical Paths
- **src/boot/**: Application initialization (axios, router)
- **src/stores/**: Pinia state management stores
- **src/services/**: API integration layer
- **src/components/**: Reusable UI components
- **src/types/**: TypeScript type definitions

### Backend Critical Paths
- **app/Http/**: API controllers and middleware
- **app/Models/**: Eloquent ORM models
- **database/migrations/**: Database schema definitions
- **routes/api.php**: REST API endpoint definitions
- **config/**: Application configuration

## Integration Points

### Frontend → Backend Communication
- **HTTP Client**: Axios configured in `frontend/src/boot/axios.ts`
- **API Base URL**: Configured via environment variables
- **Authentication**: Laravel Sanctum tokens
- **State Management**: Pinia stores handle API responses

### Key Integration Files
- Frontend: `src/services/api.ts` → Backend API endpoints
- Backend: `routes/api.php` ← Frontend requests
- Authentication: Frontend stores ↔ Backend Sanctum tokens

## Technology Stack Integration

### Database Layer
- **Primary**: PostgreSQL (configurable)
- **ORM**: Eloquent (Laravel)
- **Migrations**: Version controlled in `backend/database/migrations/`
- **Factories**: Test data generation in `backend/database/factories/`

### Cache & Session
- **Cache**: Redis for application caching
- **Session**: Redis for session storage
- **Queue**: Redis for background job processing

### File Storage
- **Local**: `backend/storage/`
- **Cloud**: AWS S3 integration for file uploads
- **Types**: User uploads, generated documents, exports

## Development Workflow

### Frontend Development
```bash
# Install dependencies
npm install

# Development server
npm run dev  # Runs on port 5173

# Run tests
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage report
```

### Backend Development
```bash
# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start development server
php artisan serve  # Runs on port 8000
```

## Testing Infrastructure

### Frontend Testing
- **Unit Tests**: Vitest with Vue Test Utils
- **E2E Tests**: Playwright
- **Coverage**: Vitest coverage reporter

### Backend Testing
- **Unit Tests**: PHPUnit
- **Feature Tests**: Laravel's testing suite
- **Database Testing**: SQLite in-memory for tests

## Architecture Patterns

### Frontend: Component-Based Architecture
- **Components**: Reusable Vue components with TypeScript
- **State**: Centralized in Pinia stores
- **Routing**: Vue Router with route guards
- **API**: Service layer with Axios interceptors

### Backend: Layered Architecture
- **Controllers**: Handle HTTP requests
- **Services**: Business logic implementation
- **Repositories**: Data access abstraction
- **Models**: Eloquent ORM with relationships

## Security Features

### Authentication & Authorization
- **Frontend**: JWT tokens stored in Pinia
- **Backend**: Laravel Sanctum for API authentication
- **Permissions**: Spatie Laravel Permission for RBAC
- **CORS**: Configured for API access

### Data Security
- **Environment**: All sensitive data in .env files
- **Validation**: Laravel's request validation
- **Rate Limiting**: API rate limiting configured
- **SQL Injection**: Prevented by Eloquent ORM