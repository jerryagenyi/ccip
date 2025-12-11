# CCIP Backend API

Laravel-based RESTful API for CCIP platform.

## Current Implementation Status

### ✅ Completed (40%)

1. **Project Structure**
   - Laravel 10+ setup with composer.json
   - Directory structure
   - Base Controller with helper methods
   - API routes structure

2. **Database**
   - All migrations created (users, organisations, activities, messages, notifications, reports, etc.)
   - All Eloquent models with relationships
   - Soft deletes where appropriate
   - JSON casting for flexible fields

3. **Authentication**
   - Login/Register endpoints
   - Password reset flow
   - Email verification
   - Laravel Sanctum integration

4. **Activities**
   - Full CRUD operations
   - Status management (submit, approve, reject, complete)
   - File upload functionality
   - Filtering and pagination

### 🚧 Remaining Work (60%)

1. **Controllers** - Need to implement:
   - UserController
   - OrganisationController
   - MessageController
   - ReportController
   - AnalyticsController
   - DashboardController
   - AIController
   - NotificationController
   - HelpController
   - UploadController

2. **Services** - Need to create:
   - AIService (OpenAI integration)
   - NotificationService
   - ReportService (PDF/Excel generation)
   - FileStorageService
   - AnalyticsService

3. **Middleware & Configuration**
   - CORS setup
   - Rate limiting
   - Role-based access control

4. **Database Seeders**
   - Initial data population

5. **Testing & Documentation**
   - Unit tests
   - Integration tests
   - API documentation (Swagger)

## Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
composer install
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Run migrations:
```bash
php artisan migrate
```

5. Seed database (when seeders are ready):
```bash
php artisan db:seed
```

## Development

Run development server:
```bash
php artisan serve
```

API will be available at: http://localhost:8000/api/v1

## Docker

The backend is configured to run in Docker. Use:
```bash
docker-compose up backend
```

## API Endpoints

All endpoints are under `/api/v1` prefix.

### Authentication
- `POST /auth/login` ✅
- `POST /auth/register` ✅
- `POST /auth/logout` ✅
- `POST /auth/forgot-password` ✅
- `POST /auth/reset-password` ✅

### Activities
- `GET /activities` ✅
- `POST /activities` ✅
- `GET /activities/{id}` ✅
- `PUT /activities/{id}` ✅
- `DELETE /activities/{id}` ✅
- `POST /activities/{id}/submit` ✅
- `POST /activities/{id}/approve` ✅
- `POST /activities/{id}/reject` ✅
- `POST /activities/{id}/complete` ✅
- `POST /activities/{id}/duplicate` ✅
- `POST /activities/{id}/upload-files` ✅
- `DELETE /activities/{id}/files/{fileId}` ✅

See `BACKEND_IMPLEMENTATION_STATUS.md` for complete endpoint list.

## Testing

Run tests:
```bash
php artisan test
```

## API Documentation

API documentation will be available at `/api/documentation` (Swagger/OpenAPI) - To be implemented.

## Architecture Notes

- **Global Platform**: No country-specific code. Location stored as JSON.
- **Administrative Levels**: Generic (national, regional, district, local, community)
- **File Storage**: S3-compatible (MinIO in Docker)
- **Caching**: Redis
- **Queue**: Redis
- **Authentication**: Laravel Sanctum (token-based)
