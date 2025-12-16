# Story US-004: User Profile Management

**Epic:** Epic 001 - User & Organisation Management

**As a** user  
**I want to** manage my profile  
**So that** my information is up to date

## Acceptance Criteria

- [ ] View own profile information
- [ ] Edit own profile (name, contact info)
- [ ] Upload profile picture
- [ ] Default profile picture: Abstract AI-generated avatars from [UI Faces](https://www.uifaces.co/category/abstract) are used when no custom profile picture is uploaded
- [ ] Update contact information
- [ ] Change password
- [ ] View activity history (own activities)

## Technical Details

### Backend
- API Endpoints: `GET /api/v1/users/me`, `PUT /api/v1/users/me`, `PUT /api/v1/users/me/password`
- File upload: S3-compatible storage for profile pictures
- Default avatar: Abstract AI-generated avatars from UI Faces

### Frontend
- Component: `UserProfile.vue`
- Store: `useUserStore.ts`
- File upload component for profile picture

## Dependencies
- US-001: User Registration & Authentication

## Status
Ready for implementation
