# Feature Specification: Dashboards & Analytics

## Overview
Implement role-based dashboards with activity tracking, heatmaps, engagement analytics, and exportable reports. This feature provides actionable insights for public health officials to monitor and analyze risk communication activities across their organisation hierarchy.

## User Stories

### US-010: Role-Based Dashboard
- **As a** user
- **I want to** see a dashboard tailored to my role
- **So that** I can quickly understand my responsibilities

**Acceptance Criteria:**
- [ ] Different dashboard views per role (Super Admin, Admin, Sub-admin, User)
- [ ] Key metrics displayed prominently
- [ ] Quick actions available (create activity, view pending)
- [ ] Recent activities shown
- [ ] Activity status summary (counts per status)
- [ ] Upcoming activities (if applicable)

### US-011: Activity Status Tracking
- **As a** user
- **I want to** see the status of activities
- **So that** I know what needs attention

**Acceptance Criteria:**
- [ ] Status indicators (draft, submitted, approved, rejected)
- [ ] Filter by status
- [ ] Count of activities per status
- [ ] Status change history
- [ ] Visual status indicators (colours/icons)
- [ ] Status breakdown chart

### US-012: Activity Heatmap
- **As an** admin
- **I want to** see activity heatmaps
- **So that** I can identify patterns and gaps

**Acceptance Criteria:**
- [ ] Time-based heatmap (calendar view)
- [ ] Filter by date range, organisation, type
- [ ] Click to drill down to activities
- [ ] Colour intensity indicates activity volume
- [ ] Month/year navigation
- [ ] Export heatmap data

**Note**: Geographic heatmap is NOT in MVP scope (per constitution - no mapping features)

### US-013: Engagement Analytics
- **As an** admin
- **I want to** see engagement rates
- **So that** I can measure communication effectiveness

**Acceptance Criteria:**
- [ ] Engagement metrics per activity
- [ ] Aggregate engagement rates
- [ ] Trend charts over time
- [ ] Comparison between organisations
- [ ] Filter by date range
- [ ] Export engagement data

### US-014: Export Reports
- **As an** admin
- **I want to** export summary reports
- **So that** I can share with leadership

**Acceptance Criteria:**
- [ ] Export to PDF, Excel, CSV
- [ ] Customisable date ranges
- [ ] Filter by organisation, activity type
- [ ] Include charts and visualisations
- [ ] Scheduled report generation (future)
- [ ] Email report delivery (future)

## Technical Requirements

### Database Schema
- **activity_status_history** table:
  - id, activity_id, status, changed_by, changed_at, notes
- **engagement_metrics** table:
  - id, activity_id, metric_type, value, recorded_at

### API Endpoints
- `GET /api/v1/dashboard/{role}` - Get role-based dashboard data
- `GET /api/v1/dashboard/summary` - Get dashboard summary (counts, stats)
- `GET /api/v1/analytics/activities/status` - Get status breakdown
- `GET /api/v1/analytics/activities/heatmap` - Get heatmap data (time-based)
- `GET /api/v1/analytics/engagement` - Get engagement metrics
- `GET /api/v1/analytics/engagement/trends` - Get engagement trends
- `GET /api/v1/analytics/organisation-comparison` - Compare organisations
- `GET /api/v1/reports/export` - Export report (PDF/Excel/CSV)
- `GET /api/v1/reports/activities` - Activity report data

### Frontend Components
- `DashboardLayout.vue` - Main dashboard layout
- `RoleDashboard.vue` - Role-specific dashboard view
- `StatusTrackingWidget.vue` - Status tracking widget
- `ActivityHeatmap.vue` - Calendar heatmap component
- `EngagementChart.vue` - Engagement metrics chart
- `TrendChart.vue` - Trend visualization
- `ExportDialog.vue` - Export options dialog
- `useDashboardStore.ts` - Pinia store for dashboard data
- `useAnalyticsStore.ts` - Pinia store for analytics

## Dependencies
- Chart library (Chart.js or ApexCharts)
- PDF generation library (jsPDF or backend generation)
- Excel export library (xlsx or backend generation)
- Analytics aggregation service
- Epic 001 (User & Organisation Management) - Required
- Epic 002 (Activity Tracking) - Required

## Security Considerations
- Role-based dashboard data filtering
- Organisation hierarchy filtering
- Sensitive data only visible to authorised roles
- Export permissions (admin only)

## Performance Considerations
- Cache dashboard summary data (Redis, 5 minutes TTL)
- Aggregate analytics data (pre-calculate where possible)
- Lazy load charts (load on demand)
- Pagination for large datasets
- Index on date fields for heatmap queries

## Priority
**High** - Core value proposition

## Related Epics
- Epic 001: User & Organisation Management (required dependency)
- Epic 002: Activity Tracking (required dependency - provides data)
- Epic 004: Communication (notifications for dashboard updates)

