# Story US-002: Role-Based Access Control

**Epic:** Epic 001 - User & Organisation Management

**As a** system administrator  
**I want to** assign roles to users  
**So that** they have appropriate permissions

## Acceptance Criteria

- [ ] Four role levels: Super Admin, Admin, Sub-admin, User
- [ ] Role-based permissions enforced at API level (middleware)
- [ ] Role-based permissions enforced at UI level (component guards)
- [ ] Role assignment by higher-level admins only
- [ ] Permission inheritance (Super Admin > Admin > Sub-admin > User)
- [ ] Role change audit trail

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/users/{id}/roles`
- Middleware: Spatie Laravel Permission
- Roles: super_admin, admin, sub_admin, user
- Audit trail for role changes

### Frontend
- Component: `UserRoleAssignment.vue`
- Route guards based on roles
- Component-level permission checks

## Dependencies
- US-001: User Registration & Authentication

## Status
Ready for implementation
