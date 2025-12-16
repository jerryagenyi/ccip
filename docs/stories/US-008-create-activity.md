# Story US-008: Create Activity

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** State Admin or LGA Officer  
**I want to** create a new activity with title, type, target population, and planned message  
**So that** I can plan and track risk communication campaigns

## Acceptance Criteria

- [ ] User can create activity with required fields (title, type, target population, planned message)
- [ ] Activity is saved as draft initially
- [ ] User can optionally assess semiotic risk before submission (integrates with Epic 007)
- [ ] Activity version history is maintained
- [ ] Activity is associated with user's organisation
- [ ] User can save activity as template for reuse

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/activities`
- Model: `Activity` with fields: title, description, type, target_population, planned_message, organisation_id, status (draft), created_by
- Validation: Required fields, organisation_id must belong to user's organisation hierarchy
- Version tracking: `version` field, increment on updates

### Frontend
- Component: `ActivityCreate.vue`
- Form fields: Title (text), Type (select), Target Population (text), Planned Message (textarea)
- Store: `useActivityStore.ts` with `createActivity()` action
- Navigation: Redirect to activity detail after creation

## Dependencies
- Epic 001: User & Organisation Management (for organisation context)

## Status
Ready for implementation
