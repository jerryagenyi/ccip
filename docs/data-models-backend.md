# Data Models - Backend

**Part:** Backend (Laravel API)  
**Database:** PostgreSQL 16  
**ORM:** Laravel Eloquent

## Core Entities

### Users Table

**Model:** `App\Models\User`

**Fields:**
- `id` (bigint, primary key)
- `name` (string)
- `email` (string, unique)
- `email_verified_at` (timestamp, nullable)
- `password` (string, hashed)
- `phone_number` (string, nullable)
- `profile_picture` (string, nullable)
- `role` (enum: `super_admin`, `admin`, `sub_admin`, `user`, default: `user`)
- `organisation_id` (foreign key → organisations.id, nullable)
- `is_active` (boolean, default: true)
- `preferences` (json, nullable)
- `avatar_id` (string, nullable)
- `last_login` (timestamp, nullable)
- `status` (string, nullable)
- `remember_token` (string, nullable)
- `created_at`, `updated_at` (timestamps)
- `deleted_at` (timestamp, nullable - soft deletes)

**Relationships:**
- `belongsTo(Organisation)` - User's primary organisation
- `belongsToMany(Role)` - User roles (via `user_roles` pivot table)
- `hasMany(Activity)` - Activities created by user
- `hasMany(Message)` - Messages sent/received
- `hasMany(Notification)` - User notifications
- `hasOne(NotificationPreference)` - Notification preferences

**Accessors (Frontend Compatibility):**
- `avatarId` → `avatar_id`
- `profilePicture` → `profile_picture`
- `phoneNumber` → `phone_number`

### Organisations Table

**Model:** `App\Models\Organisation`

**Fields:**
- `id` (bigint, primary key)
- `name` (string)
- `slug` (string, unique)
- `description` (text, nullable)
- `logo` (string, nullable)
- `website` (string, nullable)
- `email` (string, nullable)
- `phone` (string, nullable)
- `administrative_level` (enum: `national`, `regional`, `district`, `local`, `community`, default: `local`)
- `parent_id` (foreign key → organisations.id, nullable) - Hierarchical structure
- `location` (json, nullable) - `{country, administrative_level_1, administrative_level_2, city}`
- `metadata` (json, nullable)
- `is_active` (boolean, default: true)
- `created_at`, `updated_at` (timestamps)
- `deleted_at` (timestamp, nullable - soft deletes)

**Relationships:**
- `belongsTo(Organisation)` - Parent organisation (self-referential)
- `hasMany(Organisation)` - Child organisations
- `hasMany(User)` - Organisation members
- `hasMany(Activity)` - Organisation activities

**Features:**
- Hierarchical structure (parent-child relationships)
- Soft deletes enabled
- JSON location storage for flexible geographic data

### Activities Table

**Model:** `App\Models\Activity`

**Fields:**
- `id` (bigint, primary key)
- `title` (string)
- `description` (text)
- `type` (enum: `campaign`, `workshop`, `training`, `outreach`, `research`, `other`, default: `campaign`)
- `status` (enum: `draft`, `submitted`, `approved`, `rejected`, `in_progress`, `completed`, `cancelled`, default: `draft`)
- `priority` (enum: `low`, `medium`, `high`, `urgent`, default: `medium`)
- `organisation_id` (foreign key → organisations.id)
- `created_by` (foreign key → users.id)
- `updated_by` (foreign key → users.id, nullable)
- `location` (json, nullable) - Geographic location data
- `state` (string, nullable) - Nigerian state
- `lga` (string, nullable) - Local Government Area
- `target_context` (json, nullable) - `{region, language, culture}`
- `planned_message` (json, nullable) - `{content, channels, messengers, tone, key_messages}`
- `start_date` (date, nullable)
- `end_date` (date, nullable)
- `budget` (decimal 15,2, nullable)
- `actual_cost` (decimal 15,2, nullable)
- `target_audience` (integer, nullable)
- `actual_reach` (integer, nullable)
- `tags` (json, nullable) - Array of tags
- `assignees` (json, nullable) - Array of user IDs
- `human_review_completed` (boolean, default: false)
- `reviewed_at` (timestamp, nullable)
- `reviewed_by` (foreign key → users.id, nullable)
- `review_notes` (text, nullable)
- `semiotic_assessment` (json, nullable) - AI assessment results
- `semiotic_risk_score` (decimal, nullable) - Risk score (0-100)
- `communication_effectiveness` (json, nullable) - Field report data
- `semiotic_validation` (json, nullable) - Validation of predictions
- `metadata` (json, nullable)
- `created_at`, `updated_at` (timestamps)
- `deleted_at` (timestamp, nullable - soft deletes)

