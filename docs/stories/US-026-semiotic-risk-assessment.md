# Story US-026: Semiotic Risk Assessment

**Epic:** Epic 007 - Semiotic Risk Assessment

**As a** State Admin or LGA Officer  
**I want to** assess semiotic risk of my planned message before deployment  
**So that** I can identify and fix potential communication failures

## Acceptance Criteria

- [ ] User can trigger risk assessment from activity form
- [ ] Assessment completes within 5 seconds
- [ ] Assessment shows risk score (0-100 or similar scale)
- [ ] Assessment identifies 3-5 specific predicted failure points
- [ ] Assessment provides 3-5 actionable recommendations
- [ ] Assessment shows confidence score (70-95%)
- [ ] Assessment shows similar successful campaigns (if available)
- [ ] User can apply recommendations with one-click
- [ ] Assessment is human-reviewable (explainable AI for EU AI Act compliance)

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/activities/{id}/assess-risk`
- Integration: Calls Python FastAPI ML service for assessment
- Response time: < 5 seconds (synchronous call)
- Model: `SemioticAssessment` stores assessment results

### Frontend
- Component: `SemioticAnalysis.vue` (already exists in prototype)
- Features: Risk score display, failure points list, recommendations list, apply buttons
- Store: `useActivityStore.ts` with `assessRisk()` action

## Dependencies
- Epic 001: User & Organisation Management (for user context)
- Epic 002: Activity Tracking (for activity context)
- Epic 008: Pattern Database (for pattern matching)

## Status
Ready for implementation
