# Quick Start: Dashboards & Analytics

## Overview
Quick reference guide for implementing the Dashboards & Analytics feature.

## Implementation Order

1. **Database Setup**
   - Run migrations for activity_status_history, engagement_metrics
   - Create indexes for performance
   - Set up materialized views (optional)

2. **Backend Analytics Service**
   - Create AnalyticsService for aggregations
   - Create DashboardService for dashboard data
   - Implement caching layer (Redis)

3. **Backend API - Dashboard**
   - Create DashboardController
   - Implement role-based dashboard endpoints
   - Add filtering and aggregation

4. **Backend API - Analytics**
   - Create AnalyticsController
   - Implement heatmap data endpoint
   - Implement engagement metrics endpoints
   - Add comparison endpoints

5. **Backend API - Reports**
   - Create ReportController
   - Implement export functionality (PDF, Excel, CSV)
   - Add report generation service

6. **Frontend - Dashboard**
   - Create DashboardLayout component
   - Create role-specific dashboard views
   - Set up Pinia stores

7. **Frontend - Charts**
   - Integrate Chart.js
   - Create chart components (status, engagement, trends)
   - Create heatmap component

8. **Frontend - Export**
   - Create export dialog
   - Implement export functionality
   - Add download handlers

## Key Files

### Backend
- `app/Services/AnalyticsService.php`
- `app/Services/DashboardService.php`
- `app/Services/ReportService.php`
- `app/Http/Controllers/DashboardController.php`
- `app/Http/Controllers/AnalyticsController.php`
- `app/Http/Controllers/ReportController.php`
- `app/Models/ActivityStatusHistory.php`
- `app/Models/EngagementMetric.php`
- `database/migrations/*_create_*.php`

### Frontend
- `src/pages/Dashboard.vue`
- `src/components/DashboardLayout.vue`
- `src/components/StatusTrackingWidget.vue`
- `src/components/ActivityHeatmap.vue`
- `src/components/EngagementChart.vue`
- `src/components/TrendChart.vue`
- `src/components/ExportDialog.vue`
- `src/stores/useDashboardStore.ts`
- `src/stores/useAnalyticsStore.ts`

## Testing Checklist
- [ ] Dashboard loads with role-based data
- [ ] Status tracking shows correct counts
- [ ] Heatmap displays activity data
- [ ] Engagement charts render correctly
- [ ] Export PDF works
- [ ] Export Excel works
- [ ] Export CSV works
- [ ] Filters work correctly
- [ ] Caching works
- [ ] Performance acceptable

## Common Issues
- **Slow dashboard load**: Check caching and query optimization
- **Charts not rendering**: Verify Chart.js integration
- **Export fails**: Check file permissions and library setup
- **Heatmap data incorrect**: Verify date aggregation logic

## Dependencies
- Epic 001 must be complete (users, organisations)
- Epic 002 must be complete (activities)
- Redis configured for caching
- Chart library installed
- PDF/Excel generation libraries installed

