# Phase 1: Detailed Sprint Plans

**Version:** 1.0  
**Date:** December 15, 2025  
**Status:** Ready for Sprint Planning  
**Prepared By:** Winston (Architect) + Bob (Scrum Master)

---

## Overview

Phase 1 spans **10 weeks** (5 sprints) and establishes the foundation for CCIP. This document provides detailed sprint plans with specific tasks, assignments, and acceptance criteria for each sprint.

**Phase 1 Epics:**
- Epic 001: User & Organisation Management (Sprints 1-2)
- Epic 008: Pattern Database (Sprints 1-2, parallel with Epic 001)
- Epic 002: Activity Tracking & Reporting (Sprints 3-4)
- Epic 004: Communication System (Sprint 5)

**Team:**
- Backend Developer (1 FTE)
- Frontend Developer (1 FTE)
- QA Engineer (0.5 FTE)

---

## Sprint 1: Foundation Setup - Part 1 (Weeks 1-2)

**Sprint Goal:** Establish authentication system and begin pattern database foundation

**Sprint Duration:** 2 weeks  
**Sprint Start:** Week 1, Day 1  
**Sprint End:** Week 2, Day 10

### Epic 001: User & Organisation Management (Part 1)

#### Backend Tasks (Backend Dev)

**Week 1: Database & Models**

- [ ] **DB-001**: Create organisations table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_organisations_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Table created with id, name, parent_id, type, description, timestamps
  - **Dependencies:** None

- [ ] **DB-002**: Create roles table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_roles_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Table created with id, name, permissions (JSON), description, timestamps
  - **Dependencies:** None

- [ ] **DB-003**: Create users table migration (extend Laravel default)
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_users_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Users table extended with role, organisation_id, profile_picture
  - **Dependencies:** DB-001

- [ ] **DB-004**: Create user_roles pivot table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_user_roles_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Pivot table with user_id, role_id, assigned_by, assigned_at
  - **Dependencies:** DB-002, DB-003

- [ ] **DB-005**: Create database indexes
  - **File:** Update migrations with indexes
  - **Estimate:** 0.5 hours
  - **Acceptance:** Indexes on email, organisation_id, role, parent_id
  - **Dependencies:** All table migrations

- [ ] **BE-001**: Create Organisation model
  - **File:** `backend/app/Models/Organisation.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with relationships (parent, children, users)
  - **Dependencies:** DB-001

- [ ] **BE-002**: Create Role model
  - **File:** `backend/app/Models/Role.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with user_roles relationship
  - **Dependencies:** DB-002

- [ ] **BE-003**: Update User model
  - **File:** `backend/app/Models/User.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Organisation, roles relationships, role checking methods
  - **Dependencies:** DB-003

- [ ] **BE-004**: Create model factories
  - **File:** `backend/database/factories/OrganisationFactory.php`, `RoleFactory.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Factories for testing
  - **Dependencies:** All models

**Week 1 Total Backend:** ~9 hours

**Week 2: Authentication**

- [ ] **BE-005**: Install and configure Laravel Sanctum
  - **File:** `backend/composer.json`, `backend/config/sanctum.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Package installed, token expiration configured
  - **Dependencies:** None

- [ ] **BE-006**: Create RegisterRequest form validation
  - **File:** `backend/app/Http/Requests/Auth/RegisterRequest.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Validates email, password, name, organisation_id
  - **Dependencies:** None

- [ ] **BE-007**: Create LoginRequest form validation
  - **File:** `backend/app/Http/Requests/Auth/LoginRequest.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** Validates email, password
  - **Dependencies:** None

- [ ] **BE-008**: Create AuthController - register method
  - **File:** `backend/app/Http/Controllers/AuthController.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Register user, create token, send verification email
  - **Dependencies:** BE-003, BE-006

- [ ] **BE-009**: Create AuthController - login method
  - **File:** `backend/app/Http/Controllers/AuthController.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Authenticate user, create token, return user data
  - **Dependencies:** BE-003, BE-007

- [ ] **BE-010**: Create AuthController - logout method
  - **File:** `backend/app/Http/Controllers/AuthController.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** Revoke current token
  - **Dependencies:** BE-005

- [ ] **BE-011**: Create AuthController - refresh method
  - **File:** `backend/app/Http/Controllers/AuthController.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Refresh access token
  - **Dependencies:** BE-005

- [ ] **BE-012**: Create ForgotPasswordRequest form validation
  - **File:** `backend/app/Http/Requests/Auth/ForgotPasswordRequest.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** Validates email
  - **Dependencies:** None

- [ ] **BE-013**: Create ResetPasswordRequest form validation
  - **File:** `backend/app/Http/Requests/Auth/ResetPasswordRequest.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** Validates token, email, password, password_confirmation
  - **Dependencies:** None

- [ ] **BE-014**: Create AuthController - forgotPassword method
  - **File:** `backend/app/Http/Controllers/AuthController.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Send password reset email
  - **Dependencies:** BE-012

