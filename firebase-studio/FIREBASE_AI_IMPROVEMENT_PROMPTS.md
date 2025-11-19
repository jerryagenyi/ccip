# Firebase AI Assistant - UI/UX Design Prompts

**Last Updated**: 2025-01-15  
**Complete Audit Performed**: See `docs/COMPLETE_PAGE_AUDIT.md` for full page inventory  
**Note**: This is a **UI/UX prototype** for design purposes. These prompts are suggestions for enhancing the visual layouts and component designs.

These prompts should be executed sequentially in Firebase Studio. Each prompt addresses a single, focused UI/UX design improvement.

## Audit Summary

**Total Pages Found**: 21+ pages  
**Fully Audited**: 13 pages  
**UI/UX Design Suggestions**:
1. Footer text: Consider updating to match branding guidelines (remove "Powered by")
2. Organisation table: Consider splitting "Type" column into "Category" and "Hierarchy Level" for clarity
3. Organisation forms: Consider adding category selection field to create/edit forms
4. Organisation management: Consider designing UI layouts for linking and transfer features
5. Registration page: Design registration page layout (currently 404)
6. Activity forms: Consider adding organisation selection field to activity creation form
7. **Announcements page**: Required - Design page to distinguish platform updates from Federal/State/LGA announcements
8. **Pricing page**: Required - Design with free tier (50-100 members) and premium upsell with "Coming Soon" on AI features
9. **Mobile bottom navigation**: Required - Design bottom nav bar for mobile devices
10. **Desktop navigation**: Verify and enhance sidebar navigation with all required sections

---

## PROMPT 1: Update Footer Copyright Text (UI Design)

**Task**: Update the footer component design to match branding guidelines.

**Current Design**: `© 2025 Federal Ministry of Health • Powered by RCAP v1.0.0`  
**Suggested Design**: `© 2025 Federal Ministry of Health • RCAP v1.0.0`

**File to Update**: `src/components/AppFooter.tsx`

**Instructions**:
1. Open `src/components/AppFooter.tsx`
2. Find the footer text that includes "Powered by RCAP"
3. Remove the "Powered by" text, keeping only "RCAP v{version}"
4. Ensure the format is: `© {year} {organisationName} • RCAP v{version}`
5. If no organisation name, show: `© {year} RCAP v{version}`

**Expected Result**: Footer layout displays copyright text without "Powered by" for cleaner branding.

---

## PROMPT 2: Design Registration Page Layout

**Task**: Design registration page layout (currently shows 404).

**Files to Create**: `src/components/auth/RegisterScreen.tsx` (or update if exists)

**Instructions**:
1. Create registration page component similar to login page structure
2. Add form fields:
   - Full Name (required)
   - Email Address (required, validate format)
   - Password (required, min 8 characters)
   - Confirm Password (required, must match)
   - Phone Number (optional)
   - **Organisation Category** (required dropdown):
     - Options: "Government", "Nonprofit", "Civil Service"
   - **Hierarchy Level** (conditional):
     - Required if category is "Government"
     - Optional if category is "Nonprofit" or "Civil Service"
     - Options: "Federal", "State", "Local"
   - **Organisation Name** (text input or dropdown):
     - Allow user to select existing organisation or enter new one
     - If new organisation, require category and hierarchy level
3. Add validation:
   - All required fields validated
   - Email format validation
   - Password strength validation
   - Password confirmation match
   - Category required
   - Hierarchy level required when category is "Government"
4. Add "Create Account" button
5. Add "Already have an account? Sign In" link to login page
6. Update login page "Create Account" link to point to `/register` route
7. Add footer with same format as login: `© {year} {organisationName} • RCAP v{version}`

**Expected Result**: Registration page layout designed at `/register` with complete form design including organisation category and hierarchy level selection fields.

---

## PROMPT 3: Create Role-Based Dashboard Components

