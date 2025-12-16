# Story US-023: Organisation-Level Messaging

**Epic:** Epic 004 - Communication System

**As a** State Admin or Super Admin  
**I want to** send messages to all users in my organisation or sub-organisations  
**So that** I can broadcast announcements and updates

## Acceptance Criteria

- [ ] Admin can send message to entire organisation
- [ ] Admin can send message to specific organisation level (e.g., all LGAs)
- [ ] Message is delivered to all recipients
- [ ] Recipients see message in their inbox
- [ ] Broadcast messages are marked as such
- [ ] Admin can see delivery status (who received, who read)

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/messages/broadcast`
- Logic: Create message records for all recipients in organisation hierarchy
- Performance: Use background job for large broadcasts

### Frontend
- Component: `MessageBroadcast.vue`
- Features: Organisation selector, message composer, recipient count
- Store: `useMessageStore.ts` with `broadcastMessage()` action

## Dependencies
- Epic 001: User & Organisation Management (for organisation hierarchy)
- Epic 004: US-022 (Internal Messaging foundation)

## Status
Ready for implementation