- [ ] **BE-015**: Create AuthController - resetPassword method
  - **File:** `backend/app/Http/Controllers/AuthController.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Reset password, invalidate token
  - **Dependencies:** BE-013

- [ ] **BE-016**: Create Authenticate middleware
  - **File:** `backend/app/Http/Middleware/Authenticate.php` (update)
  - **Estimate:** 1 hour
  - **Acceptance:** Handle Sanctum authentication
  - **Dependencies:** BE-005

- [ ] **BE-017**: Add authentication routes
  - **File:** `backend/routes/api.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** POST /auth/register, /auth/login, /auth/logout, /auth/refresh, /auth/forgot-password, /auth/reset-password
  - **Dependencies:** BE-008 through BE-015

**Week 2 Total Backend:** ~13 hours

#### Frontend Tasks (Frontend Dev)

**Week 1: Setup & Store**

- [ ] **FE-001**: Install and configure Vue Router
  - **File:** `frontend/src/router/index.ts`
  - **Estimate:** 1 hour
  - **Acceptance:** Router set up with routes
  - **Dependencies:** None

- [ ] **FE-002**: Create Pinia auth store
  - **File:** `frontend/src/stores/useAuthStore.ts`
  - **Estimate:** 2 hours
  - **Acceptance:** State (user, token), actions (login, logout, register), getters
  - **Dependencies:** None

- [ ] **FE-003**: Create API service with Axios
  - **File:** `frontend/src/services/api.ts`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Axios instance, request/response interceptors, token management
  - **Dependencies:** None

- [ ] **FE-004**: Create route guards
  - **File:** `frontend/src/router/guards.ts`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Auth guard, guest guard, role-based guard
  - **Dependencies:** FE-001, FE-002

**Week 1 Total Frontend:** ~6 hours

**Week 2: Auth Components**

- [ ] **FE-005**: Create AuthLogin component
  - **File:** `frontend/src/pages/AuthLogin.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Login form, validation, error handling, redirect
  - **Dependencies:** FE-002, FE-003

- [ ] **FE-006**: Create AuthRegister component
  - **File:** `frontend/src/pages/AuthRegister.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Registration form, validation, success handling
  - **Dependencies:** FE-002, FE-003

- [ ] **FE-007**: Create AuthForgotPassword component
  - **File:** `frontend/src/pages/AuthForgotPassword.vue`
  - **Estimate:** 2 hours
  - **Acceptance:** Forgot password form, success message
  - **Dependencies:** FE-003

- [ ] **FE-008**: Create AuthResetPassword component
  - **File:** `frontend/src/pages/AuthResetPassword.vue`
  - **Estimate:** 2 hours
  - **Acceptance:** Reset password form, token validation
  - **Dependencies:** FE-003

**Week 2 Total Frontend:** ~10 hours

#### Testing Tasks (QA Engineer)

- [ ] **TEST-001**: Write feature test for registration
  - **File:** `backend/tests/Feature/Auth/RegistrationTest.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Test successful registration, validation errors, email uniqueness
  - **Dependencies:** BE-008

- [ ] **TEST-002**: Write feature test for login
  - **File:** `backend/tests/Feature/Auth/LoginTest.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Test successful login, invalid credentials, token generation
  - **Dependencies:** BE-009

- [ ] **TEST-003**: Write feature test for password reset
  - **File:** `backend/tests/Feature/Auth/PasswordResetTest.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Test forgot password flow, reset password flow, token validation
  - **Dependencies:** BE-014, BE-015

**Total Testing:** ~5 hours

### Epic 008: Pattern Database (Part 1) - Parallel Track

#### Backend Tasks (Backend Dev - Parallel with Epic 001)

**Week 1: Database Schema**

- [ ] **DB-008-001**: Create semiotic_patterns table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_semiotic_patterns_table.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Table with all required fields, JSONB for context_metadata, pgvector support
  - **Dependencies:** None (but requires pgvector extension)

- [ ] **DB-008-002**: Create pattern_contexts table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_pattern_contexts_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Table with pattern_id foreign key, geographic/demographic context fields
  - **Dependencies:** DB-008-001

- [ ] **DB-008-003**: Create pattern_validations table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_pattern_validations_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Table with pattern_id, validator_id, confidence_score, notes
  - **Dependencies:** DB-008-001, Epic 001 (users)

- [ ] **DB-008-004**: Create pattern_evidence table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_pattern_evidence_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Table with pattern_id, source_type, source_reference, effectiveness_metrics
  - **Dependencies:** DB-008-001

- [ ] **DB-008-005**: Install and configure pgvector extension
  - **File:** Database migration
  - **Estimate:** 1 hour
  - **Acceptance:** pgvector extension installed, vector columns configured
  - **Dependencies:** PostgreSQL setup

**Week 1 Total Backend (Epic 008):** ~7 hours

**Week 2: Models & Basic API**

- [ ] **BE-008-001**: Create SemioticPattern model
  - **File:** `backend/app/Models/SemioticPattern.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Model with relationships, JSONB accessors, vector search methods
  - **Dependencies:** DB-008-001

