# Task Breakdown: Dashboards & Analytics

Tasks organized by user story with dependencies respected.

## User Story: US-010 - Role-Based Dashboard

### Database Tasks
- [ ] **Task DB-015**: Create activity_status_history table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activity_status_history_table.php`
  - Dependencies: Epic 002 (activities), Epic 001 (users)
  - Estimated Time: 1.5 hours

- [ ] **Task DB-016**: Create engagement_metrics table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_engagement_metrics_table.php`
  - Dependencies: Epic 002 (activities), Epic 001 (users)
  - Estimated Time: 1.5 hours

### Backend Tasks
- [ ] **Task BE-062**: Create ActivityStatusHistory model
  - File: `backend/app/Models/ActivityStatusHistory.php`
  - Dependencies: Task DB-015
  - Estimated Time: 1 hour

- [ ] **Task BE-063**: Create EngagementMetric model
  - File: `backend/app/Models/EngagementMetric.php`
  - Dependencies: Task DB-016
  - Estimated Time: 1 hour

- [ ] **Task BE-064**: Create DashboardService
  - File: `backend/app/Services/DashboardService.php`
  - Dependencies: Epic 001, Epic 002
  - Estimated Time: 3 hours

- [ ] **Task BE-065**: Create DashboardController
  - File: `backend/app/Http/Controllers/DashboardController.php`
  - Dependencies: Task BE-064
  - Estimated Time: 2 hours

- [ ] **Task BE-066**: Implement Redis caching for dashboard
  - File: `backend/app/Services/DashboardService.php`
  - Dependencies: Task BE-064
  - Estimated Time: 1.5 hours

### Frontend Tasks
- [ ] **Task FE-031**: Create Pinia dashboard store
  - File: `frontend/src/stores/useDashboardStore.ts`
  - Dependencies: None
  - Estimated Time: 2 hours

- [ ] **Task FE-032**: Create DashboardLayout component
  - File: `frontend/src/components/DashboardLayout.vue`
  - Dependencies: Task FE-031
  - Estimated Time: 3 hours

- [ ] **Task FE-033**: Create RoleDashboard component
  - File: `frontend/src/pages/Dashboard.vue`
  - Dependencies: Task FE-032
  - Estimated Time: 4 hours

## User Story: US-011 - Activity Status Tracking

### Backend Tasks
- [ ] **Task BE-067**: Create AnalyticsService
  - File: `backend/app/Services/AnalyticsService.php`
  - Dependencies: Epic 002
  - Estimated Time: 2.5 hours

- [ ] **Task BE-068**: Create AnalyticsController - status endpoint
  - File: `backend/app/Http/Controllers/AnalyticsController.php`
  - Dependencies: Task BE-067
  - Estimated Time: 1.5 hours

### Frontend Tasks
- [ ] **Task FE-034**: Create StatusTrackingWidget component
  - File: `frontend/src/components/StatusTrackingWidget.vue`
  - Dependencies: Task FE-031
  - Estimated Time: 3 hours

- [ ] **Task FE-035**: Install and configure Chart.js
  - File: `frontend/package.json`, `frontend/src/plugins/chart.js`
  - Dependencies: None
  - Estimated Time: 1 hour

- [ ] **Task FE-036**: Create status breakdown chart
  - File: `frontend/src/components/StatusTrackingWidget.vue`
  - Dependencies: Task FE-034, Task FE-035
  - Estimated Time: 2 hours

## User Story: US-012 - Activity Heatmap

### Backend Tasks
- [ ] **Task BE-069**: Create AnalyticsController - heatmap endpoint
  - File: `backend/app/Http/Controllers/AnalyticsController.php`
  - Dependencies: Task BE-067
  - Estimated Time: 2 hours

### Frontend Tasks
- [ ] **Task FE-037**: Create ActivityHeatmap component
  - File: `frontend/src/components/ActivityHeatmap.vue`
  - Dependencies: Task FE-031
  - Estimated Time: 5 hours

## User Story: US-013 - Engagement Analytics

### Backend Tasks
- [ ] **Task BE-070**: Create AnalyticsController - engagement endpoints
  - File: `backend/app/Http/Controllers/AnalyticsController.php`
  - Dependencies: Task BE-067
  - Estimated Time: 2.5 hours

- [ ] **Task BE-071**: Create AnalyticsController - comparison endpoint
  - File: `backend/app/Http/Controllers/AnalyticsController.php`
  - Dependencies: Task BE-067
  - Estimated Time: 2 hours

### Frontend Tasks
- [ ] **Task FE-038**: Create Pinia analytics store
  - File: `frontend/src/stores/useAnalyticsStore.ts`
  - Dependencies: None
  - Estimated Time: 1.5 hours

- [ ] **Task FE-039**: Create EngagementChart component
  - File: `frontend/src/components/EngagementChart.vue`
  - Dependencies: Task FE-038, Task FE-035
  - Estimated Time: 4 hours

- [ ] **Task FE-040**: Create TrendChart component
  - File: `frontend/src/components/TrendChart.vue`
  - Dependencies: Task FE-038, Task FE-035
  - Estimated Time: 3 hours

## User Story: US-014 - Export Reports

### Backend Tasks
- [ ] **Task BE-072**: Install DomPDF
  - File: `backend/composer.json`
  - Dependencies: None
  - Estimated Time: 0.5 hours

- [ ] **Task BE-073**: Install Laravel Excel
  - File: `backend/composer.json`
  - Dependencies: None
  - Estimated Time: 0.5 hours

- [ ] **Task BE-074**: Create ReportService
  - File: `backend/app/Services/ReportService.php`
  - Dependencies: Task BE-072, Task BE-073
  - Estimated Time: 4 hours

- [ ] **Task BE-075**: Create ReportController
  - File: `backend/app/Http/Controllers/ReportController.php`
  - Dependencies: Task BE-074
  - Estimated Time: 2 hours

### Frontend Tasks
- [ ] **Task FE-041**: Create ExportDialog component
  - File: `frontend/src/components/ExportDialog.vue`
  - Dependencies: None
  - Estimated Time: 2 hours

- [ ] **Task FE-042**: Implement export functionality
  - File: `frontend/src/components/ExportDialog.vue`
  - Dependencies: Task FE-041
  - Estimated Time: 2 hours

## Testing Tasks
- [ ] **Task TEST-011**: Write feature tests for dashboard
  - File: `backend/tests/Feature/Dashboard/DashboardTest.php`
  - Dependencies: Task BE-065
  - Estimated Time: 2 hours

- [ ] **Task TEST-012**: Write feature tests for analytics
  - File: `backend/tests/Feature/Analytics/AnalyticsTest.php`
  - Dependencies: Task BE-068
  - Estimated Time: 2.5 hours

- [ ] **Task TEST-013**: Write feature tests for exports
  - File: `backend/tests/Feature/Report/ReportExportTest.php`
  - Dependencies: Task BE-075
  - Estimated Time: 2 hours

## Estimated Timeline
- **Total Tasks**: 35+
- **Estimated Hours**: ~55 hours
- **Estimated Days**: ~7 days
- **Estimated Weeks**: ~1.5 weeks

