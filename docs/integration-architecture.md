# Integration Architecture

**Project:** CCIP (Crisis Communication Intelligence Platform)  
**Architecture Type:** Multi-part (Frontend + Backend)  
**Integration Pattern:** API-first RESTful

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  Vue 3.5 + Quasar 2.18 + TypeScript 5.9 + Vite 7.1         │
│  PWA (Offline-first)                                        │
│  Port: 5173 (dev) / 443 (prod)                              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │ Bearer Token Auth
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                        Backend                               │
│  Laravel 11 + PHP 8.2                                       │
│  Port: 8000 (dev) / 443 (prod)                              │
└─────┬───────────────┬───────────────┬───────────────┬───────┘
      │               │               │               │
      │               │               │               │
┌─────▼─────┐  ┌──────▼──────┐  ┌─────▼─────┐  ┌─────▼─────┐
│PostgreSQL │  │    Redis    │  │   MinIO   │  │  OpenAI   │
│   16      │  │     7       │  │  (S3)     │  │   API     │
│ Port:5433 │  │  Port:6379   │  │ Port:9000 │  │  (HTTP)   │
└───────────┘  └─────────────┘  └───────────┘  └───────────┘
```

## Frontend → Backend Integration

### API Client

**Location:** `frontend/src/services/api.ts`

**Configuration:**
- Base URL: `http://localhost:8000/api/v1` (dev) or `https://ccip-api.jerryagenyi.xyz/api/v1` (prod)
- Content-Type: `application/json`
- Accept: `application/json`

**Authentication:**
- Token stored in `localStorage` as `auth_token`
- Automatically injected via Axios request interceptor:
  ```typescript
  config.headers.Authorization = `Bearer ${token}`;
  ```

**Error Handling:**
- 401: Clear token, redirect to login
- 403: Show permission error
- 422: Show validation errors
- 500: Show server error
- Network: Show connection error

**Response Format:**
```typescript
{
  success: boolean;
  data: T | PaginatedData<T>;
  message: string;
  errors?: Record<string, string[]>;
}
```

### State Management

**Pattern:** Pinia stores for each domain

**Stores:**
- `useAuthStore` - Authentication state
- `useActivityStore` - Activity management
- `useOrganisationStore` - Organisation management
- `useMessageStore` - Messaging
- `useNotificationStore` - Notifications
- `useDashboardStore` - Dashboard data
- `useAnalyticsStore` - Analytics
- `useReportStore` - Reports
- `useUserStore` - User management
- `useHelpStore` - Help articles
- `useTemplateStore` - Templates
- `useOnboardingStore` - Onboarding
- `useThemeStore` - Theme

**Store Pattern:**
```typescript
export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchActivities() {
    loading.value = true;
    try {
      const response = await api.get(API_ENDPOINTS.ACTIVITIES.LIST);
      activities.value = response.data.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return { activities, loading, error, fetchActivities };
});
```

## Backend → Database Integration

### Database Connection

**Type:** PostgreSQL 16  
**ORM:** Laravel Eloquent  
**Connection:** `pgsql` connection in `config/database.php`

**Connection Details:**
- Host: `postgres` (Docker) or `localhost` (local)
- Port: `5432`
- Database: `ccip`
- Username: `ccip_user`
- Password: `ccip_password`

### Model Relationships

**Pattern:** Eloquent relationships

**Key Relationships:**
- `User` → `Organisation` (belongsTo)
- `Activity` → `Organisation` (belongsTo)
- `Activity` → `User` (created_by, reviewed_by)
- `Organisation` → `Organisation` (parent_id - hierarchical)
- `Message` → `User` (from_user_id, to_user_id)
- `Notification` → `User` (user_id)

**Example:**
```php
class Activity extends Model
{
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
```

## Backend → Storage Integration

### File Storage

**Type:** S3-compatible storage  
**Development:** MinIO  
**Production:** AWS S3 (or compatible)

**Configuration:**
- Disk: `s3` (configured in `config/filesystems.php`)
- Endpoint: `http://minio:9000` (dev) or AWS endpoint (prod)
- Bucket: `ccip-uploads`
- Path Style: Enabled

**Usage:**
```php
Storage::disk('s3')->put('activities/123/file.pdf', $content);
$url = Storage::disk('s3')->url('activities/123/file.pdf');
```

**File Types:**
- Activity attachments
- User avatars
- Report exports (PDF, Excel)
- Message attachments

## Backend → Cache Integration

### Redis Cache

**Purpose:**
- Session storage
- Application cache
- Queue backend

**Configuration:**
- Host: `redis` (Docker) or `localhost` (local)
- Port: `6379`
- Database: `0` (default)

**Usage:**
```php
Cache::put('key', 'value', 3600);
$value = Cache::get('key');
```

**Cache Drivers:**
- Session: Redis
- Cache: Redis
- Queue: Redis

## Backend → AI Integration

### OpenAI Integration

**Service:** `app/Services/AIService.php`

**Features:**
- Semiotic risk analysis
- Report generation
- Graceful fallback to mock data

**Pattern:**
```php
try {
    $response = $this->openai->chat()->create([...]);
    return $this->formatResponse($response);
} catch (\Exception $e) {
    \Log::error('OpenAI API failed', ['error' => $e->getMessage()]);
    return $this->getMockAnalysis(); // Fallback
}
```

