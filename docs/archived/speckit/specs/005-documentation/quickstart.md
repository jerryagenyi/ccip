# Quick Start: Documentation & Help System

## Overview
Quick reference guide for implementing the Documentation & Help System feature.

## Implementation Order

1. **Database Setup**
   - Run migrations for help_articles, onboarding_steps, user_onboarding_progress
   - Create full-text search indexes
   - Seed default help articles and onboarding steps

2. **Backend Models**
   - Create HelpArticle model
   - Create OnboardingStep model
   - Create UserOnboardingProgress model
   - Set up model relationships

3. **Backend API - Help**
   - Create HelpController
   - Implement article list endpoint
   - Implement article detail endpoint
   - Implement search endpoint
   - Add role-based filtering

4. **Backend API - Onboarding**
   - Create OnboardingController
   - Implement steps endpoint (role-filtered)
   - Implement progress tracking
   - Add completion endpoint

5. **Backend API - Documentation**
   - Set up L5-Swagger
   - Configure OpenAPI annotations
   - Generate API documentation
   - Set up Swagger UI route

6. **Backend Services**
   - Create HelpService for business logic
   - Create OnboardingService for progress tracking
   - Implement Markdown rendering
   - Add search service

7. **Frontend - Help**
   - Create HelpSearch component
   - Create HelpArticle component
   - Create HelpCategories component
   - Set up Pinia store

8. **Frontend - Onboarding**
   - Integrate Driver.js
   - Create OnboardingTour component
   - Create OnboardingStep component
   - Track progress

9. **Frontend - Documentation**
   - Create DocumentationViewer component
   - Integrate Swagger UI
   - Add API explorer

10. **Frontend - Contextual Help**
    - Create ContextualHelp component
    - Create HelpTooltip component
    - Add help icons to forms

## Key Files

### Backend
- `app/Models/HelpArticle.php`
- `app/Models/OnboardingStep.php`
- `app/Models/UserOnboardingProgress.php`
- `app/Http/Controllers/HelpController.php`
- `app/Http/Controllers/OnboardingController.php`
- `app/Services/HelpService.php`
- `app/Services/OnboardingService.php`
- `app/Services/MarkdownService.php`
- `config/l5-swagger.php`
- `database/migrations/*_create_*.php`

### Frontend
- `src/components/HelpSearch.vue`
- `src/components/HelpArticle.vue`
- `src/components/HelpCategories.vue`
- `src/components/OnboardingTour.vue`
- `src/components/OnboardingStep.vue`
- `src/components/ContextualHelp.vue`
- `src/components/HelpTooltip.vue`
- `src/pages/DocumentationViewer.vue`
- `src/stores/useHelpStore.ts`
- `src/stores/useOnboardingStore.ts`

## Testing Checklist
- [ ] Help articles display correctly
- [ ] Search works
- [ ] Role-based filtering works
- [ ] Onboarding tour works
- [ ] Progress tracking works
- [ ] API documentation generates
- [ ] Swagger UI accessible
- [ ] Contextual help appears
- [ ] Markdown renders correctly
- [ ] Skip onboarding works

## Common Issues
- **Help articles not showing**: Check role_access and is_published
- **Search not working**: Verify full-text index created
- **Onboarding not starting**: Check role matching
- **API docs not generating**: Check L5-Swagger configuration
- **Markdown not rendering**: Check parser configuration

## Dependencies
- Epic 001 must be complete (users, roles)
- L5-Swagger installed and configured
- Markdown parser installed
- Driver.js installed (for onboarding)
- PostgreSQL full-text search enabled