**Task**: Create separate dashboard components for each role (Super Admin, Admin, Sub-admin, User) or make dashboard dynamic based on user role.

**Files to Create/Update**:
- `src/components/dashboards/FederalDashboard.tsx` (update)
- `src/components/dashboards/StateDashboard.tsx` (create)
- `src/components/dashboards/LocalDashboard.tsx` (create)
- `src/components/dashboards/UserDashboard.tsx` (create)
- `src/components/dashboards/RoleDashboard.tsx` (create - wrapper component)

**Instructions**:
1. Create a `RoleDashboard.tsx` component that:
   - Accepts user role as prop
   - Renders appropriate dashboard based on role
   - Super Admin → FederalDashboard (full system access)
   - Admin → StateDashboard (organisation-level access)
   - Sub-admin → LocalDashboard (limited admin access)
   - User → UserDashboard (standard user view)
2. Create `StateDashboard.tsx`:
   - Similar structure to FederalDashboard
   - Metrics filtered to state-level data
   - Quick actions relevant to state admin
3. Create `LocalDashboard.tsx`:
   - Metrics filtered to local-level data
   - Quick actions relevant to sub-admin
4. Create `UserDashboard.tsx`:
   - Personal activity overview
   - Recent activities
   - Quick actions (create activity, view profile)
5. Update `App.tsx` to use `RoleDashboard` instead of hardcoded `FederalDashboard`
6. Pass user role to dashboard component (mock for now, will connect to auth later)

**Expected Result**: Dashboard displays role-appropriate content based on user role.

---

## PROMPT 4: Create Organisation Management Components

**Task**: Create UI components for organisation management (list, create/edit, link, transfer).

**Files to Create**:
- `src/components/organisations/OrganisationList.tsx`
- `src/components/organisations/OrganisationForm.tsx`
- `src/components/organisations/OrganisationLink.tsx`
- `src/components/organisations/OrganisationTransfer.tsx`
- `src/components/organisations/OrganisationTree.tsx` (bonus)

**Instructions for OrganisationList.tsx**:
1. **Update existing table** (currently shows mixed "Type" column):
   - Split into two columns: "Category" and "Hierarchy Level"
   - Category column: Government, Nonprofit, Civil Service
   - Hierarchy Level column: Federal, State, Local (or "N/A" if not set)
2. Include columns: Name, **Category**, **Hierarchy Level**, Parent Organisation, Members, Activities, Status, Actions
3. Add filters:
   - Filter by category (government/nonprofit/civil_service)
   - Filter by hierarchy level (federal/state/local)
   - Search by name
4. Add actions: View, Edit, Link, Transfer, Delete (based on permissions)
5. Show organisation hierarchy visually (indented or tree view)
6. Add "Create Organisation" button (already exists, verify it opens form with category selection)

**Instructions for OrganisationForm.tsx**:
1. **Create or update** form for creating/editing organisations (currently missing category selection)
2. Fields:
   - Name (required, text input)
   - **Category** (required, dropdown: Government, Nonprofit, Civil Service) ⚠️ **MISSING - ADD THIS**
   - **Hierarchy Level** (conditional, dropdown: Federal, State, Local)
     - Required when category is "Government"
     - Optional for other categories
     - Show "N/A" option for nonprofit/civil_service if not applicable
   - Parent Organisation (optional, dropdown - filtered by category/type)
     - Allow cross-category parent selection (e.g., nonprofit can be child of government)
   - Description (optional, textarea)
3. Add validation:
   - Name required
   - Category required
   - Hierarchy level required when category is government
   - Prevent circular parent references
   - Validate hierarchy compatibility (e.g., state can be child of federal)
4. Add "Save" and "Cancel" buttons
5. Show success message on save

**Instructions for OrganisationLink.tsx**:
1. Create component for linking organisations (Super Admin only)
2. Fields:
   - Select organisation to link (dropdown)
   - Select parent organisation (dropdown)
   - Show warning if linking changes hierarchy
