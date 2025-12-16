# Task Breakdown: User & Organisation Management

This document contains the detailed task breakdown for implementing User & Organisation Management. Tasks are organized by user story and ordered to ensure dependencies are respected. Tasks marked with `[P]` can be executed in parallel.

## User Story: US-001 - User Registration & Authentication

### Database Tasks
- [ ] **Task DB-001**: Create organisations table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_organisations_table.php`
  - Dependencies: None
  - Estimated Time: 1 hour
  - Details: Create table with id, name, parent_id, type, description, timestamps

- [ ] **Task DB-002**: Create roles table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_roles_table.php`
  - Dependencies: None
  - Estimated Time: 1 hour
  - Details: Create table with id, name, permissions (JSON), description, timestamps

- [ ] **Task DB-003**: Create users table migration (extend Laravel default)
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_users_table.php`
  - Dependencies: Task DB-001 (organisations)
  - Estimated Time: 1.5 hours
  - Details: Add role, organisation_id, profile_picture to users table

- [ ] **Task DB-004**: Create user_roles pivot table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_user_roles_table.php`
  - Dependencies: Task DB-002, Task DB-003
  - Estimated Time: 1 hour
  - Details: Create pivot table with user_id, role_id, assigned_by, assigned_at

- [ ] **Task DB-005**: Create database indexes
  - File: Update migrations with indexes
  - Dependencies: All table migrations
  - Estimated Time: 0.5 hours
  - Details: Add indexes on email, organisation_id, role, parent_id

### Backend Model Tasks
- [ ] **Task BE-001**: Create Organisation model
  - File: `backend/app/Models/Organisation.php`
  - Dependencies: Task DB-001
  - Estimated Time: 1 hour
  - Details: Model with relationships (parent, children, users)

- [ ] **Task BE-002**: Create Role model
  - File: `backend/app/Models/Role.php`
  - Dependencies: Task DB-002
  - Estimated Time: 1 hour
  - Details: Model with user_roles relationship

- [ ] **Task BE-003**: Update User model
  - File: `backend/app/Models/User.php`
  - Dependencies: Task DB-003
  - Estimated Time: 1.5 hours
  - Details: Add organisation, roles relationships, role checking methods

- [ ] **Task BE-004**: Create model factories
  - File: `backend/database/factories/OrganisationFactory.php`, `RoleFactory.php`
  - Dependencies: All models
  - Estimated Time: 1 hour
  - Details: Factories for testing

### Backend Authentication Tasks
- [ ] **Task BE-005**: Install and configure Laravel Sanctum
  - File: `backend/composer.json`, `backend/config/sanctum.php`
  - Dependencies: None
  - Estimated Time: 1 hour
  - Details: Install package, configure token expiration

- [ ] **Task BE-006**: Create RegisterRequest form validation
  - File: `backend/app/Http/Requests/Auth/RegisterRequest.php`
  - Dependencies: None
  - Estimated Time: 1 hour
  - Details: Validate email, password, name, organisation_id

- [ ] **Task BE-007**: Create LoginRequest form validation
  - File: `backend/app/Http/Requests/Auth/LoginRequest.php`
  - Dependencies: None
  - Estimated Time: 0.5 hours
  - Details: Validate email, password

- [ ] **Task BE-008**: Create AuthController - register method
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Dependencies: Task BE-003, Task BE-006
  - Estimated Time: 2 hours
  - Details: Register user, create token, send verification email

- [ ] **Task BE-009**: Create AuthController - login method
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Dependencies: Task BE-003, Task BE-007
  - Estimated Time: 1.5 hours
  - Details: Authenticate user, create token, return user data

- [ ] **Task BE-010**: Create AuthController - logout method
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Dependencies: Task BE-005
  - Estimated Time: 0.5 hours
  - Details: Revoke current token

- [ ] **Task BE-011**: Create AuthController - refresh method
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Dependencies: Task BE-005
  - Estimated Time: 1 hour
  - Details: Refresh access token

- [ ] **Task BE-012**: Create ForgotPasswordRequest form validation
  - File: `backend/app/Http/Requests/Auth/ForgotPasswordRequest.php`
  - Dependencies: None
  - Estimated Time: 0.5 hours
  - Details: Validate email

- [ ] **Task BE-013**: Create ResetPasswordRequest form validation
  - File: `backend/app/Http/Requests/Auth/ResetPasswordRequest.php`
  - Dependencies: None
  - Estimated Time: 0.5 hours
  - Details: Validate token, email, password, password_confirmation

