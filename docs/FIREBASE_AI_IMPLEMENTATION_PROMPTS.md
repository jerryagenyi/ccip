# RCAP Firebase AI Implementation Prompts

**Last Updated**: 2025-01-19
**Purpose**: Sequential prompts to fix critical issues and add required features to the RCAP UI/UX prototype
**Status**: Ready for Firebase AI Assistant Execution

These prompts are designed to be executed **sequentially** in Firebase Studio. Each prompt addresses a specific issue or feature requirement.

---

## Quick Summary

**Current Status**: 85% complete prototype ready for development after fixes
**Critical Issues**: 3 must-fix items before development
**Required Features**: 4 additional pages needed
**Timeline**: 7-10 weeks for all improvements

---

## PROMPT 1: Fix Footer Branding (Critical - Quick Fix)

**Task**: Update footer to remove "Powered by" text across all pages.

**Current**: `© 2025 Federal Ministry of Health • Powered by RCAP v1.0.0`
**Required**: `© 2025 Federal Ministry of Health • RCAP v1.0.0`

**Execute in Firebase Studio**:
```
Find and update all footer instances to remove "Powered by" text, keeping only "RCAP v1.0.0". Apply this change to:
- Login page
- Dashboard
- All activities pages
- Reports page
- Team directory
- Organisations page
- Notifications
- Profile
- All settings pages

Ensure consistent styling and positioning remain unchanged.
```

**Expected Result**: Clean branding without "Powered by" on all pages.

---

## PROMPT 2: Fix Organisation Data Model (Critical - Complex Fix)

**Task**: Separate organisation category from hierarchy level in data model and UI.

**Current Issue**: "Type" column shows both "Government" (category) and "LGA" (hierarchy level) mixed together.

**Execute in Firebase Studio**:
```
1. Update organisations table to show separate columns:
   - "Category": Government, Nonprofit, Civil Service
   - "Hierarchy Level": Federal, State, LGA

2. Update organisation create/edit form:
   - Add Category dropdown (required): Government, Nonprofit, Civil Service
   - Add Hierarchy Level dropdown (required): Federal, State, LGA
   - Add Parent Organisation selection (for State/LGA levels)

3. Add validation rules:
   - Federal level cannot have parent organisation
   - State level must select Federal parent
   - LGA level must select State parent

4. Update existing organisations data:
   - Federal Ministry of Health: Category=Government, Level=Federal
   - State Health Depts: Category=Government, Level=State
   - LGA Health Authorities: Category=Government, Level=LGA
   - NGOs: Category=Non-Profit, appropriate Level
```

**Expected Result**: Clear separation of organisation category and hierarchy with proper parent-child relationships.

---

## PROMPT 3: Create Functional Registration Page (Critical - Required Feature)

**Task**: Create working registration page that was returning 404.

**Execute in Firebase Studio**:
```
1. Create registration page at /register with multi-step form:
   - Step 1: Personal Information (Full Name, Email, Phone, Job Title)
   - Step 2: Organisation Assignment (Search & Select Organisation)
   - Step 3: Account Setup (Password, Confirm Password)
   - Step 4: Verification (Upload ID, Terms Acceptance)

2. Add organisation selection with:
   - Search by organisation name
   - Filter by category and location
   - Show organisation details when selected
   - "Request Access" if organisation not listed

3. Implement verification system:
   - Email verification with code
   - Admin approval workflow
   - Status tracking (Pending, Approved, Rejected)

4. Connect login "Create Account" link to /register

5. Add the same footer as login (without "Powered by")
```

**Expected Result**: Complete user registration flow with organisation assignment.

---

## PROMPT 4: Create Announcements Page (Required New Page)

**Task**: Design announcements page to distinguish platform updates from government announcements.

