# Story US-034: Free Tier Management

**Epic:** Epic 006 - Pricing & Subscription Management

**As a** Organisation Admin  
**I want to** manage my free tier account  
**So that** I can use CCIP within free tier limits

## Acceptance Criteria

- [ ] Free tier limits displayed (member count, features)
- [ ] Warning when approaching limits
- [ ] Upgrade prompt when limit reached
- [ ] Usage dashboard showing current usage vs limits

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/organisations/{id}/usage`
- Logic: Calculate usage (member count, feature usage) vs tier limits
- Model: `Organisation` with `tier` field (free/premium)

### Frontend
- Component: `TierManagement.vue`, `UsageDashboard.vue`
- Features: Usage display, limit warnings, upgrade prompts

## Dependencies
- Epic 001: User & Organisation Management (for organisation and member tracking)

## Status
Ready for implementation (deferred to Phase 2 per PRD)