3. Add validation:
   - Cannot link to self
   - Cannot create circular references
   - Type compatibility check
4. Add confirmation dialog before linking

**Instructions for OrganisationTransfer.tsx**:
1. Create component for transferring ownership/admin rights (Super Admin only)
2. Fields:
   - Select organisation (dropdown)
   - Select new owner/admin (user dropdown)
   - Transfer type (radio: Ownership / Admin Rights)
   - Reason/notes (textarea, optional)
3. Add confirmation dialog with warning about impact
4. Show affected users list

**Expected Result**: Complete organisation management UI with all CRUD operations and advanced features.

---

## PROMPT 5: Enhance User Profile Component

**Task**: Add missing profile features: picture upload, activity history, organisation context.

**File to Update**: `src/components/profile/ProfileScreen.tsx`

**Instructions**:
1. Add profile picture upload section:
   - Display current profile picture (or default avatar from UI Faces)
   - Upload button with file input
   - Preview uploaded image
   - Support image formats: JPG, PNG, WebP
   - Max file size: 2MB
   - Show default avatar if no picture uploaded
2. Add "My Activities" section:
   - List of user's activities
   - Filter by status (draft/submitted/approved)
   - Link to activity detail view
   - Show activity count
3. Add organisation context display:
   - Show current organisation name
   - Show organisation category and type
   - Show user's role in organisation
   - Link to organisation details (if admin)
4. Add activity history timeline:
   - Chronological list of user actions
   - Activity creation, submissions, etc.
5. Ensure all fields from spec are present:
   - Name (editable)
   - Email (display only, or editable with verification)
   - Phone (editable)
   - Organisation (display, link to change if allowed)
   - Role (display only)

**Expected Result**: Complete profile page with all required features from specification.

---

## PROMPT 6: Create Communication System Components

**Task**: Create messaging and notification UI components.

**Files to Create**:
- `src/components/messages/MessageInbox.tsx`
- `src/components/messages/MessageComposer.tsx`
- `src/components/messages/MessageThread.tsx`
- `src/components/messages/MessageDetail.tsx`
- `src/components/notifications/NotificationBell.tsx`
- `src/components/notifications/NotificationList.tsx`

**Instructions for MessageInbox.tsx**:
1. Create inbox list view
2. Show message list with:
   - Sender name/avatar
   - Subject
   - Preview text
   - Timestamp
   - Read/unread indicator
   - Urgent badge (if urgent)
3. Add filters:
   - All / Unread / Sent / Urgent
   - Search by subject/sender
4. Add actions:
   - Mark as read/unread
   - Delete
   - Archive (future)
5. Click message to open detail view

**Instructions for MessageComposer.tsx**:
1. Create compose message form
2. Fields:
   - To (user selector or role selector)
   - Subject (required)
   - Message body (required, rich text or textarea)
   - Urgent checkbox
   - Attachments (optional, future)
3. Add "Send" and "Save Draft" buttons
4. Add validation for required fields

**Instructions for MessageThread.tsx**:
1. Create conversation thread view
2. Show message history in chronological order
3. Show sender, timestamp, read receipts
4. Add reply functionality
5. Show message status (sent, delivered, read)

**Instructions for NotificationBell.tsx**:
1. Create notification bell icon component
2. Show unread count badge
3. Click to open notification list
4. Highlight when new notifications arrive

**Instructions for NotificationList.tsx**:
1. Create notification dropdown/list
2. Show notifications with:
   - Type icon
   - Title
   - Preview text
   - Timestamp
   - Read/unread indicator
3. Add actions:
   - Mark as read
   - Mark all as read
   - Clear all
4. Group by date (Today, Yesterday, This Week, Older)

**Expected Result**: Complete messaging and notification system UI.

---

## PROMPT 7: Verify Activity Creation Form Matches Spec

**Task**: Review and enhance CreateActivity component to ensure it matches all spec requirements.

