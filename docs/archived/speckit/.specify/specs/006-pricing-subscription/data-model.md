# Data Model: Pricing & Subscription Management

## Overview
Database schema and data relationships for subscription tiers, member limits, and feature gating.

## Entity Relationship Diagram

```
[organisations] --< has one >-- [subscriptions]
[subscriptions] --< has many >-- [subscription_history]
[subscriptions] --< belongs to >-- [users] (changed_by)
```

## Tables

### subscriptions
**Purpose**: Stores organisation subscription information and tier

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| organisation_id | bigint | FOREIGN KEY, UNIQUE, NOT NULL | Organisation ID |
| tier | enum | NOT NULL, DEFAULT 'free' | Subscription tier: free, premium |
| member_limit | integer | NULLABLE | Member limit (null = unlimited) |
| current_member_count | integer | NOT NULL, DEFAULT 0 | Current member count (computed) |
| status | enum | NOT NULL, DEFAULT 'active' | Status: active, cancelled, expired |
| subscribed_at | timestamp | NULLABLE | Subscription start date |
| expires_at | timestamp | NULLABLE | Subscription expiry date (null for free tier) |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_subscriptions_organisation_id` on `organisation_id` (unique)
- `idx_subscriptions_tier` on `tier`
- `idx_subscriptions_status` on `status`

**Foreign Keys:**
- `fk_subscriptions_organisation_id` references `organisations(id)` ON DELETE CASCADE

**Business Rules:**
- Free tier: member_limit = 50 or 100 (configurable), expires_at = null
- Premium tier: member_limit = null (unlimited), expires_at set if applicable
- Default tier for new organisations: 'free'
- Member count updated automatically when users added/removed

### subscription_history
**Purpose**: Audit trail of subscription changes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| subscription_id | bigint | FOREIGN KEY, NOT NULL | Subscription ID |
| tier | enum | NOT NULL | Tier at time of change: free, premium |
| action | enum | NOT NULL | Action: created, upgraded, downgraded, cancelled |
| changed_by_user_id | bigint | FOREIGN KEY, NOT NULL | User who made the change |
| notes | text | NULLABLE | Optional notes about the change |
| created_at | timestamp | NULLABLE | Creation timestamp |

**Indexes:**
- `idx_subscription_history_subscription_id` on `subscription_id`
- `idx_subscription_history_changed_by` on `changed_by_user_id`
- `idx_subscription_history_created_at` on `created_at`

**Foreign Keys:**
- `fk_subscription_history_subscription_id` references `subscriptions(id)` ON DELETE CASCADE
- `fk_subscription_history_changed_by` references `users(id)` ON DELETE RESTRICT

## Relationships

### One-to-One
- `organisations` has one `subscriptions`

### One-to-Many
- `subscriptions` has many `subscription_history`
- `users` has many `subscription_history` (as changed_by)

## Data Validation Rules
- Organisation must have exactly one subscription
- Free tier member_limit must be set (50 or 100, configurable)
- Premium tier member_limit must be null (unlimited)
- Member count cannot exceed member_limit (enforced at application level)
- Subscription status must be valid enum value
- Subscription history entry created on every tier/status change

## Migration Strategy
1. Create `subscriptions` table (depends on organisations, users)
2. Create `subscription_history` table (depends on subscriptions, users)
3. Create default free tier subscription for all existing organisations
4. Add subscription_id foreign key constraint

## Seed Data
- Default free tier subscription for new organisations
- Sample subscription history entries for testing

## Performance Optimization
- Cache subscription status (Redis, 5 minute TTL)
- Index on organisation_id for fast lookups
- Compute member count efficiently (cached, updated on user changes)
- Archive old subscription history (after 1 year)

## Configuration
- Free tier member limit: Configurable via environment variable (default: 50 or 100)
- Premium tier pricing: Configurable (per month or contact for pricing)

