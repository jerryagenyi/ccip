# Task Breakdown: Activity Tracking & Reporting

This document contains the detailed task breakdown for implementing Activity Tracking & Reporting. Tasks are organized by user story and ordered to ensure dependencies are respected.

## User Story: US-005 - Create Activity

### Database Tasks
- [ ] **Task DB-010**: Create tags table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_tags_table.php`
  - Dependencies: None
  - Estimated Time: 1 hour

- [ ] **Task DB-011**: Create report_templates table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_report_templates_table.php`
  - Dependencies: Epic 001 (organisations, users)
  - Estimated Time: 1.5 hours

- [ ] **Task DB-012**: Create activities table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activities_table.php`
  - Dependencies: Epic 001 (organisations, users), Task DB-011
  - Estimated Time: 2 hours

- [ ] **Task DB-013**: Create activity_tags pivot table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activity_tags_table.php`
  - Dependencies: Task DB-010, Task DB-012
  - Estimated Time: 1 hour

### Backend Model Tasks
- [ ] **Task BE-039**: Create Tag model
  - File: `backend/app/Models/Tag.php`
  - Dependencies: Task DB-010
  - Estimated Time: 1 hour

- [ ] **Task BE-040**: Create ReportTemplate model
  - File: `backend/app/Models/ReportTemplate.php`
  - Dependencies: Task DB-011
  - Estimated Time: 1.5 hours

- [ ] **Task BE-041**: Create Activity model
  - File: `backend/app/Models/Activity.php`
  - Dependencies: Task DB-012
  - Estimated Time: 2 hours

### Backend API Tasks
- [ ] **Task BE-042**: Create ActivityRequest form validation
  - File: `backend/app/Http/Requests/Activity/ActivityRequest.php`
  - Dependencies: None
  - Estimated Time: 1.5 hours

- [ ] **Task BE-043**: Create ActivityController - index method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-041
  - Estimated Time: 2 hours

- [ ] **Task BE-044**: Create ActivityController - store method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-042, Task BE-041
  - Estimated Time: 2.5 hours

- [ ] **Task BE-045**: Create ActivityController - show method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-041
  - Estimated Time: 1 hour

- [ ] **Task BE-046**: Create ActivityController - update method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-042, Task BE-041
  - Estimated Time: 2 hours

- [ ] **Task BE-047**: Create ActivityController - destroy method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-041
  - Estimated Time: 1 hour

- [ ] **Task BE-048**: Create ActivityController - submit method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-041
  - Estimated Time: 1.5 hours

### Frontend Tasks
- [ ] **Task FE-019**: Create Pinia activity store
  - File: `frontend/src/stores/useActivityStore.ts`
  - Dependencies: None
  - Estimated Time: 2 hours

- [ ] **Task FE-020**: Create ActivityForm component
  - File: `frontend/src/components/ActivityForm.vue`
  - Dependencies: Task FE-019
  - Estimated Time: 5 hours

- [ ] **Task FE-021**: Create ActivityList component
  - File: `frontend/src/pages/ActivityList.vue`
  - Dependencies: Task FE-019
  - Estimated Time: 4 hours

## User Story: US-006 - Upload Evidence

### Backend Tasks
- [ ] **Task DB-014**: Create activity_evidence table migration
  - File: `backend/database/migrations/YYYY_MM_DD_HHMMSS_create_activity_evidence_table.php`
  - Dependencies: Task DB-012, Epic 001 (users)
  - Estimated Time: 1.5 hours

- [ ] **Task BE-049**: Create ActivityEvidence model
  - File: `backend/app/Models/ActivityEvidence.php`
  - Dependencies: Task DB-014
  - Estimated Time: 1 hour

- [ ] **Task BE-050**: Configure S3 storage
  - File: `backend/config/filesystems.php`
  - Dependencies: None
  - Estimated Time: 1 hour

- [ ] **Task BE-051**: Create FileUploadService
  - File: `backend/app/Services/FileUploadService.php`
  - Dependencies: Task BE-050
  - Estimated Time: 3 hours

- [ ] **Task BE-052**: Create EvidenceUploadRequest form validation
  - File: `backend/app/Http/Requests/Activity/EvidenceUploadRequest.php`
  - Dependencies: None
  - Estimated Time: 1 hour

- [ ] **Task BE-053**: Create ActivityController - uploadEvidence method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-051, Task BE-052
  - Estimated Time: 2.5 hours

