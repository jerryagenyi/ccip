# Story US-006: Link Organisations Retroactively

**Epic:** Epic 001 - User & Organisation Management

**As a** Super Admin  
**I want to** link an existing organisation to a new parent organisation  
**So that** organisations that started independently can be integrated into a hierarchy later

## Acceptance Criteria

- [ ] Link an existing organisation (e.g., state) to a new parent organisation (e.g., federal)
- [ ] Update organisation hierarchy when linking
- [ ] Preserve all existing data and users when linking
- [ ] Validate that linking maintains hierarchy integrity (no circular references)
- [ ] Support scenario: state organisation exists before federal, federal can link state as child
- [ ] Update permissions and access automatically when organisations are linked
- [ ] Maintain audit trail of organisation linking operations

## Technical Details

### Backend
- API Endpoint: `POST /api/v1/organisations/{id}/link`
- Validation: prevent circular references, ensure type compatibility
- Preserve all existing data and users
- Update permissions automatically
- Audit trail for linking operations

### Frontend
- Component: `OrganisationLink.vue`
- Validation feedback
- Confirmation dialogs

## Dependencies
- US-001: User Registration & Authentication
- US-002: Role-Based Access Control
- US-003: Organisation Hierarchy

## Status
Ready for implementation