**Relationships:**
- `belongsTo(Organisation)` - Activity organisation
- `belongsTo(User)` - Creator (via `created_by`)
- `belongsTo(User)` - Reviewer (via `reviewed_by`)
- `hasMany(ActivityAttachment)` - File attachments
- `hasMany(ActivityStatusHistory)` - Status change history
- `hasMany(EngagementMetric)` - Engagement metrics

**Scopes:**
- `byStatus($status)` - Filter by status
- `byType($type)` - Filter by type
- `byOrganisation($ids)` - Filter by organisation(s)
- `byPriority($priority)` - Filter by priority
- `search($search)` - Search in title, description, tags

**Methods:**
- `addAttachment($file, $uploadedBy)` - Add file attachment
- `updateStatus($status, $notes, $reviewedBy)` - Update status with history

### Activity Attachments Table

**Model:** `App\Models\ActivityAttachment`

**Fields:**
- `id` (bigint, primary key)
- `activity_id` (foreign key → activities.id)
- `file_name` (string)
- `file_path` (string) - S3/MinIO path
- `file_type` (string, nullable) - File extension
- `file_size` (integer, nullable) - Bytes
- `mime_type` (string, nullable)
- `uploaded_by` (foreign key → users.id)
- `sync_status` (string, nullable) - For offline sync
- `created_at`, `updated_at` (timestamps)

**Relationships:**
- `belongsTo(Activity)` - Parent activity
- `belongsTo(User)` - Uploader

### Messages Table

**Model:** `App\Models\Message`

**Fields:**
- `id` (bigint, primary key)
- `subject` (string)
- `body` (text)
- `from_user_id` (foreign key → users.id)
- `to_user_id` (foreign key → users.id)
- `parent_message_id` (foreign key → messages.id, nullable) - For replies
- `is_read` (boolean, default: false)
- `read_at` (timestamp, nullable)
- `attachments` (json, nullable) - Array of file references
- `created_at`, `updated_at` (timestamps)
- `deleted_at` (timestamp, nullable - soft deletes)

**Relationships:**
- `belongsTo(User)` - Sender (via `from_user_id`)
- `belongsTo(User)` - Recipient (via `to_user_id`)
- `belongsTo(Message)` - Parent message (for threading)
- `hasMany(Message)` - Replies

### Notifications Table

**Model:** `App\Models\Notification`

**Fields:**
- `id` (bigint, primary key)
- `user_id` (foreign key → users.id)
- `type` (enum: `message`, `activity`, `system`, `urgent`, default: `system`)
- `title` (string)
- `body` (text)
- `link` (string, nullable) - Deep link to relevant page
- `read_at` (timestamp, nullable)
- `created_at`, `updated_at` (timestamps)

**Relationships:**
- `belongsTo(User)` - Notification recipient

### Notification Preferences Table

**Model:** `App\Models\NotificationPreference`

**Fields:**
- `id` (bigint, primary key)
- `user_id` (foreign key → users.id, unique)
- `email_enabled` (boolean, default: true)
- `push_enabled` (boolean, default: true)
- `preferences` (json, nullable) - Per-type preferences
- `created_at`, `updated_at` (timestamps)

**Relationships:**
- `belongsTo(User)` - User preferences

### Reports Table

**Model:** `App\Models\Report`