- [ ] **Task BE-014**: Create AuthController - forgotPassword method
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Dependencies: Task BE-012
  - Estimated Time: 1.5 hours
  - Details: Send password reset email

- [ ] **Task BE-015**: Create AuthController - resetPassword method
  - File: `backend/app/Http/Controllers/AuthController.php`
  - Dependencies: Task BE-013
  - Estimated Time: 1.5 hours
  - Details: Reset password, invalidate token

- [ ] **Task BE-016**: Create Authenticate middleware
  - File: `backend/app/Http/Middleware/Authenticate.php` (update)
  - Dependencies: Task BE-005
  - Estimated Time: 1 hour
  - Details: Handle Sanctum authentication

- [ ] **Task BE-017**: Add authentication routes
  - File: `backend/routes/api.php`
  - Dependencies: Task BE-008 through Task BE-015
  - Estimated Time: 0.5 hours
  - Details: POST /auth/register, /auth/login, /auth/logout, /auth/refresh, /auth/forgot-password, /auth/reset-password

### Frontend Authentication Tasks
- [ ] **Task FE-001**: Install and configure Vue Router
  - File: `frontend/src/router/index.ts`
  - Dependencies: None
  - Estimated Time: 1 hour
  - Details: Set up router with routes

- [ ] **Task FE-002**: Create Pinia auth store
  - File: `frontend/src/stores/useAuthStore.ts`
  - Dependencies: None
  - Estimated Time: 2 hours
  - Details: State (user, token), actions (login, logout, register), getters

- [ ] **Task FE-003**: Create API service with Axios
  - File: `frontend/src/services/api.ts`
  - Dependencies: None
  - Estimated Time: 1.5 hours
  - Details: Axios instance, request/response interceptors, token management

- [ ] **Task FE-004**: Create route guards
  - File: `frontend/src/router/guards.ts`
  - Dependencies: Task FE-001, Task FE-002
  - Estimated Time: 1.5 hours
  - Details: Auth guard, guest guard, role-based guard

- [ ] **Task FE-005**: Create AuthLogin component
  - File: `frontend/src/pages/AuthLogin.vue`
  - Dependencies: Task FE-002, Task FE-003
  - Estimated Time: 3 hours
  - Details: Login form, validation, error handling, redirect

- [ ] **Task FE-006**: Create AuthRegister component
  - File: `frontend/src/pages/AuthRegister.vue`
  - Dependencies: Task FE-002, Task FE-003
  - Estimated Time: 3 hours
  - Details: Registration form, validation, success handling

- [ ] **Task FE-007**: Create AuthForgotPassword component
  - File: `frontend/src/pages/AuthForgotPassword.vue`
  - Dependencies: Task FE-003
  - Estimated Time: 2 hours
  - Details: Forgot password form, success message

- [ ] **Task FE-008**: Create AuthResetPassword component
  - File: `frontend/src/pages/AuthResetPassword.vue`
  - Dependencies: Task FE-003
  - Estimated Time: 2 hours
  - Details: Reset password form, token validation

### Testing Tasks
- [ ] **Task TEST-001**: Write feature test for registration
  - File: `backend/tests/Feature/Auth/RegistrationTest.php`
  - Dependencies: Task BE-008
  - Estimated Time: 1.5 hours
  - Details: Test successful registration, validation errors, email uniqueness

- [ ] **Task TEST-002**: Write feature test for login
  - File: `backend/tests/Feature/Auth/LoginTest.php`
  - Dependencies: Task BE-009
  - Estimated Time: 1.5 hours
  - Details: Test successful login, invalid credentials, rate limiting

- [ ] **Task TEST-003**: Write feature test for password reset
  - File: `backend/tests/Feature/Auth/PasswordResetTest.php`
  - Dependencies: Task BE-014, Task BE-015
  - Estimated Time: 2 hours
  - Details: Test forgot password, reset password, token expiration

## Checkpoint: US-001 Complete
After completing all tasks for US-001:
- [ ] Users can register
- [ ] Users can login
- [ ] Users can logout
- [ ] Password reset works
- [ ] All tests passing
- [ ] Manual testing completed

## User Story: US-002 - Role-Based Access Control

