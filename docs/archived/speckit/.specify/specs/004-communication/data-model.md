# Data Model: Communication System

## Overview
Database schema and data relationships for internal messaging, notifications, and communication preferences.

## Entity Relationship Diagram

```
[messages] --< has many >-- [message_recipients] --< belongs to >-- [users]
[messages] --< belongs to >-- [users] (sender)
[messages] --< belongs to >-- [organisations]
[users] --< has many >-- [notifications]
[users] --< has one >-- [notification_preferences]
[announcements] --< belongs to >-- [users] (author)
[announcements] --< belongs to >-- [organisations] (optional)
[announcements] --< has many >-- [announcement_reads] --< belongs to >-- [users]
```

## Tables

### messages
**Purpose**: Stores internal messages between users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| sender_id | bigint | FOREIGN KEY, NOT NULL | User who sent message |
| subject | varchar(255) | NOT NULL | Message subject |
| body | text | NOT NULL | Message body |
| is_urgent | boolean | NOT NULL, DEFAULT false | Urgent flag |
| organisation_id | bigint | FOREIGN KEY, NULLABLE | Organisation context (for broadcasts) |
| parent_message_id | bigint | FOREIGN KEY, NULLABLE | Parent message (for replies) |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_messages_sender_id` on `sender_id`
- `idx_messages_organisation_id` on `organisation_id`
- `idx_messages_created_at` on `created_at`
- `idx_messages_is_urgent` on `is_urgent`

**Foreign Keys:**
- `fk_messages_sender_id` references `users(id)` ON DELETE CASCADE
- `fk_messages_organisation_id` references `organisations(id)` ON DELETE CASCADE
- `fk_messages_parent_message_id` references `messages(id)` ON DELETE CASCADE

### message_recipients
**Purpose**: Stores message recipients and read status

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| message_id | bigint | FOREIGN KEY, NOT NULL | Message ID |
| user_id | bigint | FOREIGN KEY, NOT NULL | Recipient user ID |
| read_at | timestamp | NULLABLE | Read timestamp |
| deleted_at | timestamp | NULLABLE | Soft delete timestamp |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_message_recipients_message_id` on `message_id`
- `idx_message_recipients_user_id` on `user_id`
- `idx_message_recipients_read_at` on `read_at`
- UNIQUE constraint on `(message_id, user_id)`

**Foreign Keys:**
- `fk_message_recipients_message_id` references `messages(id)` ON DELETE CASCADE
- `fk_message_recipients_user_id` references `users(id)` ON DELETE CASCADE

### notifications
**Purpose**: Stores in-app notifications for users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| user_id | bigint | FOREIGN KEY, NOT NULL | User who receives notification |
| type | enum | NOT NULL | Type: message, activity, system, urgent |
| title | varchar(255) | NOT NULL | Notification title |
| body | text | NOT NULL | Notification body |
| link | varchar(500) | NULLABLE | Link to related resource |
| read_at | timestamp | NULLABLE | Read timestamp |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_notifications_user_id` on `user_id`
- `idx_notifications_read_at` on `read_at`
- `idx_notifications_type` on `type`
- `idx_notifications_created_at` on `created_at`

**Foreign Keys:**
- `fk_notifications_user_id` references `users(id)` ON DELETE CASCADE

### notification_preferences
**Purpose**: Stores user notification preferences

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| user_id | bigint | FOREIGN KEY, UNIQUE, NOT NULL | User ID |
| email_enabled | boolean | NOT NULL, DEFAULT true | Email notifications enabled |
| in_app_enabled | boolean | NOT NULL, DEFAULT true | In-app notifications enabled |
| message_email | boolean | NOT NULL, DEFAULT false | Email for messages |
| message_in_app | boolean | NOT NULL, DEFAULT true | In-app for messages |
| activity_email | boolean | NOT NULL, DEFAULT false | Email for activities |
| activity_in_app | boolean | NOT NULL, DEFAULT true | In-app for activities |
| urgent_email | boolean | NOT NULL, DEFAULT true | Email for urgent (always on) |
| urgent_in_app | boolean | NOT NULL, DEFAULT true | In-app for urgent (always on) |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_notification_preferences_user_id` on `user_id` (unique)

