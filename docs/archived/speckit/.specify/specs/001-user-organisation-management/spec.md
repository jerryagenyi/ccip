# Feature Specification: User & Organisation Management

## Overview
Implement multi-tier role-based user and organisation management system with hierarchical permissions and self-service profile management. This is the foundation for all other features in CCIP, providing authentication, authorization, and organisational structure.

## User Stories

### US-001: User Registration & Authentication
- **As a** new user
- **I want to** register and authenticate
- **So that** I can access the platform

**Acceptance Criteria:**
- [ ] User can register with email and password
- [ ] Email verification required before account activation
- [ ] Password reset functionality via email
- [ ] JWT token-based authentication via Laravel Sanctum
- [ ] Session management with token refresh
- [ ] Logout functionality

### US-002: Role-Based Access Control
- **As a** system administrator
- **I want to** assign roles to users
- **So that** they have appropriate permissions

**Acceptance Criteria:**
- [ ] Four role levels: Super Admin, Admin, Sub-admin, User
- [ ] Role-based permissions enforced at API level (middleware)
- [ ] Role-based permissions enforced at UI level (component guards)
- [ ] Role assignment by higher-level admins only
- [ ] Permission inheritance (Super Admin > Admin > Sub-admin > User)
- [ ] Role change audit trail

### US-003: Organisation Hierarchy
- **As a** Super Admin
- **I want to** create and manage organisations in a hierarchy
- **So that** the system reflects real-world structure

**Acceptance Criteria:**
- [ ] Create organisations with parent-child relationships
- [ ] Select organisation category (government, nonprofit, civil_service) when creating
- [ ] Select hierarchy level (federal, state, local) - required for government, optional for nonprofit/civil_service
- [ ] Assign users to organisations
- [ ] View organisation tree structure
- [ ] Edit organisation details (by authorised users)
- [ ] Delete organisations (with cascade handling)
- [ ] Organisation-based data filtering
- [ ] Link existing organisations to new parent organisations (e.g., when a state organisation exists before a federal organisation, the federal can link the state as a child)
- [ ] Validate hierarchy when linking (prevent circular references, ensure type compatibility)
- [ ] Allow cross-category hierarchies (e.g., nonprofit can be linked to government organisation when collaborating)

### US-004: User Profile Management
- **As a** user
- **I want to** manage my profile
- **So that** my information is up to date