**Endpoints:**
- `POST /api/v1/ai/semiotic-analyze` - Analyze activity message
- `POST /api/v1/ai/generate-report` - Generate AI report
- `GET /api/v1/ai/insights` - Get AI insights

**Fallback:**
- Returns mock analysis when API fails
- Ensures application continues functioning
- Logs errors for monitoring

## Authentication Flow

### Token-Based Authentication

**Provider:** Laravel Sanctum

**Flow:**
1. User submits credentials → `POST /api/v1/auth/login`
2. Backend validates → Returns user + token
3. Frontend stores token → `localStorage.setItem('auth_token', token)`
4. Subsequent requests → `Authorization: Bearer {token}` header
5. Backend validates token → `auth:sanctum` middleware
6. Token refresh → `POST /api/v1/auth/refresh`

**Token Storage:**
- Frontend: `localStorage`
- Backend: `personal_access_tokens` table

**Token Expiry:**
- Default: 1 hour
- Auto-refresh: 5 minutes before expiry

## API Versioning

**Pattern:** URL-based versioning

**Base Path:** `/api/v1`

**Future Versions:**
- `/api/v2` (when breaking changes needed)

**Benefits:**
- Clear version separation
- Backward compatibility
- Gradual migration path

## CORS Configuration

**File:** `backend/config/cors.php`

**Settings:**
- Allowed Origins: Frontend URL(s)
- Allowed Methods: `GET, POST, PUT, DELETE, OPTIONS`
- Allowed Headers: `Authorization, Content-Type, Accept`
- Credentials: Enabled

**Development:**
- All origins allowed (for local development)

**Production:**
- Specific frontend domain(s) only

## Error Handling

### Backend Error Responses

**Format:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

### Frontend Error Handling

**Axios Interceptors:**
- Request: Add auth token
- Response: Handle errors globally
- Network: Show connection errors

**User Feedback:**
- Quasar Notify for errors
- Form validation errors inline
- Loading states during requests

## Offline Support (PWA)

### Service Worker

**Purpose:** Cache API responses for offline access

**Strategy:**
- Cache-first for static assets
- Network-first for API calls
- Queue failed requests for sync

### Offline Storage

**Table:** `offline_storage`

**Purpose:** Store offline changes

**Fields:**
- `user_id`
- `entity_type` (Activity, Message, etc.)
- `entity_id`
- `action` (create, update, delete)
- `data` (JSON)
- `sync_status` (pending, synced, failed)

**Sync Flow:**
1. User makes change offline
2. Store in `offline_storage` table
3. When online, sync to API
4. Update `sync_status`

## Data Flow Examples

### Activity Creation Flow

1. **Frontend:** User fills form → `ActivityCreate.vue`
2. **Store:** `useActivityStore.createActivity(data)`
3. **API:** `POST /api/v1/activities` with Bearer token
4. **Backend:** `ActivityController@store`
5. **Validation:** Form Request validation
6. **Model:** `Activity::create($validated)`
7. **Database:** Insert into `activities` table
8. **Response:** Return created activity
9. **Frontend:** Update store, redirect to detail page

### Authentication Flow

1. **Frontend:** User submits login → `AuthLogin.vue`
2. **Store:** `useAuthStore.login(credentials)`
3. **API:** `POST /api/v1/auth/login`
4. **Backend:** `AuthController@login`
5. **Validation:** Check credentials
6. **Token:** Generate Sanctum token
7. **Response:** Return user + token
8. **Frontend:** Store token, update auth state
9. **Router:** Redirect to dashboard

## Integration Testing

### API Testing

**Tool:** PHPUnit

**Location:** `backend/tests/Feature/`

**Example:**
```php
public function test_user_can_create_activity()
{
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withHeader('Authorization', "Bearer $token")
        ->postJson('/api/v1/activities', [
            'title' => 'Test Activity',
            'description' => 'Test Description',
        ]);

    $response->assertStatus(201);
}
```

### E2E Testing

**Tool:** Playwright

**Location:** `frontend/tests/e2e/`

**Example:**
```typescript
test('user can login', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Monitoring & Logging

### Backend Logging

**Location:** `storage/logs/laravel.log`

**Levels:** ERROR, WARNING, INFO, DEBUG

**Usage:**
```php
\Log::error('API call failed', ['error' => $e->getMessage()]);
```

### Frontend Logging

**Console:** Browser DevTools

**Production:** Error tracking service (to be implemented)

## Security Considerations

1. **Authentication:** Bearer tokens, secure storage
2. **Authorization:** Role-based access control
3. **CORS:** Restricted origins in production
4. **Validation:** Input validation on all endpoints
5. **SQL Injection:** Eloquent ORM protection
6. **XSS:** Vue automatic escaping
7. **CSRF:** Laravel CSRF tokens (for web routes)

## Performance Optimization

1. **Caching:** Redis for sessions and cache
2. **Database:** Indexes on frequently queried columns
3. **API:** Pagination for large datasets
4. **Frontend:** Code splitting, lazy loading
5. **Assets:** Vite build optimization
6. **CDN:** Static assets (production)