**Execute in Firebase Studio**:
```
1. Create announcements page at /dashboard/announcements with:
   - Filter tabs at top: All, Platform Updates, Federal Announcements, State Announcements, LGA Updates
   - Search functionality by title and content
   - Sort options: Newest First, Priority

2. Design announcement cards with:
   - Type badge/icon for visual distinction:
     * Platform Updates: Blue badge, system icon
     * Federal Announcements: Green badge, federal icon
     * State Announcements: Orange badge, state icon
     * LGA Updates: Yellow badge, local icon
   - Title and preview text (2 lines max)
   - Date and author/organisation
   - Read/Unread indicator
   - "Read More" link

3. Create detail view for announcements:
   - Full content with rich text formatting
   - Attachments (if any)
   - Related announcements
   - Back to list navigation

4. Add to navigation menu (desktop sidebar and mobile bottom nav)
5. Add notification badge for unread announcements
```

**Expected Result**: Complete announcements system with clear distinction between types and read/unread functionality.

---

## PROMPT 5: Create Pricing Page (Required New Page)

**Task**: Design pricing page with free tier and premium upsell for AI features.

**Execute in Firebase Studio**:
```
1. Create pricing page at /pricing with:
   - Hero section: "Choose Your Plan" heading
   - Two pricing cards side-by-side:
     * FREE TIER:
       - "Free Forever" badge
       - Up to 100 members
       - Basic activity tracking
       - Standard reports
       - Basic notifications
       - Community support
       - "Current Plan" button
     * PREMIUM TIER:
       - "Premium" badge
       - Custom pricing or "Contact Sales"
       - Unlimited members
       - Advanced analytics
       - AI-powered insights (COMING SOON badge)
       - AI report generation (COMING SOON badge)
       - AI activity recommendations (COMING SOON badge)
       - Priority support
       - Custom integrations
       - "Upgrade" or "Contact Sales" button

2. Add feature comparison table:
   - Side-by-side Free vs Premium comparison
   - Checkmarks/X marks for features
   - "Coming Soon" badges on all AI features

3. Add FAQ section with expandable answers

4. Link from footer and settings menu

5. Make fully responsive (stack cards on mobile)
```

**Expected Result**: Complete pricing page with free tier (100 members), premium upsell, and "Coming Soon" badges on AI features.

---

## PROMPT 6: Implement Mobile Bottom Navigation (Required Feature)

**Task**: Add bottom navigation bar for mobile devices (desktop uses sidebar).

**Execute in Firebase Studio**:
```
1. Create mobile bottom navigation component:
   - Fixed at bottom of viewport (mobile only)
   - Height: 80px
   - Background: White with shadow
   - 5 primary tabs with icons:
     * Dashboard (home icon)
     * Activities (assignment icon)
     * Reports (chart icon)
     * Team (people icon)
     * Profile (user icon)

2. Add visual states:
   - Active tab: Purple color (#7B2CBF) with gradient accent
   - Inactive tabs: Gray
   - Badge notifications on relevant tabs
   - Touch targets: Minimum 44x44px
   - Icon + label for each tab

3. Responsive behavior:
   - Show only on mobile (< 768px)
   - Hide on desktop (use sidebar instead)
   - Smooth transitions
   - Prevent overlap with content (add bottom padding)

4. Integration:
   - Connect to Vue Router for navigation
   - Update active state based on current route
   - Sync with desktop sidebar active state

5. Test on mobile 375px width
```

**Expected Result**: Mobile bottom navigation that appears only on mobile with 5 primary tabs and proper responsive behavior.

---

## PROMPT 7: Enhance Desktop Navigation Menu

**Task**: Verify and enhance desktop sidebar navigation with all required sections.

**Execute in Firebase Studio**:
```
1. Verify current navigation items:
   - Dashboard ✅
   - Activities ✅
   - Reports ✅
   - Team ✅
   - Organisations ✅
   - Notifications ✅
   - Profile ✅
   - Settings ✅

2. Add missing navigation items:
   - Announcements (link to announcements page)
   - Pricing (link to pricing page)

3. Organise navigation with section headers:
   - Main: Dashboard, Activities, Reports, Team
   - Management: Organisations, Announcements
   - Personal: Notifications, Profile, Settings
   - Billing: Pricing

4. Enhance visual design:
   - Active state indicator (purple background)
   - Hover states
   - Icons for all items
   - Badge notifications where applicable

5. Add role-based visibility:
   - Show/hide items based on user role
   - Collapse sections for non-admin users

6. Responsive behavior:
   - Hide on mobile (use bottom nav instead)
   - Collapsible to icon-only mode
   - Smooth animations

7. Test navigation links work correctly
```

