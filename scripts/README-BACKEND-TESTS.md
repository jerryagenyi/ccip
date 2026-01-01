# Backend Authentication Integration Tests

Test scripts for verifying US-001 (User Registration & Authentication) backend endpoints.

## Prerequisites

1. **Backend server running**
   - Local: `php artisan serve` (runs on http://localhost:8000)
   - Docker: `docker-compose up backend`
   - Ensure database is migrated: `php artisan migrate`

2. **Required tools** (choose one):
   - **Node.js** (for JavaScript version)
   - **curl** (for shell version)

## Usage

### Option 1: Node.js Script (Recommended)

```bash
# Default (http://localhost:8000)
node scripts/test-backend-auth.js

# Custom base URL
node scripts/test-backend-auth.js --base-url=http://localhost:8000

# With environment variable
API_URL=http://localhost:8000 node scripts/test-backend-auth.js
```

### Option 2: Shell Script

```bash
# Make executable (first time only)
chmod +x scripts/test-backend-auth.sh

# Default (http://localhost:8000)
./scripts/test-backend-auth.sh

# Custom base URL
./scripts/test-backend-auth.sh http://localhost:8000
```

## What It Tests

The script tests all authentication endpoints:

### Public Endpoints
1. ✅ **Health Check** - `GET /api/v1/system/health`
2. ✅ **Register** - `POST /api/v1/auth/register`
   - Valid registration
   - Invalid email format
   - Password mismatch
3. ✅ **Login** - `POST /api/v1/auth/login`
   - Valid credentials
   - Invalid credentials
   - Non-existent user
4. ✅ **Forgot Password** - `POST /api/v1/auth/forgot-password`
   - Valid email
   - Invalid email format

### Protected Endpoints (Requires Authentication)
5. ✅ **Logout** - `POST /api/v1/auth/logout`
   - With authentication
   - Without authentication (should fail)
6. ✅ **Refresh Token** - `POST /api/v1/auth/refresh`
   - With authentication
   - Without authentication (should fail)
7. ✅ **Get Current User** - `GET /api/v1/users/me`
   - With authentication
   - Without authentication (should fail)

## Expected Output

```
═══════════════════════════════════════════════════════
  CCIP Backend Authentication Integration Tests
═══════════════════════════════════════════════════════

Base URL: http://localhost:8000/api/v1
Started: 2025-01-01T12:00:00.000Z

▶ Testing: Health Check Endpoint
✓ Health Check Endpoint - PASSED

▶ Testing: POST /auth/register - Valid Registration
✓ POST /auth/register - Valid Registration - PASSED
  ✓ Token received: abc123def456...
  ✓ User ID: 1

...

═══════════════════════════════════════════════════════
  Test Summary
═══════════════════════════════════════════════════════

Total Tests: 15
Passed: 15
Failed: 0
Skipped: 0

Completed: 2025-01-01T12:00:05.000Z
```

## Troubleshooting

### Backend Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:8000
```

**Solution:** Start the backend server:
```bash
cd backend
php artisan serve
```

### Database Not Migrated
```
Error: SQLSTATE[42P01]: Undefined table: 7 ERROR: relation "users" does not exist
```

**Solution:** Run migrations:
```bash
cd backend
php artisan migrate
```

### CORS Issues
If you see CORS errors, ensure your backend `.env` has:
```env
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Start Backend
  run: |
    cd backend
    php artisan serve &
    sleep 5

- name: Run Auth Tests
  run: node scripts/test-backend-auth.js
```

## Next Steps

After all tests pass:
1. ✅ ThemeToggle fix (completed)
2. ✅ Backend integration tests (this script)
3. ⏭️ Run code review workflow: `/bmad:bmm:workflows:code-review`
4. ⏭️ Mark US-001 as `done` in sprint-status.yaml

