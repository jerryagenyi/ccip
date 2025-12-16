# Story US-001: User Registration & Authentication

**Epic:** Epic 001 - User & Organisation Management

**As a** new user  
**I want to** register and authenticate  
**So that** I can access the platform

## Acceptance Criteria

- [ ] User can register with email and password
- [ ] Email verification required before account activation
- [ ] Password reset functionality via email
- [ ] JWT token-based authentication via Laravel Sanctum
- [ ] Session management with token refresh
- [ ] Logout functionality

## Technical Details

### Backend
- API Endpoints: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`
- Authentication: Laravel Sanctum
- Email verification required
- Password hashing: bcrypt

### Frontend
- Components: `AuthLogin.vue`, `AuthRegister.vue`, `AuthForgotPassword.vue`, `AuthResetPassword.vue`
- Store: `useAuthStore.ts`
- Routing: Vue Router with auth guards

## Dependencies
- None (foundation story)

## Status
Ready for implementation
