# Story US-013: Offline Field Report Submission (PWA)

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** Field Officer  
**I want to** submit field reports even when offline  
**So that** I can work in low-bandwidth or no-connectivity field environments

## Acceptance Criteria

- [ ] User can submit report when offline
- [ ] Report is stored locally in IndexedDB
- [ ] Service worker handles offline detection
- [ ] Offline indicator shows when device is offline
- [ ] Reports automatically sync when connection is restored
- [ ] User can manually trigger sync
- [ ] Conflict resolution for concurrent edits
- [ ] User sees sync status for pending reports

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/activities/{id}/reports` (normal endpoint, works when online)
- Background sync: Handled by service worker, not backend

### Frontend
- PWA Service Worker: Handles offline detection and background sync
- IndexedDB: Store reports locally using `localForage` library
- Components: `OfflineSyncStatus.vue`, `FieldReportForm.vue` (enhanced for offline)
- Store: `useReportStore.ts` with `submitReportOffline()`, `syncPendingReports()` actions
- Background Sync API: Automatic retry when online

### PWA Configuration
- Service worker registration in `main.ts`
- Cache strategy: Network-first for API calls, cache-first for static assets
- Offline fallback page

## Dependencies
- Epic 001: User & Organisation Management (for user context)
- Quasar PWA mode configured

## Status
Ready for implementation
