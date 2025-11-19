# Feature Specification: Documentation & Help System

## Overview
Implement comprehensive documentation system for developers and users, including onboarding guides and feature-specific help. This ensures users can effectively use RCAP and developers can integrate with the API.

## User Stories

### US-019: Developer Documentation
- **As a** developer
- **I want to** access API documentation
- **So that** I can integrate with the system

**Acceptance Criteria:**
- [ ] Auto-generated API docs (OpenAPI/Swagger)
- [ ] Code examples for each endpoint
- [ ] Authentication guide
- [ ] Error code reference
- [ ] Request/response schemas
- [ ] Interactive API explorer
- [ ] Downloadable OpenAPI spec

### US-020: User Help Guides
- **As a** user
- **I want to** access help guides
- **So that** I can learn how to use features

**Acceptance Criteria:**
- [ ] Feature-specific guides
- [ ] Role-based help content
- [ ] Search functionality
- [ ] Table of contents
- [ ] Step-by-step instructions
- [ ] Screenshots or illustrations
- [ ] Video tutorials (optional, future)

### US-021: Onboarding
- **As a** new user
- **I want to** an onboarding experience
- **So that** I can get started quickly

**Acceptance Criteria:**
- [ ] Interactive tour of key features
- [ ] Step-by-step guides
- [ ] Skip option
- [ ] Progress tracking
- [ ] Role-specific onboarding
- [ ] Completion tracking per user

### US-022: In-App Help
- **As a** user
- **I want to** contextual help
- **So that** I understand what I'm doing

**Acceptance Criteria:**
- [ ] Help tooltips on forms
- [ ] "?" icons with explanations
- [ ] Contextual help panels
- [ ] Link to full documentation
- [ ] Keyboard shortcuts reference
- [ ] FAQ section

## Technical Requirements

### Database Schema
- **help_articles** table:
  - id, title, content, category, role_access, order, created_at, updated_at
- **onboarding_steps** table:
  - id, title, description, order, role, target_element, created_at, updated_at
- **user_onboarding_progress** table:
  - id, user_id, step_id, completed_at

### API Endpoints
- `GET /api/v1/docs/api` - Get API documentation (OpenAPI spec)
- `GET /api/v1/docs/swagger` - Swagger UI endpoint
- `GET /api/v1/help/articles` - List help articles
- `GET /api/v1/help/articles/{id}` - Get help article
- `GET /api/v1/help/search` - Search help articles
- `GET /api/v1/help/categories` - List help categories
- `GET /api/v1/onboarding/steps` - Get onboarding steps (filtered by role)
- `PUT /api/v1/onboarding/steps/{id}/complete` - Mark step as complete
- `GET /api/v1/onboarding/progress` - Get user onboarding progress
- `POST /api/v1/onboarding/reset` - Reset onboarding progress

### Frontend Components
- `DocumentationViewer.vue` - API documentation viewer
- `HelpSearch.vue` - Help article search
- `HelpArticle.vue` - Help article viewer
- `HelpCategories.vue` - Help category navigation
- `OnboardingTour.vue` - Interactive onboarding tour
- `OnboardingStep.vue` - Individual onboarding step
- `ContextualHelp.vue` - Contextual help tooltip/panel
- `HelpTooltip.vue` - Help tooltip component
- `useHelpStore.ts` - Pinia store for help content
- `useOnboardingStore.ts` - Pinia store for onboarding

## Dependencies
- OpenAPI/Swagger generator (Laravel Swagger or L5-Swagger)
- Markdown renderer (for help articles)
- Tour library (optional, for onboarding - e.g., Driver.js or Intro.js)
- Epic 001 (User & Organisation Management) - Required for role-based content

## Security Considerations
- Role-based help content access
- API documentation accessible to authenticated users only
- Help articles editable by admins only
- Onboarding progress user-specific

## Performance Considerations
- Cache help articles (Redis, 1 hour TTL)
- Lazy load help content
- Pre-generate API documentation
- Index help articles for search

## Priority
**Medium** - Important for user adoption

## Related Epics
- Epic 001: User & Organisation Management (required dependency for role-based content)
- All other epics (help content references all features)

