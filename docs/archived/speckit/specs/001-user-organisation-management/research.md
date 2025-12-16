# Research: User & Organisation Management

## Technology Research

### Laravel Sanctum
- **Version**: Latest (compatible with Laravel 10+)
- **Purpose**: API token authentication
- **Key Features**:
  - Token-based authentication for SPAs
  - CSRF protection
  - Token expiration and refresh
- **Documentation**: https://laravel.com/docs/sanctum

### Vue Router
- **Version**: 4.x (compatible with Vue 3)
- **Purpose**: Client-side routing
- **Key Features**:
  - Route guards for authentication
  - Nested routes for organisation hierarchy
  - Route meta fields for role-based access
- **Documentation**: https://router.vuejs.org/

### Pinia
- **Version**: 2.x (compatible with Vue 3)
- **Purpose**: State management
- **Key Features**:
  - TypeScript support
  - DevTools integration
  - Persistent state (for auth tokens)
- **Documentation**: https://pinia.vuejs.org/

## Security Research

### Password Hashing
- Laravel uses bcrypt by default
- Cost factor: 10 (default, sufficient for current needs)
- Consider Argon2 for future if needed

### JWT Token Strategy
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Token rotation on refresh

### Role-Based Access Control
- Middleware-based enforcement at API level
- Component guards at UI level
- Permission inheritance: Super Admin > Admin > Sub-admin > User

## Performance Considerations

### Database Indexing
- Email index for fast login lookups
- Organisation_id index for user filtering
- Parent_id index for hierarchy queries

### Caching Strategy
- Cache organisation tree structure (Redis)
- Cache user permissions (Redis, 1 hour TTL)
- Invalidate cache on role changes

## Low-Bandwidth Optimizations
- Minimal API responses (exclude sensitive data)
- Lazy load organisation children
- Paginate user lists
- Compress profile pictures

## Implementation Notes
- Email verification required before account activation
- Password reset via secure token (expires in 1 hour)
- Organisation hierarchy validation prevents circular references
- Role assignment requires higher-level admin permission

