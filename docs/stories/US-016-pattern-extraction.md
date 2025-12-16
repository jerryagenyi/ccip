# Story US-016: Pattern Extraction from Field Reports

**Epic:** Epic 002 - Activity Tracking & Reporting

**As a** system  
**I want to** automatically extract semiotic patterns from field reports  
**So that** the pattern database can learn from field outcomes and improve future risk assessments

## Acceptance Criteria

- [ ] Background job processes field reports after submission
- [ ] Job extracts patterns from effectiveness metrics and barriers
- [ ] Patterns are validated before storage
- [ ] Extracted patterns are linked to original activity/report
- [ ] Pattern extraction runs asynchronously (doesn't block report submission)
- [ ] Failed extractions are logged for review
- [ ] Pattern extraction respects data privacy (anonymization)

## Technical Details

### Backend
- Background Job: Laravel queue job `ExtractPatternsFromReport`
- Trigger: Dispatched when report is submitted
- Process: Analyze effectiveness metrics, barriers, message content, context
- Output: Create `SemioticPattern` records (Epic 008)
- Model: `ActivityReport` triggers pattern extraction job

### Pattern Extraction Logic
- Analyze barriers_encountered for common failure patterns
- Correlate low effectiveness scores with message content
- Extract context (location, target population, activity type)
- Create pattern with: type, context, failed_element, successful_alternative, evidence

### Privacy & Anonymization
- Remove personally identifiable information
- Anonymize organisation details if needed
- Store only anonymized patterns in shared database

## Dependencies
- Epic 001: User & Organisation Management (for user context)
- Epic 008: Pattern Database (for pattern storage)
- Laravel Queue system configured

## Status
Ready for implementation
