# Story US-032: In-App Help

**Epic:** Epic 005 - Documentation & Help System

**As a** user  
**I want to** access contextual help within the application  
**So that** I can get help without leaving the current page

## Acceptance Criteria

- [ ] Help icon/button available on key pages
- [ ] Contextual help tooltips for form fields
- [ ] Help panel that can be opened/closed
- [ ] Help content relevant to current page/feature
- [ ] Links to full help articles

## Technical Details

### Backend
- API Endpoint: `GET /api/v1/help/context/{page}` (returns help for specific page)
- Context mapping: Map page routes to help content

### Frontend
- Component: `HelpPanel.vue`, `HelpTooltip.vue`
- Features: Slide-out panel, tooltips, contextual content
- Integration: Add help buttons to key pages

## Dependencies
- Epic 001: User & Organisation Management (for user context)
- Epic 005: US-030 (User Help Guides - for help content)

## Status
Ready for implementation