- [ ] **BE-008-002**: Create PatternContext model
  - **File:** `backend/app/Models/PatternContext.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with pattern relationship
  - **Dependencies:** DB-008-002

- [ ] **BE-008-003**: Create PatternValidation model
  - **File:** `backend/app/Models/PatternValidation.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with pattern and validator relationships
  - **Dependencies:** DB-008-003

- [ ] **BE-008-004**: Create PatternEvidence model
  - **File:** `backend/app/Models/PatternEvidence.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with pattern relationship
  - **Dependencies:** DB-008-004

- [ ] **BE-008-005**: Create PatternRequest form validation
  - **File:** `backend/app/Http/Requests/Pattern/PatternRequest.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Validates all pattern fields, context metadata
  - **Dependencies:** None

- [ ] **BE-008-006**: Create PatternController - CRUD methods
  - **File:** `backend/app/Http/Controllers/PatternController.php`
  - **Estimate:** 4 hours
  - **Acceptance:** index, store, show, update, destroy methods
  - **Dependencies:** BE-008-001, BE-008-005

- [ ] **BE-008-007**: Add pattern routes
  - **File:** `backend/routes/api.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** RESTful routes for patterns
  - **Dependencies:** BE-008-006

**Week 2 Total Backend (Epic 008):** ~11 hours

### Sprint 1 Acceptance Criteria

**Epic 001:**
- [ ] Users can register with email and password
- [ ] Users can login and receive authentication token
- [ ] Users can logout
- [ ] Password reset flow works end-to-end
- [ ] All API endpoints return proper responses
- [ ] Frontend auth pages render and function correctly

**Epic 008:**
- [ ] Pattern database schema created with all tables
- [ ] pgvector extension installed and configured
- [ ] Pattern CRUD API endpoints functional
- [ ] Models created with proper relationships

**Sprint 1 Definition of Done:**
- [ ] All tasks completed and code reviewed
- [ ] Unit tests written and passing
- [ ] Integration tests for auth flow passing
- [ ] Documentation updated
- [ ] No critical bugs
- [ ] Code deployed to development environment

---

## Sprint 2: Foundation Setup - Part 2 (Weeks 3-4)

**Sprint Goal:** Complete organisation management and pattern database admin UI

**Sprint Duration:** 2 weeks  
**Sprint Start:** Week 3, Day 1  
**Sprint End:** Week 4, Day 10

### Epic 001: User & Organisation Management (Part 2)

#### Backend Tasks (Backend Dev)

**Week 3: Organisation Management**

- [ ] **BE-018**: Create OrganisationRequest form validation
  - **File:** `backend/app/Http/Requests/Organisation/OrganisationRequest.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Validates name, type, parent_id, hierarchy_level
  - **Dependencies:** None

- [ ] **BE-019**: Create OrganisationController - CRUD methods
  - **File:** `backend/app/Http/Controllers/OrganisationController.php`
  - **Estimate:** 4 hours
  - **Acceptance:** index, store, show, update, destroy methods with hierarchy validation
  - **Dependencies:** BE-001, BE-018

- [ ] **BE-020**: Create OrganisationService for hierarchy management
  - **File:** `backend/app/Services/OrganisationService.php`
  - **Estimate:** 3 hours
  - **Acceptance:** Methods for linking organisations, validating hierarchy, preventing cycles
  - **Dependencies:** BE-001

- [ ] **BE-021**: Create RoleController
  - **File:** `backend/app/Http/Controllers/RoleController.php`
  - **Estimate:** 2 hours
  - **Acceptance:** index, show methods (roles are predefined)
  - **Dependencies:** BE-002

- [ ] **BE-022**: Create UserController - profile management
  - **File:** `backend/app/Http/Controllers/UserController.php`
  - **Estimate:** 3 hours
  - **Acceptance:** show, update methods for user profile
  - **Dependencies:** BE-003

- [ ] **BE-023**: Create UserController - role assignment
  - **File:** `backend/app/Http/Controllers/UserController.php`
  - **Estimate:** 2 hours
  - **Acceptance:** assignRole, removeRole methods with permission checks
  - **Dependencies:** BE-003, BE-002

- [ ] **BE-024**: Add organisation and user routes
  - **File:** `backend/routes/api.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** RESTful routes for organisations and users
  - **Dependencies:** BE-019, BE-022

**Week 3 Total Backend:** ~15.5 hours

**Week 4: Role-Based Permissions**

- [ ] **BE-025**: Create RoleBasedAccess middleware
  - **File:** `backend/app/Http/Middleware/RoleBasedAccess.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Middleware checks user role, enforces permissions
  - **Dependencies:** BE-003

