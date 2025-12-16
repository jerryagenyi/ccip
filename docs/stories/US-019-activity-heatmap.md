# Story US-019: Activity Heatmap

**Epic:** Epic 003 - Dashboards & Analytics

**As a** Super Admin or State Admin  
**I want to** see a heatmap of activity distribution  
**So that** I can identify activity patterns and gaps

## Acceptance Criteria

- [ ] Heatmap shows activity density over time
- [ ] Heatmap can be filtered by activity type, organisation level, date range
- [ ] Visual representation (color intensity = activity count)
- [ ] Interactive: Hover shows details, click filters activities
- [ ] Heatmap respects organisation hierarchy

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/analytics/activity-heatmap`
- Data: Aggregate activities by date and organisation level
- Format: Time series data for heatmap visualization

### Frontend
- Component: `ActivityHeatmap.vue`
- Library: Use charting library (Chart.js, D3.js, or Quasar's chart components)
- Store: `useAnalyticsStore.ts` with `getActivityHeatmap()` action

## Dependencies
- Epic 001: User & Organisation Management (for organisation hierarchy)
- Epic 002: Activity Tracking & Reporting (for activity data)

## Status
Ready for implementation
