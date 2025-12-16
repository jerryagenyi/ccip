# Data Model: Documentation & Help System

## Overview
Database schema and data relationships for help articles, onboarding steps, and user progress tracking.

## Entity Relationship Diagram

```
[help_articles] --< belongs to >-- [categories] (via category field)
[onboarding_steps] --< independent >-- (role-based)
[user_onboarding_progress] --< belongs to >-- [users]
[user_onboarding_progress] --< belongs to >-- [onboarding_steps]
```

## Tables

### help_articles
**Purpose**: Stores help articles and documentation content

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| title | varchar(255) | NOT NULL | Article title |
| slug | varchar(255) | UNIQUE, NOT NULL | URL-friendly slug |
| content | text | NOT NULL | Article content (Markdown) |
| excerpt | text | NULLABLE | Short description |
| category | varchar(100) | NOT NULL | Category: getting-started, activities, dashboard, communication, admin |
| role_access | json | NULLABLE | Roles that can access (null = all roles) |
| order | integer | NOT NULL, DEFAULT 0 | Display order |
| is_published | boolean | NOT NULL, DEFAULT true | Published status |
| created_by | bigint | FOREIGN KEY, NULLABLE | User who created article |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_help_articles_slug` on `slug` (unique)
- `idx_help_articles_category` on `category`
- `idx_help_articles_is_published` on `is_published`
- `idx_help_articles_order` on `order`
- Full-text index on `title` and `content` (for search)

**Foreign Keys:**
- `fk_help_articles_created_by` references `users(id)` ON DELETE SET NULL

### onboarding_steps
**Purpose**: Defines onboarding steps for new users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| title | varchar(255) | NOT NULL | Step title |
| description | text | NOT NULL | Step description |
| order | integer | NOT NULL | Step order |
| role | enum | NOT NULL | Role: super_admin, admin, sub_admin, user, all |
| target_element | varchar(255) | NULLABLE | CSS selector for tour target |
| content | text | NULLABLE | Additional content/instructions |
| is_active | boolean | NOT NULL, DEFAULT true | Active status |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_onboarding_steps_role` on `role`
- `idx_onboarding_steps_order` on `order`
- `idx_onboarding_steps_is_active` on `is_active`

### user_onboarding_progress
**Purpose**: Tracks user onboarding progress

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| user_id | bigint | FOREIGN KEY, NOT NULL | User ID |
| step_id | bigint | FOREIGN KEY, NOT NULL | Onboarding step ID |
| completed_at | timestamp | NOT NULL, DEFAULT NOW() | Completion timestamp |
| skipped | boolean | NOT NULL, DEFAULT false | Whether step was skipped |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_user_onboarding_progress_user_id` on `user_id`
- `idx_user_onboarding_progress_step_id` on `step_id`
- UNIQUE constraint on `(user_id, step_id)`

**Foreign Keys:**
- `fk_user_onboarding_progress_user_id` references `users(id)` ON DELETE CASCADE
- `fk_user_onboarding_progress_step_id` references `onboarding_steps(id)` ON DELETE CASCADE

## Relationships

### One-to-Many
- `users` has many `help_articles` (as created_by)
- `users` has many `user_onboarding_progress`
- `onboarding_steps` has many `user_onboarding_progress`

### Many-to-Many
- `users` belongs to many `onboarding_steps` (via `user_onboarding_progress`)

## Data Validation Rules
- Help article slug must be unique
- Onboarding step order must be unique per role
- User can only complete each onboarding step once
- Help article content must be valid Markdown
- Role access JSON must be valid array

## Migration Strategy
1. Create `help_articles` table (depends on users)
2. Create `onboarding_steps` table (no dependencies)
3. Create `user_onboarding_progress` table (depends on users, onboarding_steps)

## Seed Data
- Default help articles for each feature
- Default onboarding steps for each role
- Getting started guide
- FAQ articles

## Performance Optimization
- Full-text search index on help articles
- Cache help articles (Redis, 1 hour TTL)
- Cache onboarding steps (Redis, 1 hour TTL)
- Index on role and order for onboarding steps