- [ ] **BE-026**: Create PermissionService
  - **File:** `backend/app/Services/PermissionService.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Methods for checking permissions, role hierarchy
  - **Dependencies:** BE-002, BE-003

- [ ] **BE-027**: Apply middleware to protected routes
  - **File:** `backend/routes/api.php`
  - **Estimate:** 1 hour
  - **Acceptance:** All protected routes have appropriate middleware
  - **Dependencies:** BE-025

- [ ] **BE-028**: Create seeders for roles and initial organisations
  - **File:** `backend/database/seeders/RoleSeeder.php`, `OrganisationSeeder.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Seeders create 4 roles and sample organisations
  - **Dependencies:** All models

**Week 4 Total Backend:** ~7 hours

#### Frontend Tasks (Frontend Dev)

**Week 3: Organisation Management UI**

- [ ] **FE-009**: Create OrganisationList component
  - **File:** `frontend/src/pages/OrganisationList.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** List organisations, show hierarchy, filter/search
  - **Dependencies:** FE-003

- [ ] **FE-010**: Create OrganisationForm component
  - **File:** `frontend/src/components/OrganisationForm.vue`
  - **Estimate:** 5 hours
  - **Acceptance:** Create/edit organisation, parent selection, type selection
  - **Dependencies:** FE-003

- [ ] **FE-011**: Create OrganisationTree component
  - **File:** `frontend/src/components/OrganisationTree.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** Visual tree view of organisation hierarchy
  - **Dependencies:** FE-003

**Week 3 Total Frontend:** ~13 hours

**Week 4: User Management UI**

- [ ] **FE-012**: Create UserList component
  - **File:** `frontend/src/pages/UserList.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** List users, filter by organisation/role, search
  - **Dependencies:** FE-003

- [ ] **FE-013**: Create UserProfile component
  - **File:** `frontend/src/pages/UserProfile.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** View/edit user profile, change password
  - **Dependencies:** FE-003

- [ ] **FE-014**: Create RoleAssignment component
  - **File:** `frontend/src/components/RoleAssignment.vue`
  - **Estimate:** 2 hours
  - **Acceptance:** Assign/remove roles from users
  - **Dependencies:** FE-003

- [ ] **FE-015**: Create Dashboard component (basic)
  - **File:** `frontend/src/pages/Dashboard.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** Role-based dashboard view, quick actions
  - **Dependencies:** FE-002, FE-003

**Week 4 Total Frontend:** ~12 hours

### Epic 008: Pattern Database (Part 2) - Admin UI

#### Frontend Tasks (Frontend Dev)

**Week 3: Pattern Management UI**

- [ ] **FE-008-001**: Create PatternList component
  - **File:** `frontend/src/pages/PatternList.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** List patterns, filter by type/status, search
  - **Dependencies:** FE-003

- [ ] **FE-008-002**: Create PatternForm component
  - **File:** `frontend/src/components/PatternForm.vue`
  - **Estimate:** 6 hours
  - **Acceptance:** Create/edit pattern, context metadata form, evidence attachment
  - **Dependencies:** FE-003

- [ ] **FE-008-003**: Create PatternDetail component
  - **File:** `frontend/src/pages/PatternDetail.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** View pattern details, validation history, evidence
  - **Dependencies:** FE-003

**Week 3 Total Frontend (Epic 008):** ~13 hours

**Week 4: Pattern Validation UI**

- [ ] **FE-008-004**: Create PatternValidation component
  - **File:** `frontend/src/components/PatternValidation.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** Validation form, confidence scoring, expert notes
  - **Dependencies:** FE-003