### Backend Tasks
- [ ] **Task BE-018**: Create RoleMiddleware
  - File: `backend/app/Http/Middleware/RoleMiddleware.php`
  - Dependencies: Task BE-003
  - Estimated Time: 2 hours
  - Details: Check user role, enforce permission hierarchy

- [ ] **Task BE-019**: Create RoleService
  - File: `backend/app/Services/RoleService.php`
  - Dependencies: Task BE-002, Task BE-003
  - Estimated Time: 2 hours
  - Details: Role assignment logic, permission checking, hierarchy validation

- [ ] **Task BE-020**: Create AssignRoleRequest form validation
  - File: `backend/app/Http/Requests/User/AssignRoleRequest.php`
  - Dependencies: None
  - Estimated Time: 0.5 hours
  - Details: Validate role_id, user_id

- [ ] **Task BE-021**: Create UserController - assignRole method
  - File: `backend/app/Http/Controllers/UserController.php`
  - Dependencies: Task BE-019, Task BE-020
  - Estimated Time: 2 hours
  - Details: Assign role to user, create audit trail

- [ ] **Task BE-022**: Apply RoleMiddleware to protected routes
  - File: `backend/routes/api.php`, `backend/app/Http/Kernel.php`
  - Dependencies: Task BE-018
  - Estimated Time: 1 hour
  - Details: Add middleware to routes requiring specific roles

### Frontend Tasks
- [ ] **Task FE-009**: Create role checking composable
  - File: `frontend/src/composables/useRole.ts`
  - Dependencies: Task FE-002
  - Estimated Time: 1 hour
  - Details: Composable for checking user roles

- [ ] **Task FE-010**: Create role-based component guards
  - File: `frontend/src/components/RoleGuard.vue`
  - Dependencies: Task FE-009
  - Estimated Time: 1.5 hours
  - Details: Component that shows/hides based on role

- [ ] **Task FE-011**: Create UserRoleAssignment component (admin)
  - File: `frontend/src/components/UserRoleAssignment.vue`
  - Dependencies: Task FE-003, Task FE-009
  - Estimated Time: 3 hours
  - Details: User selector, role selector, assign button

### Testing Tasks
- [ ] **Task TEST-004**: Write feature test for role assignment
  - File: `backend/tests/Feature/User/RoleAssignmentTest.php`
  - Dependencies: Task BE-021
  - Estimated Time: 2 hours
  - Details: Test role assignment, permission checks, hierarchy enforcement

## Checkpoint: US-002 Complete
After completing all tasks for US-002:
- [ ] Role-based middleware works
- [ ] Role assignment works
- [ ] Permission hierarchy enforced
- [ ] All tests passing

## User Story: US-003 - Organisation Hierarchy

### Backend Tasks
- [ ] **Task BE-023**: Create OrganisationRequest form validation
  - File: `backend/app/Http/Requests/Organisation/OrganisationRequest.php`
  - Dependencies: None
  - Estimated Time: 1 hour
  - Details: Validate name, parent_id, type, prevent circular references

- [ ] **Task BE-024**: Create OrganisationService
  - File: `backend/app/Services/OrganisationService.php`
  - Dependencies: Task BE-001
  - Estimated Time: 2.5 hours
  - Details: Hierarchy validation, tree building, organisation filtering

- [ ] **Task BE-025**: Create OrganisationController - index method
  - File: `backend/app/Http/Controllers/OrganisationController.php`
  - Dependencies: Task BE-024
  - Estimated Time: 1.5 hours
  - Details: List organisations with filtering

- [ ] **Task BE-026**: Create OrganisationController - store method
  - File: `backend/app/Http/Controllers/OrganisationController.php`
  - Dependencies: Task BE-023, Task BE-024
  - Estimated Time: 2 hours
  - Details: Create organisation, validate hierarchy

- [ ] **Task BE-027**: Create OrganisationController - show method
  - File: `backend/app/Http/Controllers/OrganisationController.php`
  - Dependencies: Task BE-001
  - Estimated Time: 1 hour
  - Details: Get organisation with users and children

- [ ] **Task BE-028**: Create OrganisationController - update method
  - File: `backend/app/Http/Controllers/OrganisationController.php`
  - Dependencies: Task BE-023, Task BE-024
  - Estimated Time: 1.5 hours
  - Details: Update organisation, validate hierarchy

- [ ] **Task BE-029**: Create OrganisationController - users method
  - File: `backend/app/Http/Controllers/OrganisationController.php`
  - Dependencies: Task BE-001
  - Estimated Time: 1 hour
  - Details: List users in organisation

