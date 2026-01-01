# Development Guide

**Project:** CCIP (Crisis Communication Intelligence Platform)  
**Architecture:** Multi-part (Backend + Frontend)  
**Development Environment:** Docker Compose (recommended)

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Development Workflow](#development-workflow)
4. [Backend Development](#backend-development)
5. [Frontend Development](#frontend-development)
6. [Testing](#testing)
7. [Code Quality](#code-quality)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Docker** 20.10+ and **Docker Compose** 2.0+
- **Node.js** 18+ and **npm** 9+ (for local development)
- **PHP** 8.2+ and **Composer** 2.0+ (for local development)
- **PostgreSQL** 16+ (if not using Docker)
- **Redis** 7+ (if not using Docker)
- **Git** 2.30+

### Recommended Tools

- **VS Code** with extensions:
  - PHP Intelephense
  - Vue Language Features (Volar)
  - ESLint
  - Prettier
  - Laravel Pint (for PHP formatting)

## Quick Start

### Option 1: Docker Compose (Recommended)

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-org/ccip.git
   cd ccip
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Backend setup:**
   ```bash
   docker-compose exec backend composer install
   docker-compose exec backend php artisan key:generate
   docker-compose exec backend php artisan migrate
   docker-compose exec backend php artisan db:seed
   ```

4. **Access services:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api/v1
   - MinIO Console: http://localhost:9001
   - PostgreSQL: localhost:5433

### Option 2: Local Development

1. **Backend setup:**
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

2. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Update VITE_API_URL=http://localhost:8000/api/v1
   npm run dev
   ```

3. **Start supporting services:**
   ```bash
   # PostgreSQL, Redis, MinIO via Docker
   docker-compose up postgres redis minio -d
   ```

## Development Workflow

### Git Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

### BMAD Method Workflow

All features follow Epic → Story → Implementation:

1. **Check Epic:** Review `docs/epics/epic-XXX-feature-name.md`
2. **Check Story:** Review `docs/stories/US-XXX-story-name.md`
3. **Check Sprint Status:** Review `_bmad-output/implementation-artifacts/sprint-status.yaml`
4. **Implement:** Follow story requirements
5. **Update Status:** Update sprint status after completion

## Backend Development

### Project Structure

```
backend/
├── app/
│   ├── Http/Controllers/    # API Controllers
│   ├── Models/              # Eloquent Models
│   ├── Services/            # Business Logic
│   └── Http/Resources/     # API Resources
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/            # Database seeders
└── routes/
    └── api.php             # API routes
```

### Common Commands

```bash
# Start development server
php artisan serve

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Create migration
php artisan make:migration create_table_name

# Create model
php artisan make:model ModelName

# Create controller
php artisan make:controller ControllerName

# Create service
php artisan make:service ServiceName

# Run tests
php artisan test

# Code formatting (PSR-12)
php artisan pint

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### API Development

**Base Controller Pattern:**
All controllers extend `App\Http\Controllers\Controller` which provides:
- `success($data, $message, $code)` - Success response
- `error($message, $code, $errors)` - Error response
- `paginated($data, $message)` - Paginated response

**Example Controller:**
```php
class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $activities = Activity::paginate(15);
        return $this->paginated($activities, 'Activities retrieved');
    }
}
```

**API Routes:**
All routes are in `routes/api.php` under `/api/v1` prefix.

**Authentication:**
Protected routes use `auth:sanctum` middleware.

### Database Development

**Migrations:**
- Location: `database/migrations/`
- Naming: `YYYY_MM_DD_HHMMSS_description.php`
- Run: `php artisan migrate`

**Models:**
- Use Eloquent relationships
- Soft deletes where appropriate
- JSON casting for flexible fields

**Seeders:**
- Location: `database/seeders/`
- Run: `php artisan db:seed`

### Service Layer

Business logic goes in `app/Services/`:
- `AIService.php` - AI integration with fallback
- `NotificationService.php` - Notification handling
- `ReportService.php` - Report generation

## Frontend Development

### Project Structure

```
frontend/
├── src/
│   ├── components/    # Vue components
│   ├── pages/         # Route pages
│   ├── stores/        # Pinia stores
│   ├── services/      # API services
│   ├── router/        # Vue Router
│   └── types/         # TypeScript types
```

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Linting
npm run lint              # Auto-fix
npm run lint:check        # Check only

# Formatting
npm run format            # Format
npm run format:check      # Check only

# Testing
npm run test              # Unit tests
npm run test:ui           # Vitest UI
npm run test:coverage     # Coverage
npm run test:e2e          # E2E tests
```

### Component Development

**Component Pattern:**
```vue
<template>
  <q-card>
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  title?: string;
}

const props = defineProps<Props>();
</script>
```

**Store Usage:**
```typescript
import { useActivityStore } from '@/stores/useActivityStore';

const activityStore = useActivityStore();
await activityStore.fetchActivities();
```

### API Integration

**API Client:**
Located in `src/services/api.ts`:
- Axios instance with interceptors
- Automatic token injection
- Error handling
- Base URL configuration

**Usage:**
```typescript
import { api, API_ENDPOINTS } from '@/services/api';

const response = await api.get(API_ENDPOINTS.ACTIVITIES.LIST);
```

### Routing

**Route Definition:**
```typescript
// src/router/routes.ts
{
  path: '/activities',
  name: 'activities',
  component: () => import('@/pages/ActivityList.vue'),
  meta: { requiresAuth: true }
}
```

**Route Guards:**
- `authGuard` - Requires authentication
- `roleGuard` - Requires specific role
- `guestGuard` - Redirects authenticated users

## Testing

### Backend Testing

**PHPUnit:**
```bash
php artisan test
php artisan test --filter ActivityTest
```

**Test Structure:**
- `tests/Feature/` - Feature tests
- `tests/Unit/` - Unit tests

### Frontend Testing

**Unit Tests (Vitest):**
```bash
npm run test
npm run test:ui
npm run test:coverage
```

**E2E Tests (Playwright):**
```bash
# Local development
npm run test:e2e

# Production testing
npm run test:e2e:prod

# Debug mode
npm run test:e2e:debug
```

**Test Files:**
- Unit: `tests/unit/`
- E2E: `tests/e2e/`

## Code Quality

### Backend

**PHP Code Style:**
- PSR-12 standard
- Laravel Pint for formatting
- Run: `php artisan pint`

**Linting:**
- PHPStan (if configured)
- Laravel Pint

### Frontend

**TypeScript:**
- Strict mode enabled
- Type all props, emits, API responses
- No `any` types

**ESLint:**
- Vue 3 recommended rules
- Run: `npm run lint`

**Prettier:**
- Code formatting
- Run: `npm run format`

## Troubleshooting

### Backend Issues

**Migration Errors:**
```bash
# Reset database
php artisan migrate:fresh
php artisan db:seed
```

**Cache Issues:**
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

**Permission Errors:**
```bash
chmod -R 775 storage bootstrap/cache
```

### Frontend Issues

**Build Errors:**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

**Type Errors:**
```bash
# Check TypeScript
npm run typecheck
```

**API Connection:**
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Check CORS configuration

### Docker Issues

**Container Not Starting:**
```bash
docker-compose down
docker-compose up -d
docker-compose logs backend
```

**Port Conflicts:**
- Update ports in `docker-compose.yml`
- Check for running services on ports

**Volume Issues:**
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d
```

## Environment Variables

### Backend (.env)

```env
APP_ENV=local
APP_DEBUG=true
APP_KEY=

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=ccip
DB_USERNAME=ccip_user
DB_PASSWORD=ccip_password

REDIS_HOST=redis
REDIS_PORT=6379

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_ENDPOINT=http://minio:9000
AWS_BUCKET=ccip-uploads
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## Development Tips

1. **Use Docker Compose** for consistent environment
2. **Check Epic/Story** before implementing features
3. **Follow naming conventions** (PSR-12, Vue style guide)
4. **Write tests** for critical functionality
5. **Use TypeScript** strictly in frontend
6. **Lint before committing** (`npm run lint`, `php artisan pint`)
7. **Check API contracts** in `docs/api-contracts-backend.md`
8. **Review data models** in `docs/data-models-backend.md`

## Next Steps

- [Architecture Overview](architecture/overview.md)
- [API Contracts](api-contracts-backend.md)
- [Data Models](data-models-backend.md)
- [Component Inventory](component-inventory-frontend.md)