- [ ] **FE-008-005**: Create PatternSearch component
  - **File:** `frontend/src/components/PatternSearch.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Full-text search, filter by context, results display
  - **Dependencies:** FE-003

- [ ] **FE-008-006**: Seed initial patterns (admin task)
  - **File:** Database seeder or admin UI
  - **Estimate:** 2 hours
  - **Acceptance:** 50+ patterns seeded from research
  - **Dependencies:** BE-008-006

**Week 4 Total Frontend (Epic 008):** ~9 hours

### Sprint 2 Acceptance Criteria

**Epic 001:**
- [ ] Organisations can be created with hierarchy
- [ ] Organisation tree view displays correctly
- [ ] Users can be assigned to organisations
- [ ] Roles can be assigned to users
- [ ] Role-based permissions enforced in UI
- [ ] Basic dashboard shows role-appropriate content

**Epic 008:**
- [ ] Patterns can be created via admin UI
- [ ] Pattern validation workflow functional
- [ ] Pattern search works with filters
- [ ] Initial pattern dataset seeded

**Sprint 2 Definition of Done:**
- [ ] All tasks completed and code reviewed
- [ ] Integration tests for organisation management passing
- [ ] UI components tested and accessible
- [ ] Documentation updated
- [ ] No critical bugs
- [ ] Code deployed to development environment

---

## Sprint 3: Activity Tracking - Part 1 (Weeks 5-6)

**Sprint Goal:** Implement core activity creation and management

**Sprint Duration:** 2 weeks  
**Sprint Start:** Week 5, Day 1  
**Sprint End:** Week 6, Day 10

### Epic 002: Activity Tracking & Reporting (Part 1)

#### Backend Tasks (Backend Dev)

**Week 5: Database & Models**

- [ ] **DB-010**: Create tags table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_tags_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Table with id, name, description, timestamps
  - **Dependencies:** None

- [ ] **DB-011**: Create report_templates table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_report_templates_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Table with organisation_id, name, fields (JSON), timestamps
  - **Dependencies:** Epic 001 (organisations)

- [ ] **DB-012**: Create activities table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activities_table.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Table with all activity fields, status, organisation_id, user_id
  - **Dependencies:** Epic 001 (organisations, users), DB-011

- [ ] **DB-013**: Create activity_tags pivot table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activity_tags_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Pivot table with activity_id, tag_id
  - **Dependencies:** DB-010, DB-012

- [ ] **BE-039**: Create Tag model
  - **File:** `backend/app/Models/Tag.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with activities relationship
  - **Dependencies:** DB-010

- [ ] **BE-040**: Create ReportTemplate model
  - **File:** `backend/app/Models/ReportTemplate.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Model with organisation relationship
  - **Dependencies:** DB-011

- [ ] **BE-041**: Create Activity model
  - **File:** `backend/app/Models/Activity.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Model with all relationships, status workflow methods
  - **Dependencies:** DB-012

**Week 5 Total Backend:** ~10 hours

**Week 6: Activity API**

- [ ] **BE-042**: Create ActivityRequest form validation
  - **File:** `backend/app/Http/Requests/Activity/ActivityRequest.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Validates all activity fields, date validation
  - **Dependencies:** None

- [ ] **BE-043**: Create ActivityController - index method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 2 hours
  - **Acceptance:** List activities with filtering, pagination, organisation scope
  - **Dependencies:** BE-041

- [ ] **BE-044**: Create ActivityController - store method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 2.5 hours
  - **Acceptance:** Create activity, handle tags, save as draft
  - **Dependencies:** BE-042, BE-041

- [ ] **BE-045**: Create ActivityController - show method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Return activity with relationships
  - **Dependencies:** BE-041

- [ ] **BE-046**: Create ActivityController - update method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Update activity (only if draft), handle tags
  - **Dependencies:** BE-042, BE-041

- [ ] **BE-047**: Create ActivityController - destroy method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Delete activity (only if draft)
  - **Dependencies:** BE-041

- [ ] **BE-048**: Create ActivityController - submit method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Change status to submitted, lock from editing
  - **Dependencies:** BE-041

- [ ] **BE-049**: Add activity routes
  - **File:** `backend/routes/api.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** RESTful routes for activities
  - **Dependencies:** All controller methods

**Week 6 Total Backend:** ~12 hours

#### Frontend Tasks (Frontend Dev)

**Week 5: Activity Store & Components**

- [ ] **FE-019**: Create Pinia activity store
  - **File:** `frontend/src/stores/useActivityStore.ts`
  - **Estimate:** 2 hours
  - **Acceptance:** State, actions for CRUD operations, getters
  - **Dependencies:** None

- [ ] **FE-020**: Create ActivityForm component
  - **File:** `frontend/src/components/ActivityForm.vue`
  - **Estimate:** 5 hours
  - **Acceptance:** Form with all fields, validation, draft/submit buttons
  - **Dependencies:** FE-019

- [ ] **FE-021**: Create ActivityList component
  - **File:** `frontend/src/pages/ActivityList.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** List activities, filter by status/type, pagination
  - **Dependencies:** FE-019

**Week 5 Total Frontend:** ~11 hours

**Week 6: Activity Detail & Status**

- [ ] **FE-022**: Create ActivityDetail component
  - **File:** `frontend/src/pages/ActivityDetail.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** View activity details, status display, timeline
  - **Dependencies:** FE-019

- [ ] **FE-023**: Create ActivityStatusBadge component
  - **File:** `frontend/src/components/ActivityStatusBadge.vue`
  - **Estimate:** 1 hour
  - **Acceptance:** Visual status indicator with colours
  - **Dependencies:** None

