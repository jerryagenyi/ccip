# CCIP Backend Architecture Documentation

## Executive Summary

The CCIP backend is a Laravel 10 RESTful API serving as the core engine for the Crisis Communication Intelligence Platform. It provides secure, scalable endpoints for user management, crisis communication handling, analytics, and real-time notifications.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|------------|---------|----------------|
| **Framework** | Laravel | 10.10 | Mature PHP framework with robust ecosystem |
| **Language** | PHP | 8.2+ | Modern PHP features and performance |
| **Database** | PostgreSQL | 15+ | ACID compliance, JSON support, reliability |
| **Authentication** | Laravel Sanctum | 3.2 | Simple API authentication without sessions |
| **Queue** | Redis | 6+ | Fast job processing and caching |
| **File Storage** | Local + AWS S3 | - | Flexible storage with cloud backup |
| **Permissions** | Spatie Laravel Permission | 5.10 | Role-based access control (RBAC) |

## Architecture Pattern

### Layered Architecture with Clean Code Principles

```
┌─────────────────────────────────────┐
│          API Routes                 │
├─────────────────────────────────────┤
│        Controllers                  │
├─────────────────────────────────────┤
│      Request Validation             │
├─────────────────────────────────────┤
│         Services                    │
├─────────────────────────────────────┤
│       Repositories                  │
├─────────────────────────────────────┤
│          Models                     │
└─────────────────────────────────────┘
```

### Design Patterns Applied
1. **Repository Pattern**: Data access abstraction
2. **Service Pattern**: Business logic encapsulation
3. **Factory Pattern**: Model and response creation
4. **Observer Pattern**: Event-driven architecture
5. **Strategy Pattern**: Payment/export implementations

## Data Architecture

### Database Schema Design

```sql
-- Core Tables
users                    # User accounts and profiles
organisations            # Organization management
user_organisations      # Many-to-many user-organization relationships
roles                    # System roles (admin, user, moderator)
permissions             # Granular permissions
role_has_permissions     # Role-permission mapping

-- Crisis Communication
crisis_incidents         # Crisis event records
messages                # Crisis messages and communications
message_templates       # Reusable message templates
message_attachments      # File attachments
message_deliveries      # Delivery tracking

-- Analytics & Tracking
activities              # User activity logs
analytics               # Aggregated analytics data
reports                 # Generated reports
notifications            # User notifications

-- System
audit_logs              # System audit trail
settings                # System configuration
```

### Database Relationships
- **Users ↔ Organisations**: Many-to-many
- **Users → Messages**: One-to-many (author)
- **Organisations → Messages**: One-to-many (owner)
- **Crisis Incidents → Messages**: One-to-many
- **Templates ↔ Users**: One-to-many (creator)

## API Design

### RESTful Endpoints Structure

```
/api/v1/
├── auth/
│   ├── login
│   ├── logout
│   ├── refresh
│   └── register
├── users/
│   ├── profile
│   ├── {id}
│   └── organisations
├── organisations/
│   ├── {id}
│   ├── members
│   └── settings
├── messages/
│   ├── {id}
│   ├── templates
│   ├── drafts
│   └── delivery
├── crisis/
│   ├── incidents
│   └── response
├── analytics/
│   ├── dashboard
│   ├── reports
│   └── exports
└── notifications/
    ├── {id}
    └── preferences
```

### API Features
- **Versioning**: `/api/v1/` with backward compatibility
- **Rate Limiting**: Configurable per endpoint
- **Pagination**: Cursor-based for large datasets
- **Filtering**: Query parameter filtering
- **Sorting**: Multi-column sorting support
- **Field Selection**: Partial response with `?fields=`

## Component Overview

### Controllers
- **AuthController**: Authentication and authorization
- **UserController**: User management operations
- **MessageController**: Message CRUD and delivery
- **TemplateController**: Template management
- **AnalyticsController**: Data aggregation and reports
- **NotificationController**: Real-time notifications

### Services
- **AuthService**: Authentication logic and token management
- **MessageService**: Message processing and delivery
- **NotificationService**: Multi-channel notifications
- **AnalyticsService**: Data aggregation and insights
- **ExportService**: Report generation and file export
- **FileService**: File upload and storage management

### Repositories
- **UserRepository**: User data access with caching
- **MessageRepository**: Message queries with filters
- **AnalyticsRepository**: Complex analytics queries
- **AuditRepository**: Audit trail management

## Development Workflow

### Local Development

```bash
# Backend development
cd backend
composer install              # Install PHP dependencies
cp .env.example .env          # Environment setup
php artisan key:generate      # Generate application key
php artisan migrate           # Run database migrations
php artisan db:seed           # Seed database with test data
php artisan serve             # Start development server on port 8000
```

### Code Organization

