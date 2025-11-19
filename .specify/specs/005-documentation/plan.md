# Implementation Plan: Documentation & Help System

## Overview
Technical implementation plan for Documentation & Help System based on the specification in `spec.md`. This ensures users can effectively use RCAP and developers can integrate with the API.

## Technology Stack
- **Backend**: Laravel 10+ with PHP 8.2+
- **API Docs**: L5-Swagger (Laravel Swagger/OpenAPI)
- **Markdown**: Parsedown (backend) or marked.js (frontend)
- **Onboarding**: Driver.js (lightweight tour library)
- **Search**: PostgreSQL full-text search
- **Caching**: Redis for help articles

## Architecture Decisions

### Backend Architecture
- **Controllers**: HelpController, OnboardingController
- **Services**: HelpService, OnboardingService, MarkdownService
- **API Docs**: L5-Swagger for auto-generated documentation
- **Search**: PostgreSQL full-text search for help articles

### Frontend Architecture
- **Components**: HelpSearch, HelpArticle, OnboardingTour, ContextualHelp
- **Stores**: useHelpStore, useOnboardingStore
- **Tour**: Driver.js for interactive onboarding
- **Markdown**: Client-side rendering for help articles

## Implementation Phases

### Phase 1: Database Setup
- Create help_articles table
- Create onboarding_steps table
- Create user_onboarding_progress table
- Create full-text search indexes

### Phase 2: Backend Help System
- Create HelpArticle model
- Create HelpController
- Implement search functionality
- Add role-based filtering

### Phase 3: Backend Onboarding System
- Create OnboardingStep model
- Create UserOnboardingProgress model
- Create OnboardingController
- Implement progress tracking

### Phase 4: Backend API Documentation
- Install and configure L5-Swagger
- Add OpenAPI annotations to controllers
- Generate API documentation
- Set up Swagger UI route

### Phase 5: Frontend Help System
- Create help search interface
- Create help article viewer
- Implement markdown rendering
- Add category navigation

### Phase 6: Frontend Onboarding
- Install Driver.js
- Create onboarding tour component
- Implement step tracking
- Add progress persistence

### Phase 7: Frontend Contextual Help
- Create contextual help component
- Create help tooltip component
- Add help icons to forms

## Database Migrations

### Migration 1: Create help_articles table
- **File**: `YYYY_MM_DD_HHMMSS_create_help_articles_table.php`
- **Purpose**: Store help articles
- **Fields**: id, title, slug, content, excerpt, category, role_access, order, is_published, created_by, timestamps

### Migration 2: Create onboarding_steps table
- **File**: `YYYY_MM_DD_HHMMSS_create_onboarding_steps_table.php`
- **Purpose**: Define onboarding steps
- **Fields**: id, title, description, order, role, target_element, content, is_active, timestamps

### Migration 3: Create user_onboarding_progress table
- **File**: `YYYY_MM_DD_HHMMSS_create_user_onboarding_progress_table.php`
- **Purpose**: Track user onboarding progress
- **Fields**: id, user_id, step_id, completed_at, skipped, timestamps

## API Design

### Help Endpoints
- `GET /api/v1/help/articles` - List help articles
- `GET /api/v1/help/articles/{id}` - Get help article
- `GET /api/v1/help/search` - Search help articles
- `GET /api/v1/help/categories` - List categories

### Onboarding Endpoints
- `GET /api/v1/onboarding/steps` - Get onboarding steps (role-filtered)
- `PUT /api/v1/onboarding/steps/{id}/complete` - Mark step complete
- `GET /api/v1/onboarding/progress` - Get user progress
- `POST /api/v1/onboarding/reset` - Reset progress

### Documentation Endpoints
- `GET /api/v1/docs/api` - Get OpenAPI spec
- `GET /api/docs` - Swagger UI (L5-Swagger route)

## Frontend Design

### Help Search
- **Component**: `HelpSearch.vue`
- **Features**: Search input, results list, category filters

### Help Article Viewer
- **Component**: `HelpArticle.vue`
- **Features**: Markdown rendering, table of contents, related articles

### Onboarding Tour
- **Component**: `OnboardingTour.vue`
- **Features**: Step-by-step tour, skip option, progress indicator

## Testing Strategy
- Feature tests for help endpoints
- Onboarding progress tests
- Search functionality tests
- API documentation generation tests

## Performance Optimization
- Cache help articles (Redis, 1 hour)
- Cache onboarding steps (Redis, 1 hour)
- Full-text search index
- Lazy load help content

## Security Considerations
- Role-based help content access
- API documentation for authenticated users only
- Help articles editable by admins only

## Risk Mitigation
- **Search Performance**: Full-text index, limit results
- **Tour Library**: Start with Driver.js (lightweight)
- **Markdown**: Sanitize user-generated content

## Dependencies
- **External**: L5-Swagger, Parsedown/marked.js, Driver.js
- **Internal**: Epic 001 (required)

## Success Criteria
- [ ] Help articles display correctly
- [ ] Search works
- [ ] Onboarding tour works
- [ ] API documentation generates
- [ ] Contextual help appears
- [ ] All tests passing

