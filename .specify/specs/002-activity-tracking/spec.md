# Feature Specification: Activity Tracking & Reporting

## Overview
Implement comprehensive activity tracking system with evidence uploads, customisable templates, and audit trails for risk communication activities. This is the core feature of RCAP, enabling public health officials to record, track, and report on risk communication activities with supporting evidence.

## User Stories

### US-005: Create Activity
- **As a** user
- **I want to** create a risk communication activity
- **So that** I can track my work

**Acceptance Criteria:**
- [ ] Form with required fields (title, description, date, location, type)
- [ ] Select organisation/team
- [ ] Tag with metrics/categories
- [ ] Save as draft or submit
- [ ] Validation for required fields
- [ ] Date validation (cannot be in future)
- [ ] Location field supports text input (no mapping/GIS)

### US-006: Upload Evidence
- **As a** user
- **I want to** upload evidence files
- **So that** I can support my activity reports

**Acceptance Criteria:**
- [ ] Upload images, documents, audio, video files
- [ ] File size limits enforced (images: 5MB, docs: 10MB, audio: 20MB, video: 50MB)
- [ ] Preview uploaded files
- [ ] Delete uploaded files before submission
- [ ] File type validation
- [ ] Progress indicator for large uploads
- [ ] Multiple file upload support
- [ ] Files stored in S3-compatible storage

### US-007: Activity Submission
- **As a** user
- **I want to** submit activities
- **So that** they are recorded in the system

**Acceptance Criteria:**
- [ ] Submit completed activity
- [ ] Cannot edit after submission (only admins can)
- [ ] Automatic timestamp and user tracking
- [ ] Status changes to "submitted"
- [ ] Confirmation message on submission
- [ ] Activity locked from editing after submission

### US-008: Activity Timeline
- **As a** user
- **I want to** view activities in a timeline
- **So that** I can see chronological progress

**Acceptance Criteria:**
- [ ] Timeline view with date filters
- [ ] Filter by organisation, user, type
- [ ] Click to view activity details
- [ ] Export timeline data (CSV)
- [ ] Pagination for large datasets
- [ ] Sort by date (ascending/descending)

### US-009: Reporting Templates
- **As an** admin
- **I want to** create custom reporting templates
- **So that** users can follow standard formats

**Acceptance Criteria:**
- [ ] Create template with custom fields
- [ ] Assign templates to organisations
- [ ] Users select template when creating activity
- [ ] Template fields populate activity form
- [ ] Edit templates (admin only)
- [ ] Delete templates (admin only)
- [ ] Template preview

## Technical Requirements

### Database Schema
- **activities** table:
  - id, title, description, date, location, type, status, organisation_id, user_id, template_id, created_at, updated_at
- **activity_evidence** table:
  - id, activity_id, file_path, file_type, file_size, created_at
- **activity_tags** pivot table:
  - activity_id, tag_id
- **tags** table:
  - id, name, category, created_at
- **report_templates** table:
  - id, name, organisation_id, fields (JSON), created_at, updated_at

### API Endpoints
- `GET /api/v1/activities` - List activities (filtered by user role)
- `POST /api/v1/activities` - Create new activity
- `GET /api/v1/activities/{id}` - Get activity details
- `PUT /api/v1/activities/{id}` - Update activity (draft only)
- `DELETE /api/v1/activities/{id}` - Delete activity (draft only)
- `POST /api/v1/activities/{id}/submit` - Submit activity
- `POST /api/v1/activities/{id}/evidence` - Upload evidence file
- `DELETE /api/v1/activities/{id}/evidence/{evidenceId}` - Delete evidence
- `GET /api/v1/activities/timeline` - Get timeline data
- `GET /api/v1/templates` - List templates (filtered by organisation)
- `POST /api/v1/templates` - Create template (admin only)
- `PUT /api/v1/templates/{id}` - Update template (admin only)
- `DELETE /api/v1/templates/{id}` - Delete template (admin only)

### Frontend Components
- `ActivityForm.vue` - Activity creation/editing form
- `FileUpload.vue` - Evidence file upload component
- `ActivityList.vue` - Activity listing with filters
- `ActivityDetail.vue` - Activity detail view
- `ActivityTimeline.vue` - Timeline component
- `TemplateManager.vue` - Template management (admin)
- `TemplateSelector.vue` - Template selection dropdown
- `useActivityStore.ts` - Pinia store for activities
- `useTemplateStore.ts` - Pinia store for templates

## Dependencies
- S3-compatible storage for file uploads (MinIO/AWS S3)
- File validation service
- Activity state management (Pinia)
- Epic 001 (User & Organisation Management) - Required for user/organisation context

## Security Considerations
- File upload validation (type, size, virus scanning)
- Activity ownership verification
- Role-based access to activities (users see own org's activities)
- Admin override for submitted activities
- Secure file storage with signed URLs

## Performance Considerations
- Chunked file uploads for large files
- Image compression before storage
- Lazy loading of evidence files
- Pagination for activity lists
- Index on organisation_id and user_id for filtering
- Cache template definitions

## Priority
**High** - Core feature of the platform

## Related Epics
- Epic 001: User & Organisation Management (required dependency)
- Epic 003: Dashboards & Analytics (uses activity data)
- Epic 004: Communication (notifications for activity submissions)

