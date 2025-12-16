# Task Breakdown: Communication System

Tasks organized by user story with dependencies respected.

## User Story: US-015 - Internal Messaging

### Database Tasks
- [ ] **Task DB-017**: Create messages table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_messages_table.php`
  - Dependencies: Epic 001 (users, organisations)
  - Estimated Time: 1.5 hours

- [ ] **Task DB-018**: Create message_recipients table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_message_recipients_table.php`
  - Dependencies: Task DB-017, Epic 001 (users)
  - Estimated Time: 1.5 hours

### Backend Tasks
- [ ] **Task BE-076**: Create Message model
  - File: `backend/app/Models/Message.php`
  - Dependencies: Task DB-017
  - Estimated Time: 1.5 hours

- [ ] **Task BE-077**: Create MessageRecipient model
  - File: `backend/app/Models/MessageRecipient.php`
  - Dependencies: Task DB-018
  - Estimated Time: 1 hour

- [ ] **Task BE-078**: Create MessageService
  - File: `backend/app/Services/MessageService.php`
  - Dependencies: Task BE-076
  - Estimated Time: 3 hours

- [ ] **Task BE-079**: Create MessageRequest form validation
  - File: `backend/app/Http/Requests/Message/MessageRequest.php`
  - Dependencies: None
  - Estimated Time: 1 hour

- [ ] **Task BE-080**: Create MessageController
  - File: `backend/app/Http/Controllers/MessageController.php`
  - Dependencies: Task BE-078, Task BE-079
  - Estimated Time: 4 hours

### Frontend Tasks
- [ ] **Task FE-043**: Create Pinia message store
  - File: `frontend/src/stores/useMessageStore.ts`
  - Dependencies: None
  - Estimated Time: 2 hours

- [ ] **Task FE-044**: Create MessageInbox component
  - File: `frontend/src/pages/MessageInbox.vue`
  - Dependencies: Task FE-043
  - Estimated Time: 4 hours

- [ ] **Task FE-045**: Create MessageComposer component
  - File: `frontend/src/components/MessageComposer.vue`
  - Dependencies: Task FE-043
  - Estimated Time: 3 hours

- [ ] **Task FE-046**: Create MessageThread component
  - File: `frontend/src/components/MessageThread.vue`
  - Dependencies: Task FE-043
  - Estimated Time: 3 hours

## User Story: US-016 - Organisation-Level Messaging

### Backend Tasks
- [ ] **Task BE-081**: Add broadcast functionality to MessageService
  - File: `backend/app/Services/MessageService.php`
  - Dependencies: Task BE-078
  - Estimated Time: 2 hours

- [ ] **Task BE-082**: Add read receipts tracking
  - File: `backend/app/Http/Controllers/MessageController.php`
  - Dependencies: Task BE-080
  - Estimated Time: 1.5 hours

## User Story: US-017 - Notifications

### Database Tasks
- [ ] **Task DB-019**: Create notifications table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_notifications_table.php`
  - Dependencies: Epic 001 (users)
  - Estimated Time: 1 hour

- [ ] **Task DB-020**: Create notification_preferences table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_notification_preferences_table.php`
  - Dependencies: Epic 001 (users)
  - Estimated Time: 1 hour

### Backend Tasks
- [ ] **Task BE-083**: Create Notification model
  - File: `backend/app/Models/Notification.php`
  - Dependencies: Task DB-019
  - Estimated Time: 1 hour

- [ ] **Task BE-084**: Create NotificationPreference model
  - File: `backend/app/Models/NotificationPreference.php`
  - Dependencies: Task DB-020
  - Estimated Time: 1 hour

- [ ] **Task BE-085**: Create NotificationService
  - File: `backend/app/Services/NotificationService.php`
  - Dependencies: Task BE-083
  - Estimated Time: 2.5 hours

- [ ] **Task BE-086**: Create NotificationController
  - File: `backend/app/Http/Controllers/NotificationController.php`
  - Dependencies: Task BE-085
  - Estimated Time: 2.5 hours

- [ ] **Task BE-087**: Create SendEmailNotification job
  - File: `backend/app/Jobs/SendEmailNotification.php`
  - Dependencies: Task BE-085
  - Estimated Time: 2 hours

- [ ] **Task BE-088**: Implement Redis caching for unread counts
  - File: `backend/app/Services/NotificationService.php`
  - Dependencies: Task BE-085
  - Estimated Time: 1.5 hours

### Frontend Tasks
- [ ] **Task FE-047**: Create Pinia notification store
  - File: `frontend/src/stores/useNotificationStore.ts`
  - Dependencies: None
  - Estimated Time: 2 hours

- [ ] **Task FE-048**: Create NotificationBell component
  - File: `frontend/src/components/NotificationBell.vue`
  - Dependencies: Task FE-047
  - Estimated Time: 3 hours

- [ ] **Task FE-049**: Create NotificationList component
  - File: `frontend/src/components/NotificationList.vue`
  - Dependencies: Task FE-047
  - Estimated Time: 3 hours

- [ ] **Task FE-050**: Implement polling for notifications
  - File: `frontend/src/stores/useNotificationStore.ts`
  - Dependencies: Task FE-047
  - Estimated Time: 2 hours

## User Story: US-018 - Urgent Alerts

### Backend Tasks
- [ ] **Task BE-089**: Add urgent flag handling to MessageService
  - File: `backend/app/Services/MessageService.php`
  - Dependencies: Task BE-078
  - Estimated Time: 1 hour

### Frontend Tasks
- [ ] **Task FE-051**: Add urgent alert UI
  - File: `frontend/src/components/MessageComposer.vue`, `NotificationBell.vue`
  - Dependencies: Task FE-045, Task FE-048
  - Estimated Time: 2 hours

- [ ] **Task FE-052**: Implement browser notifications for urgent alerts
  - File: `frontend/src/stores/useNotificationStore.ts`
  - Dependencies: Task FE-047
  - Estimated Time: 2 hours

## User Story: Notification Preferences

### Frontend Tasks
- [ ] **Task FE-053**: Create NotificationPreferences page
  - File: `frontend/src/pages/NotificationPreferences.vue`
  - Dependencies: Task FE-047
  - Estimated Time: 3 hours

## Testing Tasks
- [ ] **Task TEST-014**: Write feature tests for messaging
  - File: `backend/tests/Feature/Message/MessageTest.php`
  - Dependencies: Task BE-080
  - Estimated Time: 3 hours

- [ ] **Task TEST-015**: Write feature tests for notifications
  - File: `backend/tests/Feature/Notification/NotificationTest.php`
  - Dependencies: Task BE-086
  - Estimated Time: 2.5 hours

## Estimated Timeline
- **Total Tasks**: 40+
- **Estimated Hours**: ~60 hours
- **Estimated Days**: ~7-8 days
- **Estimated Weeks**: ~1.5 weeks

