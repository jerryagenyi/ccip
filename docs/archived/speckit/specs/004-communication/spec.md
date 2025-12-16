# Feature Specification: Communication System

## Overview
Implement internal messaging and notification system for communication between organisation levels. This enables coordinated communication for public health officials across the organisational hierarchy, supporting urgent alerts and routine messaging.

## User Stories

### US-015: Internal Messaging
- **As a** user
- **I want to** send messages to other users
- **So that** I can communicate within the organisation

**Acceptance Criteria:**
- [ ] Send message to individual users
- [ ] Send message to user groups (by role)
- [ ] View message thread/conversation
- [ ] Mark messages as read/unread
- [ ] Search message history
- [ ] Reply to messages
- [ ] Delete own messages (before read)

### US-016: Organisation-Level Messaging
- **As an** admin
- **I want to** send messages to all users in my organisation
- **So that** I can broadcast information

**Acceptance Criteria:**
- [ ] Send to all users in organisation
- [ ] Send to specific role groups within organisation
- [ ] Message delivery confirmation
- [ ] View who has read the message
- [ ] View read receipts
- [ ] Broadcast to sub-organisations (optional)

### US-017: Notifications
- **As a** user
- **I want to** receive notifications
- **So that** I'm aware of important updates

**Acceptance Criteria:**
- [ ] In-app notifications
- [ ] Email notifications (optional, user preference)
- [ ] Notification preferences (per notification type)
- [ ] Mark notifications as read
- [ ] Notification history
- [ ] Notification count badge
- [ ] Clear all notifications

### US-018: Urgent Alerts
- **As an** admin
- **I want to** send urgent alerts
- **So that** critical information reaches users immediately

**Acceptance Criteria:**
- [ ] Mark messages as urgent
- [ ] Urgent notifications are highlighted
- [ ] Cannot be dismissed until read
- [ ] Visual alert (badge, colour)
- [ ] Sound alert (optional, browser notification)
- [ ] Email notification for urgent alerts (if enabled)

### US-019: Announcements System
- **As a** user
- **I want to** view announcements from platform, Federal, State, and LGA levels
- **So that** I can stay informed about updates and important information

**Acceptance Criteria:**
- [ ] View all announcements in a dedicated announcements page
- [ ] Filter announcements by type:
  - Platform Updates (feature updates, system maintenance)
  - Federal Announcements
  - State Announcements
  - LGA Updates
- [ ] All users can read all announcement types (read-only access)
- [ ] Clear visual distinction between announcement types (badges, icons, colours)
- [ ] Search announcements by title, content, or organisation
- [ ] Sort by date (newest first, oldest first) or importance
- [ ] Mark announcements as read/unread
- [ ] Mark all announcements as read
- [ ] View announcement detail with full content
- [ ] Support rich text formatting in announcements
- [ ] Support attachments in announcements (optional)
- [ ] Notification badge when unread announcements exist
- [ ] Announcements accessible from navigation menu (desktop sidebar and mobile bottom nav)

## Technical Requirements

### Database Schema
- **messages** table:
  - id, sender_id, subject, body, is_urgent, organisation_id, created_at, updated_at
- **message_recipients** table:
  - id, message_id, user_id, read_at, deleted_at
- **notifications** table:
  - id, user_id, type, title, body, read_at, created_at
- **notification_preferences** table:
  - id, user_id, notification_type, email_enabled, in_app_enabled
- **announcements** table:
  - id, type (enum: platform_update, federal, state, lga), title, content, author_id, organisation_id (nullable), is_pinned, created_at, updated_at
- **announcement_reads** table:
  - id, announcement_id, user_id, read_at

### API Endpoints
- `GET /api/v1/messages` - List messages (inbox)
- `POST /api/v1/messages` - Send message
- `GET /api/v1/messages/{id}` - Get message details
- `PUT /api/v1/messages/{id}/read` - Mark as read
- `DELETE /api/v1/messages/{id}` - Delete message
- `POST /api/v1/messages/{id}/reply` - Reply to message
- `GET /api/v1/messages/sent` - List sent messages
- `GET /api/v1/notifications` - List notifications
- `PUT /api/v1/notifications/{id}/read` - Mark notification as read
- `PUT /api/v1/notifications/read-all` - Mark all as read
- `GET /api/v1/notifications/preferences` - Get preferences
- `PUT /api/v1/notifications/preferences` - Update preferences
- `GET /api/v1/notifications/unread-count` - Get unread count
- `GET /api/v1/announcements` - List announcements (with filters: type, search, sort)
- `GET /api/v1/announcements/{id}` - Get announcement details
- `POST /api/v1/announcements` - Create announcement (Admin/Super Admin only)
- `PUT /api/v1/announcements/{id}` - Update announcement (Admin/Super Admin only)
- `PUT /api/v1/announcements/{id}/read` - Mark announcement as read
- `PUT /api/v1/announcements/read-all` - Mark all announcements as read
- `GET /api/v1/announcements/unread-count` - Get unread announcement count

### Frontend Components
- `MessageInbox.vue` - Message inbox list
- `MessageComposer.vue` - Compose new message
- `MessageThread.vue` - Message conversation view
- `MessageDetail.vue` - Message detail view
- `NotificationBell.vue` - Notification indicator
- `NotificationList.vue` - Notification list
- `NotificationPreferences.vue` - Preferences page
- `AnnouncementsPage.vue` - Announcements list with filters
- `AnnouncementDetail.vue` - Announcement detail view
- `AnnouncementCard.vue` - Announcement card component
- `AnnouncementForm.vue` - Create/edit announcement (Admin only)
- `useMessageStore.ts` - Pinia store for messages
- `useNotificationStore.ts` - Pinia store for notifications
- `useAnnouncementStore.ts` - Pinia store for announcements

## Dependencies
- Real-time updates (start with polling, upgrade to WebSocket later)
- Email service (optional, for email notifications)
- Notification service
- Epic 001 (User & Organisation Management) - Required

## Security Considerations
- Users can only see messages they sent or received
- Organisation filtering for broadcast messages
- Message encryption (future consideration)
- Rate limiting on message sending
- Spam prevention

## Performance Considerations
- Pagination for message lists
- Lazy loading of message threads
- Polling interval: 30 seconds (start with polling)
- Cache unread counts (Redis, 1 minute TTL)
- Index on user_id and read_at for notifications

## Priority
**Medium** - Important for coordination

## Related Epics
- Epic 001: User & Organisation Management (required dependency)
- Epic 002: Activity Tracking (notifications for activity submissions)
- Epic 003: Dashboards (notifications for dashboard updates)

