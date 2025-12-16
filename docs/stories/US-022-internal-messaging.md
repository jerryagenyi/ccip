# Story US-022: Internal Messaging

**Epic:** Epic 004 - Communication System

**As a** user  
**I want to** send and receive one-on-one messages with other users  
**So that** I can communicate directly with colleagues

## Acceptance Criteria

- [ ] User can send messages to other users
- [ ] User can view message inbox
- [ ] Messages show read/unread status
- [ ] User can reply to messages
- [ ] Real-time message delivery (or near-real-time)
- [ ] Message notifications (browser and/or email)

## Technical Details

### Backend
- API Endpoints: 
  - `GET /api/v1/messages`
  - `POST /api/v1/messages`
  - `PUT /api/v1/messages/{id}/read`
- Model: `Message` with fields: sender_id, recipient_id, subject, body, read_at, timestamps
- Real-time: Laravel Broadcasting + Pusher (MVP), WebSocket (Phase 2)

### Frontend
- Components: `MessageInbox.vue`, `MessageCompose.vue`, `MessageDetail.vue`
- Store: `useMessageStore.ts` with messaging actions
- Real-time: Subscribe to Pusher channels for new messages

## Dependencies
- Epic 001: User & Organisation Management (for user context)

## Status
Ready for implementation
