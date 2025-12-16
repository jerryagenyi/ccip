# Story US-025: Urgent Alerts

**Epic:** Epic 004 - Communication System

**As a** State Admin or Super Admin  
**I want to** send urgent alerts that require immediate attention  
**So that** I can communicate critical information during crises

## Acceptance Criteria

- [ ] Admin can mark message as "urgent"
- [ ] Urgent alerts appear prominently (banner, modal, or push notification)
- [ ] Urgent alerts require acknowledgment before dismissal
- [ ] Urgent alerts are delivered via multiple channels (in-app, email, SMS if available)
- [ ] Urgent alerts are logged for audit purposes

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/messages` (with urgent flag)
- Model: `Message` with `is_urgent` boolean field
- Delivery: Multiple channels (in-app notification, email, SMS queue)
- Audit: Log urgent alert deliveries

### Frontend
- Component: `UrgentAlertBanner.vue` or `UrgentAlertModal.vue`
- Features: Prominent display, acknowledgment button, cannot be dismissed without action
- Store: `useMessageStore.ts` with urgent alert handling

## Dependencies
- Epic 001: User & Organisation Management (for admin permissions)
- Epic 004: US-022 (Internal Messaging), US-024 (Notifications)

## Status
Ready for implementation
