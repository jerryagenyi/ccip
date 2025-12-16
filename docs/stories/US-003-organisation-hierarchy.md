# Story US-003: Organisation Hierarchy

**Epic:** Epic 001 - User & Organisation Management

**As a** Super Admin  
**I want to** create and manage organisations in a hierarchy  
**So that** the system reflects real-world structure

## Acceptance Criteria

- [ ] Create organisations with parent-child relationships
- [ ] Select organisation category (government, nonprofit, civil_service) when creating
- [ ] Select hierarchy level (federal, state, local) - required for government, optional for nonprofit/civil_service
- [ ] Assign users to organisations
- [ ] View organisation tree structure
- [ ] Edit organisation details (by authorised users)
- [ ] Delete organisations (with cascade handling)
- [ ] Organisation-based data filtering
- [ ] Link existing organisations to new parent organisations (e.g., when a state organisation exists before a federal organisation, the federal can link the state as a child)
- [ ] Validate hierarchy when linking (prevent circular references, ensure type compatibility)
- [ ] Allow cross-category hierarchies (e.g., nonprofit can be linked to government organisation when collaborating)

## Technical Details

### Backend
- API Endpoints: `GET /api/v1/organisations`, `POST /api/v1/organisations`, `GET /api/v1/organisations/{id}`, `PUT /api/v1/organisations/{id}`, `GET /api/v1/organisations/{id}/users`, `POST /api/v1/organisations/{id}/link`
- Database: organisations table with parent_id (adjacency list pattern)
- Categories: government, nonprofit, civil_service
- Hierarchy levels: federal, state, local (required for government, optional for others)
- Validation: prevent circular references, ensure type compatibility

### Frontend
- Components: `OrganisationList.vue`, `OrganisationForm.vue`, `OrganisationLink.vue`
- Store: `useOrganisationStore.ts`
- Tree view for organisation hierarchy

## Dependencies
- US-001: User Registration & Authentication
- US-002: Role-Based Access Control

## Status
Ready for implementation
