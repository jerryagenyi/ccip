# Story US-018: Activity Status Tracking

**Epic:** Epic 003 - Dashboards & Analytics

**As a** State Admin or LGA Officer  
**I want to** track activity status across my organisation  
**So that** I can monitor progress and identify bottlenecks

## Acceptance Criteria

- [ ] Dashboard shows activity counts by status (draft, submitted, approved, active, completed)
- [ ] Status breakdown is visual (cards, charts, or lists)
- [ ] Clicking a status shows filtered activity list
- [ ] Status counts update in real-time or on refresh
- [ ] Status tracking respects organisation hierarchy

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/dashboard/activity-status`
- Aggregation: Count activities by status, filtered by user's organisation scope
- Performance: Use database aggregation, cache results

### Frontend
- Component: `ActivityStatusCards.vue` or `ActivityStatusChart.vue`
- Store: `useDashboardStore.ts` with `getActivityStatus()` action
- Visualization: Cards with counts, or pie/bar chart

## Dependencies
- Epic 001: User & Organisation Management (for organisation scope)
- Epic 002: Activity Tracking & Reporting (for activity data)

## Status
Ready for implementation