**Expected Result**: Complete desktop navigation with all sections, proper organisation, and role-based visibility.

---

## PROMPT 8: Add Organisation Management Features

**Task**: Create missing organisation linking and transfer functionality.

**Execute in Firebase Studio**:
```
1. Add organisation linking interface:
   - "Link Organisation" button on organisations page
   - Modal with parent organisation selection
   - Link type selection (Direct Oversight, Partnership, Support)
   - Effective date picker
   - Description field
   - Validation to prevent circular references

2. Create linked organisations section:
   - Show parent organisations (if any)
   - Show child organisations (if any)
   - Display link type and effective date
   - Add unlink option with confirmation

3. Add ownership transfer system:
   - "Transfer Ownership" button (owners only)
   - Multi-step transfer wizard:
     * Select new owner from organisation members
     * Choose admin rights (Full, Partial, Read-only)
     * Set transition date (immediate or scheduled)
     * Add transfer notes
     * Confirmation with impact summary

4. Add transfer history section:
   - Show all past transfers
   - Include dates, parties, and reasons
   - Export option for audit trail

5. Create organisation tree view:
   - Hierarchical tree structure
   - Expandable/collapsible nodes
   - Search functionality
```

**Expected Result**: Complete organisation management with linking, transfer, and hierarchy visualization.

---

## PROMPT 9: Complete Activity Creation Form

**Task**: Add missing fields to activity creation form.

**Execute in Firebase Studio**:
```
1. Add organisation selection field:
   - Dropdown with user's organisations
   - Search and filter options
   - Show organisation type and level
   - Auto-select based on user role

2. Add activity categorization:
   - Tags field with autocomplete
   - Risk level selection (Low, Medium, High, Critical)
   - Target population field
   - Priority level (Normal, High, Urgent)

3. Add template selection:
   - "Use Template" checkbox
   - Template dropdown based on activity type
   - Pre-fill form fields from template
   - Allow customization after selection

4. Add draft functionality:
   - "Save as Draft" button
   - Auto-save every 2 minutes
   - Drafts section in activities list
   - "Submit for Approval" for final submission

5. Enhance form validation:
   - All required fields marked
   - Real-time validation feedback
   - Clear error messages
   - Success confirmation

6. Test form works correctly with all fields
```

**Expected Result**: Complete activity creation form with organisation selection, categorization, templates, and draft saving.

---

## PROMPT 10: Create Internal Messaging System

**Task**: Build complete messaging system for internal communication.

**Execute in Firebase Studio**:
```
1. Add "Messages" to navigation sidebar

2. Create message inbox with:
   - Conversation list with sender, preview, timestamp
   - Unread count indicator
   - Search by sender or message content
   - Filters: All, Unread, Sent, Urgent
   - Mark as read/unread functionality
   - Delete/archive options

3. Create message composer with:
   - To field with user search and organisation filtering
   - Subject line
   - Rich text message body
   - Priority level (Normal, High, Urgent)
   - File attachment option
   - Send/Schedule options

4. Create message thread view:
   - Full conversation history
   - Sender info and timestamps
   - Reply and forward options
   - Read receipts

5. Integrate with notification system:
   - New message notifications
   - Message count in navigation

6. Make fully responsive for mobile
```

**Expected Result**: Complete internal messaging system with inbox, composer, and conversation threads.

---

## PROMPT 11: Fix Mobile Navigation Accessibility

**Task**: Fix mobile menu accessibility and UX issues found during testing.

