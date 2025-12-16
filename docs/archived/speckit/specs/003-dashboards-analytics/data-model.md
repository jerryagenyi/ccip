# Data Model: Dashboards & Analytics

## Overview
Database schema and data relationships for dashboard analytics, status tracking, engagement metrics, and reporting.

## Entity Relationship Diagram

```
[activities] --< has many >-- [activity_status_history]
[activities] --< has many >-- [engagement_metrics]
[activity_status_history] --< belongs to >-- [users] (changed_by)
```

## Tables

### activity_status_history
**Purpose**: Audit trail for activity status changes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| activity_id | bigint | FOREIGN KEY, NOT NULL | Activity ID |
| status | enum | NOT NULL | Status: draft, submitted, approved, rejected |
| changed_by | bigint | FOREIGN KEY, NOT NULL | User who changed status |
| changed_at | timestamp | NOT NULL, DEFAULT NOW() | Status change timestamp |
| notes | text | NULLABLE | Optional notes about status change |
| previous_status | enum | NULLABLE | Previous status (for history) |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_activity_status_history_activity_id` on `activity_id`
- `idx_activity_status_history_changed_at` on `changed_at`
- `idx_activity_status_history_status` on `status`

**Foreign Keys:**
- `fk_activity_status_history_activity_id` references `activities(id)` ON DELETE CASCADE
- `fk_activity_status_history_changed_by` references `users(id)` ON DELETE CASCADE

### engagement_metrics
**Purpose**: Stores engagement metrics for activities

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| activity_id | bigint | FOREIGN KEY, NOT NULL | Activity ID |
| metric_type | enum | NOT NULL | Type: reach, engagement, feedback, attendance |
| value | decimal(10,2) | NOT NULL | Metric value |
| unit | varchar(50) | NULLABLE | Unit of measurement (e.g., "people", "percentage") |
| recorded_at | timestamp | NOT NULL, DEFAULT NOW() | Recording timestamp |
| recorded_by | bigint | FOREIGN KEY, NULLABLE | User who recorded metric |
| notes | text | NULLABLE | Additional context |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_engagement_metrics_activity_id` on `activity_id`
- `idx_engagement_metrics_metric_type` on `metric_type`
- `idx_engagement_metrics_recorded_at` on `recorded_at`

**Foreign Keys:**
- `fk_engagement_metrics_activity_id` references `activities(id)` ON DELETE CASCADE
- `fk_engagement_metrics_recorded_by` references `users(id)` ON DELETE SET NULL

## Relationships

### One-to-Many
- `activities` has many `activity_status_history`
- `activities` has many `engagement_metrics`
- `users` has many `activity_status_history` (as changed_by)

## Data Validation Rules
- Status changes must follow workflow: draft → submitted → approved/rejected
- Engagement metrics must have positive values
- Metric types must be from allowed enum values
- Status history cannot be deleted (audit trail)

## Aggregated Views (Computed)

### Dashboard Summary (Computed)
- Total activities count
- Activities by status (draft, submitted, approved, rejected)
- Activities by type
- Recent activities (last 7 days)
- Upcoming activities (next 7 days)

### Analytics Aggregations (Computed)
- Activities per day/week/month (for heatmap)
- Average engagement rate
- Engagement trends over time
- Organisation comparison metrics

## Migration Strategy
1. Create `activity_status_history` table (depends on activities, users)
2. Create `engagement_metrics` table (depends on activities, users)
3. Migrate existing activity status data to history table
4. Create database views for common aggregations (optional)

## Seed Data
- Sample status history entries for testing
- Sample engagement metrics for demonstration

## Performance Optimization
- Materialized views for dashboard summaries (refresh every 5 minutes)
- Index on date fields for time-based queries
- Cache aggregated data in Redis
- Partition activity_status_history by date (if large volume)

