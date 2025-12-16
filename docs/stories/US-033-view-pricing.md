# Story US-033: View Pricing Information

**Epic:** Epic 006 - Pricing & Subscription Management

**As a** Organisation Admin  
**I want to** view pricing tiers and features  
**So that** I can understand what's included in each tier

## Acceptance Criteria

- [ ] Pricing page shows free and premium tiers
- [ ] Feature comparison table
- [ ] Clear pricing information
- [ ] Upgrade button for premium tier
- [ ] Current tier highlighted

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/pricing`
- Model: `PricingTier` with fields: name, price, features (JSONB), member_limit

### Frontend
- Component: `PricingPage.vue`
- Features: Tier comparison, feature list, upgrade CTA

## Dependencies
- Epic 001: User & Organisation Management (for organisation context)

## Status
Ready for implementation (deferred to Phase 2 per PRD)
