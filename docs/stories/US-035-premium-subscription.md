# Story US-035: Premium Tier Subscription

**Epic:** Epic 006 - Pricing & Subscription Management

**As a** Organisation Admin  
**I want to** subscribe to premium tier  
**So that** I can access advanced features

## Acceptance Criteria

- [ ] Upgrade flow from free to premium
- [ ] Payment processing integration (Stripe/PayPal)
- [ ] Subscription management (cancel, renew)
- [ ] Billing history
- [ ] Invoice generation

## Technical Details

### Backend
- API Endpoints: `POST /api/v1/subscriptions`, `GET /api/v1/subscriptions/{id}`, `DELETE /api/v1/subscriptions/{id}`
- Payment integration: Stripe or PayPal SDK
- Model: `Subscription` with fields: organisation_id, tier, status, billing_cycle, payment_method

### Frontend
- Component: `SubscriptionForm.vue`, `BillingHistory.vue`
- Features: Payment form, subscription status, billing history

## Dependencies
- Epic 001: User & Organisation Management (for organisation context)
- Payment gateway integration (Stripe/PayPal)

## Status
Ready for implementation (deferred to Phase 2 per PRD)
