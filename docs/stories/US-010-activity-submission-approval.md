# Story US-010: Activity Submission & Approval Workflow

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** State Admin  
**I want to** submit activities for approval and approve/reject submitted activities  
**So that** I can ensure quality and coordinate activities across the organisation hierarchy

## Acceptance Criteria

- [ ] LGA Officer can submit draft activity for approval
- [ ] Activity status changes from "draft" to "submitted"
- [ ] State Admin receives notification of submitted activity
- [ ] State Admin can approve or reject activity
- [ ] Rejection includes reason/notes
- [ ] Approved activities can be activated/executed
- [ ] Activity status history is maintained
- [ ] Email notifications sent on status changes

## Technical Details

### Backend
- API Endpoints: 
  - `POST /api/v1/activities/{id}/submit`
  - `POST /api/v1/activities/{id}/approve`
  - `POST /api/v1/activities/{id}/reject`
- Status workflow: draft → submitted → approved/rejected → active → completed
- Model: `ActivityStatusHistory` tracks all status changes
- Notifications: Laravel notifications for status changes

### Frontend
- Components: `ActivityDetail.vue` with approval actions
- Status badges: Visual indicators for activity status
- Approval form: Notes field for rejection reasons
- Store: `useActivityStore.ts` with `submitActivity()`, `approveActivity()`, `rejectActivity()` actions

## Dependencies
- Epic 001: User & Organisation Management (for role-based permissions)
- Epic 004: Communication System (for notifications)

## Status
Ready for implementation
