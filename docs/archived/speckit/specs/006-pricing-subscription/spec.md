# Feature Specification: Pricing & Subscription Management

## Overview
Implement pricing tiers and subscription management system to support free tier for small organisations and premium tier with advanced analytics and AI features. This enables sustainable platform growth while providing value to organisations of all sizes.

## User Stories

### US-020: View Pricing Information
- **As a** user or organisation admin
- **I want to** view pricing tiers and feature comparison
- **So that** I can understand available plans and make informed decisions

**Acceptance Criteria:**
- [ ] View pricing page with free and premium tiers
- [ ] See feature comparison table (Free vs Premium)
- [ ] View member limits for each tier
- [ ] See "Coming Soon" badges on AI features
- [ ] Access pricing page from:
  - Footer link
  - Settings menu
  - Organisation settings (for admins)
- [ ] Responsive design (stack cards on mobile, full-width table)

### US-021: Free Tier Management
- **As a** small organisation
- **I want to** use the platform for free with limited members
- **So that** I can access core functionality without cost

**Acceptance Criteria:**
- [ ] Free tier available to all organisations
- [ ] Member limit: Up to 50-100 members (configurable, to be decided)
- [ ] Core features included:
  - Basic activity tracking
  - Standard reports
  - Basic notifications
  - Community support
- [ ] Automatic tier assignment for new organisations
- [ ] Warning when approaching member limit
- [ ] Upgrade prompt when member limit reached

### US-022: Premium Tier Subscription
- **As an** organisation admin
- **I want to** subscribe to premium tier
- **So that** I can access advanced features and unlimited members

**Acceptance Criteria:**
- [ ] Premium tier subscription option
- [ ] Unlimited members
- [ ] Advanced analytics features (with "Coming Soon" badge if not ready)
- [ ] AI-powered features (all marked "Coming Soon"):
  - AI-powered insights
  - AI report generation
  - AI activity recommendations
- [ ] Priority support
- [ ] Custom integrations (future)
- [ ] Upgrade flow from free to premium
- [ ] Subscription management (view current plan, upgrade, cancel)

### US-023: AI Features Coming Soon
- **As a** user
- **I want to** see which AI features are coming soon
- **So that** I understand what's available now vs future

**Acceptance Criteria:**
- [ ] All AI features display "Coming Soon" badge
- [ ] Gray out or use different styling for coming soon features
- [ ] Tooltip explaining when features will be available
- [ ] Consistent "Coming Soon" messaging across platform
- [ ] No AI features functional until explicitly released

## Technical Requirements

### Database Schema
- **subscriptions** table:
  - id (bigint, primary key)
  - organisation_id (bigint, foreign key, unique)
  - tier (enum: free, premium)
  - member_limit (integer, nullable - null = unlimited)
  - status (enum: active, cancelled, expired)
  - current_member_count (integer, computed)
  - subscribed_at (timestamp, nullable)
  - expires_at (timestamp, nullable)
  - created_at, updated_at
- **subscription_history** table:
  - id (bigint, primary key)
  - subscription_id (bigint, foreign key)
  - tier (enum: free, premium)
  - action (enum: created, upgraded, downgraded, cancelled)
  - changed_by_user_id (bigint, foreign key)
  - created_at

### API Endpoints
- `GET /api/v1/pricing` - Get pricing information (public)
- `GET /api/v1/organisations/{id}/subscription` - Get organisation subscription
- `POST /api/v1/organisations/{id}/subscription/upgrade` - Upgrade to premium (Admin only)
- `POST /api/v1/organisations/{id}/subscription/cancel` - Cancel premium subscription (Admin only)
- `GET /api/v1/organisations/{id}/subscription/usage` - Get subscription usage (member count, limits)

### Frontend Components
- `PricingPage.vue` - Pricing page with tiers and comparison
- `PricingCard.vue` - Individual pricing tier card
- `FeatureComparisonTable.vue` - Side-by-side feature comparison
- `ComingSoonBadge.vue` - Reusable "Coming Soon" badge component
- `SubscriptionStatus.vue` - Display current subscription status
- `UpgradePrompt.vue` - Upgrade CTA component
- `useSubscriptionStore.ts` - Pinia store for subscription management

### Configuration
- Free tier member limit: Configurable (default: 50 or 100, to be decided)
- Premium tier pricing: Configurable (per month or contact for pricing)
- AI feature release dates: Configurable (for "Coming Soon" tooltips)

## Business Rules
- All new organisations start on free tier
- Member limit enforced at organisation level
- Premium features only accessible to premium tier organisations
- AI features: All marked "Coming Soon" until explicitly released
- Subscription changes require admin permissions
- Subscription history maintained for audit trail

## Security Considerations
- Subscription status checked at API level (middleware)
- Premium features gated by subscription tier
- Member limit enforcement prevents exceeding free tier
- Subscription changes logged for audit

## Performance Considerations
- Cache subscription status (Redis, 5 minute TTL)
- Lazy load pricing page (not critical path)
- Member count computed efficiently (cached, updated on user changes)

## Priority
**Medium** - Important for platform sustainability, but not blocking MVP core functionality

## Related Epics
- Epic 001: User & Organisation Management (subscription tied to organisations)
- Epic 003: Dashboards & Analytics (premium features include advanced analytics)
- Future Epic: AI Features (when ready, remove "Coming Soon" badges)

## Notes
- Resource Centre / Learning Centre: **Not needed for MVP** (per product decision)
- Can be added in future iterations if needed

