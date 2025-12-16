# Story US-020: Engagement Analytics

**Epic:** Epic 003 - Dashboards & Analytics

**As a** State Admin or Super Admin  
**I want to** view engagement analytics (effectiveness scores, compliance rates)  
**So that** I can measure communication campaign success

## Acceptance Criteria

- [ ] Dashboard shows average effectiveness scores
- [ ] Dashboard shows compliance rates
- [ ] Analytics can be filtered by activity type, date range, organisation
- [ ] Visual charts (line charts, bar charts) for trends
- [ ] Comparison views (compare across organisations or time periods)
- [ ] Analytics respect organisation hierarchy

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/analytics/engagement`
- Data: Aggregate effectiveness scores and compliance from activity reports
- Calculations: Average scores, compliance percentages, trends

### Frontend
- Component: `EngagementAnalytics.vue`
- Charts: Line charts for trends, bar charts for comparisons
- Store: `useAnalyticsStore.ts` with `getEngagementAnalytics()` action

## Dependencies
- Epic 001: User & Organisation Management (for organisation scope)
- Epic 002: Activity Tracking & Reporting (for effectiveness metrics)

## Status
Ready for implementation