**File to Review/Update**: `src/components/activities/CreateActivity.tsx`

**Instructions**:
1. **Current form is single-page** - consider multi-step or keep single page with sections
2. **Add missing fields**:
   - ⚠️ **Organisation selection** (currently missing - add dropdown)
   - Tags/Categories (optional, multi-select)
   - Template Selection (if applicable)
3. Verify all required fields:
   - Title (required) ✅ Present
   - Description (required) ✅ Present
   - Activity Type (required, dropdown) ✅ Present
   - **Organisation (required, dropdown)** ❌ **MISSING - ADD THIS**
   - State (required) ✅ Present
   - LGA/Area Council (conditional) ✅ Present
   - Specific Location/Venue ✅ Present
   - Start Date (required) ✅ Present
   - End Date (required) ✅ Present
4. **Current evidence upload section**:
   - ✅ Present with drag-and-drop
   - ✅ File types: PDF, DOCX, XLSX, PNG
   - ✅ Max size: 5MB each
   - ⚠️ Consider adding: Images (JPG, WebP), Audio, Video support
5. Add "Save as Draft" button (currently only "Submit for Approval")
6. Add validation for all required fields
7. Show confirmation on submission
8. **Add organisation context**: Pre-select user's organisation, allow change if user has multiple organisations

**Expected Result**: Complete activity creation form matching all spec requirements.

---

## PROMPT 8: Update Design System Colors

**Task**: Align color system with design system specification or update design system to match current implementation.

