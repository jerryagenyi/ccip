# Story US-021: Exportable Reports

**Epic:** Epic 003 - Dashboards & Analytics

**As a** Data Analyst or Admin  
**I want to** export analytics and activity data as reports  
**So that** I can share insights and create documentation

## Acceptance Criteria

- [ ] User can export dashboard data as PDF or CSV
- [ ] Export includes filters applied to dashboard
- [ ] PDF reports include charts and visualizations
- [ ] CSV exports include raw data
- [ ] Export respects organisation hierarchy and permissions
- [ ] Large exports are processed asynchronously (background job)

## Technical Details

### Backend
- API Endpoints: 
  - `POST /api/v1/reports/export` (trigger export)
  - `GET /api/v1/reports/export/{id}/download` (download when ready)
- Export formats: PDF (using DomPDF or similar), CSV
- Background processing: Laravel queue for large exports

### Frontend
- Component: `ExportButton.vue` or `ReportExportDialog.vue`
- Store: `useReportStore.ts` with `exportReport()` action
- Features: Format selection, filter application, download link

## Dependencies
- Epic 001: User & Organisation Management (for permissions)
- Epic 002: Activity Tracking & Reporting (for data)

## Status
Ready for implementation
