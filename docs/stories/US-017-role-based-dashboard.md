# Story US-017: Role-Based Dashboard

**Epic:** Epic 003 - Dashboards & Analytics

**As a** user (Super Admin, State Admin, LGA Officer, Field Officer)  
**I want to** see a dashboard tailored to my role  
**So that** I can quickly understand what requires my attention

## Acceptance Criteria

- [ ] Dashboard content varies by user role
- [ ] Super Admin sees: National metrics, cross-regional analytics, policy settings
- [ ] State Admin sees: Activities pending approval, state-level analytics, team overview
- [ ] LGA Officer sees: Local activities, assigned tasks, local team status
- [ ] Field Officer sees: Assigned activities, pending reports, personal metrics
- [ ] Dashboard loads quickly (< 2 seconds)
- [ ] Dashboard data refreshes automatically or on demand
- [ ] Dashboard respects organisation hierarchy (users see only their scope)

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/dashboard`
- Data aggregation: Role-specific queries, cached for performance
- Model: Dashboard data aggregated from activities, reports, users
- Caching: Redis cache with 1-minute TTL for dashboard data

### Frontend
- Component: `Dashboard.vue` (role-specific views)
- Store: `useDashboardStore.ts` with `fetchDashboardData()` action
- Real-time updates: Polling or WebSocket for live data

## Dependencies
- Epic 001: User & Organisation Management (for role and organisation context)
- Epic 002: Activity Tracking & Reporting (for activity data)

## Status
Ready for implementation
