# Quick Start: Activity Tracking & Reporting

## Overview
Quick reference guide for implementing the Activity Tracking & Reporting feature.

## Implementation Order

1. **Database Setup**
   - Run migrations for tags, report_templates, activities, activity_evidence, activity_tags
   - Seed default tags and sample templates

2. **Backend Models & Relationships**
   - Create Activity model with relationships
   - Create ActivityEvidence model
   - Create Tag model
   - Create ReportTemplate model
   - Set up model relationships

3. **Backend API - Activities**
   - Create ActivityController
   - Implement CRUD operations
   - Add status management (submit, approve, reject)
   - Add filtering and pagination

4. **Backend API - Evidence**
   - Create file upload endpoint
   - Implement S3 storage integration
   - Add file validation
   - Generate signed URLs for file access

5. **Backend API - Templates**
   - Create TemplateController
   - Implement template CRUD (admin only)
   - Add template field validation

6. **Frontend - Activity Management**
   - Create ActivityForm component
   - Create ActivityList component
   - Create ActivityDetail component
   - Set up Pinia store

7. **Frontend - File Upload**
   - Create FileUpload component
   - Implement chunked upload for large files
   - Add progress indicators

8. **Frontend - Timeline**
   - Create ActivityTimeline component
   - Implement date filtering
   - Add export functionality

## Key Files

### Backend
- `app/Models/Activity.php`
- `app/Models/ActivityEvidence.php`
- `app/Models/Tag.php`
- `app/Models/ReportTemplate.php`
- `app/Http/Controllers/ActivityController.php`
- `app/Http/Controllers/TemplateController.php`
- `app/Http/Requests/ActivityRequest.php`
- `app/Services/FileUploadService.php`
- `database/migrations/*_create_*.php`

### Frontend
- `src/components/ActivityForm.vue`
- `src/components/FileUpload.vue`
- `src/pages/ActivityList.vue`
- `src/pages/ActivityDetail.vue`
- `src/components/ActivityTimeline.vue`
- `src/stores/useActivityStore.ts`
- `src/stores/useTemplateStore.ts`

## Testing Checklist
- [ ] Create activity (draft)
- [ ] Upload evidence files
- [ ] Submit activity
- [ ] Cannot edit submitted activity (user)
- [ ] Admin can edit submitted activity
- [ ] Filter activities by organisation
- [ ] Filter activities by status
- [ ] Timeline view works
- [ ] Export timeline data
- [ ] Create template (admin)
- [ ] Use template when creating activity
- [ ] File upload validation works
- [ ] File size limits enforced

## Common Issues
- **File upload fails**: Check S3 configuration and permissions
- **Activity not visible**: Check organisation filtering logic
- **Template fields not loading**: Verify JSON schema validation
- **Large file upload timeout**: Implement chunked upload

## Dependencies
- Epic 001 must be complete (users, organisations)
- S3 storage configured and accessible
- File validation service running