**Decision Required**: 
- Option A: Update UI to use design system colors (Primary: #1976D2 Blue)
- Option B: Update design system to match current purple theme (#7B2CBF)

**If Option A (Update UI)**:
1. Create color constants file: `src/styles/colors.ts`
2. Define colors from design system:
   - Primary: #1976D2
   - Secondary: #26A69A
   - Accent: #FF6B35
   - Success: #4CAF50
   - Warning: #FF9800
   - Error: #F44336
3. Update all components to use color constants
4. Update Tailwind config to use these colors

**If Option B (Update Design System)**:
1. Update `design/design-system.md` to reflect current purple theme
2. Document purple as primary brand color
3. Ensure all colors meet WCAG contrast requirements

**Expected Result**: Consistent color system across UI and documentation.

---

## PROMPT 9: Add Accessibility Features

**Task**: Ensure all components meet WCAG 2.1 AA accessibility standards.

**Instructions**:
1. Add focus indicators to all interactive elements:
   - 3px outline with primary color
   - Visible on keyboard navigation
2. Verify color contrast:
   - Text on background: minimum 4.5:1
   - Large text: minimum 3:1
   - Use contrast checker tool
3. Add ARIA labels to all icon-only buttons:
   - Example: `<button aria-label="Show password">`
4. Ensure all form fields have proper labels:
   - Use `<label>` elements
   - Associate labels with inputs using `htmlFor` and `id`
5. Add keyboard navigation support:
   - Tab order is logical
   - All interactive elements are keyboard accessible
   - Escape key closes modals/dialogs
6. Add skip links for main content
7. Test with screen reader (if possible)
8. Add `prefers-reduced-motion` media query support:
   - Disable animations when user prefers reduced motion

**Files to Update**: All component files

**Expected Result**: Fully accessible UI meeting WCAG 2.1 AA standards.

---

## PROMPT 10: Create Activity Detail View

**Task**: Create comprehensive activity detail view component.

**File to Create**: `src/components/activities/ActivityDetail.tsx`

**Instructions**:
1. Create detailed activity view with sections:
   - **Header**: Title, status badge, actions (edit, delete, export)
   - **Basic Info**: Description, date, location, type, organisation
   - **Tags/Categories**: Display all tags
   - **Evidence Gallery**: 
     - Grid view of uploaded files
     - Preview images
     - Download documents
     - Play audio/video
   - **Timeline/History**:
     - Creation date
     - Submission date
     - Status changes
     - Edit history
   - **Comments/Notes** (if applicable)
2. Add actions:
   - Edit (if draft or user has permission)
   - Delete (if draft or user has permission)
   - Export as PDF
   - Share (future)
3. Show related activities (same organisation, similar tags)
4. Add breadcrumb navigation
5. Make responsive for mobile

**Expected Result**: Complete activity detail view with all information and actions.

---

## Summary

Execute these prompts in order (1-10). Each prompt is self-contained and can be completed independently. These are **UI/UX design suggestions** for enhancing the prototype layouts. After completing all prompts, the UI layouts will be more comprehensive and aligned with specifications.

**Priority Order** (for design purposes):
1. High Priority: Prompts 1, 2, 3, 4, 7, 11, 12, 13 (core layout improvements + required pages)
2. Medium Priority: Prompts 5, 6, 10 (additional component layouts)
3. Low Priority: Prompts 8, 9 (design system and accessibility considerations)

---

## PROMPT 11: Design Announcements Page

**Task**: Design announcements page to distinguish platform-specific announcements from Federal/State/LGA announcements.

**File to Create**: `src/components/announcements/AnnouncementsPage.tsx` or `src/pages/Announcements.vue`

**Instructions**:
1. Create announcements page layout with:
   - **Filter Tabs** at top:
     - "All Announcements" (default)
     - "Platform Updates" (feature updates, system maintenance)
     - "Federal Announcements"
     - "State Announcements"
     - "LGA Updates"
   - **Announcement Cards**:
     - Type badge/icon (Platform/Federal/State/LGA)
     - Title
     - Preview text (truncated)
     - Date and time
     - Author/Organisation name
     - Read/Unread indicator
     - "Read More" link
   - **Search functionality**: Search by title, content, organisation
   - **Sort options**: Newest first, Oldest first, Most important
   - **Mark as read/unread** toggle per announcement
   - **Mark all as read** button
2. **Visual Distinction**:
   - Platform Updates: Blue/purple badge, system icon
   - Federal Announcements: Green badge, federal icon
   - State Announcements: Orange badge, state icon
   - LGA Updates: Yellow badge, local icon
3. **Detail View** (when clicking announcement):
   - Full announcement content
   - Rich text formatting support
   - Attachments (if any)
   - Related announcements
   - Back to list button
4. Add to navigation menu (desktop sidebar and mobile bottom nav)
5. Add notification badge if unread announcements exist

**Expected Result**: Complete announcements page layout with filtering, clear visual distinction between announcement types, and read/unread functionality.

---

## PROMPT 12: Design Pricing Page

**Task**: Design pricing page with free tier and premium upsell.

**File to Create**: `src/components/pricing/PricingPage.tsx` or `src/pages/Pricing.vue`

**Instructions**:
1. Create pricing page layout with:
   - **Hero Section**:
     - "Choose Your Plan" heading
     - Brief description of pricing structure
   - **Pricing Cards** (side-by-side):
     - **Free Tier**:
       - "Free" badge
       - Price: "Free Forever"
       - Features:
         - Up to 50-100 members (to be decided - show as "Up to [X] members")
         - Basic activity tracking
         - Standard reports
         - Basic notifications
         - Community support
       - "Current Plan" or "Get Started" button
     - **Premium Tier**:
       - "Premium" or "Pro" badge
       - Price: "£X/month" or "Contact for Pricing"
       - Features:
         - Unlimited members
         - Advanced analytics ⚠️ (with "Coming Soon" badge if not ready)
         - AI-powered insights ⚠️ (with "Coming Soon" badge)
         - AI report generation ⚠️ (with "Coming Soon" badge)
         - AI activity recommendations ⚠️ (with "Coming Soon" badge)
         - Priority support
         - Custom integrations
       - "Upgrade" or "Contact Sales" button
   - **Feature Comparison Table**:
     - Side-by-side comparison of Free vs Premium
     - Clear checkmarks/X marks
     - "Coming Soon" badges on AI features
   - **FAQ Section**:
     - Common pricing questions
     - Expandable answers
   - **Testimonials/Use Cases** (optional):
     - Examples of organisations using each tier
2. **AI Features Styling**:
   - All AI features must have "Coming Soon" badge
   - Gray out or use different styling for coming soon features
   - Tooltip explaining when features will be available
3. Add link to pricing page in:
   - Footer
   - Settings menu
   - Organisation settings (for admins)
4. **Responsive Design**:
   - Stack pricing cards on mobile
   - Full-width comparison table on mobile
   - Touch-friendly buttons

**Expected Result**: Complete pricing page layout with free tier, premium upsell, clear feature comparison, and "Coming Soon" badges on all AI features.

---

## PROMPT 13: Design Mobile Bottom Navigation

**Task**: Design mobile bottom navigation bar (desktop uses sidebar).

**File to Create/Update**: `src/components/navigation/MobileBottomNav.tsx` or update layout component

**Instructions**:
1. Create mobile bottom navigation component:
   - **Fixed Position**: Fixed at bottom of viewport (mobile only)
   - **Height**: 60-80px
   - **Background**: White or app primary color
   - **Shadow**: Subtle top shadow for elevation
   - **5 Primary Tabs**:
     - Dashboard (home icon)
     - Activities (activity/assignment icon)
     - Reports (chart/analytics icon)
     - Team (users/team icon)
     - Profile (user/profile icon)
   - **Active State**:
     - Active tab: Primary color (purple)
     - Inactive tabs: Gray
     - Active indicator: Bottom border or background highlight
     - Icon + Label for each tab
   - **Badge Notifications**:
     - Red badge with count on relevant tabs (Activities, Team, Profile)
     - Small circular badge in top-right of icon
   - **Responsive Behavior**:
     - Show only on mobile devices (< 768px or < 1024px breakpoint)
     - Hide on desktop (use sidebar instead)
     - Smooth transitions
2. **Integration**:
   - Add to main layout component
   - Use Vue Router for navigation
   - Update active state based on current route
   - Ensure content area has bottom padding to prevent overlap
3. **Accessibility**:
   - Proper ARIA labels
   - Keyboard navigation support
   - Touch target size: minimum 44x44px
4. **Optional Enhancements**:
   - Haptic feedback on tap (if supported)
   - Swipe gestures (future)
   - Floating action button overlay (if needed)

**Expected Result**: Mobile bottom navigation bar that appears only on mobile devices, with 5 primary tabs, active states, badge notifications, and proper responsive behavior.

---

## PROMPT 14: Verify Desktop Navigation Menu

**Task**: Verify and enhance desktop navigation menu (sidebar).

**File to Update**: `src/layouts/MainLayout.vue` or sidebar component

**Instructions**:
1. **Verify Current Navigation Items**:
   - Dashboard ✅
   - Activities ✅
   - Reports ✅
   - Team ✅
   - Organisations ✅
   - Notifications ✅
   - Profile ✅
   - Settings ✅
2. **Add Missing Navigation Items**:
   - Announcements (link to announcements page)
   - Pricing (link to pricing page - for admins or all users)
3. **Organise Navigation**:
   - Group related items (e.g., "Management" section: Team, Organisations)
   - Add section headers if needed
   - Show/hide items based on user role
4. **Enhance Visual Design**:
   - Active state indicator
   - Hover states
   - Icons for all items
   - Badge notifications where applicable
5. **Collapsible Sidebar**:
   - Allow collapsing to icon-only mode
   - Remember user preference
   - Smooth animation
6. **Responsive Behavior**:
   - Hide on mobile (use bottom nav instead)
   - Show hamburger menu on mobile to toggle
   - Overlay or push content when open on mobile

**Expected Result**: Complete desktop navigation menu with all required sections, proper organisation, role-based visibility, and responsive behavior.

