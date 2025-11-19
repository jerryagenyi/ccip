# Implementation Plan: Activity Tracking & Reporting

## Overview
Technical implementation plan for Activity Tracking & Reporting based on the specification in `spec.md`. This is the core feature of RCAP, enabling public health officials to record and track risk communication activities with supporting evidence.

## Technology Stack
- **Backend**: Laravel 10+ with PHP 8.2+
- **Storage**: S3-compatible (MinIO for dev, AWS S3 for prod)
- **File Upload**: Laravel Filesystem with chunked upload support
- **Frontend**: Vue 3 + Quasar + Pinia
- **File Handling**: Axios with progress tracking
- **Database**: PostgreSQL 15+

## Architecture Decisions

### Backend Architecture
- **Controllers**: ActivityController, TemplateController, EvidenceController
- **Services**: FileUploadService, ActivityService, TemplateService
- **Form Requests**: Validation for activities, templates, file uploads
- **Resources**: ActivityResource, TemplateResource for API responses
- **Jobs**: Background jobs for file processing (compression, thumbnails)

### Frontend Architecture
- **Components**: ActivityForm, FileUpload, ActivityList, ActivityTimeline
- **Stores**: useActivityStore, useTemplateStore
- **File Upload**: Chunked upload component with progress
- **State Management**: Pinia for activity state and templates

## Implementation Phases

### Phase 1: Database Setup & Models
- Create migrations for activities, activity_evidence, tags, activity_tags, report_templates
- Create Eloquent models with relationships
- Set up indexes for performance
- Create factories and seeders

### Phase 2: Backend File Upload System
- Configure S3-compatible storage
- Create FileUploadService
- Implement file validation
- Add chunked upload support
- Generate signed URLs for file access

### Phase 3: Backend Activity Management
- Create ActivityController
- Implement CRUD operations
- Add status management (draft, submitted)
- Implement filtering and pagination
- Add audit trail

### Phase 4: Backend Template System
- Create TemplateController
- Implement template CRUD (admin only)
- Add template field validation
- Implement template-to-activity mapping

### Phase 5: Backend Evidence Management
- Create evidence upload endpoints
- Implement file association with activities
- Add file deletion (before submission)
- Generate file previews

### Phase 6: Frontend Activity Management
- Create ActivityForm component
- Create ActivityList component
- Create ActivityDetail component
- Set up Pinia stores

### Phase 7: Frontend File Upload
- Create FileUpload component
- Implement chunked upload
- Add progress indicators
- Add file preview

### Phase 8: Frontend Timeline
- Create ActivityTimeline component
- Implement date filtering
- Add export functionality

## Database Migrations

### Migration 1: Create tags table
- **File**: `YYYY_MM_DD_HHMMSS_create_tags_table.php`
- **Purpose**: Store categorisation tags
- **Fields**: id, name, category, description, timestamps

### Migration 2: Create report_templates table
- **File**: `YYYY_MM_DD_HHMMSS_create_report_templates_table.php`
- **Purpose**: Store customisable reporting templates
- **Fields**: id, name, organisation_id, fields (JSON), is_active, created_by, timestamps

### Migration 3: Create activities table
- **File**: `YYYY_MM_DD_HHMMSS_create_activities_table.php`
- **Purpose**: Store activity records
- **Fields**: id, title, description, date, location, type, status, organisation_id, user_id, template_id, submitted_at, submitted_by, timestamps

### Migration 4: Create activity_evidence table
- **File**: `YYYY_MM_DD_HHMMSS_create_activity_evidence_table.php`
- **Purpose**: Store evidence files
- **Fields**: id, activity_id, file_path, file_name, file_type, file_size, mime_type, uploaded_by, timestamps

### Migration 5: Create activity_tags pivot table
- **File**: `YYYY_MM_DD_HHMMSS_create_activity_tags_table.php`
- **Purpose**: Activity-tag relationships
- **Fields**: id, activity_id, tag_id, timestamps

## API Design

### Activity Endpoints
- `GET /api/v1/activities` - List activities (filtered by organisation)
- `POST /api/v1/activities` - Create activity
- `GET /api/v1/activities/{id}` - Get activity details
- `PUT /api/v1/activities/{id}` - Update activity (draft only)
- `DELETE /api/v1/activities/{id}` - Delete activity (draft only)
- `POST /api/v1/activities/{id}/submit` - Submit activity

### Evidence Endpoints
- `POST /api/v1/activities/{id}/evidence` - Upload evidence file
- `DELETE /api/v1/activities/{id}/evidence/{evidenceId}` - Delete evidence
- `GET /api/v1/activities/{id}/evidence` - List evidence files

### Template Endpoints
- `GET /api/v1/templates` - List templates (filtered by organisation)
- `POST /api/v1/templates` - Create template (admin only)
- `GET /api/v1/templates/{id}` - Get template details
- `PUT /api/v1/templates/{id}` - Update template (admin only)
- `DELETE /api/v1/templates/{id}` - Delete template (admin only)

### Timeline Endpoints
- `GET /api/v1/activities/timeline` - Get timeline data
- `GET /api/v1/activities/timeline/export` - Export timeline (CSV)

## Frontend Design

### Activity Form
- **Component**: `ActivityForm.vue`
- **Features**: Title, description, date, location, type, template selector, tags, save/submit buttons
- **Validation**: Required fields, date validation, location text input

### File Upload
- **Component**: `FileUpload.vue`
- **Features**: Drag-and-drop, file selection, progress bar, file preview, delete button
- **Limits**: Images 5MB, docs 10MB, audio 20MB, video 50MB

### Activity List
- **Component**: `ActivityList.vue`
- **Features**: Filter by status, organisation, type, date range, pagination, search

### Activity Timeline
- **Component**: `ActivityTimeline.vue`
- **Features**: Calendar view, date filtering, activity markers, export button

## Testing Strategy

### Backend Tests
- Feature tests for activity CRUD
- File upload tests
- Template management tests
- Status workflow tests
- Organisation filtering tests

### Frontend Tests
- Component tests for ActivityForm
- File upload component tests
- Activity list filtering tests

## Performance Optimization
- Index on organisation_id, user_id, date, status
- Chunked file uploads for large files
- Image compression before storage
- Lazy loading of evidence files
- Pagination for activity lists
- Cache template definitions

## Security Considerations
- File type validation (MIME type checking)
- File size limits enforced
- Activity ownership verification
- Organisation-based filtering
- Admin override for submitted activities
- Secure file storage with signed URLs

## Risk Mitigation
- **File Upload Failures**: Implement retry mechanism, chunked uploads
- **Large Files**: Compression, chunked uploads, progress indicators
- **Storage Costs**: Image compression, file size limits
- **Performance**: Indexing, pagination, caching

## Dependencies
- **External**: S3-compatible storage configured
- **Internal**: Epic 001 (User & Organisation Management) - Required

## Success Criteria
- [ ] Activities can be created and edited
- [ ] Evidence files can be uploaded
- [ ] Activities can be submitted
- [ ] Templates work correctly
- [ ] Timeline view works
- [ ] All tests passing
- [ ] Performance benchmarks met

