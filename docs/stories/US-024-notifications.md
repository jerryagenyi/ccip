# Story US-024: Notifications

**Epic:** Epic 004 - Communication System

**As a** user  
**I want to** receive notifications for important events  
**So that** I don't miss critical updates

## Acceptance Criteria

- [ ] User receives notifications for: new messages, activity status changes, approvals needed
- [ ] Notifications appear in notification center (bell icon)
- [ ] Notifications show unread count
- [ ] User can mark notifications as read
- [ ] User can dismiss notifications
- [ ] Real-time notification delivery
- [ ] Browser push notifications (optional, with permission)

## Technical Details

### Backend
- API Endpoints: 
  - `GET /api/v1/notifications`
  - `PUT /api/v1/notifications/{id}/read`
- Model: `Notification` with fields: user_id, type, title, body, read_at, timestamps
- Real-time: Laravel Broadcasting + Pusher

### Frontend
- Component: `NotificationCenter.vue` (dropdown or sidebar)
- Store: `useNotificationStore.ts` with notification management
- Real-time: Subscribe to user-specific notification channel

## Dependencies
- Epic 001: User & Organisation Management (for user context)

## Status
Ready for implementation
