# Backend Architecture

## Executive Summary

The CCIP backend is a Laravel 11 RESTful API serving as the core engine for the Crisis Communication Intelligence Platform. It provides secure, scalable endpoints for user management, crisis communication handling, analytics, and real-time notifications.

## Technology Stack

| Category | Technology | Version | Justification |
|----------|------------|---------|----------------|
| **Framework** | Laravel | 11.x | Modern PHP framework with robust ecosystem |
| **Language** | PHP | 8.2+ | Modern PHP features and performance improvements |
| **Database** | PostgreSQL | 16+ | ACID compliance, JSONB support, pgvector extension |
| **Authentication** | Laravel Sanctum | 3.x | Simple API authentication without sessions |
| **Queue** | Redis | 7+ | Fast job processing and application caching |
| **File Storage** | S3-compatible (MinIO/AWS) | - | Flexible storage with cloud compatibility |
| **Permissions** | Spatie Laravel Permission | 5.x | Role-based access control (RBAC) |
| **Testing** | PHPUnit + Pest | - | Unit and feature testing |

## Architecture Pattern

### Layered Architecture with Clean Code Principles

```
┌─────────────────────────────────────┐
│          API Routes                 │  (routes/api.php)
├─────────────────────────────────────┤
│        Controllers                  │  (app/Http/Controllers/API/)
├─────────────────────────────────────┤
│      Request Validation             │  (app/Http/Requests/)
├─────────────────────────────────────┤
│         Services                    │  (app/Services/)
├─────────────────────────────────────┤
│       Repositories                  │  (app/Repositories/)
├─────────────────────────────────────┤
│          Models                     │  (app/Models/)
└─────────────────────────────────────┘
```

### Design Patterns Applied
1. **Repository Pattern**: Data access abstraction
2. **Service Pattern**: Business logic encapsulation
3. **Factory Pattern**: Model and response creation
4. **Observer Pattern**: Event-driven architecture
5. **Strategy Pattern**: Multi-tenant configurations

## Data Architecture

### Database Schema Design

```sql
-- Core Entity Tables
users                    # User accounts and profiles
organisations            # Organization hierarchy
user_organisations      # Many-to-many relationships
roles                    # System roles
permissions             # Granular permissions
role_has_permissions     # Role-permission mapping

-- Core Functionality
activities              # Crisis communication activities
activity_reports        # Field reports and evidence
activity_attachments    # File uploads
semiotic_assessments    # AI analysis results
messages                # Internal communications
notifications            # System notifications

-- Pattern Database (Core Innovation)
semiotic_patterns       # Anonymized communication patterns
pattern_validations    # Pattern effectiveness data
pattern_contexts        # Context metadata
```

### Database Features
- **Hierarchical Organizations**: Using adjacency list pattern
- **Soft Deletes**: Maintains data integrity
- **JSONB Fields**: Flexible metadata storage
- **pgvector**: Vector similarity for pattern matching
- **Row-Level Security**: Multi-tenant data isolation

### Model Definitions

#### User Model
```php
class User extends Authenticatable
{
    protected $fillable = [
        'name', 'email', 'password', 'phone_number',
        'profile_photo_path', 'settings'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'settings' => 'array'
    ];

    public function organisations()
    {
        return $this->belongsToMany(Organisation::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class, 'created_by');
    }
}
```

#### Organisation Model
```php
class Organisation extends Model
{
    protected $fillable = [
        'name', 'type', 'level', 'parent_id',
        'location', 'contact_info', 'settings'
    ];

    protected $casts = [
        'location' => 'json',
        'contact_info' => 'json',
        'settings' => 'array'
    ];

    public function parent()
    {
        return $this->belongsTo(Organisation::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Organisation::class, 'parent_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
```

#### Activity Model
```php
class Activity extends Model
{
    protected $fillable = [
        'title', 'type', 'description', 'target_audience',
        'planned_message', 'status', 'organisation_id',
        'created_by', 'approved_by', 'approved_at',
        'meta_data', 'semiotic_assessment_id'
    ];

    protected $casts = [
        'target_audience' => 'json',
        'meta_data' => 'json',
        'approved_at' => 'datetime'
    ];

    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function reports()
    {
        return $this->hasMany(ActivityReport::class);
    }

    public function semioticAssessment()
    {
        return $this->belongsTo(SemioticAssessment::class);
    }
}
```

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
│   ├── hierarchy
│   └── members
├── activities/
│   ├── {id}
│   ├── reports
│   ├── assessments
│   └── attachments
├── patterns/
│   ├── search
│   ├── validate
│   └── contexts
├── communications/
│   ├── messages
│   ├── notifications
│   └── announcements
└── analytics/
    ├── dashboard
    ├── reports
    └── exports
