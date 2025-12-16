# Story US-011: Activity Timeline & Status Tracking

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** user  
**I want to** view the complete timeline and status history of an activity  
**So that** I can track progress and understand what has happened

## Acceptance Criteria

- [ ] Activity detail page shows complete timeline
- [ ] Timeline includes: creation, submissions, approvals/rejections, status changes, report submissions
- [ ] Each timeline entry shows: timestamp, user, action, notes
- [ ] Timeline is chronological (newest first or oldest first, toggleable)
- [ ] Visual timeline component with status indicators
- [ ] Filter timeline by event type (optional)

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/activities/{id}/timeline`
- Data sources: `activities` table, `activity_status_history` table, `activity_reports` table
- Aggregation: Combine events from multiple tables, sort chronologically

### Frontend
- Component: `ActivityTimeline.vue`
- Features: Timeline visualization, event filtering, user avatars
- Store: `useActivityStore.ts` with `getActivityTimeline()` action

## Dependencies
- Epic 001: User & Organisation Management (for user information in timeline)

## Status
Ready for implementation
