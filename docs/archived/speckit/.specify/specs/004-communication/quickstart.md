# Quick Start: Communication System

## Overview
Quick reference guide for implementing the Communication System feature.

## Implementation Order

1. **Database Setup**
   - Run migrations for messages, message_recipients, notifications, notification_preferences
   - Create indexes for performance
   - Seed default notification preferences

2. **Backend Models & Relationships**
   - Create Message model
   - Create MessageRecipient model
   - Create Notification model
   - Create NotificationPreference model
   - Set up model relationships

3. **Backend API - Messages**
   - Create MessageController
   - Implement send message endpoint
   - Implement inbox endpoint
   - Implement read/unread functionality
   - Add reply functionality

4. **Backend API - Notifications**
   - Create NotificationController
   - Implement notification list endpoint
   - Implement mark as read endpoint
   - Implement unread count endpoint
   - Add notification preferences endpoint

5. **Backend Services**
   - Create MessageService for business logic
   - Create NotificationService for notification creation
   - Implement email notification service (optional)
   - Set up queue jobs for email

6. **Frontend - Messages**
   - Create MessageInbox component
   - Create MessageComposer component
   - Create MessageThread component
   - Set up Pinia store

7. **Frontend - Notifications**
   - Create NotificationBell component
   - Create NotificationList component
   - Create NotificationPreferences page
   - Set up polling for updates

8. **Real-Time Updates**
   - Implement polling (30-second interval)
   - Add unread count updates
   - Add new message indicators

## Key Files

### Backend
- `app/Models/Message.php`
- `app/Models/MessageRecipient.php`
- `app/Models/Notification.php`
- `app/Models/NotificationPreference.php`
- `app/Http/Controllers/MessageController.php`
- `app/Http/Controllers/NotificationController.php`
- `app/Services/MessageService.php`
- `app/Services/NotificationService.php`
- `app/Jobs/SendEmailNotification.php`
- `database/migrations/*_create_*.php`

### Frontend
- `src/components/MessageInbox.vue`
- `src/components/MessageComposer.vue`
- `src/components/MessageThread.vue`
- `src/components/NotificationBell.vue`
- `src/components/NotificationList.vue`
- `src/pages/NotificationPreferences.vue`
- `src/stores/useMessageStore.ts`
- `src/stores/useNotificationStore.ts`

## Testing Checklist
- [ ] Send message to individual user
- [ ] Send message to role group
- [ ] Broadcast to organisation
- [ ] Mark message as read
- [ ] Reply to message
- [ ] Delete message
- [ ] Receive notification
- [ ] Mark notification as read
- [ ] Update notification preferences
- [ ] Urgent alert works
- [ ] Email notification works (if enabled)
- [ ] Polling updates work

## Common Issues
- **Messages not appearing**: Check organisation filtering
- **Notifications not updating**: Verify polling interval
- **Email not sending**: Check queue configuration
- **Unread count incorrect**: Check caching logic

## Dependencies
- Epic 001 must be complete (users, organisations)
- Laravel Mail configured (for email notifications)
- Laravel Queue configured (for async email)
- Redis configured (for caching)

