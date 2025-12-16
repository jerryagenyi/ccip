# Story US-030: User Help Guides

**Epic:** Epic 005 - Documentation & Help System

**As a** user  
**I want to** access help guides for features  
**So that** I can learn how to use CCIP effectively

## Acceptance Criteria

- [ ] Help section accessible from navigation
- [ ] Feature-specific help guides available
- [ ] Guides include step-by-step instructions
- [ ] Guides include screenshots or videos
- [ ] Search functionality for help content
- [ ] Role-based help content (different guides for different roles)

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/help/articles`
- Model: `HelpArticle` with fields: title, content, category, role_access, featured
- Search: Full-text search on help articles

### Frontend
- Component: `HelpSearch.vue`, `HelpArticle.vue`
- Features: Search, categories, role filtering, article viewer

## Dependencies
- Epic 001: User & Organisation Management (for role-based access)

## Status
Ready for implementation