- [ ] **Task BE-030**: Create OrganisationResource
  - File: `backend/app/Http/Resources/OrganisationResource.php`
  - Dependencies: Task BE-001
  - Estimated Time: 1 hour
  - Details: Format organisation API response

- [ ] **Task BE-031**: Add organisation routes
  - File: `backend/routes/api.php`
  - Dependencies: Task BE-025 through Task BE-029
  - Estimated Time: 0.5 hours
  - Details: GET /organisations, POST /organisations, GET /organisations/{id}, PUT /organisations/{id}, GET /organisations/{id}/users

### Frontend Tasks
- [ ] **Task FE-012**: Create Pinia organisation store
  - File: `frontend/src/stores/useOrganisationStore.ts`
  - Dependencies: Task FE-003
  - Estimated Time: 2 hours
  - Details: State (organisations), actions (fetch, create, update), getters

- [ ] **Task FE-013**: Create OrganisationList component (admin)
  - File: `frontend/src/pages/OrganisationList.vue`
  - Dependencies: Task FE-012
  - Estimated Time: 4 hours
  - Details: Tree view, create button, edit/delete actions

- [ ] **Task FE-014**: Create OrganisationForm component
  - File: `frontend/src/components/OrganisationForm.vue`
  - Dependencies: Task FE-012
  - Estimated Time: 3 hours
  - Details: Create/edit form, parent selector, validation

### Testing Tasks
- [ ] **Task TEST-005**: Write feature test for organisation CRUD
  - File: `backend/tests/Feature/Organisation/OrganisationTest.php`
  - Dependencies: Task BE-026, Task BE-028
  - Estimated Time: 2.5 hours
  - Details: Test create, read, update, hierarchy validation

## Checkpoint: US-003 Complete
After completing all tasks for US-003:
- [ ] Organisations can be created
- [ ] Hierarchy works correctly
- [ ] Circular references prevented
- [ ] All tests passing

## User Story: US-004 - User Profile Management

### Backend Tasks
- [ ] **Task BE-032**: Create UpdateProfileRequest form validation
  - File: `backend/app/Http/Requests/User/UpdateProfileRequest.php`
  - Dependencies: None
  - Estimated Time: 0.5 hours
  - Details: Validate name, profile_picture

- [ ] **Task BE-033**: Create ChangePasswordRequest form validation
  - File: `backend/app/Http/Requests/User/ChangePasswordRequest.php`
  - Dependencies: None
  - Estimated Time: 0.5 hours
  - Details: Validate current_password, password, password_confirmation

- [ ] **Task BE-034**: Create UserController - me method
  - File: `backend/app/Http/Controllers/UserController.php`
  - Dependencies: Task BE-003
  - Estimated Time: 1 hour
  - Details: Get current authenticated user with organisation and roles

- [ ] **Task BE-035**: Create UserController - updateProfile method
  - File: `backend/app/Http/Controllers/UserController.php`
  - Dependencies: Task BE-032
  - Estimated Time: 2 hours
  - Details: Update user profile, handle profile picture upload

- [ ] **Task BE-036**: Create UserController - changePassword method
  - File: `backend/app/Http/Controllers/UserController.php`
  - Dependencies: Task BE-033
  - Estimated Time: 1.5 hours
  - Details: Change password, validate current password

- [ ] **Task BE-037**: Create UserResource
  - File: `backend/app/Http/Resources/UserResource.php`
  - Dependencies: Task BE-003
  - Estimated Time: 1 hour
  - Details: Format user API response

- [ ] **Task BE-038**: Add user routes
  - File: `backend/routes/api.php`
  - Dependencies: Task BE-034, Task BE-035, Task BE-036
  - Estimated Time: 0.5 hours
  - Details: GET /users/me, PUT /users/me, PUT /users/me/password

### Frontend Tasks
- [ ] **Task FE-015**: Create Pinia user store
  - File: `frontend/src/stores/useUserStore.ts`
  - Dependencies: Task FE-003
  - Estimated Time: 1.5 hours
  - Details: State (currentUser), actions (fetch, update), getters

- [ ] **Task FE-016**: Create UserProfile component
  - File: `frontend/src/pages/UserProfile.vue`
  - Dependencies: Task FE-015
  - Estimated Time: 3 hours
  - Details: Display user info, edit button, profile picture

