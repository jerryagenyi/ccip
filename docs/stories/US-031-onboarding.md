# Story US-031: Onboarding

**Epic:** Epic 005 - Documentation & Help System

**As a** new user  
**I want to** complete an onboarding flow  
**So that** I can quickly learn how to use CCIP

## Acceptance Criteria

- [ ] Onboarding flow appears for new users
- [ ] Multi-step onboarding with key features introduction
- [ ] Interactive tour of main features
- [ ] User can skip onboarding
- [ ] Onboarding progress saved (can resume later)
- [ ] Role-specific onboarding content

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/onboarding/steps`, `POST /api/v1/onboarding/complete`
- Model: `OnboardingStep` with fields: step_number, title, content, role_access
- User tracking: `users.onboarding_completed_at` field

### Frontend
- Component: `OnboardingFlow.vue`, `OnboardingStep.vue`
- Features: Step-by-step wizard, progress indicator, skip option
- Store: `useOnboardingStore.ts` with onboarding state

## Dependencies
- Epic 001: User & Organisation Management (for user context and roles)

## Status
Ready for implementation
