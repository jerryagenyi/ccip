# Story US-014: Capture Effectiveness Metrics

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** Field Officer  
**I want to** capture communication effectiveness metrics (Understanding Score, Compliance, Barriers Encountered)  
**So that** the system can learn from field outcomes and improve future recommendations

## Acceptance Criteria

- [ ] User can rate Understanding Score (1-5 scale or percentage)
- [ ] User can rate Compliance Score (1-5 scale or percentage)
- [ ] User can record Barriers Encountered (multi-select or free text)
- [ ] Metrics are saved with field report
- [ ] Metrics are required before report submission
- [ ] Metrics feed pattern database for learning (Epic 008)
- [ ] Visual feedback for metric input (sliders, stars, etc.)

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/activities/{id}/reports` (includes metrics)
- Model: `ActivityReport` with fields: effectiveness_score, understanding_score, compliance_score, barriers_encountered (JSONB)
- Validation: Scores must be within valid range (1-5 or 0-100)
- Pattern extraction: Background job processes reports to extract patterns (Epic 008)

### Frontend
- Component: `EffectivenessMetrics.vue`
- Input types: Sliders for scores, multi-select/tags for barriers
- Validation: Client-side validation before submission
- Store: `useReportStore.ts` with metrics capture

## Dependencies
- Epic 001: User & Organisation Management (for user context)
- Epic 008: Pattern Database (for pattern extraction from metrics)

## Status
Ready for implementation