```
app/
├── Http/
│   ├── Controllers/          # API controllers
│   ├── Middleware/           # Custom middleware
│   ├── Requests/             # Form request validation
│   └── Resources/            # API resource transformers
├── Models/                   # Eloquent models
├── Services/                 # Business logic services
├── Repositories/             # Data access layer
├── Events/                   # System events
├── Listeners/                # Event handlers
├── Jobs/                     # Queue jobs
├── Observers/                # Model observers
└── Providers/                # Service providers
```

## Deployment Architecture

### Production Infrastructure

```
┌─────────────────┐    ┌─────────────────┐
│   Load Balancer  │────│   Web Server     │
│   (Nginx)        │    │   (Nginx/PHP-FPM)│
└─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │  Laravel App     │
                       │  (PHP 8.2)       │
                       └─────────────────┘
                                │
                    ┌───────────┬───────────┐
                    │           │           │
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ PostgreSQL  │ │    Redis    │ │    S3       │
            │ (Database)  │ │  (Cache/    │ │ (Files/     │
            │             │ │   Queue)     │ │  Assets)    │
            └─────────────┘ └─────────────┘ └─────────────┘
```

### Environment Configuration
- **Development**: Local database, Redis cache
- **Staging**: Separate database, test Redis cluster
- **Production**: High-availability PostgreSQL, Redis cluster

### CI/CD Pipeline
1. **Code Push** → GitHub Actions trigger
2. **Tests Run** → PHPUnit + Feature tests
3. **Build Docker** → Multi-stage Docker build
4. **Deploy** → Blue-green deployment to production
5. **Health Check** → Smoke tests on deployment

## Testing Strategy

### Testing Pyramid
- **Unit Tests**: 70% - Individual class methods
- **Feature Tests**: 20% - API endpoint integration
- **Browser Tests**: 10% - Critical user flows

### Test Types
```bash
# Run all tests
php artisan test

# Unit tests only
php artisan test --testsuite=Unit

# Feature tests only
php artisan test --testsuite=Feature

# Coverage report
php artisan test --coverage
```

### Testing Best Practices
- **Database**: Use SQLite in-memory for speed
- **Factories**: Model factories for test data
- **Refresh Database**: Clean state between tests
- **Seeders**: Consistent test data setup

## Performance Optimization

### Database Optimization
1. **Indexes**: Strategic indexing on foreign keys and search columns
2. **Query Optimization**: Eloquent eager loading to prevent N+1
3. **Connection Pooling**: PgBouncer for PostgreSQL
4. **Read Replicas**: Separate read replicas for analytics

### Caching Strategy
```php
// Cache Levels
- L1: In-memory (per request)
- L2: Redis (application-level)
- L3: CDN (static assets)

// Cache Keys Pattern
cache('user:profile:{id}', 3600);        // User profiles
cache('message:list:org:{id}', 300);      // Message lists
cache('analytics:daily:{date}', 86400);   // Daily analytics
```

### Queue System
- **Jobs**: Async processing for heavy operations
- **Failed Jobs**: Automatic retry with exponential backoff
- **Monitoring**: Queue health dashboards

## Security Features

### Authentication & Authorization
```php
// Sanctum API Authentication
- Token-based authentication
- Token scopes for permissions
- Token expiration (configurable)
- Token revocation on logout
```

### RBAC Implementation
```php
// Role-Based Access Control
$admin = Role::findByName('admin');
$admin->givePermissionTo('manage-users');
$admin->givePermissionTo('view-analytics');

// Middleware Protection
Route::middleware('permission:manage-users')->group(...)
```

### Security Headers
```php
// HTTP Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: "1; mode=block"
- Strict-Transport-Security: max-age=31536000
```

### Data Protection
- **Encryption**: Sensitive data encrypted at rest
- **API Rate Limiting**: Prevent abuse and DDoS
- **Input Validation**: Comprehensive request validation
- **SQL Injection**: Protected by Eloquent ORM
- **XSS Protection**: Auto-escaping in Blade templates

## Monitoring & Logging

### Application Monitoring
- **Metrics**: Response times, error rates, throughput
- **Logging**: Structured logs with context
- **Health Checks**: `/health` endpoint for load balancer
- **Error Tracking**: Sentry for production error monitoring

### Audit Trail
```php
// Audit Log Events
- User login/logout
- Permission changes
- Data modifications
- API access (sensitive endpoints)
```

## Scalability Considerations

### Horizontal Scaling
- **Stateless**: Session-free API design
- **Load Balancing**: Multiple app servers behind LB
- **Database**: Read replicas for scaling reads
- **Queue**: Redis cluster for job processing

### Microservices Preparation
- **Service Boundaries**: Clear domain separation
- **API Contracts**: Stable versioned APIs
- **Event-Driven**: Decoupled via events and queues
- **Circuit Breakers**: Fault tolerance patterns