- [ ] **Task BE-054**: Create ActivityController - deleteEvidence method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-049
  - Estimated Time: 1 hour

- [ ] **Task BE-055**: Create signed URL generation for file access
  - File: `backend/app/Services/FileUploadService.php`
  - Dependencies: Task BE-051
  - Estimated Time: 1.5 hours

### Frontend Tasks
- [ ] **Task FE-022**: Create FileUpload component
  - File: `frontend/src/components/FileUpload.vue`
  - Dependencies: None
  - Estimated Time: 6 hours

- [ ] **Task FE-023**: Implement chunked upload support
  - File: `frontend/src/components/FileUpload.vue`
  - Dependencies: Task FE-022
  - Estimated Time: 3 hours

## User Story: US-007 - Activity Submission

### Backend Tasks
- [ ] **Task BE-056**: Implement status validation in Activity model
  - File: `backend/app/Models/Activity.php`
  - Dependencies: Task BE-041
  - Estimated Time: 1 hour

- [ ] **Task BE-057**: Add status check to update method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-046
  - Estimated Time: 1 hour

### Frontend Tasks
- [ ] **Task FE-024**: Add submit button to ActivityForm
  - File: `frontend/src/components/ActivityForm.vue`
  - Dependencies: Task FE-020
  - Estimated Time: 1 hour

- [ ] **Task FE-025**: Implement submit confirmation
  - File: `frontend/src/components/ActivityForm.vue`
  - Dependencies: Task FE-024
  - Estimated Time: 1 hour

## User Story: US-008 - Activity Timeline

### Backend Tasks
- [ ] **Task BE-058**: Create ActivityController - timeline method
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-041
  - Estimated Time: 2 hours

- [ ] **Task BE-059**: Create timeline export endpoint
  - File: `backend/app/Http/Controllers/ActivityController.php`
  - Dependencies: Task BE-058
  - Estimated Time: 1.5 hours

### Frontend Tasks
- [ ] **Task FE-026**: Create ActivityTimeline component
  - File: `frontend/src/components/ActivityTimeline.vue`
  - Dependencies: Task FE-019
  - Estimated Time: 5 hours

- [ ] **Task FE-027**: Implement timeline export
  - File: `frontend/src/components/ActivityTimeline.vue`
  - Dependencies: Task FE-026
  - Estimated Time: 2 hours

## User Story: US-009 - Reporting Templates

### Backend Tasks
- [ ] **Task BE-060**: Create TemplateRequest form validation
  - File: `backend/app/Http/Requests/Template/TemplateRequest.php`
  - Dependencies: None
  - Estimated Time: 1.5 hours

- [ ] **Task BE-061**: Create TemplateController
  - File: `backend/app/Http/Controllers/TemplateController.php`
  - Dependencies: Task BE-040, Task BE-060
  - Estimated Time: 4 hours

### Frontend Tasks
- [ ] **Task FE-028**: Create Pinia template store
  - File: `frontend/src/stores/useTemplateStore.ts`
  - Dependencies: None
  - Estimated Time: 1.5 hours

- [ ] **Task FE-029**: Create TemplateSelector component
  - File: `frontend/src/components/TemplateSelector.vue`
  - Dependencies: Task FE-028
  - Estimated Time: 2 hours

- [ ] **Task FE-030**: Create TemplateManager component (admin)
  - File: `frontend/src/pages/TemplateManager.vue`
  - Dependencies: Task FE-028
  - Estimated Time: 4 hours

## Testing Tasks
- [ ] **Task TEST-008**: Write feature tests for activity CRUD
  - File: `backend/tests/Feature/Activity/ActivityTest.php`
  - Dependencies: All activity endpoints
  - Estimated Time: 3 hours

- [ ] **Task TEST-009**: Write feature tests for file upload
  - File: `backend/tests/Feature/Activity/EvidenceUploadTest.php`
  - Dependencies: Task BE-053
  - Estimated Time: 2.5 hours

- [ ] **Task TEST-010**: Write feature tests for templates
  - File: `backend/tests/Feature/Template/TemplateTest.php`
  - Dependencies: Task BE-061
  - Estimated Time: 2 hours

## Estimated Timeline
- **Total Tasks**: 50+
- **Estimated Hours**: ~75 hours
- **Estimated Days**: ~9-10 days
- **Estimated Weeks**: ~2 weeks