**Execute in Firebase Studio**:
```
1. Fix console accessibility errors:
   - Add DialogTitle: "Navigation Menu" to mobile menu
   - Add aria-describedby: "Main navigation for RCAP application"
   - Add proper ARIA labels to all navigation elements
   - Ensure keyboard navigation (Escape to close, Tab to navigate)
   - Add focus management when opening/closing

2. Improve mobile menu UX:
   - Add smooth slide-in animation (300ms ease-in-out)
   - Add darker backdrop overlay for better focus
   - Add explicit close button (X icon in top-right)
   - Prevent body scroll when menu is open
   - Auto-close menu when navigation item is clicked

3. Optimize touch targets:
   - Ensure all interactive elements are minimum 44x44px
   - Add proper spacing between touch targets
   - Test touch interactions
   - Prevent accidental taps

4. Add mobile navigation features:
   - Swipe gesture to close menu
   - Back button closes menu on Android
   - Visual feedback for touched elements
   - Haptic feedback if supported

5. Test on various mobile devices and screen readers
```

**Expected Result**: Fully accessible mobile navigation with smooth animations and proper touch targets.

---

## PROMPT 12: Add Comprehensive Error Handling

**Task**: Implement robust error handling and loading states.

**Execute in Firebase Studio**:
```
1. Add loading states for all async operations:
   - Skeleton screens for data loading
   - Spinners for button actions
   - Progress bars for file uploads
   - Loading overlays for page transitions

2. Create error boundary components:
   - Network error handling with retry options
   - Validation error messages with correction guidance
   - Permission error explanations
   - System maintenance notices

3. Add success feedback:
   - Toast notifications for successful actions
   - Confirmation dialogs for destructive actions
   - Progress indicators for multi-step processes
   - Summary of completed operations

4. Implement graceful degradation:
   - Offline mode indicators
   - Cached data display when network unavailable
   - Fallback UI for failed component loads
   - Auto-retry for failed network requests

5. Add comprehensive form validation:
   - Real-time field validation
   - Clear error messages
   - Success states
   - Prevent submission of invalid forms
```

**Expected Result**: Professional user experience with clear feedback for all operations and robust error recovery.

---

## Implementation Timeline

| Prompt | Priority | Estimated Time | Dependencies |
|--------|----------|----------------|--------------|
| 1 - Footer Fix | Critical | 1 day | None |
| 2 - Organisation Model | Critical | 3-4 days | None |
| 3 - Registration | Critical | 4-5 days | None |
| 4 - Announcements | High | 3-4 days | None |
| 5 - Pricing | High | 3-4 days | None |
| 6 - Mobile Nav | High | 2-3 days | None |
| 7 - Desktop Nav | High | 2-3 days | 6 |
| 8 - Organisation Mgmt | Medium | 5-7 days | 2 |
| 9 - Activity Form | Medium | 2-3 days | 2, 3 |
| 10 - Messaging | Medium | 5-7 days | None |
| 11 - Mobile Accessibility | Low | 2-3 days | All previous |
| 12 - Error Handling | Low | 3-4 days | All previous |

**Total Estimated Time**: 37-52 days (7-10 weeks)

---

## Success Criteria

After completing all prompts:

✅ **Critical Issues Fixed**:
- Footer branding consistent
- Organisation data model correct
- User registration functional

✅ **Required Features Added**:
- Announcements system with type filtering
- Pricing page with free/premium tiers
- Mobile bottom navigation
- Complete desktop navigation

✅ **Enhanced Functionality**:
- Organisation management complete
- Activity creation fully functional
- Internal messaging system
- Mobile accessibility compliant

✅ **Production Ready**:
- Robust error handling
- Consistent UI/UX throughout
- Mobile-responsive design
- Accessibility standards met

---

## Next Steps After Completion

1. **Regression Testing**: Test all existing functionality still works
2. **Cross-Device Testing**: Verify on mobile, tablet, and desktop
3. **User Acceptance Testing**: Get feedback from actual users
4. **Performance Optimization**: Optimize load times and animations
5. **Prepare for Development**: Export components and prepare migration plan

The RCAP prototype will be **95% complete** and ready for development transition after these improvements.