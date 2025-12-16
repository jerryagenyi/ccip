# Story US-007: Navigation System

**Epic:** Epic 001 - User & Organisation Management

**As a** user  
**I want to** navigate the application using appropriate navigation for my device  
**So that** I can access all features efficiently

## Acceptance Criteria

- [ ] Desktop navigation: Fixed sidebar with all main sections
  - Dashboard, Activities, Reports, Team, Organisations, Notifications, Profile, Settings, Announcements
  - Collapsible sidebar (icon-only mode)
  - Active state indicators
  - Badge notifications where applicable
  - Role-based visibility (show/hide items based on permissions)
- [ ] Mobile navigation: Bottom navigation bar (mobile only)
  - Fixed at bottom of viewport
  - 5 primary tabs: Dashboard, Activities, Reports, Team, Profile
  - Active state indicators
  - Badge notifications on relevant tabs
  - Hidden on desktop (use sidebar instead)
  - Responsive breakpoint: Show on < 768px or < 1024px
- [ ] Navigation accessibility:
  - Proper ARIA labels
  - Keyboard navigation support
  - Touch target size: minimum 44x44px
  - Smooth transitions
- [ ] Navigation integration:
  - Use Vue Router for navigation
  - Update active state based on current route
  - Ensure content area has proper padding to prevent overlap with bottom nav

## Technical Details

### Frontend
- Components: `DesktopSidebar.vue`, `MobileBottomNav.vue`
- Routing: Vue Router
- Responsive breakpoints: < 768px or < 1024px for mobile nav
- Accessibility: ARIA labels, keyboard navigation, proper touch targets

## Dependencies
- US-001: User Registration & Authentication
- US-002: Role-Based Access Control

## Status
Ready for implementation
