# Story US-015: GPS Location Tagging

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** Field Officer  
**I want to** tag GPS location with field reports  
**So that** activities can be analyzed by geographic context for pattern matching

## Acceptance Criteria

- [ ] User can enable GPS location capture (with consent)
- [ ] GPS coordinates are captured automatically or manually
- [ ] Location is displayed on map (optional, if mapping available)
- [ ] User can edit/adjust location if needed
- [ ] Location privacy: User consent required, data minimization
- [ ] Location stored as JSONB (latitude, longitude, accuracy, timestamp)
- [ ] Location is optional (not required for report submission)

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/activities/{id}/reports` (includes gps_location)
- Model: `ActivityReport` with field: `gps_location` (JSONB: {lat, lng, accuracy, timestamp})
- Privacy: Store only if user consents, allow deletion

### Frontend
- Component: `GPSLocationPicker.vue`
- Browser API: Geolocation API for GPS capture
- Features: Request permission, capture coordinates, display on map (if available)
- Store: `useReportStore.ts` with location capture

### Privacy Considerations
- Explicit user consent before capturing location
- Clear explanation of why location is needed
- Option to skip location capture
- Data minimization: Only capture when needed

## Dependencies
- Epic 001: User & Organisation Management (for user context)
- Browser Geolocation API

## Status
Ready for implementation