**Fields:**
- `id` (bigint, primary key)
- `title` (string)
- `description` (text, nullable)
- `type` (enum: `activity-summary`, `performance-analysis`, `impact-assessment`, `semiotic-analysis`, `stakeholder-update`, `research-findings`, `incident-report`, default: `activity-summary`)
- `status` (enum: `draft`, `generating`, `completed`, `failed`, default: `draft`)
- `created_by` (foreign key → users.id)
- `template_id` (foreign key → report_templates.id, nullable)
- `filters` (json, nullable) - Report filter criteria
- `data` (json, nullable) - Report data/content
- `file_path` (string, nullable) - Generated file path
- `file_format` (string, nullable) - `pdf`, `excel`, `csv`
- `generated_at` (timestamp, nullable)
- `created_at`, `updated_at` (timestamps)
- `deleted_at` (timestamp, nullable - soft deletes)

**Relationships:**
- `belongsTo(User)` - Report creator
- `belongsTo(ReportTemplate)` - Template used

### Report Templates Table

**Model:** `App\Models\ReportTemplate`

**Fields:**
- `id` (bigint, primary key)
- `name` (string)
- `description` (text, nullable)
- `type` (string) - Template type
- `structure` (json) - Template structure/format
- `is_active` (boolean, default: true)
- `created_at`, `updated_at` (timestamps)

### Help Articles Table

**Model:** `App\Models\HelpArticle`

**Fields:**
- `id` (bigint, primary key)
- `title` (string)
- `content` (text)
- `category` (string, nullable)
- `tags` (json, nullable)
- `is_published` (boolean, default: true)
- `view_count` (integer, default: 0)
- `created_at`, `updated_at` (timestamps)

### Activity Status History Table

**Model:** `App\Models\ActivityStatusHistory`

**Fields:**
- `id` (bigint, primary key)
- `activity_id` (foreign key → activities.id)
- `status` (string) - Status value
- `changed_by` (foreign key → users.id)
- `notes` (text, nullable)
- `created_at`, `updated_at` (timestamps)

**Relationships:**
- `belongsTo(Activity)` - Activity
- `belongsTo(User)` - User who changed status

### Engagement Metrics Table

**Model:** `App\Models\EngagementMetric`

**Fields:**
- `id` (bigint, primary key)
- `activity_id` (foreign key → activities.id)
- `metric_type` (string) - Type of metric
- `value` (decimal, nullable)
- `data` (json, nullable) - Additional metric data
- `recorded_at` (timestamp)
- `created_at`, `updated_at` (timestamps)

**Relationships:**
- `belongsTo(Activity)` - Activity

## Semiotic Intelligence Tables

### Semiotic Patterns Table

**Model:** `App\Models\SemioticPattern` (if exists)

**Fields:**
- `id` (uuid, primary key)
- `pattern_type` (enum: `language`, `cultural`, `technical`, `demographic`, `regional`, `channel`)
- `title` (string)
- `description` (text)
- `failed_element` (text) - What failed
- `successful_alternative` (text) - Successful alternative
- `context_metadata` (json, nullable) - Context information
- `evidence_sources` (json, nullable) - Evidence references
- `effectiveness_score` (decimal 5,2, nullable)
- `confidence_score` (decimal 5,2, default: 50.0)
- `usage_count` (integer, default: 0)
- `status` (enum: `draft`, `validated`, `deprecated`, default: `draft`)
- `is_global` (boolean, default: false)
- `organisation_id` (foreign key → organisations.id, nullable)
- `created_by` (foreign key → users.id, nullable)
- `embedding` (vector(1536), nullable) - pgvector embedding for similarity search
- `created_at`, `updated_at` (timestamps)
- `deleted_at` (timestamp, nullable - soft deletes)

**Indexes:**
- `(pattern_type, status)`
- `(is_global, status)`

**Features:**
- Vector embeddings for semantic similarity search (pgvector extension)
- Global vs organisation-specific patterns
- Evidence-based validation

### Semiotic Assessments Table

