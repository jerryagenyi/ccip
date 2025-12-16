# Quick Start: User & Organisation Management

## Overview
Quick reference guide for implementing the User & Organisation Management feature.

## Implementation Order

1. **Database Setup**
   - Run migrations for organisations, roles, users, user_roles
   - Seed default roles and initial super admin

2. **Backend Authentication**
   - Install Laravel Sanctum
   - Create AuthController with register/login/logout
   - Implement password reset flow

3. **Backend User Management**
   - Create UserController
   - Create OrganisationController
   - Implement role assignment endpoints

4. **Frontend Authentication**
   - Create login/register pages
   - Set up Pinia auth store
   - Implement route guards

5. **Frontend User Management**
   - Create user profile page
   - Create organisation management (admin)
   - Implement role assignment UI

## Key Files

### Backend
- `app/Http/Controllers/AuthController.php`
- `app/Http/Controllers/UserController.php`
- `app/Http/Controllers/OrganisationController.php`
- `app/Models/User.php`
- `app/Models/Organisation.php`
- `app/Models/Role.php`
- `app/Http/Middleware/RoleMiddleware.php`
- `database/migrations/*_create_*.php`

### Frontend
- `src/pages/AuthLogin.vue`
- `src/pages/AuthRegister.vue`
- `src/pages/UserProfile.vue`
- `src/stores/useAuthStore.ts`
- `src/stores/useUserStore.ts`
- `src/stores/useOrganisationStore.ts`
- `src/router/index.ts`

## Testing Checklist
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Email verification works
- [ ] Password reset works
- [ ] Role-based access enforced
- [ ] Organisation hierarchy works
- [ ] Profile management works

## Common Issues
- Token expiration: Implement refresh token flow
- Circular organisation references: Add validation
- Role permission inheritance: Implement in middleware

