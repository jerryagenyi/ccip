# Implementation Plan: User & Organisation Management

## Overview
Technical implementation plan for User & Organisation Management based on the specification in `spec.md`. This is the foundation feature that all other epics depend on.

## Technology Stack
- **Backend**: Laravel 10+ with PHP 8.2+
- **Authentication**: Laravel Sanctum (for API token authentication)
- **Frontend**: Vue 3 + Quasar + Pinia
- **Database**: PostgreSQL 15+
- **State Management**: Pinia stores for auth, user, and organisation state

## Architecture Decisions

### Backend Architecture
- **Controllers**: Separate controllers for Auth, User, and Organisation
- **Form Requests**: Validation via Laravel Form Requests
- **Resources**: API Resources for consistent response formatting
- **Middleware**: Role-based middleware for authorization
- **Services**: Service classes for complex business logic (role assignment, organisation hierarchy)

### Frontend Architecture
- **Composition API**: Use Vue 3 Composition API primarily
- **Pinia Stores**: Separate stores for auth, user, and organisation state
- **Router Guards**: Route guards for authentication and role-based access
- **Components**: Reusable components for forms, lists, and detail views
- **API Service**: Centralized Axios service with interceptors

## Implementation Phases

### Phase 1: Database Setup & Models
- Create database migrations for all tables
- Create Eloquent models with relationships
- Create model factories and seeders
- Set up database indexes

### Phase 2: Backend Authentication
- Install and configure Laravel Sanctum
- Create authentication controllers
- Implement registration, login, logout
- Add password reset functionality
- Create authentication middleware

### Phase 3: Backend User Management
- Create user management controllers
- Implement user profile endpoints
- Add role assignment logic
- Create role-based middleware
- Implement permission checking

### Phase 4: Backend Organisation Management
- Create organisation controllers
- Implement organisation CRUD
- Add hierarchy validation
- Implement organisation tree queries
- Add organisation-user relationships

### Phase 5: Frontend Authentication
- Set up Vue Router with guards
- Create Pinia auth store
- Build login/register pages
- Implement token management
- Add password reset flow

### Phase 6: Frontend User Management
- Create user profile page
- Build profile editing form
- Implement password change
- Add profile picture upload

### Phase 7: Frontend Organisation Management
- Create organisation list (admin)
- Build organisation form (create/edit)
- Implement organisation tree view
- Add user-role assignment UI (admin)

### Phase 8: Testing & Documentation
- Write backend feature tests
- Write frontend component tests
- Test authentication flows
- Test role-based access
- Document API endpoints

## Database Migrations

### Migration 1: Create organisations table
- **File**: `YYYY_MM_DD_HHMMSS_create_organisations_table.php`
- **Purpose**: Store organisational hierarchy
- **Fields**: id, name, parent_id, type, description, timestamps

### Migration 2: Create roles table
- **File**: `YYYY_MM_DD_HHMMSS_create_roles_table.php`
- **Purpose**: Define system roles
- **Fields**: id, name, permissions (JSON), description, timestamps

### Migration 3: Create users table (extend Laravel default)
- **File**: `YYYY_MM_DD_HHMMSS_create_users_table.php`
- **Purpose**: User accounts with role and organisation
- **Fields**: id, email, password, name, role, organisation_id, email_verified_at, profile_picture, timestamps

### Migration 4: Create user_roles pivot table
- **File**: `YYYY_MM_DD_HHMMSS_create_user_roles_table.php`
- **Purpose**: Audit trail for role assignments
- **Fields**: id, user_id, role_id, assigned_by, assigned_at, timestamps

## API Design

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
  - Request: email, password, name, organisation_id (optional)
  - Response: user, token
  - Validation: email unique, password min 8 chars

- `POST /api/v1/auth/login` - User login
  - Request: email, password
  - Response: user, token
  - Rate limiting: 5 attempts per minute

- `POST /api/v1/auth/logout` - User logout
  - Headers: Authorization Bearer token
  - Response: success message

- `POST /api/v1/auth/refresh` - Refresh token
  - Headers: Authorization Bearer token
  - Response: new token

- `POST /api/v1/auth/forgot-password` - Request password reset
  - Request: email
  - Response: success message

- `POST /api/v1/auth/reset-password` - Reset password
  - Request: token, email, password, password_confirmation
  - Response: success message

### User Endpoints
- `GET /api/v1/users/me` - Get current user
  - Headers: Authorization Bearer token
  - Response: user with organisation and roles

- `PUT /api/v1/users/me` - Update current user profile
  - Headers: Authorization Bearer token
  - Request: name, profile_picture (optional)
  - Response: updated user

