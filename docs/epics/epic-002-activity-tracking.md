# Epic 002: Activity Tracking & Reporting

## Epic Goal
Implement comprehensive activity tracking system with evidence uploads, offline-capable field reporting, effectiveness metrics capture, GPS location tagging, and pattern extraction integration. This is the core feature of CCIP, enabling public health officials to record, track, and report on risk communication activities with supporting evidence, even in low-bandwidth field environments.

## Epic Description
This epic provides the core activity tracking functionality for CCIP. Users can create activities, upload evidence, submit for approval, and track activity status through a complete workflow. Activities support multiple file types, custom templates, and comprehensive audit trails. Field officers can submit reports offline via PWA, capture communication effectiveness metrics (Understanding Score, Compliance, Barriers Encountered), tag GPS locations, and contribute data that feeds the pattern database for semiotic intelligence.

## User Stories
- US-008: Create Activity
- US-009: Upload Evidence
- US-010: Activity Submission & Approval Workflow
- US-011: Activity Timeline & Status Tracking
- US-012: Activity Templates
- US-013: Offline Field Report Submission (PWA)
- US-014: Capture Effectiveness Metrics
- US-015: GPS Location Tagging
- US-016: Pattern Extraction from Field Reports

## Technical Requirements

### Database Schema
- **activities** table: id, title, description, type, target_population, planned_message, organisation_id, status, created_by, approved_by, version, timestamps
- **activity_reports** table: id, activity_id, user_id, effectiveness_score, understanding_score, compliance_score, barriers_encountered (JSONB), gps_location (JSONB), submitted_at, submitted_offline, synced_at, timestamps
- **activity_attachments** table: id, activity_id, report_id, file_path, file_type, file_size, uploaded_by, timestamps
- **activity_status_history** table: id, activity_id, status, changed_by, notes, timestamps

### API Endpoints
- Activities: `/api/v1/activities/*` (CRUD, submit, approve, reject, complete)
- Reports: `/api/v1/activities/{id}/reports` (create, list, sync offline reports)
- Attachments: `/api/v1/activities/{id}/attachments` (upload, download, delete)
- Templates: `/api/v1/activity-templates/*` (CRUD)

### Frontend Components
- Activity components: `ActivityList.vue`, `ActivityCreate.vue`, `ActivityDetail.vue`, `ActivityForm.vue`
- Report components: `FieldReportForm.vue`, `EffectivenessMetrics.vue`, `GPSLocationPicker.vue`, `OfflineSyncStatus.vue`
- Attachment components: `FileUpload.vue`, `AttachmentList.vue`
- Template components: `ActivityTemplateSelector.vue`, `TemplateForm.vue`
- Stores: `useActivityStore.ts`, `useReportStore.ts`

### PWA Requirements
- Service Worker for offline functionality
- IndexedDB for offline report storage
- Background sync API for automatic retry when online
- Offline indicator UI component
- Conflict resolution for concurrent edits

### Pattern Extraction Integration
- Background job processing for pattern extraction from field reports
- Connection to Epic 008 (Pattern Database) for storing extracted patterns
- Effectiveness metrics feed pattern validation workflow

## Dependencies
- Epic 001: User & Organisation Management (for user/organisation structure)
- Epic 008: Pattern Database (for pattern extraction and storage)

## Security Considerations
- File upload validation (type, size limits)
- GPS location privacy (user consent, data minimization)
- Offline data encryption in IndexedDB
- Rate limiting on report submission endpoints

## Performance Considerations
- Optimistic UI updates for offline reports
- Batch sync for multiple offline reports
- Lazy loading of activity attachments
- Pagination for activity lists

## Priority
**High** - Core feature of CCIP

## Related Epics
- Epic 001: User & Organisation Management (depends on user/organisation structure)
- Epic 003: Dashboards (depends on activity data)
- Epic 007: Semiotic Risk Assessment (activities use risk assessment)
- Epic 008: Pattern Database (field reports feed pattern extraction)

## Status
Ready for implementation
