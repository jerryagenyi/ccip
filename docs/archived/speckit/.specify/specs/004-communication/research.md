# Research: Communication System

## Technology Research

### Real-Time Updates
- **Polling**: Start with polling (30-second interval)
  - Simple to implement
  - Works in all browsers
  - Low bandwidth overhead
  - Upgrade to WebSocket later if needed

- **WebSocket**: Future enhancement
  - Laravel Echo + Pusher (or Socket.io)
  - Real-time bidirectional communication
  - Better for high-frequency updates
  - More complex setup

**Recommendation**: Start with polling for MVP, upgrade later

### Email Service
- **Laravel Mail**: Built-in mail system
- **SMTP**: Standard SMTP for email delivery
- **Queue**: Use Laravel queues for async email sending
- **Templates**: Blade templates for email formatting

**Optional**: Email notifications can be disabled per user preference

### Notification System
- **Browser Notifications**: Use Web Notifications API
  - Requires user permission
  - Works for urgent alerts
  - Cross-browser support

- **In-App Notifications**: Custom notification system
  - Badge count
  - Notification list
  - Mark as read functionality

## Security Research

### Message Security
- **Access Control**: Users can only see messages they sent/received
- **Organisation Filtering**: Broadcast messages filtered by organisation
- **Rate Limiting**: Prevent spam (max 10 messages per minute)
- **Content Filtering**: Basic profanity filter (optional)

### Notification Security
- **User-Specific**: Notifications only visible to recipient
- **No Sensitive Data**: Don't include sensitive info in notifications
- **Link Validation**: Validate notification links

## Performance Research

### Database Optimization
- **Indexes**: On user_id, read_at, created_at
- **Pagination**: 20 messages per page
- **Soft Deletes**: Use deleted_at for message_recipients
- **Archiving**: Archive old notifications (30+ days)

### Caching Strategy
- **Unread Counts**: Cache in Redis (1 minute TTL)
- **Message Lists**: Cache for 30 seconds
- **Invalidate**: On message send/receive/read

### Query Optimization
- **Eager Loading**: Load relationships efficiently
- **Lazy Loading**: Load message threads on demand
- **Selective Fields**: Only load needed fields

## Low-Bandwidth Optimizations
- **Polling Interval**: 30 seconds (configurable)
- **Minimal Payloads**: Only send unread count, not full messages
- **Lazy Loading**: Load message content on demand
- **Compression**: Compress API responses (gzip)

## Implementation Notes
- **Message Threading**: Support replies (parent_message_id)
- **Read Receipts**: Track when messages are read
- **Urgent Alerts**: Cannot be dismissed until read
- **Email Notifications**: Optional, user-controlled
- **Notification Preferences**: Per notification type

## Dependencies
- Epic 001 (User & Organisation Management) - Required
- Laravel Mail (for email notifications)
- Laravel Queue (for async email sending)
- Redis (for caching unread counts)

## Future Enhancements
- WebSocket for real-time updates
- Message encryption
- File attachments in messages
- Message search with full-text search
- Message templates