- `PUT /api/v1/users/me/password` - Change password
  - Headers: Authorization Bearer token
  - Request: current_password, password, password_confirmation
  - Response: success message

### Organisation Endpoints
- `GET /api/v1/organisations` - List organisations
  - Headers: Authorization Bearer token
  - Query params: parent_id (optional), type (optional)
  - Response: paginated organisations
  - Filtering: By user's organisation hierarchy

- `POST /api/v1/organisations` - Create organisation (admin only)
  - Headers: Authorization Bearer token
  - Request: name, parent_id, type, description
  - Response: created organisation

- `GET /api/v1/organisations/{id}` - Get organisation details
  - Headers: Authorization Bearer token
  - Response: organisation with users and children

- `PUT /api/v1/organisations/{id}` - Update organisation (admin only)
  - Headers: Authorization Bearer token
  - Request: name, description
  - Response: updated organisation

- `GET /api/v1/organisations/{id}/users` - List users in organisation
  - Headers: Authorization Bearer token
  - Response: paginated users

### Role Management Endpoints
- `POST /api/v1/users/{id}/roles` - Assign role to user (admin only)
  - Headers: Authorization Bearer token
  - Request: role_id
  - Response: success message
  - Validation: Admin can only assign roles at or below their level

## Frontend Design

### Authentication Pages
- **Login Page** (`AuthLogin.vue`)
  - Email and password fields
  - "Forgot password" link
  - "Register" link
  - Form validation
  - Error handling

- **Register Page** (`AuthRegister.vue`)
  - Email, password, password confirmation, name fields
  - Organisation selection (if applicable)
  - Form validation
  - Success redirect to login

- **Forgot Password Page** (`AuthForgotPassword.vue`)
  - Email field
  - Submit button
  - Success message

- **Reset Password Page** (`AuthResetPassword.vue`)
  - Token validation
  - New password fields
  - Submit button

### User Profile Page
- **Profile View** (`UserProfile.vue`)
  - Display user information
  - Edit button
  - Profile picture display
  - Organisation information
  - Role information

- **Profile Edit** (`UserProfileEdit.vue`)
  - Name field
  - Profile picture upload
  - Save/Cancel buttons
  - Password change link

### Organisation Management (Admin)
- **Organisation List** (`OrganisationList.vue`)
  - Tree view of organisations
  - Create button
  - Edit/Delete actions
  - User count per organisation

- **Organisation Form** (`OrganisationForm.vue`)
  - Name, type, description fields
  - Parent organisation selector
  - Save/Cancel buttons
  - Validation

- **User Role Assignment** (`UserRoleAssignment.vue`)
  - User selector
  - Role selector
  - Assign button
  - Current roles display

## Testing Strategy

### Backend Tests
- **Feature Tests**:
  - Authentication flow (register, login, logout)
  - Password reset flow
  - User profile update
  - Organisation CRUD operations
  - Role assignment
  - Role-based access control

- **Unit Tests**:
  - Model relationships
  - Service class methods
  - Middleware logic

### Frontend Tests
- **Component Tests**:
  - Login form validation
  - Register form validation
  - Profile form submission
  - Organisation form validation

- **E2E Tests**:
  - Complete authentication flow
  - User profile update flow
  - Organisation creation flow (admin)

## Performance Optimization
- **Database Indexes**: On email, organisation_id, role
- **Caching**: Organisation tree structure (Redis, 1 hour TTL)
- **Eager Loading**: Load relationships efficiently
- **Pagination**: For user and organisation lists

## Security Considerations
- **Password Hashing**: bcrypt with cost factor 10
- **Token Expiration**: 15 minutes access token, 7 days refresh token
- **Rate Limiting**: 5 login attempts per minute
- **CSRF Protection**: For form submissions
- **Role Validation**: Server-side validation of role assignments
- **Organisation Hierarchy**: Prevent circular references

## Risk Mitigation
- **Technical Risks**:
  - Token expiration handling → Implement refresh token flow
  - Organisation circular references → Add validation logic
  - Role permission inheritance → Implement in middleware

- **Scope Risks**:
  - Feature creep → Strictly follow spec.md
  - Over-engineering → Keep it simple, MVP focus

## Dependencies
- **External**: Laravel Sanctum package
- **Internal**: None (this is the foundation epic)

## Success Criteria
- [ ] Users can register and authenticate
- [ ] Password reset works
- [ ] Users can manage their profiles
- [ ] Admins can manage organisations
- [ ] Role-based access control works
- [ ] All tests passing
- [ ] API documentation complete
- [ ] Performance benchmarks met