- [ ] **FE-024**: Create ActivityTimeline component
  - **File:** `frontend/src/components/ActivityTimeline.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Timeline view of activity status changes
  - **Dependencies:** FE-019

**Week 6 Total Frontend:** ~8 hours

### Sprint 3 Acceptance Criteria

**Epic 002 (Part 1):**
- [ ] Activities can be created with all required fields
- [ ] Activities can be saved as draft
- [ ] Activities can be submitted (status change)
- [ ] Activities can be listed with filtering
- [ ] Activity detail view shows all information
- [ ] Activity timeline displays status history

**Sprint 3 Definition of Done:**
- [ ] All tasks completed and code reviewed
- [ ] Integration tests for activity CRUD passing
- [ ] UI components tested
- [ ] Documentation updated
- [ ] No critical bugs
- [ ] Code deployed to development environment

---

## Sprint 4: Activity Tracking - Part 2 (Weeks 7-8)

**Sprint Goal:** Implement evidence uploads, GPS tagging, and effectiveness metrics

**Sprint Duration:** 2 weeks  
**Sprint Start:** Week 7, Day 1  
**Sprint End:** Week 8, Day 10

### Epic 002: Activity Tracking & Reporting (Part 2)

#### Backend Tasks (Backend Dev)

**Week 7: Evidence Uploads**

- [ ] **DB-014**: Create activity_evidence table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activity_evidence_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Table with activity_id, file_path, file_type, file_size, uploaded_by
  - **Dependencies:** Task DB-012, Epic 001 (users)

- [ ] **BE-050**: Create ActivityEvidence model
  - **File:** `backend/app/Models/ActivityEvidence.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with activity relationship
  - **Dependencies:** DB-014

- [ ] **BE-051**: Configure S3 storage
  - **File:** `backend/config/filesystems.php`
  - **Estimate:** 1 hour
  - **Acceptance:** MinIO/S3 configuration, disk setup
  - **Dependencies:** None

- [ ] **BE-052**: Create FileUploadService
  - **File:** `backend/app/Services/FileUploadService.php`
  - **Estimate:** 3 hours
  - **Acceptance:** Upload files, validate types/sizes, generate signed URLs
  - **Dependencies:** BE-051

- [ ] **BE-053**: Create EvidenceUploadRequest form validation
  - **File:** `backend/app/Http/Requests/Activity/EvidenceUploadRequest.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Validates file type, size, activity_id
  - **Dependencies:** None

- [ ] **BE-054**: Create ActivityController - uploadEvidence method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 2.5 hours
  - **Acceptance:** Upload file, store in S3, create evidence record
  - **Dependencies:** BE-052, BE-053

- [ ] **BE-055**: Create ActivityController - deleteEvidence method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Delete evidence file and record
  - **Dependencies:** BE-050

- [ ] **BE-056**: Create signed URL generation for file access
  - **File:** `backend/app/Services/FileUploadService.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Generate temporary signed URLs for file access
  - **Dependencies:** BE-052

**Week 7 Total Backend:** ~12.5 hours

**Week 8: GPS & Effectiveness Metrics**

- [ ] **DB-015**: Add GPS fields to activities table migration
  - **File:** Update activities migration
  - **Estimate:** 0.5 hours
  - **Acceptance:** latitude, longitude, location_accuracy fields
  - **Dependencies:** DB-012

- [ ] **DB-016**: Create activity_effectiveness_metrics table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activity_effectiveness_metrics_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Table with activity_id, understanding_score, compliance_rate, barriers (JSON)
  - **Dependencies:** DB-012

- [ ] **BE-057**: Create ActivityEffectivenessMetric model
  - **File:** `backend/app/Models/ActivityEffectivenessMetric.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with activity relationship
  - **Dependencies:** DB-016

- [ ] **BE-058**: Create ActivityController - updateGPS method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Update GPS coordinates, handle privacy settings
  - **Dependencies:** BE-041

- [ ] **BE-059**: Create ActivityController - recordEffectiveness method
  - **File:** `backend/app/Http/Controllers/ActivityController.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Record effectiveness metrics, validate scores
  - **Dependencies:** BE-057

- [ ] **BE-060**: Add evidence and metrics routes
  - **File:** `backend/routes/api.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** Routes for evidence upload/delete, GPS update, metrics recording
  - **Dependencies:** All controller methods

**Week 8 Total Backend:** ~7 hours

#### Frontend Tasks (Frontend Dev)

**Week 7: File Upload UI**

- [ ] **FE-025**: Create FileUpload component
  - **File:** `frontend/src/components/FileUpload.vue`
  - **Estimate:** 6 hours
  - **Acceptance:** Drag-and-drop upload, file preview, progress indicator
  - **Dependencies:** None

- [ ] **FE-026**: Implement chunked upload support
  - **File:** `frontend/src/components/FileUpload.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Large file chunking, resume on failure
  - **Dependencies:** FE-025

- [ ] **FE-027**: Create EvidenceGallery component
  - **File:** `frontend/src/components/EvidenceGallery.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Display uploaded evidence, preview images, delete option
  - **Dependencies:** FE-025

**Week 7 Total Frontend:** ~12 hours

**Week 8: GPS & Metrics UI**

- [ ] **FE-028**: Create GPSLocationPicker component
  - **File:** `frontend/src/components/GPSLocationPicker.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** Get current location, manual entry, privacy toggle
  - **Dependencies:** Browser geolocation API

