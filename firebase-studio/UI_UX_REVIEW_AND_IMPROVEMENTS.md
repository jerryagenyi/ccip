# RCAP UI/UX Review and Improvement Plan

**Date**: 2025-01-15  
**Reviewer**: AI Assistant  
**Scope**: Complete UI/UX review against specifications

---

## Executive Summary

This document provides a comprehensive review of the Firebase Studio UI/UX implementation against RCAP specifications, identifies gaps, and provides detailed improvement prompts for the Firebase AI assistant.

### Status Overview
- ✅ **Login Screen**: Well implemented, minor footer text update needed
- ⚠️ **Registration Screen**: Needs organisation category selection
- ⚠️ **Dashboard**: Needs role-based customization
- ⚠️ **Activities**: Good foundation, needs spec alignment
- ❌ **Organisation Management**: Not yet implemented
- ❌ **Communication System**: Not yet implemented
- ❌ **User Profile**: Basic implementation, needs enhancement

---

## 1. Footer/Copyright Text Update

### Issue
Current footer shows: `© 2025 Federal Ministry of Health • Powered by RCAP v1.0.0`  
Spec requires: `© 2025 Federal Ministry of Health • RCAP v1.0.0`

### Impact
Low - Cosmetic only, but should match branding guidelines

### Fix Required
Update `AppFooter.tsx` to remove "Powered by" text.

---

## 2. Registration Screen - Organisation Category Selection

### Issue
Registration screen has hardcoded organisation list without category selection (government/nonprofit/civil_service).

### Spec Requirement
From `001-user-organisation-management/spec.md`:
- Select organisation category (government, nonprofit, civil_service) when creating
- Select hierarchy level (federal, state, local) - required for government, optional for nonprofit/civil_service

### Current Implementation
- Hardcoded organisation dropdown
- No category selection
- No hierarchy level selection

### Fix Required
Add organisation category selection and hierarchy level fields to registration form.

---

## 3. Dashboard - Role-Based Views

### Issue
Dashboard shows hardcoded "Federal Dashboard" content regardless of user role.

### Spec Requirement
From `003-dashboards-analytics/spec.md`:
- Different dashboard views per role (Super Admin, Admin, Sub-admin, User)
- Role-specific metrics and quick actions

### Current Implementation
- Single "FederalDashboard" component
- Hardcoded metrics
- No role-based filtering

### Fix Required
Create role-based dashboard components or make dashboard dynamic based on user role.

---

## 4. Activities List - Status Alignment

### Issue
Activities list uses: `'draft' | 'submitted' | 'approved' | 'rejected'`  
Spec requires: `'draft' | 'submitted' | 'approved' | 'rejected'` (matches, but need to verify all statuses are used correctly)

### Spec Requirement
From `002-activity-tracking/spec.md`:
- Status indicators (draft, submitted, approved, rejected)
- Status change history
- Visual status indicators (colours/icons)

### Current Implementation
- Status badges present ✅
- Status filtering present ✅
- Need to verify status change history

---

## 5. Organisation Management UI - Missing

### Issue
No UI components for:
- Organisation creation/editing
- Organisation hierarchy tree view
- Organisation linking (US-006)
- Ownership transfer (US-005)

### Spec Requirement
From `001-user-organisation-management/spec.md`:
- `OrganisationList.vue` - Organisation listing (admin) - Filterable by category
- `OrganisationForm.vue` - Organisation create/edit form (admin) - Includes category selection
- `OrganisationLink.vue` - Link organisation to parent (Super Admin)
- `OrganisationTransfer.vue` - Transfer ownership/admin rights (Super Admin)

### Fix Required
Create all organisation management components.

---

## 6. User Profile - Missing Features

### Issue
Profile screen exists but may be missing:
- Profile picture upload
- Activity history view
- Organisation context display

### Spec Requirement
From `001-user-organisation-management/spec.md`:
- Upload profile picture
- Default profile picture: Abstract AI-generated avatars from UI Faces
- View activity history (own activities)
- Update contact information

---

## 7. Communication System - Missing

### Issue
No messaging or notification UI components.

### Spec Requirement
From `004-communication/spec.md`:
- `MessageInbox.vue` - Message inbox list
- `MessageComposer.vue` - Compose new message
- `MessageThread.vue` - Message conversation view
- `NotificationBell.vue` - Notification indicator
- `NotificationList.vue` - Notification list

### Fix Required
Create all communication system components.

---

## 8. Design System Alignment

### Issue
Need to verify design system colors match implementation.

### Spec Requirement
From `design/design-system.md`:
- Primary: `#1976D2` (Blue)
- Current implementation uses purple (`#7B2CBF`) as primary

### Fix Required
Update color system to match design system or update design system to match implementation.

---

## 9. Activity Creation - Multi-Step Form

### Issue
Need to verify CreateActivity component matches spec requirements.

### Spec Requirement
From `002-activity-tracking/spec.md`:
- Multi-step form with progress indicator
- Evidence upload support
- Template selection
- Tag/category selection

---

## 10. Accessibility Improvements

### Issue
Need to verify WCAG 2.1 AA compliance.

### Spec Requirement
From `design/design-system.md`:
- Focus indicators: 3px outline
- Color contrast: WCAG AA (4.5:1 minimum)
- ARIA labels on all icon-only buttons
- Keyboard navigation

---

## Improvement Prompts for Firebase AI Assistant

The following prompts are designed to be executed sequentially. Each prompt addresses a single, focused improvement.

