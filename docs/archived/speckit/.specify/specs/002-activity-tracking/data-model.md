# Data Model: Activity Tracking & Reporting

## Overview
Database schema and data relationships for activity tracking, evidence uploads, templates, and tagging system.

## Entity Relationship Diagram

```
[activities] --< has many >-- [activity_evidence]
[activities] --< belongs to >-- [organisations]
[activities] --< belongs to >-- [users]
[activities] --< belongs to >-- [report_templates]
[activities] --< has many >-- [activity_tags] --< belongs to >-- [tags]
[report_templates] --< belongs to >-- [organisations]
```

## Tables

### activities
**Purpose**: Stores risk communication activity records

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| title | varchar(255) | NOT NULL | Activity title |
| description | text | NOT NULL | Activity description |
| date | date | NOT NULL | Activity date |
| location | varchar(255) | NOT NULL | Activity location (text, no GIS) |
| type | enum | NOT NULL | Type: workshop, campaign, meeting, training, other |
| status | enum | NOT NULL, DEFAULT 'draft' | Status: draft, submitted, approved, rejected |
| organisation_id | bigint | FOREIGN KEY, NOT NULL | Organisation that owns activity |
| user_id | bigint | FOREIGN KEY, NOT NULL | User who created activity |
| template_id | bigint | FOREIGN KEY, NULLABLE | Template used (if any) |
| submitted_at | timestamp | NULLABLE | Submission timestamp |
| submitted_by | bigint | FOREIGN KEY, NULLABLE | User who submitted |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_activities_organisation_id` on `organisation_id`
- `idx_activities_user_id` on `user_id`
- `idx_activities_date` on `date`
- `idx_activities_status` on `status`
- `idx_activities_type` on `type`

**Foreign Keys:**
- `fk_activities_organisation_id` references `organisations(id)` ON DELETE CASCADE
- `fk_activities_user_id` references `users(id)` ON DELETE CASCADE
- `fk_activities_template_id` references `report_templates(id)` ON DELETE SET NULL
- `fk_activities_submitted_by` references `users(id)` ON DELETE SET NULL

### activity_evidence
**Purpose**: Stores evidence files associated with activities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| activity_id | bigint | FOREIGN KEY, NOT NULL | Associated activity |
| file_path | varchar(500) | NOT NULL | S3 file path |
| file_name | varchar(255) | NOT NULL | Original file name |
| file_type | enum | NOT NULL | Type: image, document, audio, video |
| file_size | bigint | NOT NULL | File size in bytes |
| mime_type | varchar(100) | NOT NULL | MIME type |
| uploaded_by | bigint | FOREIGN KEY, NOT NULL | User who uploaded |
| created_at | timestamp | NULLABLE | Upload timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_activity_evidence_activity_id` on `activity_id`
- `idx_activity_evidence_file_type` on `file_type`

**Foreign Keys:**
- `fk_activity_evidence_activity_id` references `activities(id)` ON DELETE CASCADE
- `fk_activity_evidence_uploaded_by` references `users(id)` ON DELETE CASCADE

### tags
**Purpose**: Categorisation tags for activities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| name | varchar(100) | UNIQUE, NOT NULL | Tag name |
| category | varchar(50) | NOT NULL | Category: metric, theme, audience, other |
| description | text | NULLABLE | Tag description |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_tags_name` on `name` (unique)
- `idx_tags_category` on `category`

### activity_tags
**Purpose**: Pivot table for activity-tag relationships

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| activity_id | bigint | FOREIGN KEY, NOT NULL | Activity ID |
| tag_id | bigint | FOREIGN KEY, NOT NULL | Tag ID |
| created_at | timestamp | NULLABLE | Creation timestamp |

**Indexes:**
- `idx_activity_tags_activity_id` on `activity_id`
- `idx_activity_tags_tag_id` on `tag_id`
- UNIQUE constraint on `(activity_id, tag_id)`

**Foreign Keys:**
- `fk_activity_tags_activity_id` references `activities(id)` ON DELETE CASCADE
- `fk_activity_tags_tag_id` references `tags(id)` ON DELETE CASCADE

### report_templates
**Purpose**: Customisable reporting templates for standardised activity reporting

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| name | varchar(255) | NOT NULL | Template name |
| description | text | NULLABLE | Template description |
| organisation_id | bigint | FOREIGN KEY, NULLABLE | Organisation template belongs to (null = global) |
| fields | json | NOT NULL | JSON array of field definitions |
| is_active | boolean | NOT NULL, DEFAULT true | Template active status |
| created_by | bigint | FOREIGN KEY, NOT NULL | Admin who created template |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_report_templates_organisation_id` on `organisation_id`
- `idx_report_templates_is_active` on `is_active`

**Foreign Keys:**
- `fk_report_templates_organisation_id` references `organisations(id)` ON DELETE CASCADE
- `fk_report_templates_created_by` references `users(id)` ON DELETE CASCADE

## Relationships

### One-to-Many
- `activities` has many `activity_evidence`
- `activities` has many `activity_tags`
- `organisations` has many `activities`
- `users` has many `activities`
- `report_templates` has many `activities`

### Many-to-Many
- `activities` belongs to many `tags` (via `activity_tags` pivot)

## Data Validation Rules
- Activity date cannot be in the future
- Activity status can only change: draft → submitted → approved/rejected
- Submitted activities cannot be edited by regular users
- File uploads must match allowed types and size limits
- Template fields JSON must be valid schema
- Location field is text only (no geospatial data)

## Migration Strategy
1. Create `tags` table (no dependencies)
2. Create `report_templates` table (depends on organisations, users)
3. Create `activities` table (depends on organisations, users, templates)
4. Create `activity_evidence` table (depends on activities, users)
5. Create `activity_tags` pivot table (depends on activities, tags)

## Seed Data
- Default tags (categories: metric, theme, audience)
- Sample report templates for common activity types
- Sample activities for testing