- [ ] **FE-029**: Create EffectivenessMetricsForm component
  - **File:** `frontend/src/components/EffectivenessMetricsForm.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** Form for understanding score, compliance rate, barriers
  - **Dependencies:** FE-019

- [ ] **FE-030**: Integrate GPS and metrics into ActivityForm
  - **File:** `frontend/src/components/ActivityForm.vue`
  - **Estimate:** 2 hours
  - **Acceptance:** GPS picker and metrics form in activity creation
  - **Dependencies:** FE-028, FE-029

**Week 8 Total Frontend:** ~10 hours

### Sprint 4 Acceptance Criteria

**Epic 002 (Part 2):**
- [ ] Files can be uploaded as evidence (images, documents, audio, video)
- [ ] File uploads show progress and handle errors
- [ ] Evidence can be previewed and deleted
- [ ] GPS location can be captured automatically or entered manually
- [ ] Effectiveness metrics can be recorded
- [ ] All data persists correctly

**Sprint 4 Definition of Done:**
- [ ] All tasks completed and code reviewed
- [ ] File upload tests passing
- [ ] GPS functionality tested
- [ ] UI components tested
- [ ] Documentation updated
- [ ] No critical bugs
- [ ] Code deployed to development environment

---

## Sprint 5: Communication System (Weeks 9-10)

**Sprint Goal:** Implement internal messaging and notification system

**Sprint Duration:** 2 weeks  
**Sprint Start:** Week 9, Day 1  
**Sprint End:** Week 10, Day 10

### Epic 004: Communication System

#### Backend Tasks (Backend Dev)

**Week 9: Messaging System**

- [ ] **DB-017**: Create messages table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_messages_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Table with sender_id, organisation_id, subject, body, message_type
  - **Dependencies:** Epic 001 (users, organisations)

- [ ] **DB-018**: Create message_recipients table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_message_recipients_table.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Table with message_id, recipient_id, read_at, deleted_at
  - **Dependencies:** DB-017, Epic 001 (users)

- [ ] **BE-076**: Create Message model
  - **File:** `backend/app/Models/Message.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Model with sender, organisation, recipients relationships
  - **Dependencies:** DB-017

- [ ] **BE-077**: Create MessageRecipient model
  - **File:** `backend/app/Models/MessageRecipient.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with message and recipient relationships
  - **Dependencies:** DB-018

- [ ] **BE-078**: Create MessageService
  - **File:** `backend/app/Services/MessageService.php`
  - **Estimate:** 3 hours
  - **Acceptance:** Send message, handle recipients, organisation scoping
  - **Dependencies:** BE-076

- [ ] **BE-079**: Create MessageRequest form validation
  - **File:** `backend/app/Http/Requests/Message/MessageRequest.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Validates subject, body, recipient_ids
  - **Dependencies:** None

- [ ] **BE-080**: Create MessageController
  - **File:** `backend/app/Http/Controllers/MessageController.php`
  - **Estimate:** 4 hours
  - **Acceptance:** index, store, show, update, destroy methods
  - **Dependencies:** BE-078, BE-079

- [ ] **BE-081**: Add broadcast functionality to MessageService
  - **File:** `backend/app/Services/MessageService.php`
  - **Estimate:** 2 hours
  - **Acceptance:** Send to all users in organisation, role-based groups
  - **Dependencies:** BE-078

- [ ] **BE-082**: Add read receipts tracking
  - **File:** `backend/app/Http/Controllers/MessageController.php`
  - **Estimate:** 1.5 hours
  - **Acceptance:** Track when messages are read, who has read
  - **Dependencies:** BE-080

**Week 9 Total Backend:** ~17 hours

**Week 10: Notifications**

- [ ] **DB-019**: Create notifications table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_notifications_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Table with user_id, type, title, body, read_at, data (JSON)
  - **Dependencies:** Epic 001 (users)

- [ ] **DB-020**: Create notification_preferences table migration
  - **File:** `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_notification_preferences_table.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Table with user_id, notification_type, email_enabled, in_app_enabled
  - **Dependencies:** Epic 001 (users)

- [ ] **BE-083**: Create Notification model
  - **File:** `backend/app/Models/Notification.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with user relationship
  - **Dependencies:** DB-019

- [ ] **BE-084**: Create NotificationPreference model
  - **File:** `backend/app/Models/NotificationPreference.php`
  - **Estimate:** 1 hour
  - **Acceptance:** Model with user relationship
  - **Dependencies:** DB-020

- [ ] **BE-085**: Create NotificationService
  - **File:** `backend/app/Services/NotificationService.php`
  - **Estimate:** 3 hours
  - **Acceptance:** Create notifications, send emails, respect preferences
  - **Dependencies:** BE-083, BE-084

