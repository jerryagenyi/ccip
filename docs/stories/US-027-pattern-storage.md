# Story US-027: Pattern Storage

**Epic:** Epic 008 - Pattern Database

**As a** system  
**I want to** store semiotic patterns with rich context metadata  
**So that** patterns can be searched and matched for risk assessment

## Acceptance Criteria

- [ ] System can store patterns with: ID, Type, Context, Failed Element, Successful Alternative, Evidence
- [ ] Patterns support JSONB context metadata (location, population, crisis_type)
- [ ] Patterns support vector embeddings for similarity search (pgvector)
- [ ] Pattern storage is performant (< 100ms insert)
- [ ] Patterns can be organization-specific or globally shared
- [ ] Pattern validation workflow (pending, validated, rejected)

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/patterns`
- Model: `SemioticPattern` with fields: pattern_type, context (JSONB), failed_element, successful_alternative, evidence (JSONB), embedding (vector), validation_status
- Database: PostgreSQL with pgvector extension
- Vector generation: Python service generates embeddings, stored in database

### Frontend
- Component: `PatternManagement.vue` (admin interface)
- Features: Pattern list, pattern detail, validation workflow
- Store: `usePatternStore.ts` (if needed for admin UI)

## Dependencies
- Epic 001: User & Organisation Management (for organisation context)
- PostgreSQL with pgvector extension

## Status
Ready for implementation
