# Implementation Plan: Dashboards & Analytics

## Overview
Technical implementation plan for Dashboards & Analytics based on the specification in `spec.md`. This feature provides actionable insights for public health officials to monitor and analyze risk communication activities.

## Technology Stack
- **Backend**: Laravel 10+ with PHP 8.2+
- **Frontend**: Vue 3 + Quasar + Chart.js
- **Charts**: Chart.js (lightweight, low-bandwidth friendly)
- **Export**: Backend generation (DomPDF for PDF, Laravel Excel for Excel)
- **Caching**: Redis for dashboard aggregations
- **Database**: PostgreSQL 15+ with materialized views

## Architecture Decisions

### Backend Architecture
- **Services**: DashboardService, AnalyticsService, ReportService
- **Controllers**: DashboardController, AnalyticsController, ReportController
- **Caching**: Redis for dashboard summaries (5 min TTL), analytics (15 min TTL)
- **Aggregations**: Pre-calculate common aggregations, use materialized views

### Frontend Architecture
- **Components**: DashboardLayout, RoleDashboard, StatusWidget, Heatmap, Charts
- **Stores**: useDashboardStore, useAnalyticsStore
- **Charts**: Chart.js for visualizations
- **Lazy Loading**: Load charts on demand

## Implementation Phases

### Phase 1: Database Setup
- Create activity_status_history table
- Create engagement_metrics table
- Create indexes for performance
- Set up materialized views (optional)

### Phase 2: Backend Analytics Services
- Create AnalyticsService for aggregations
- Create DashboardService for dashboard data
- Implement caching layer
- Add aggregation methods

### Phase 3: Backend Dashboard API
- Create DashboardController
- Implement role-based dashboard endpoints
- Add filtering and aggregation
- Cache dashboard data

### Phase 4: Backend Analytics API
- Create AnalyticsController
- Implement heatmap data endpoint
- Implement engagement metrics endpoints
- Add comparison endpoints

### Phase 5: Backend Report Export
- Create ReportController
- Implement PDF export (DomPDF)
- Implement Excel export (Laravel Excel)
- Implement CSV export

### Phase 6: Frontend Dashboard
- Create DashboardLayout component
- Create role-specific dashboard views
- Set up Pinia stores
- Integrate Chart.js

### Phase 7: Frontend Charts & Visualizations
- Create status tracking widget
- Create calendar heatmap component
- Create engagement charts
- Create trend charts

### Phase 8: Frontend Export
- Create export dialog
- Implement export functionality
- Add download handlers

## Database Migrations

### Migration 1: Create activity_status_history table
- **File**: `YYYY_MM_DD_HHMMSS_create_activity_status_history_table.php`
- **Purpose**: Audit trail for status changes
- **Fields**: id, activity_id, status, changed_by, changed_at, notes, previous_status

### Migration 2: Create engagement_metrics table
- **File**: `YYYY_MM_DD_HHMMSS_create_engagement_metrics_table.php`
- **Purpose**: Store engagement metrics
- **Fields**: id, activity_id, metric_type, value, unit, recorded_at, recorded_by, notes

## API Design

### Dashboard Endpoints
- `GET /api/v1/dashboard/{role}` - Get role-based dashboard data
- `GET /api/v1/dashboard/summary` - Get dashboard summary (counts, stats)

### Analytics Endpoints
- `GET /api/v1/analytics/activities/status` - Get status breakdown
- `GET /api/v1/analytics/activities/heatmap` - Get heatmap data (time-based)
- `GET /api/v1/analytics/engagement` - Get engagement metrics
- `GET /api/v1/analytics/engagement/trends` - Get engagement trends
- `GET /api/v1/analytics/organisation-comparison` - Compare organisations

### Report Endpoints
- `GET /api/v1/reports/export` - Export report (PDF/Excel/CSV)
- `GET /api/v1/reports/activities` - Activity report data

## Frontend Design

### Dashboard Layout
- **Component**: `DashboardLayout.vue`
- **Features**: Role-based sections, key metrics, quick actions, recent activities

### Status Tracking Widget
- **Component**: `StatusTrackingWidget.vue`
- **Features**: Status indicators, counts, filters, status breakdown chart

### Calendar Heatmap
- **Component**: `ActivityHeatmap.vue`
- **Features**: Calendar view, date range filter, activity markers, drill-down

### Engagement Charts
- **Component**: `EngagementChart.vue`
- **Features**: Line/bar charts, trend visualization, comparison charts

## Testing Strategy
- Feature tests for dashboard endpoints
- Analytics aggregation tests
- Export functionality tests
- Performance tests for caching

## Performance Optimization
- Cache dashboard summaries (Redis, 5 minutes)
- Cache analytics aggregations (Redis, 15 minutes)
- Materialized views for common queries
- Lazy load charts
- Pagination for large datasets

## Security Considerations
- Role-based dashboard data filtering
- Organisation hierarchy filtering
- Export permissions (admin only)
- Sensitive data only visible to authorised roles

## Risk Mitigation
- **Performance**: Caching, materialized views, pagination
- **Chart Library**: Start with Chart.js (lightweight), upgrade if needed
- **Export**: Backend generation for consistency

## Dependencies
- **External**: Chart.js, DomPDF, Laravel Excel, Redis
- **Internal**: Epic 001 (required), Epic 002 (required - provides data)

## Success Criteria
- [ ] Role-based dashboards work
- [ ] Status tracking displays correctly
- [ ] Heatmap renders properly
- [ ] Engagement charts work
- [ ] Export functionality works
- [ ] Performance benchmarks met
- [ ] All tests passing

