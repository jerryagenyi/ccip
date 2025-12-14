# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Docker (Recommended)
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up backend    # Laravel API on port 8000
docker-compose up frontend   # Vue 3 + Quasar on port 5173

# Stop services
docker-compose down
```

### Backend (Laravel 10)
```bash
cd backend

# Setup
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# Development
php artisan serve

# Testing
php artisan test
```

### Frontend (Vue 3 + Quasar)
```bash
cd frontend

# Setup
npm install

# Development
npm run dev

# Build for production
npm run build

# Testing
npm run test              # Unit tests with Vitest
npm run test:ui           # Vitest UI
npm run test:coverage     # Coverage report
npm run test:e2e          # E2E tests with Playwright
```

## Architecture Overview

### System Structure
- **Platform**: Crisis Communication Intelligence Platform (CCIP) for public health crisis management
- **Target**: Low-bandwidth environments, African health contexts
- **Stack**: Laravel 10 API + Vue 3 + Quasar PWA + PostgreSQL + MinIO + Redis

### Key Architectural Concepts

1. **SpecKit-Driven Development**: All features follow Epic → Spec → Plan → Tasks → Implementation workflow
   - Epic specs in `.specify/specs/XXX-feature-name/`
   - Always check relevant specs before implementation

2. **Hierarchical Organization System**:
   - Multi-level role-based access (Super Admin → Admin → Sub-admin → User)
   - Organizations can be linked and transferred
   - Users can have different roles across organizations

3. **Global Platform Design**:
   - No country-specific code
   - Location stored as JSON
   - Generic administrative levels (national, regional, district, local, community)

### Backend Architecture (Laravel 10)
- **Authentication**: Laravel Sanctum (token-based)
- **Database**: PostgreSQL with soft deletes
- **File Storage**: S3-compatible (MinIO)
- **Permissions**: Spatie Laravel Permission package
- **API Versioning**: All endpoints under `/api/v1`

Key directories:
- `app/Http/Controllers/API/` - API controllers
- `app/Models/` - Eloquent models with relationships
- `database/migrations/` - Database schema
- `app/Services/` - Business logic services

### Frontend Architecture (Vue 3 + Quasar)
- **Framework**: Vue 3 Composition API + Quasar for PWA capabilities
- **State Management**: Pinia stores
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Testing**: Vitest + Playwright

Key directories:
- `src/pages/` - Route components
- `src/components/` - Reusable components
- `src/stores/` - Pinia stores
- `src/composables/` - Vue composables

### Database Schema
Core entities:
- **Users** with roles and organization assignments
- **Organizations** with hierarchical structure
- **Activities** with workflow states (submit → approve/reject → complete)
- **Messages** for internal communication
- **Reports** for analytics and export
- **Files** with S3 storage integration

### Key Constraints
- **No mapping/GIS features** in MVP
- **Low-bandwidth optimization** required
- **Offline functionality** through PWA
- **Role-based security** strictly enforced

## Important Files
- Epic specifications: `.specify/specs/XXX-feature-name/spec.md`
- Implementation plan: `IMPLEMENTATION_PLAN.md`
- Backend status: `backend/README.md`
- API endpoints: `docs/technical/api/CCIP_API_ENDPOINT_SPECIFICATION.md`

## Testing Strategy
- Backend: PHPUnit with feature tests
- Frontend: Vitest for unit tests, Playwright for E2E
- API testing through Postman collections (in docs)