**Acceptance Criteria:**
- [ ] View own profile information
- [ ] Edit own profile (name, contact info)
- [ ] Upload profile picture
- [ ] Default profile picture: Abstract AI-generated avatars from [UI Faces](https://www.uifaces.co/category/abstract) are used when no custom profile picture is uploaded
- [ ] Update contact information
- [ ] Change password
- [ ] View activity history (own activities)

### US-005: Transfer Ownership and Admin Rights
- **As a** Super Admin
- **I want to** transfer ownership and admin rights between organisations
- **So that** organisations can merge, adopt movements, or restructure seamlessly

**Acceptance Criteria:**
- [ ] Transfer organisation ownership from one user to another
- [ ] Transfer super admin rights between organisations
- [ ] Maintain audit trail of ownership transfers
- [ ] Notify affected users when ownership changes
- [ ] Validate transfer permissions (only Super Admin can transfer)
- [ ] Handle cascading role updates when ownership transfers
- [ ] Support scenarios where small CSOs start movements that get adopted by larger organisations

### US-006: Link Organisations Retroactively
- **As a** Super Admin
- **I want to** link an existing organisation to a new parent organisation
- **So that** organisations that started independently can be integrated into a hierarchy later

**Acceptance Criteria:**
- [ ] Link an existing organisation (e.g., state) to a new parent organisation (e.g., federal)
- [ ] Update organisation hierarchy when linking
- [ ] Preserve all existing data and users when linking
- [ ] Validate that linking maintains hierarchy integrity (no circular references)
- [ ] Support scenario: state organisation exists before federal, federal can link state as child
- [ ] Update permissions and access automatically when organisations are linked
- [ ] Maintain audit trail of organisation linking operations

### US-007: Navigation System
- **As a** user
- **I want to** navigate the application using appropriate navigation for my device
- **So that** I can access all features efficiently

**Acceptance Criteria:**
- [ ] Desktop navigation: Fixed sidebar with all main sections
  - Dashboard, Activities, Reports, Team, Organisations, Notifications, Profile, Settings, Announcements
  - Collapsible sidebar (icon-only mode)
  - Active state indicators
  - Badge notifications where applicable
  - Role-based visibility (show/hide items based on permissions)
- [ ] Mobile navigation: Bottom navigation bar (mobile only)
  - Fixed at bottom of viewport
  - 5 primary tabs: Dashboard, Activities, Reports, Team, Profile
  - Active state indicators
  - Badge notifications on relevant tabs
  - Hidden on desktop (use sidebar instead)
  - Responsive breakpoint: Show on < 768px or < 1024px
- [ ] Navigation accessibility:
  - Proper ARIA labels
  - Keyboard navigation support
  - Touch target size: minimum 44x44px
  - Smooth transitions
- [ ] Navigation integration:
  - Use Vue Router for navigation
  - Update active state based on current route
  - Ensure content area has proper padding to prevent overlap with bottom nav

## Technical Requirements

### Database Schema
- **users** table:
  - id (bigint, primary key)
  - email (varchar, unique, not null)
  - password (varchar, hashed)
  - name (varchar, not null)
  - role (enum: super_admin, admin, sub_admin, user)
  - organisation_id (bigint, foreign key)
  - email_verified_at (timestamp, nullable)
  - profile_picture (varchar, nullable) - Default: abstract AI avatars from https://www.uifaces.co/category/abstract
  - created_at, updated_at

- **organisations** table:
  - id (bigint, primary key)
  - name (varchar, not null)
  - parent_id (bigint, nullable, foreign key)
  - category (enum: government, nonprofit, civil_service) - **NEW**: Organisation sector/category
  - type (enum: federal, state, local, nullable) - Hierarchy level (required for government, optional for others)
  - description (text, nullable)
  - created_at, updated_at

- **roles** table:
  - id (bigint, primary key)
  - name (varchar, unique)
  - permissions (json)
  - created_at, updated_at

- **user_roles** pivot table:
  - user_id (bigint, foreign key)
  - role_id (bigint, foreign key)
  - assigned_by (bigint, foreign key)
  - assigned_at (timestamp)

### API Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update current user profile
- `PUT /api/v1/users/me/password` - Change password
- `GET /api/v1/organisations` - List organisations (filtered by role)
- `POST /api/v1/organisations` - Create organisation (admin only)
- `GET /api/v1/organisations/{id}` - Get organisation details
- `PUT /api/v1/organisations/{id}` - Update organisation (admin only)
- `GET /api/v1/organisations/{id}/users` - List users in organisation
- `POST /api/v1/users/{id}/roles` - Assign role to user (admin only)
- `POST /api/v1/organisations/{id}/link` - Link organisation to parent (Super Admin only)
- `POST /api/v1/organisations/{id}/transfer-ownership` - Transfer organisation ownership (Super Admin only)
- `POST /api/v1/organisations/{id}/transfer-admin` - Transfer admin rights (Super Admin only)

### Frontend Components
- `AuthLogin.vue` - Login page component
- `AuthRegister.vue` - Registration page component
- `AuthForgotPassword.vue` - Password reset request page
- `AuthResetPassword.vue` - Password reset page
- `UserProfile.vue` - User profile page
- `OrganisationList.vue` - Organisation listing (admin) - Filterable by category
- `OrganisationForm.vue` - Organisation create/edit form (admin) - Includes category selection (government/nonprofit/civil_service) and hierarchy level
- `OrganisationLink.vue` - Link organisation to parent (Super Admin)
- `OrganisationTransfer.vue` - Transfer ownership/admin rights (Super Admin)
- `UserRoleAssignment.vue` - Role assignment interface (admin)
- `DesktopSidebar.vue` - Desktop navigation sidebar
- `MobileBottomNav.vue` - Mobile bottom navigation bar
- `useAuthStore.ts` - Pinia store for authentication
- `useUserStore.ts` - Pinia store for user data
- `useOrganisationStore.ts` - Pinia store for organisations

## Dependencies
- Laravel Sanctum for authentication
- Vue Router for navigation
- Pinia for state management
- Email service for verification and password reset

## Organisation Category and Cross-Sector Collaboration

### Category System
- **Government**: Public sector organisations (federal, state, local levels)
- **Nonprofit**: Non-governmental organisations, CSOs, NGOs
- **Civil Service**: Government service organisations, public service departments

### Cross-Sector Collaboration
- **Cross-category hierarchies are supported**: A nonprofit can be linked as a child of a government organisation when they collaborate
- **Example**: A local CSO working with a state health department can be linked under the state organisation
- **Flexible hierarchy**: Nonprofits and civil service organisations can have their own hierarchies (national > regional > local) or be linked to government organisations
- **No conflicts**: Category is informational and doesn't restrict collaboration - it helps identify organisation type while allowing flexible relationships

### Validation Rules
- Government organisations **must** have a hierarchy level (federal, state, local)
- Nonprofit and civil service organisations **may** have a hierarchy level (optional)
- Cross-category parent-child relationships are allowed and validated like same-category relationships

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

