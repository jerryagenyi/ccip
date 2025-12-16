# Story US-009: Upload Evidence

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** Field Officer or LGA Officer  
**I want to** upload evidence files (photos, documents, audio, video) to activities  
**So that** I can provide supporting documentation for communication activities

## Acceptance Criteria

- [ ] User can upload multiple file types (images, PDFs, audio, video)
- [ ] File size validation (max 10MB per file, configurable)
- [ ] File type validation (whitelist of allowed types)
- [ ] Upload progress indicator
- [ ] Files stored in S3-compatible storage
- [ ] File preview available for images and PDFs
- [ ] User can delete uploaded files before activity submission

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/activities/{id}/attachments`
- Storage: S3-compatible (MinIO dev, AWS S3 prod)
- Model: `ActivityAttachment` with fields: activity_id, file_path, file_type, file_size, uploaded_by
- Validation: File type whitelist, size limits, virus scanning (optional)

### Frontend
- Component: `FileUpload.vue` (reusable)
- Features: Drag-and-drop, multiple file selection, progress bars
- Preview: Image preview, PDF viewer integration
- Store: `useActivityStore.ts` with `uploadAttachment()` action

## Dependencies
- Epic 001: User & Organisation Management (for user context)
- S3-compatible storage configured

## Status
Ready for implementation
