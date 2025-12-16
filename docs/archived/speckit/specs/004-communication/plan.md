# Implementation Plan: Communication System

## Overview
Technical implementation plan for Communication System based on the specification in `spec.md`. This enables coordinated communication for public health officials across the organisational hierarchy.

## Technology Stack
- **Backend**: Laravel 10+ with PHP 8.2+
- **Real-Time**: Start with polling (30-second interval), upgrade to WebSocket later
- **Email**: Laravel Mail with queues (optional)
- **Frontend**: Vue 3 + Quasar + Pinia
- **Notifications**: Browser Notifications API
- **Caching**: Redis for unread counts

## Architecture Decisions

### Backend Architecture
- **Controllers**: MessageController, NotificationController
- **Services**: MessageService, NotificationService
- **Jobs**: SendEmailNotification (queued)
- **Polling**: 30-second interval for real-time updates
- **Caching**: Redis for unread notification counts (1 minute TTL)

### Frontend Architecture
- **Components**: MessageInbox, MessageComposer, MessageThread, NotificationBell
- **Stores**: useMessageStore, useNotificationStore
- **Polling**: SetInterval for checking new messages/notifications
- **Notifications**: Browser Notifications API for urgent alerts

## Implementation Phases

### Phase 1: Database Setup
- Create messages table
- Create message_recipients table
- Create notifications table
- Create notification_preferences table
- Create indexes

### Phase 2: Backend Message System
- Create Message model and relationships
- Create MessageController
- Implement send message functionality
- Add organisation filtering
- Implement read receipts

### Phase 3: Backend Notification System
- Create Notification model
- Create NotificationController
- Implement notification creation
- Add notification preferences
- Set up email notifications (optional)

### Phase 4: Backend Services
- Create MessageService
- Create NotificationService
- Implement email notification job
- Add caching for unread counts

### Phase 5: Frontend Messaging
- Create message inbox
- Create message composer
- Create message thread view
- Set up Pinia stores

### Phase 6: Frontend Notifications
- Create notification bell
- Create notification list
- Implement polling
- Add browser notifications

### Phase 7: Frontend Preferences
- Create notification preferences page
- Implement preference updates

## Database Migrations

### Migration 1: Create messages table
- **File**: `YYYY_MM_DD_HHMMSS_create_messages_table.php`
- **Purpose**: Store internal messages
- **Fields**: id, sender_id, subject, body, is_urgent, organisation_id, parent_message_id, timestamps

### Migration 2: Create message_recipients table
- **File**: `YYYY_MM_DD_HHMMSS_create_message_recipients_table.php`
- **Purpose**: Message recipients and read status
- **Fields**: id, message_id, user_id, read_at, deleted_at, timestamps

### Migration 3: Create notifications table
- **File**: `YYYY_MM_DD_HHMMSS_create_notifications_table.php`
- **Purpose**: In-app notifications
- **Fields**: id, user_id, type, title, body, link, read_at, timestamps

### Migration 4: Create notification_preferences table
- **File**: `YYYY_MM_DD_HHMMSS_create_notification_preferences_table.php`
- **Purpose**: User notification preferences
- **Fields**: id, user_id, email_enabled, in_app_enabled, per-type preferences, timestamps

## API Design

### Message Endpoints
- `GET /api/v1/messages` - List messages (inbox)
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/{id}` - Get message details
- `PUT /api/v1/messages/{id}/read` - Mark as read
- `DELETE /api/v1/messages/{id}` - Delete message
- `POST /api/v1/messages/{id}/reply` - Reply to message
- `GET /api/v1/messages/sent` - List sent messages

### Notification Endpoints
- `GET /api/v1/notifications` - List notifications
- `PUT /api/v1/notifications/{id}/read` - Mark notification as read
- `PUT /api/v1/notifications/read-all` - Mark all as read
- `GET /api/v1/notifications/unread-count` - Get unread count
- `GET /api/v1/notifications/preferences` - Get preferences
- `PUT /api/v1/notifications/preferences` - Update preferences

## Frontend Design

### Message Inbox
- **Component**: `MessageInbox.vue`
- **Features**: Message list, filters, search, unread indicators

### Message Composer
- **Component**: `MessageComposer.vue`
- **Features**: Recipient selection, subject, body, urgent flag, send button

### Notification Bell
- **Component**: `NotificationBell.vue`
- **Features**: Unread count badge, dropdown list, mark as read

## Testing Strategy
- Feature tests for messaging
- Notification creation tests
- Polling functionality tests
- Email notification tests (if enabled)

## Performance Optimization
- Pagination for message lists
- Cache unread counts (Redis, 1 minute)
- Lazy loading of message threads
- Index on user_id and read_at

## Security Considerations
- Users can only see messages they sent/received
- Organisation filtering for broadcasts
- Rate limiting on message sending
- Spam prevention

## Risk Mitigation
- **Polling Performance**: 30-second interval, cache unread counts
- **Email Delivery**: Use queues, handle failures gracefully
- **Real-Time**: Start with polling, upgrade to WebSocket if needed

## Dependencies
- **External**: Laravel Mail, Laravel Queue, Redis
- **Internal**: Epic 001 (required)

## Success Criteria
- [ ] Messages can be sent and received
- [ ] Notifications work correctly
- [ ] Polling updates work
- [ ] Email notifications work (if enabled)
- [ ] Preferences work
- [ ] All tests passing