- [ ] **Task FE-017**: Create UserProfileEdit component
  - File: `frontend/src/components/UserProfileEdit.vue`
  - Dependencies: Task FE-015
  - Estimated Time: 3 hours
  - Details: Edit form, profile picture upload, save/cancel

- [ ] **Task FE-018**: Create ChangePassword component
  - File: `frontend/src/components/ChangePassword.vue`
  - Dependencies: Task FE-015
  - Estimated Time: 2 hours
  - Details: Password change form, validation

### Testing Tasks
- [ ] **Task TEST-006**: Write feature test for profile update
  - File: `backend/tests/Feature/User/ProfileTest.php`
  - Dependencies: Task BE-035
  - Estimated Time: 1.5 hours
  - Details: Test profile update, profile picture upload

- [ ] **Task TEST-007**: Write feature test for password change
  - File: `backend/tests/Feature/User/PasswordChangeTest.php`
  - Dependencies: Task BE-036
  - Estimated Time: 1.5 hours
  - Details: Test password change, current password validation

## Checkpoint: US-004 Complete
After completing all tasks for US-004:
- [ ] Users can view their profile
- [ ] Users can edit their profile
- [ ] Users can change password
- [ ] Profile picture upload works
- [ ] All tests passing

## Database Seeding Tasks
- [ ] **Task DB-006**: Create RoleSeeder
  - File: `backend/database/seeders/RoleSeeder.php`
  - Dependencies: Task DB-002
  - Estimated Time: 1 hour
  - Details: Seed default roles (super_admin, admin, sub_admin, user)

- [ ] **Task DB-007**: Create OrganisationSeeder
  - File: `backend/database/seeders/OrganisationSeeder.php`
  - Dependencies: Task DB-001
  - Estimated Time: 1.5 hours
  - Details: Seed sample organisations (federal, state, local)

- [ ] **Task DB-008**: Create UserSeeder
  - File: `backend/database/seeders/UserSeeder.php`
  - Dependencies: Task DB-003, Task DB-006, Task DB-007
  - Estimated Time: 1.5 hours
  - Details: Seed initial super admin user

- [ ] **Task DB-009**: Create DatabaseSeeder
  - File: `backend/database/seeders/DatabaseSeeder.php`
  - Dependencies: All seeders
  - Estimated Time: 0.5 hours
  - Details: Call all seeders in order

## Final Integration Tasks
- [ ] **Task INT-001**: Update API documentation
  - File: Update Swagger/OpenAPI annotations
  - Dependencies: All API endpoints
  - Estimated Time: 2 hours
  - Details: Document all endpoints with examples

- [ ] **Task INT-002**: End-to-end testing
  - File: Manual testing checklist
  - Dependencies: All features complete
  - Estimated Time: 3 hours
  - Details: Test complete user flows

- [ ] **Task INT-003**: Performance testing
  - File: Performance test scripts
  - Dependencies: All features complete
  - Estimated Time: 2 hours
  - Details: Test database queries, API response times

## Dependencies Graph

```
Database Migrations:
  DB-001 (organisations) → DB-003 (users)
  DB-002 (roles) → DB-004 (user_roles)
  DB-003 (users) → DB-004 (user_roles)

Backend:
  DB-001 → BE-001 (Organisation model)
  DB-002 → BE-002 (Role model)
  DB-003 → BE-003 (User model)
  BE-003, BE-006 → BE-008 (register)
  BE-003, BE-007 → BE-009 (login)
  BE-003 → BE-018 (RoleMiddleware)
  BE-001 → BE-024 (OrganisationService)

Frontend:
  FE-001, FE-002 → FE-004 (route guards)
  FE-002, FE-003 → FE-005 (login)
  FE-002, FE-003 → FE-006 (register)
  FE-012 → FE-013 (organisation list)
  FE-015 → FE-016 (user profile)
```

## Estimated Timeline

- **Total Tasks**: 70+
- **Estimated Hours**: ~90 hours
- **Estimated Days**: ~11-12 days (assuming 8 hours/day)
- **Estimated Weeks**: ~2.5 weeks (assuming 5 days/week)

## Notes

- Tasks can be parallelized where marked with `[P]`
- Database tasks must complete before model tasks
- Model tasks must complete before controller tasks
- Frontend tasks can start after backend API is ready
- Testing tasks should be written alongside implementation
- Seed data is important for development and testing