**Foreign Keys:**
- `fk_notification_preferences_user_id` references `users(id)` ON DELETE CASCADE

### announcements
**Purpose**: Stores platform and organisation-level announcements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| type | enum | NOT NULL | Type: platform_update, federal, state, lga |
| title | varchar(255) | NOT NULL | Announcement title |
| content | text | NOT NULL | Announcement content (rich text) |
| author_id | bigint | FOREIGN KEY, NOT NULL | User who created announcement |
| organisation_id | bigint | FOREIGN KEY, NULLABLE | Organisation context (null for platform updates) |
| is_pinned | boolean | NOT NULL, DEFAULT false | Pin to top of list |
| created_at | timestamp | NULLABLE | Creation timestamp |
| updated_at | timestamp | NULLABLE | Last update timestamp |

**Indexes:**
- `idx_announcements_type` on `type`
- `idx_announcements_organisation_id` on `organisation_id`
- `idx_announcements_created_at` on `created_at`
- `idx_announcements_is_pinned` on `is_pinned`

**Foreign Keys:**
- `fk_announcements_author_id` references `users(id)` ON DELETE RESTRICT
- `fk_announcements_organisation_id` references `organisations(id)` ON DELETE CASCADE

### announcement_reads
**Purpose**: Tracks which users have read which announcements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | bigint | PRIMARY KEY, AUTO_INCREMENT | Primary key |
| announcement_id | bigint | FOREIGN KEY, NOT NULL | Announcement ID |
| user_id | bigint | FOREIGN KEY, NOT NULL | User who read announcement |
| read_at | timestamp | NOT NULL | Read timestamp |
| created_at | timestamp | NULLABLE | Creation timestamp |

**Indexes:**
- `idx_announcement_reads_announcement_id` on `announcement_id`
- `idx_announcement_reads_user_id` on `user_id`
- UNIQUE constraint on `(announcement_id, user_id)`

**Foreign Keys:**
- `fk_announcement_reads_announcement_id` references `announcements(id)` ON DELETE CASCADE
- `fk_announcement_reads_user_id` references `users(id)` ON DELETE CASCADE

## Relationships

### One-to-Many
- `messages` has many `message_recipients`
- `messages` can have many `messages` (replies, parent_message_id)
- `users` has many `messages` (as sender)
- `users` has many `message_recipients` (as recipient)
- `users` has many `notifications`
- `users` has one `notification_preferences`

### Many-to-Many
- `messages` belongs to many `users` (via `message_recipients`)
- `announcements` belongs to many `users` (via `announcement_reads`)

## Data Validation Rules
- Message subject required, max 255 characters
- Message body required, max 10000 characters
- Urgent messages cannot be deleted until read
- Notification preferences must have user
- Read receipts tracked per recipient
- Announcement type must be one of: platform_update, federal, state, lga
- Announcement title required, max 255 characters
- Announcement content required, supports rich text
- Platform announcements (type: platform_update) should have null organisation_id
- Organisation announcements should have organisation_id set
- Announcement reads tracked per user per announcement (unique constraint)

## Migration Strategy
1. Create `messages` table (depends on users, organisations)
2. Create `message_recipients` table (depends on messages, users)
3. Create `notifications` table (depends on users)
4. Create `notification_preferences` table (depends on users)
5. Create `announcements` table (depends on users, organisations)
6. Create `announcement_reads` table (depends on announcements, users)

## Seed Data
- Default notification preferences for new users
- Sample messages for testing

## Performance Optimization
- Index on user_id and read_at for fast unread queries
- Soft delete for message_recipients (deleted_at)
- Pagination for message lists
- Cache unread counts (Redis, 1 minute TTL)
- Archive old notifications (after 30 days)

