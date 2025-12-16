# Research: Activity Tracking & Reporting

## Technology Research

### File Upload Strategy
- **S3-Compatible Storage**: MinIO for dev, AWS S3 for production
- **Laravel Filesystem**: Use Laravel's filesystem abstraction
- **File Validation**: Laravel validation rules + custom file type checking
- **Chunked Uploads**: For large files (>10MB), implement chunked upload
- **Signed URLs**: Generate signed URLs for secure file access

### File Size Limits
- **Images**: 5MB max (compress before upload)
- **Documents**: 10MB max (PDF, DOC, DOCX)
- **Audio**: 20MB max (MP3, WAV)
- **Video**: 50MB max (MP4, WebM)

### File Type Validation
- **Images**: jpg, jpeg, png, gif, webp
- **Documents**: pdf, doc, docx, xls, xlsx, txt
- **Audio**: mp3, wav, ogg
- **Video**: mp4, webm, mov

### Image Processing
- **Compression**: Use Intervention Image or similar
- **Thumbnails**: Generate thumbnails for image previews
- **Optimization**: Compress images before storage

## Security Research

### File Upload Security
- **Virus Scanning**: Consider ClamAV integration for production
- **File Type Validation**: Check MIME type, not just extension
- **File Size Limits**: Enforce at both frontend and backend
- **Secure Storage**: Files stored in S3 with restricted access
- **Signed URLs**: Time-limited signed URLs for file access

### Activity Security
- **Ownership Verification**: Users can only edit own activities (draft status)
- **Organisation Filtering**: Users see activities from their organisation hierarchy
- **Status Enforcement**: Submitted activities locked from editing
- **Audit Trail**: Track all status changes and edits

## Performance Considerations

### Database Optimization
- Index on organisation_id, user_id, date, status for filtering
- Pagination for activity lists (20 items per page)
- Eager loading for relationships (avoid N+1 queries)

### File Upload Optimization
- Chunked uploads for large files
- Progress indicators for user feedback
- Background processing for file compression
- Lazy loading of evidence files in UI

### Caching Strategy
- Cache template definitions (Redis, 1 hour TTL)
- Cache activity counts per status
- Invalidate cache on activity create/update

## Low-Bandwidth Optimizations
- Compress images before upload
- Lazy load evidence files
- Paginate activity lists
- Minimal API responses (exclude large fields)
- Progressive image loading

## Implementation Notes
- Location field is text-only (no mapping/GIS per constitution)
- Activity status workflow: draft → submitted → approved/rejected
- Templates use JSON field definitions for flexibility
- Evidence files can only be deleted before activity submission
- Timeline view supports date range filtering

## Dependencies
- Epic 001 (User & Organisation Management) - Required
- S3-compatible storage configured
- File validation service
- Image processing library (optional but recommended)

