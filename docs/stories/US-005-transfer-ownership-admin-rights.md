# Story US-005: Transfer Ownership and Admin Rights

**Epic:** Epic 001 - User & Organisation Management

**As a** Super Admin  
**I want to** transfer ownership and admin rights between organisations  
**So that** organisations can merge, adopt movements, or restructure seamlessly

## Acceptance Criteria

- [ ] Transfer organisation ownership from one user to another
- [ ] Transfer super admin rights between organisations
- [ ] Maintain audit trail of ownership transfers
- [ ] Notify affected users when ownership changes
- [ ] Validate transfer permissions (only Super Admin can transfer)
- [ ] Handle cascading role updates when ownership transfers
- [ ] Support scenarios where small CSOs start movements that get adopted by larger organisations

## Technical Details

### Backend
- API Endpoints: `POST /api/v1/organisations/{id}/transfer-ownership`, `POST /api/v1/organisations/{id}/transfer-admin`
- Permission: Super Admin only
- Audit trail: log all ownership transfers
- Notifications: notify affected users

### Frontend
- Component: `OrganisationTransfer.vue`
- Confirmation dialogs for transfers
- Success/error notifications

## Dependencies
- US-001: User Registration & Authentication
- US-002: Role-Based Access Control
- US-003: Organisation Hierarchy

## Status
Ready for implementation