```

### API Features
- **Versioning**: `/api/v1/` with backward compatibility
- **Rate Limiting**: Configurable per endpoint and user role
- **Pagination**: Cursor-based for large datasets
- **Filtering**: Advanced query parameter filtering
- **Sorting**: Multi-column sorting support
- **Field Selection**: Partial response with `?fields=`
- **Include Relations**: Eager loading with `?include=`

## Authentication & Authorization

### Token-Based Authentication
```php
// JWT Token Structure
{
    "sub": "user_id",
    "org": "organisation_id",
    "role": "user_role",
    "iat": 1234567890,
    "exp": 1234567890
}
```

### Role-Based Access Control (RBAC)
- **Super Admin**: Full system access
- **State Admin**: Organization + child organizations
- **LGA Officer**: Local activities only
- **Field Officer**: Assigned activities only
- **Data Analyst**: Read-only + export

### Middleware Stack
```php
// API middleware
1. ThrottleRequests          // Rate limiting
2. TrimStrings              // Input sanitization
3. VerifyCsrfToken          // CSRF protection
4. Authenticate:sanctum     // JWT validation
5. CheckOrganisation       // Multi-tenant isolation
6. CheckPermission         // RBAC enforcement
7. LogApiAccess            // Audit trail
```

## Component Architecture

### Controllers
```php
// AuthController
class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        // Validate credentials
        // Generate JWT token
        // Return user data and token
    }

    public function logout(Request $request)
    {
        // Revoke token
        // Clear session data
    }
}
```

```php
// ActivityController
class ActivityController extends Controller
{
    public function index(ListActivitiesRequest $request)
    {
        // Apply filters and permissions
        // Return paginated activities
    }

    public function store(CreateActivityRequest $request)
    {
        // Validate request
        // Create activity
        // Trigger semiotic assessment if needed
    }
}
```

### Services
```php
// ActivityService
class ActivityService
{
    public function createActivity(array $data): Activity
    {
        // Business logic for activity creation
        // Workflow state management
        // Event dispatching
    }

    public function submitForApproval(Activity $activity): bool
    {
        // Validate activity completeness
        // Update status
        // Send notifications
    }
}
```

```php
// SemioticService
class SemioticService
{
    public function assessMessage(string $message, array $context): array
    {
        // Call AI service
        // Cache results
        // Store assessment
    }

    public function getPatterns(array $filters): Collection
    {
        // Search pattern database
        // Apply relevance scoring
    }
}
```

### Repositories
```php
// ActivityRepository
class ActivityRepository
{
    public function findWithFilters(array $filters): Builder
    {
        $query = Activity::query();

        // Apply dynamic filters
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }

        return $query->with(['organisation', 'creator']);
    }
}
```

## Data Flow Architecture

### Request Processing Flow
```
Client Request
    ↓
Route Definition
    ↓
Middleware Stack
    ↓
Controller (HTTP)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Database (PostgreSQL)
    ↓
JSON Response
```

### Async Processing Flow
```
Action Triggered
    ↓
Event Dispatched
    ↓
Queue Job Created
    ↓
Background Processing
    ↓
AI Service Call (if needed)
    ↓
Database Update
    ↓
WebSocket/Push Notification
```

## Performance Optimizations

### Database Optimizations
- **Connection Pooling**: PgBouncer for connection management
- **Read Replicas**: Analytics queries on read replicas
- **Indexes**: Strategic indexing for common queries
- **Query Optimization**: Eager loading prevents N+1 queries

### Caching Strategy
- **Application Cache**: Redis for frequent data
- **Query Cache**: Database query results
- **Response Cache**: API responses with tags
- **CDN**: Static asset delivery

### Queue Configuration
```php
// Queue priorities
'high'      => Semiotic assessments, notifications
'default'   => Activity processing, reports
'low'       => Analytics, data exports
```

## Security Architecture

### Data Protection
- **Encryption**: TLS 1.3 for all communications
- **Hashing**: Bcrypt for passwords, SHA-256 for sensitive data
- **PII Handling**: Field-level encryption for sensitive fields
- **Audit Logging**: All data access logged

### API Security
- **Input Validation**: Comprehensive request validation
- **SQL Injection**: Prepared statements and ORM
- **XSS Protection**: Output escaping and CSP headers
- **Rate Limiting**: Prevent brute force attacks

### Infrastructure Security
- **Environment Variables**: Sensitive config in .env
- **Secret Management**: Encrypted secrets storage
- **Network Security**: VPC and security groups
- **Regular Updates**: Automated security patches

## Testing Strategy

### Unit Tests (PHPUnit/Pest)
```php
// Example unit test
test('can create activity', function () {
    $activity = Activity::factory()->create();

    expect($activity->title)->toBeString();
    expect($activity->status)->toBe('draft');
});
```

### Feature Tests
```php
// Example feature test
test('user can create activity', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)
        ->post('/api/v1/activities', [
            'title' => 'Test Activity',
            'type' => 'campaign'
        ]);

    $response->assertStatus(201)
        ->assertJson(['success' => true]);
});
```

### Integration Tests
- **Database**: Migration and seeding
- **External Services**: AI service integration
- **File Storage**: Upload/download flows
- **Email**: Notification delivery

## Deployment Architecture

### Development Environment
- **Docker Compose**: All services locally
- **Volume Mounts**: Live code editing
- **Seed Data**: Realistic test data
- **Debugging**: Xdebug integration

### Production Environment
- **Kubernetes**: Container orchestration
- **Load Balancer**: Traffic distribution
- **Auto-scaling**: Horizontal pod scaling
- **Health Checks**: Service monitoring

---

*For detailed implementation guides, see: [Backend Development Guide](../guides/backend/)*