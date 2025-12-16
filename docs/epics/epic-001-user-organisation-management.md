# Epic 001: User & Organisation Management

## Epic Goal
Implement multi-tier role-based user and organisation management system with hierarchical permissions and self-service profile management. This is the foundation for all other features in CCIP, providing authentication, authorization, and organisational structure.

## Epic Description
This epic establishes the core user and organisation infrastructure for CCIP. It includes user registration and authentication, role-based access control, hierarchical organisation management, user profile management, and navigation systems. This epic is critical as it provides the foundation for all other features in the platform.

## User Stories
- US-001: User Registration & Authentication
- US-002: Role-Based Access Control
- US-003: Organisation Hierarchy
- US-004: User Profile Management
- US-005: Transfer Ownership and Admin Rights
- US-006: Link Organisations Retroactively
- US-007: Navigation System

## Technical Requirements

### Database Schema
- **users** table: id, email, password, name, role, organisation_id, email_verified_at, profile_picture, timestamps
- **organisations** table: id, name, parent_id, category, type, description, timestamps
- **roles** table: id, name, permissions (JSON), timestamps
- **user_roles** pivot table: user_id, role_id, assigned_by, assigned_at

### API Endpoints
- Authentication: `/api/v1/auth/*` (register, login, logout, refresh, forgot-password, reset-password)
- Users: `/api/v1/users/me`, `/api/v1/users/{id}/roles`
- Organisations: `/api/v1/organisations/*` (CRUD, link, transfer-ownership, transfer-admin)

### Frontend Components
- Auth components: `AuthLogin.vue`, `AuthRegister.vue`, `AuthForgotPassword.vue`, `AuthResetPassword.vue`
- User components: `UserProfile.vue`, `UserRoleAssignment.vue`
- Organisation components: `OrganisationList.vue`, `OrganisationForm.vue`, `OrganisationLink.vue`, `OrganisationTransfer.vue`
- Navigation components: `DesktopSidebar.vue`, `MobileBottomNav.vue`
- Stores: `useAuthStore.ts`, `useUserStore.ts`, `useOrganisationStore.ts`

## Dependencies
- Laravel Sanctum for authentication
- Spatie Laravel Permission for RBAC
- Vue Router for navigation
- Pinia for state management
- Email service for verification and password reset

## Security Considerations
- Password hashing using bcrypt
- JWT token expiration and refresh
- Role-based middleware on all protected endpoints
- Email verification to prevent fake accounts
- Rate limiting on authentication endpoints
- CSRF protection for forms

## Performance Considerations
- Index on email for fast login lookups
- Index on organisation_id for filtering
- Cache organisation tree structure
- Lazy load organisation children

## Priority
**High** - Foundation for all other features

## Related Epics
- Epic 002: Activity Tracking (depends on user/organisation structure)
- Epic 003: Dashboards (depends on role-based access)
- Epic 004: Communication (depends on organisation hierarchy)

## Status
Ready for implementation