- [ ] **BE-086**: Create NotificationController
  - **File:** `backend/app/Http/Controllers/NotificationController.php`
  - **Estimate:** 2 hours
  - **Acceptance:** index, markAsRead, markAllAsRead, updatePreferences
  - **Dependencies:** BE-085

- [ ] **BE-087**: Add message and notification routes
  - **File:** `backend/routes/api.php`
  - **Estimate:** 0.5 hours
  - **Acceptance:** RESTful routes for messages and notifications
  - **Dependencies:** All controllers

**Week 10 Total Backend:** ~9.5 hours

#### Frontend Tasks (Frontend Dev)

**Week 9: Messaging UI**

- [ ] **FE-043**: Create Pinia message store
  - **File:** `frontend/src/stores/useMessageStore.ts`
  - **Estimate:** 2 hours
  - **Acceptance:** State, actions for messaging, getters
  - **Dependencies:** None

- [ ] **FE-044**: Create MessageInbox component
  - **File:** `frontend/src/pages/MessageInbox.vue`
  - **Estimate:** 4 hours
  - **Acceptance:** List messages, unread count, filter by type
  - **Dependencies:** FE-043

- [ ] **FE-045**: Create MessageComposer component
  - **File:** `frontend/src/components/MessageComposer.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Compose message, select recipients, send
  - **Dependencies:** FE-043

- [ ] **FE-046**: Create MessageThread component
  - **File:** `frontend/src/components/MessageThread.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** View message thread, reply, mark as read
  - **Dependencies:** FE-043

**Week 9 Total Frontend:** ~12 hours

**Week 10: Notifications UI**

- [ ] **FE-047**: Create Pinia notification store
  - **File:** `frontend/src/stores/useNotificationStore.ts`
  - **Estimate:** 2 hours
  - **Acceptance:** State, actions for notifications, getters
  - **Dependencies:** None

- [ ] **FE-048**: Create NotificationBell component
  - **File:** `frontend/src/components/NotificationBell.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** Notification icon with badge, dropdown list
  - **Dependencies:** FE-047

- [ ] **FE-049**: Create NotificationList component
  - **File:** `frontend/src/pages/NotificationList.vue`
  - **Estimate:** 3 hours
  - **Acceptance:** List all notifications, mark as read, filter
  - **Dependencies:** FE-047

- [ ] **FE-050**: Create NotificationPreferences component
  - **File:** `frontend/src/components/NotificationPreferences.vue`
  - **Estimate:** 2 hours
  - **Acceptance:** Toggle notification preferences per type
  - **Dependencies:** FE-047

- [ ] **FE-051**: Integrate real-time notifications (polling)
  - **File:** Update notification store
  - **Estimate:** 2 hours
  - **Acceptance:** Poll for new notifications, update UI
  - **Dependencies:** FE-047

**Week 10 Total Frontend:** ~12 hours

### Sprint 5 Acceptance Criteria

**Epic 004:**
- [ ] Users can send messages to other users
- [ ] Users can send messages to groups/roles
- [ ] Organisation-level messaging works
- [ ] Read receipts are tracked
- [ ] Notifications are created and displayed
- [ ] Notification preferences can be managed
- [ ] Real-time notification updates work (polling)

**Sprint 5 Definition of Done:**
- [ ] All tasks completed and code reviewed
- [ ] Integration tests for messaging passing
- [ ] Notification system tested
- [ ] UI components tested
- [ ] Documentation updated
- [ ] No critical bugs
- [ ] Code deployed to development environment
- [ ] **Phase 1 Complete** ✅

---

## Phase 1 Summary

### Completed Epics
- ✅ **Epic 001:** User & Organisation Management (100%)
- ✅ **Epic 008:** Pattern Database (100%)
- ✅ **Epic 002:** Activity Tracking & Reporting (100%)
- ✅ **Epic 004:** Communication System (100%)

### Phase 1 Deliverables
- ✅ Complete authentication & authorisation system
- ✅ Organisation hierarchy management
- ✅ Activity tracking with evidence uploads
- ✅ GPS location tagging
- ✅ Effectiveness metrics capture
- ✅ Pattern database foundation
- ✅ Basic communication system
- ✅ Ready for field testing

### Phase 1 Metrics
- **Duration:** 10 weeks (5 sprints)
- **Total Tasks:** ~150 tasks
- **Team Velocity:** Adjusted based on actual performance
- **Quality:** All acceptance criteria met

### Next Phase
**Phase 2: Core Innovation (Weeks 11-14)**
- Epic 007: Semiotic Risk Assessment
- Integration with Epic 002 and Epic 008
- MVP completion

---

**Document Status:** ✅ Ready for Sprint Planning  
**Next Review:** After Sprint 1 completion  
**Owners:** Winston (Architect), Bob (Scrum Master)

---

*These sprint plans are living documents. Update as implementation progresses and learnings emerge.*