**Fields:**
- `id` (bigint, primary key)
- `activity_id` (foreign key → activities.id)
- `risk_score` (decimal, nullable)
- `confidence` (decimal, nullable)
- `assessment_data` (json) - Full assessment results
- `created_at`, `updated_at` (timestamps)

### Pattern Contexts Table

**Fields:**
- `id` (bigint, primary key)
- `pattern_id` (foreign key → semiotic_patterns.id)
- `context_type` (string)
- `context_data` (json)
- `created_at`, `updated_at` (timestamps)

### Pattern Validations Table

**Fields:**
- `id` (bigint, primary key)
- `pattern_id` (foreign key → semiotic_patterns.id)
- `activity_id` (foreign key → activities.id)
- `validated` (boolean)
- `validation_data` (json)
- `created_at`, `updated_at` (timestamps)

### Pattern Evidence Table

**Fields:**
- `id` (bigint, primary key)
- `pattern_id` (foreign key → semiotic_patterns.id)
- `evidence_type` (string)
- `evidence_data` (json)
- `created_at`, `updated_at` (timestamps)

## Authentication & Authorization Tables

### Roles Table

**Model:** `App\Models\Role`

**Fields:**
- `id` (bigint, primary key)
- `name` (string, unique)
- `display_name` (string, nullable)
- `description` (text, nullable)
- `permissions` (json, nullable)
- `created_at`, `updated_at` (timestamps)

### User Roles Table (Pivot)

**Fields:**
- `user_id` (foreign key → users.id)
- `role_id` (foreign key → roles.id)
- `assigned_by` (foreign key → users.id, nullable)
- `assigned_at` (timestamp, nullable)
- `created_at`, `updated_at` (timestamps)

### Password Reset Tokens Table

**Fields:**
- `email` (string, primary key)
- `token` (string)
- `created_at` (timestamp)

## Offline Storage Table

**Fields:**
- `id` (bigint, primary key)
- `user_id` (foreign key → users.id)
- `entity_type` (string) - Model class name
- `entity_id` (bigint) - Model ID
- `action` (string) - `create`, `update`, `delete`
- `data` (json) - Entity data
- `sync_status` (string) - `pending`, `synced`, `failed`
- `created_at`, `updated_at` (timestamps)

**Purpose:** Store offline changes for sync when connection restored

## Database Relationships Summary

```
users
  ├── belongsTo → organisations
  ├── belongsToMany → roles (via user_roles)
  ├── hasMany → activities (created_by)
  ├── hasMany → messages (from_user_id, to_user_id)
  └── hasMany → notifications

organisations
  ├── belongsTo → organisations (parent_id - self-referential)
  ├── hasMany → organisations (children)
  ├── hasMany → users
  └── hasMany → activities

activities
  ├── belongsTo → organisations
  ├── belongsTo → users (created_by, reviewed_by)
  ├── hasMany → activity_attachments
  ├── hasMany → activity_status_history
  └── hasMany → engagement_metrics

messages
  ├── belongsTo → users (from_user_id, to_user_id)
  └── belongsTo → messages (parent_message_id - threading)

semiotic_patterns
  ├── belongsTo → organisations (optional)
  ├── belongsTo → users (created_by)
  └── hasMany → pattern_contexts, pattern_validations, pattern_evidence
```

## Key Design Patterns

1. **Soft Deletes:** Users, Organisations, Activities, Messages, Reports use soft deletes
2. **JSON Fields:** Flexible data storage for location, metadata, preferences, assessments
3. **Hierarchical Organisations:** Self-referential parent_id for multi-level structure
4. **Status Workflows:** Activities have status history tracking
5. **Vector Search:** Semiotic patterns use pgvector for similarity search
6. **Offline Sync:** Offline storage table for PWA offline functionality

## Indexes

- `users.email` (unique)
- `users.organisation_id`
- `activities.status`
- `activities.organisation_id`
- `activities.created_by`
- `organisations.parent_id`
- `semiotic_patterns(pattern_type, status)`
- `semiotic_patterns(is_global, status)`

