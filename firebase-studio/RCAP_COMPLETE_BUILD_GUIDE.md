# RCAP Complete Build Guide for Firebase Studio
**Updated: 2025-01-19 - Incorporates Current Prototype Status and Required Improvements**

**Current Status**: 85% complete prototype at https://9000-firebase-studio-1763236692080.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev
**Next Step**: Execute implementation prompts from docs/FIREBASE_AI_IMPLEMENTATION_PROMPTS.md

---

## 🚀 Immediate Action Plan

### Phase 1: Critical Fixes (Week 1-2)
Execute these prompts from `docs/FIREBASE_AI_IMPLEMENTATION_PROMPTS.md`:
1. **Prompt 1**: Fix footer branding (remove "Powered by")
2. **Prompt 2**: Fix organisation data model (separate category from hierarchy)
3. **Prompt 3**: Create functional registration page

### Phase 2: Required Features (Week 3-4)
4. **Prompt 4**: Create announcements page (distinguish platform vs government announcements)
5. **Prompt 5**: Create pricing page (free tier up to 100 members, AI features "Coming Soon")
6. **Prompt 6**: Implement mobile bottom navigation
7. **Prompt 7**: Enhance desktop navigation menu

### Phase 3: Enhanced Features (Week 5-8)
8. **Prompt 8**: Add organisation management features (linking, transfer)
9. **Prompt 9**: Complete activity creation form
10. **Prompt 10**: Create internal messaging system

### Phase 4: Polish & Accessibility (Week 9-10)
11. **Prompt 11**: Fix mobile navigation accessibility
12. **Prompt 12**: Add comprehensive error handling

---

## 📋 How to Use This Guide

This document provides **layer-by-layer build instructions** for RCAP. Given that 85% of the prototype is already complete, this guide now focuses on:

1. **Executing critical fixes** using the implementation prompts
2. **Building missing pages** (Announcements, Pricing)
3. **Enhancing existing components** with missing functionality
4. **Adding required navigation** (mobile bottom nav)

**Workflow**:
1. First, execute all prompts from `docs/FIREBASE_AI_IMPLEMENTATION_PROMPTS.md`
2. Use this guide for detailed component specifications as needed
3. Each section assumes the prototype foundation is already in place

**Important**: Execute the implementation prompts first before building new components from this guide.

---

# SECTION 1: Foundation & Design System Setup

## 🎨 Design System Foundation

Create the base design system and layout structure for RCAP (Risk Communication Activity Platform).

### **Project Context**
- **Platform**: RCAP - Risk Communication Activity Platform for African public health professionals
- **Tech Stack**: Vue 3 + Quasar Framework (but build in Firebase Studio's native components)
- **Design Theme**: Modern purple-blue gradient theme
- **Target Users**: Federal, State, LGA, and Field Officer level public health officials
- **Primary Device**: Mobile-first (60%+ mobile users, 375px primary breakpoint)

### **Color System**

**Primary Colors**:
- **Primary Purple**: #7B2CBF - buttons, links, active states, highlights
- **Primary Blue**: #4A90E2 - secondary actions, accents
- **Gradient Primary**: `linear-gradient(135deg, #7B2CBF 0%, #4A90E2 100%)` - primary buttons
- **Background**: Light gradient from #F0F4F8 to #E8E0F5 - soft blue-purple gradient
- **Surface**: White (#FFFFFF) - cards, modals
- **Text Primary**: #212121 - main text
- **Text Secondary**: #757575 - secondary text

**Semantic Colors**:
- **Success**: #4CAF50 - approved status, success states
- **Warning**: #FF9800 - pending items, warnings
- **Error**: #F44336 - rejected status, errors
- **Info**: #2196F3 - information

### **Typography**
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **H1**: 32px, SemiBold (600), line-height: 1.2
- **H2**: 24px, SemiBold (600), line-height: 1.3
- **H3**: 20px, SemiBold (600), line-height: 1.3
- **Body**: 16px, Regular (400), line-height: 1.6
- **Caption**: 12px, Regular (400), line-height: 1.4

### **Spacing System (8px Grid)**
- **Card Padding**: 24px (all sides)
- **Card Gap**: 16px (between cards)
- **Section Spacing**: 32px vertical
- **Form Field Spacing**: 24px vertical
- **Button Gap**: 16px horizontal

### **Component Specifications**

**Buttons**:
- **Primary**: Purple-blue gradient, white text, 48px height, 12px vertical padding, 24px horizontal padding, 12px border radius
- **Secondary**: Blue background (#4A90E2), white text, same dimensions
- **Outline**: 2px solid purple border, transparent background, purple text

**Cards**:
- White background (#FFFFFF)
- 24px padding on all sides
- 16px border radius
- Shadow: `0 2px 8px rgba(123, 44, 191, 0.1)`
- Hover: Elevate with `translateY(-4px)` and increased shadow

**Inputs**:
- 48px height (minimum for touch targets)
- 16px horizontal padding
- 12px border radius
- 2px solid #E0E0E0 border (default)
- Focus: 2px solid #7B2CBF border with 4px glow

### **Layout Structure**

**App Shell**:
- **Header**: 64px height, white background, 16px horizontal padding
- **Main Content**: 16px horizontal padding (mobile), 24px (tablet), 32px (desktop)
- **Bottom Navigation** (Mobile): 80px height, 5 tabs (Dashboard, Activities, Reports, Team, Profile)
- **Sidebar** (Desktop): 280px width, collapsible

### **Responsive Breakpoints**
- **Mobile**: < 600px (primary focus)
- **Tablet**: 600px - 1023px
- **Desktop**: 1024px+

### **Accessibility Requirements**
- All interactive elements: 48px × 48px minimum touch targets
- Focus indicators: 3px purple outline
- Color contrast: WCAG AA (4.5:1 minimum)
- ARIA labels on all icon-only buttons

### **What to Build in This Section**

1. **Global Styles**: Set up color variables, typography, spacing
2. **Layout Components**: 
   - App shell with header
   - Main content container
   - Bottom navigation (mobile)
   - Sidebar (desktop)
3. **Base Components**:
   - Button variants (primary, secondary, outline)
   - Card component
   - Input field component
   - Status badge component

**Success Criteria**: 
- [ ] Color system applied globally
- [ ] Typography scale working
- [ ] Base layout structure in place
- [ ] Reusable button, card, and input components created
- [ ] Responsive breakpoints working

---

# SECTION 2: Authentication Pages

## 🔐 Authentication & Onboarding

Build all authentication-related pages for user login, registration, and password management.

### **Page 1: Login Screen**

**Layout**:
- Full-screen centered card on gradient background
- Logo and branding at top
- Login form in center
- Footer with copyright

**Elements**:
1. **Header Section** (top):
   - RCAP logo (purple-blue gradient icon, 64px × 64px)
   - "RCAP" text (32px, bold, purple #7B2CBF)
   - "Federal Ministry of Health" subtitle (14px, #757575)
   - "Risk Communication Activity Platform" tagline (12px, #757575)

2. **Login Card** (center, white background):
   - "Welcome Back" heading (24px, bold, #212121)
   - **Email Input Field**:
     - Label: "Email Address"
     - Placeholder: "Enter your email"
     - Type: email
     - Height: 48px
     - Border: 2px solid #E0E0E0
     - Focus: Purple border with glow
   - **Password Input Field**:
     - Label: "Password"
     - Placeholder: "Enter your password"
     - Type: password
     - Show/hide toggle icon (eye icon, right side)
     - Same styling as email field
   - **Remember Me Checkbox**:
     - Checkbox with "Remember me" label (14px, #212121)
     - Left side of row
   - **Forgot Password Link**:
     - "Forgot password?" text (14px, purple #7B2CBF)
     - Right side of row
   - **Sign In Button**:
     - Purple-blue gradient background
     - White "Sign In" text
     - 48px height, full width
     - Centered
   - **Create Account Link**:
     - "Don't have an account?" text (14px, #757575)
     - "Create Account" link (14px, purple #7B2CBF)
     - Centered below button

3. **Footer** (bottom):
   - "© 2025 Federal Ministry of Health • RCAP v1.0.0" (12px, #757575)

**Spacing**:
- Card padding: 24px
- Gap between form fields: 24px
- Gap between checkbox row and button: 16px

**Validation States**:
- Error: Red border (#F44336) with error message below field
- Success: Green border (#4CAF50) with checkmark

### **Page 2: Registration Screen**

**Layout**: Similar to login, but with multi-step form

**Elements**:
1. **Header**: Same as login
2. **Registration Card**:
   - "Create Account" heading (24px, bold)
   - **Step Indicator** (top):
     - "Step 1 of 3" text (14px, #757575)
     - Progress bar (purple gradient, 4px height)
   - **Form Fields**:
     - Full Name (text input, required)
     - Email Address (email input, required)
     - Phone Number (tel input, required)
     - Password (password input, required, with strength indicator)
     - Confirm Password (password input, required)
     - Organisation Selection (dropdown, required)
     - Role Selection (dropdown, required - depends on organisation)
   - **Terms Checkbox**:
     - "I agree to terms and conditions" (required)
   - **Register Button**: Purple gradient, full width, 48px height
   - **Already have account?** link to login

**Spacing**: Same as login form

### **Page 3: Forgot Password Screen**

**Layout**: Centered card on gradient background

**Elements**:
1. **Card**:
   - "Reset Password" heading (24px, bold)
   - Description: "Enter your email address and we'll send you a link to reset your password" (14px, #757575)
   - **Email Input**: Same styling as login
   - **Send Reset Link Button**: Purple gradient, full width, 48px height
   - **Back to Login** link

### **Page 4: Password Reset Screen**

**Layout**: Centered card

**Elements**:
1. **Card**:
   - "Set New Password" heading (24px, bold)
   - **New Password Input**: With strength indicator
   - **Confirm Password Input**
   - **Reset Password Button**: Purple gradient, full width, 48px height
   - **Back to Login** link

### **Page 5: Email Verification Screen**

**Layout**: Centered card

**Elements**:
1. **Card**:
   - Email icon (64px, purple)
   - "Verify Your Email" heading (24px, bold)
   - Description: "We've sent a verification link to your email address. Please check your inbox." (14px, #757575)
   - **Resend Email Button**: Outline button
   - **Change Email** link

### **Page 6: Onboarding Tutorial (Optional)**

**Layout**: Full-screen overlay with step-by-step guide

**Elements**:
- 3-4 tutorial screens with:
  - Illustration/icon
  - Title (20px, bold)
  - Description (14px, #757575)
  - "Next" button (purple gradient)
  - "Skip" link (top right)
  - Progress dots at bottom

**Success Criteria**:
- [ ] Login screen with proper styling
- [ ] Registration screen with form validation
- [ ] Password reset flow complete
- [ ] Email verification screen
- [ ] All forms have proper spacing (24px between fields)
- [ ] All buttons are 48px height
- [ ] Error states display correctly
- [ ] Mobile-responsive (375px+)

---

# SECTION 3: Role-Based Dashboard Pages

## 📊 Dashboard Pages (4 Role Variations)

Build role-specific dashboards for Federal, State, LGA, and Field Officer levels.

### **Page 7: Federal Level Dashboard (Super Admin)**

**Layout**:
- Header with "National Overview" title
- 4 metric cards in top row
- Sections below with charts and data

**Elements**:

1. **Header** (64px height):
   - Left: "National Overview" (32px, bold, white text on purple gradient background)
   - Left below: "Federal Ministry of Health" (14px, white, opacity 0.9)
   - Right: Connection status indicator (green dot + "Online")
   - Right: Notification bell icon with badge (red circle with number)

2. **Top Metrics Row** (4 cards, 16px gap):
   - **Card 1: Total Activities**
     - Purple accent bar (4px height, top)
     - Icon: Clipboard icon (24px, purple #7B2CBF, right side)
     - Label: "Total Activities" (14px, #757575)
     - Value: "1,247" (32px, bold, #212121)
     - Trend: "+12% this month" (12px, green #4CAF50) with up arrow
     - Padding: 24px
   - **Card 2: Active Outbreaks**
     - Orange accent bar
     - Icon: Alert icon (24px, orange #FF9800)
     - Label: "Active Outbreaks" (14px, #757575)
     - Value: "3" (32px, bold, #212121)
     - Status: "2 under control, 1 active" (12px, #757575)
     - Padding: 24px
   - **Card 3: Vaccination Coverage**
     - Green accent bar
     - Icon: Syringe icon (24px, green #4CAF50)
     - Label: "Vaccination Coverage" (14px, #757575)
     - Value: "67.3%" (32px, bold, #212121)
     - Target: "Target: 70%" (12px, #757575)
     - Progress bar: Purple-blue gradient, 4px height
     - Padding: 24px
   - **Card 4: Healthcare Workers Trained**
     - Blue accent bar
     - Icon: People icon (24px, blue #4A90E2)
     - Label: "Healthcare Workers Trained" (14px, #757575)
     - Value: "15,892" (32px, bold, #212121)
     - Trend: "↑ 1,234 this quarter" (12px, blue #4A90E2)
     - Padding: 24px

3. **Quick Actions Section** (32px margin-top):
   - Heading: "Quick Actions" (20px, bold, #212121)
   - 3 buttons in row (16px gap):
     - "Create Activity" (purple gradient, 48px height)
     - "View Reports" (blue outline, 48px height)
     - "Manage Teams" (purple outline, 48px height)

4. **Performance Trends Section** (32px margin-top):
   - Heading: "Performance Trends" (20px, bold) with chart icon
   - Time filter buttons: "Week" (active, purple), "Month", "Year" (12px padding, 8px border radius)
   - **Chart Area**:
     - 4 horizontal progress bars:
       - "Activities Created" - Purple bar, value "85"
       - "Activities Completed" - Green bar, value "72"
       - "Activities Approved" - Blue bar, value "68"
       - "Pending Review" - Orange bar, value "13"
     - Each bar: 8px height, rounded ends, value on right (16px, bold)
   - Card padding: 24px

5. **State Activity Distribution Section** (32px margin-top):
   - Heading: "State Activity Distribution" (20px, bold) with location icon
   - **State List** (vertical list, 16px gap between items):
     - Each item: State name (16px, bold) + activity count (14px, #757575) + horizontal bar (purple/blue gradient, height varies by count)
     - States: Lagos (342 activities), Kano (218), Rivers (156), Kaduna (134), FCT Abuja (98), Others (299)
   - Card padding: 24px

6. **Emergency Alert Section** (32px margin-top):
   - Red background card (#F44336) with white text
   - Alert icon (48px, white)
   - Heading: "Active Emergency Alert" (20px, bold, white)
   - Message: "Cholera outbreak reported in Kano State. Immediate response required." (16px, white)
   - 2 buttons:
     - "Create Response Activity" (white background, red text, 48px height)
     - "View Details" (white outline, 48px height)
   - Padding: 24px

7. **Bottom Navigation** (Mobile, 80px height):
   - 5 tabs: Dashboard (active, purple), Activities (badge "5"), Reports (badge "2"), Team, Profile (badge "1")
   - Each tab: Icon + label below
   - Active tab: Purple color + gradient accent bar above icon

**Spacing**:
- Section margin-top: 32px (critical - must be exactly 32px)
- Card gap: 16px
- Card padding: 24px

### **Page 8: State Level Dashboard (State Admin)**

**Layout**: Similar structure, but state-focused

**Elements**:
1. **Header**: "Lagos State" (instead of National Overview)
2. **Top Metrics** (4 cards):
   - Activities This Week: "89" (purple accent)
   - Pending Approvals: "23" (orange accent, action required)
   - Active Field Teams: "45/52" (blue accent)
   - Community Reach: "2.3M people" (green accent)
3. **LGA Performance Section**:
   - Table with sortable columns: LGA Name, Activities, Completion Rate, Team Size
   - Color-coded rows (green = high, yellow = medium, red = low)
4. **Resource Allocation Section**:
   - Donut charts showing resource breakdown
5. **Field Team Status Section**:
   - List of teams with online/offline indicators
   - Activity count per team

**Spacing**: Same as Federal dashboard (32px between sections)

### **Page 9: LGA/Field Officer Dashboard**

**Layout**: Simplified, personal focus

**Elements**:
1. **Header**: "Local Dashboard" or user's name
2. **Top Metrics** (4 simplified cards):
   - My Activities: Personal count
   - Pending Tasks: Tasks from supervisor
   - Team Members: Team count
   - Recent Updates: Notification count
3. **Activity Timeline/Calendar**:
   - Monthly/weekly/daily view toggle
   - Color-coded by status
4. **Quick Activity Submission Form**:
   - Simplified form for rapid entry
   - Offline sync indicator
5. **Recent Updates Section**:
   - Latest messages and notifications

**Spacing**: Same as other dashboards

### **Page 10: User Dashboard (Individual)**

**Layout**: Single column, personal focus

**Elements**:
1. **My Activities Widget**: List of user's activities
2. **Assigned Tasks Widget**: Tasks from supervisors
3. **Team Updates Widget**: Team member activities
4. **Performance Metrics Widget**: Personal statistics
5. **Learning Resources Widget**: Training materials

**Success Criteria**:
- [ ] All 4 role-based dashboards created
- [ ] Metric cards have 24px padding
- [ ] Sections have exactly 32px margin-top (critical)
- [ ] Cards have 16px gap
- [ ] All buttons are 48px height
- [ ] Mobile bottom navigation working
- [ ] Responsive on 375px, 768px, 1024px+

---

# SECTION 4: Activity Management Pages

## 📝 Activity Tracking & Management

Build all pages for creating, viewing, editing, and managing activities.

### **Page 11: Activities List Page**

**Layout**:
- Header with title and create button
- Search and filter bar
- Activity cards list
- Pagination

**Elements**:

1. **Header** (64px height):
   - Left: "Activity Management" (32px, bold, #212121)
   - Left below: "6 activities" (14px, #757575)
   - Right: Connection status + "Create" button (purple gradient, 48px height)

2. **Search & Filter Bar**:
   - Search input (48px height, full width on mobile, flex on desktop):
     - Search icon (left, 24px)
     - Placeholder: "Search activities, organizations, locations..."
     - Border: 2px solid #E0E0E0
     - Focus: Purple border
   - "Filters" button (gray outline, 48px height, right side)

3. **Activity Cards List** (16px gap between cards):
   - **Each Activity Card** (white background, 24px padding):
     - **Checkbox** (left, 24px × 24px, 16px gap to content)
     - **Content Area** (flex: 1):
       - **Title Row**:
         - Activity title (18px, bold, #212121) - e.g., "COVID-19 Vaccination Campaign - Phase 3"
         - Status badge (right side): 
           - "Approved" (green #4CAF50, white text, 8px padding, 12px border radius)
           - "Submitted" (blue #4A90E2, white text)
           - "Draft" (gray #9E9E9E, white text)
           - "Rejected" (red #F44336, white text)
       - **Metadata Row** (12px margin-top):
         - Organisation icon + "Lagos State Health Department" (14px, #757575)
         - Location icon + "Lagos, Ikeja LGA" (14px, #757575)
         - Activity type chip: "Vaccination Campaign" (12px, purple background, white text)
       - **Dates Row** (16px margin-top):
         - Calendar icon + "Created: 1/10/2025" (12px, #757575)
         - "Modified: 1/12/2025" (12px, #757575)
       - **Actions Row** (16px margin-top):
         - 3 icon buttons (24px × 24px, 8px gap):
           - View (eye icon)
           - Edit (pencil icon)
           - Delete (trash icon)
     - Border radius: 16px
     - Shadow: 0 2px 8px rgba(123, 44, 191, 0.1)
     - Hover: Elevate with translateY(-4px)

4. **Pagination** (bottom):
   - "Showing 1-6 of 6 activities" (14px, #757575, left)
   - Pagination controls (right):
     - "Previous" button (outline, 40px height)
     - Page numbers: "1" (active, purple), "2" (40px height)
     - "Next" button (outline, 40px height)

**Sample Activities** (for testing):
1. COVID-19 Vaccination Campaign - Phase 3 (Approved)
2. Cholera Prevention Training Workshop (Submitted)
3. Community Health Education - Malaria Prevention (Approved)
4. Emergency Response - Lassa Fever Outbreak (Submitted)
5. Routine Immunization Campaign (Draft)
6. Disease Surveillance Training (Rejected)

**Spacing**:
- Card gap: 16px
- Card padding: 24px
- Title to metadata: 12px
- Metadata to dates: 16px
- Dates to actions: 16px

### **Page 12: Create Activity Form (Multi-Step)**

**Layout**: Full-page form with step indicator

**Elements**:

1. **Header**:
   - "Back to Activities" button (left, purple text, arrow icon)
   - "Create New Activity" heading (32px, bold, #212121)

2. **Step Indicator** (top):
   - Progress text: "Step 1 of 6" (14px, #757575) + "17% Complete" (14px, purple)
   - **Step Pills** (horizontal, 16px gap):
     - "1 Basic Info" (active, purple background, white text)
     - "2 Details" (inactive, gray background)
     - "3 Location" (inactive)
     - "4 Target" (inactive)
     - "5 Resources" (inactive)
     - "6 Review" (inactive)
   - Progress bar below (purple gradient, 4px height)

3. **Form Section** (white card, 24px padding):
   - **Section Heading**: "Basic Information" (20px, bold) with icon
   - **Form Fields** (24px vertical spacing):
     - **Activity Type** (dropdown, required):
       - Label: "Activity Type *" (14px, #212121)
       - Options: Vaccination Campaign, Health Education, Emergency Response, Disease Surveillance, Community Outreach, Training Workshop
       - Height: 48px
       - Border: 2px solid #E0E0E0
       - Focus: Purple border
     - **Activity Title** (text input, required):
       - Label: "Activity Title *"
       - Placeholder: "Enter a descriptive title"
       - Max length: 200 characters
       - Character counter (12px, #757575, right)
     - **Short Description** (textarea, required):
       - Label: "Short Description * (Max 500 characters)"
       - Placeholder: "Brief description of the activity"
       - Min rows: 3
       - Character counter: "0/500 characters" (12px, #757575, right)
   - **Continue Button** (bottom, purple gradient, 48px height, full width)

**Validation**:
- Required fields marked with *
- Real-time validation on blur
- Error messages below fields (14px, red #F44336)
- Success state: Green border with checkmark

**Spacing**:
- Form field spacing: 24px vertical
- Section padding: 24px

### **Page 13: Activity Detail View**

**Layout**: Full-page view with collapsible sections

**Elements**:

1. **Header**:
   - "Back to Activities" button
   - Activity title (32px, bold, #212121)
   - Status badge (large, prominent)
   - Action buttons (right): "Edit" (if draft), "Export PDF" (if approved)

2. **Content Sections** (white cards, 24px padding, 32px margin-top):
   - **Basic Information** (collapsible):
     - Activity Type, Title, Description
   - **Location & Schedule**:
     - State, LGA, Specific Location
     - Start Date/Time, End Date/Time, Duration
   - **Target Population**:
     - Population size, Age groups, Demographics
   - **Resources**:
     - Personnel count, Budget, Equipment, Materials
   - **Evidence & Attachments**:
     - File gallery with thumbnails
     - "Upload Evidence" button
   - **Tags**:
     - Tag chips (purple/blue/green/orange based on category)
   - **Approval Workflow**:
     - Status timeline: Draft → Submitted → Under Review → Approved/Rejected
     - Each status shows: Status name, timestamp, user, comments
   - **Comments/Feedback**:
     - Comment input (textarea, 48px min height)
     - "Add Comment" button (purple, 48px height)
     - Comments list:
       - User avatar (40px circle)
       - User name + role (14px, bold)
       - Comment text (14px, #212121)
       - Timestamp (12px, #757575)

**Spacing**: Same as other pages

### **Page 14: Edit Activity Form**

**Layout**: Same as Create Activity, but pre-filled

**Elements**:
- Same multi-step form structure
- All fields pre-filled with existing data
- "Save Draft" button (gray outline)
- "Submit for Approval" button (green, 48px height)
- Auto-save indicator: "Saved" (green checkmark) or "Saving..." (spinner)

### **Page 15: Activity Timeline View**

**Layout**: Calendar/timeline visualization

**Elements**:
1. **Header**:
   - "Activity Timeline" (32px, bold)
   - Date range selector
   - View toggle: Month / Week / Day
2. **Timeline Visualization**:
   - Calendar grid (month view) or timeline (week/day view)
   - Activities shown as colored blocks
   - Color-coded by status (draft=gray, submitted=blue, approved=green, rejected=red)
   - Click activity to view details
3. **Filters** (sidebar or drawer):
   - Filter by organisation, type, status
   - Date range picker

**Success Criteria**:
- [ ] Activities list with proper card spacing
- [ ] Create activity multi-step form
- [ ] Activity detail view with all sections
- [ ] Edit activity form
- [ ] Timeline view
- [ ] All forms have 24px field spacing
- [ ] All cards have 24px padding
- [ ] Status badges color-coded correctly

---

# SECTION 5: Communication & Messaging Pages

## 💬 Communication System

Build messaging and notification pages for internal communication.

### **Page 16: Message Inbox**

**Layout**: List of conversations/messages

**Elements**:

1. **Header**:
   - "Messages" (32px, bold)
   - "Compose" button (purple gradient, 48px height, right)

2. **Filter Tabs**:
   - "All", "Unread", "Urgent", "Archived" (purple active state)

3. **Message List** (16px gap):
   - **Each Message Card** (white, 24px padding):
     - **Left**: Avatar (40px circle) or organisation icon
     - **Center** (flex: 1):
       - Sender name (16px, bold, #212121)
       - Subject (14px, #212121, truncated)
       - Preview text (14px, #757575, 2 lines max)
       - Timestamp (12px, #757575)
     - **Right**:
       - Unread indicator (purple dot, 8px circle) if unread
       - Urgent badge (red, "URGENT") if urgent
     - Hover: Slight elevation
     - Click: Opens message detail

4. **Empty State** (if no messages):
   - Message icon (64px, #BDBDBD)
   - "No messages" (20px, bold, #212121)
   - "Start a conversation" (14px, #757575)
   - "Compose Message" button (purple, 48px height)

**Spacing**: Card gap 16px, card padding 24px

### **Page 17: Compose Message**

**Layout**: Full-page form or modal

**Elements**:

1. **Header**: "Compose Message" (24px, bold)

2. **Form** (24px field spacing):
   - **To** (multi-select, required):
     - Searchable user/organisation selector
     - Selected recipients shown as chips
   - **Subject** (text input, required):
     - Placeholder: "Enter message subject"
   - **Message Body** (textarea, required):
     - Rich text editor (basic formatting)
     - Min height: 200px
   - **Priority Toggle**:
     - "Mark as Urgent" checkbox
   - **Attachments**:
     - File upload area (drag-and-drop, dashed border)
     - File list with remove buttons
   - **Send Button** (purple gradient, 48px height, full width)

**Spacing**: 24px between fields

### **Page 18: Message Thread/Detail**

**Layout**: Conversation view

**Elements**:

1. **Header**:
   - Back button
   - Subject (24px, bold)
   - Actions: Reply, Forward, Archive

2. **Message Detail**:
   - Sender info (avatar, name, role, timestamp)
   - Message body (16px, #212121)
   - Attachments (if any) with download buttons
   - Read receipts: "Read by [Name]" (12px, #757575)

3. **Reply Section** (bottom):
   - Reply textarea
   - "Send Reply" button (purple, 48px height)

### **Page 19: Notification Center**

**Layout**: Dropdown or full-page list

**Elements**:

1. **Header**: "Notifications" (24px, bold) + "Mark All as Read" button

2. **Notification List** (16px gap):
   - **Each Notification** (white card, 24px padding):
     - Icon (24px, color-coded by type)
     - Title (16px, bold, #212121)
     - Description (14px, #757575)
     - Timestamp (12px, #757575)
     - Unread indicator (purple dot, left side)
     - Click: Navigate to related item

3. **Categories**:
   - Filter by: Approvals, Assignments, Alerts, System Updates

**Success Criteria**:
- [ ] Message inbox with proper spacing
- [ ] Compose message form
- [ ] Message thread view
- [ ] Notification center
- [ ] All cards have 24px padding
- [ ] All forms have 24px field spacing

---

# SECTION 6: User & Organisation Management Pages

## 👥 User & Organisation Management

Build pages for managing users, profiles, and organisations.

### **Page 20: User Profile Page**

**Layout**: Profile information with editable sections

**Elements**:

1. **Header**: "My Profile" (32px, bold)

2. **Profile Card** (white, 24px padding):
   - **Photo Section**:
     - Avatar (80px circle, purple border when active)
     - "Change Photo" button (purple outline, 48px height)
   - **Personal Information** (24px field spacing):
     - Full Name (text input, editable)
     - Email Address (email input, validated)
     - Phone Number (tel input)
     - Job Title (text input)
     - Bio (textarea, max 500 chars)
   - **Save Changes Button** (purple gradient, 48px height)

3. **Role & Permissions Section** (32px margin-top):
   - Current role badge (purple/blue/green/orange)
   - Permission list (read-only)
   - "Request Permission Change" link

4. **Activity History Section** (32px margin-top):
   - Personal statistics cards
   - Recent activity timeline
   - Performance charts

5. **Notification Preferences Section** (32px margin-top):
   - Toggle switches for:
     - Email notifications
     - SMS notifications
     - Push notifications
     - Activity assignments
     - Approval requests
   - Save preferences button

6. **Password Change Section** (32px margin-top, collapsible):
   - Current password input
   - New password input (with strength indicator)
   - Confirm password input
   - "Update Password" button (purple, 48px height)

**Spacing**: 24px between fields, 32px between sections

### **Page 21: Team Directory**

**Layout**: Searchable list of team members

**Elements**:

1. **Header**:
   - "Team Directory" (32px, bold)
   - Search bar (48px height, full width)

2. **Filters**:
   - Role filter (dropdown)
   - Location filter (dropdown)
   - Organisation filter (dropdown)

3. **Team Member Grid** (3 columns desktop, 1 column mobile, 16px gap):
   - **Each Member Card** (white, 24px padding):
     - Avatar (48px circle, purple border if online)
     - Name (16px, bold, #212121)
     - Role + Organisation (14px, #757575)
     - Location (14px, #757575)
     - Contact info (email, phone icons)
     - Activity count badge (purple circle with number)
     - Online/offline indicator (green/red dot, 8px)
     - "View Profile" link (purple)

**Spacing**: Card gap 16px, card padding 24px

### **Page 22: Organisation Management (Admin Only)**

**Layout**: Organisation tree with management interface

**Elements**:

1. **Header**:
   - "Organisation Management" (32px, bold)
   - "Create Organisation" button (purple gradient, 48px height)

2. **Organisation Tree**:
   - Hierarchical tree view
   - Expand/collapse nodes
   - Each node shows:
     - Organisation name (16px, bold)
     - User count (14px, #757575)
     - Actions: Edit, Delete, Add Child

3. **Organisation Detail Panel** (when selected):
   - Organisation name (editable)
   - Parent organisation (dropdown)
   - Description (textarea)
   - User list
   - "Save Changes" button

**Spacing**: 16px between tree items, 24px card padding

### **Page 23: User Management (Admin Only)**

**Layout**: User list with management actions

**Elements**:

1. **Header**:
   - "User Management" (32px, bold)
   - "Create User" button (purple gradient, 48px height)
   - Search bar

2. **User Table** (or card list):
   - Columns/Cards: Name, Email, Role, Organisation, Status, Actions
   - Actions: Edit, Assign Role, Deactivate
   - Status indicators: Active (green), Inactive (gray)

3. **Bulk Actions**:
   - Checkbox selection
   - Bulk actions: Assign Role, Deactivate, Export

**Spacing**: 16px between rows/cards

### **Page 24: Role Assignment Interface (Admin Only)**

**Layout**: Modal or page for assigning roles

**Elements**:

1. **User Selection**:
   - Searchable user list
   - Selected user displayed

2. **Role Assignment**:
   - Current role badge
   - Role selector (dropdown)
   - Available roles: Super Admin, Admin, Sub-admin, User
   - Permission preview

3. **Assign Button** (purple gradient, 48px height)

**Success Criteria**:
- [ ] User profile page with all sections
- [ ] Team directory with search and filters
- [ ] Organisation management tree
- [ ] User management interface
- [ ] Role assignment interface
- [ ] All forms have proper spacing

---

# SECTION 7: Reports & Analytics Pages

## 📈 Reports & Analytics

Build pages for data visualization, reports, and analytics.

### **Page 25: Reports Dashboard**

**Layout**: Report library with generation options

**Elements**:

1. **Header**:
   - "Reports & Analytics" (32px, bold)
   - "Generate Report" button (purple gradient, 48px height)

2. **Report Templates** (grid, 3 columns desktop, 1 column mobile, 16px gap):
   - **Each Template Card** (white, 24px padding):
     - Template icon (64px, purple)
     - Title (18px, bold, #212121)
     - Description (14px, #757575, 2 lines)
     - Usage badge: "Used 45 times" (12px, blue)
     - Actions: "Preview", "Use Template", "Edit" (admin)

3. **Recent Reports Section** (32px margin-top):
   - List of recently generated reports
   - Download buttons
   - Date generated

**Spacing**: Card gap 16px, card padding 24px

### **Page 26: Report Generation Wizard**

**Layout**: Multi-step wizard for creating custom reports

**Elements**:

1. **Step Indicator**: Same as activity creation (6 steps)

2. **Step 1: Report Type**:
   - Radio buttons: Weekly, Monthly, Quarterly, Custom
   - Template selection (optional)

3. **Step 2: Date Range**:
   - Start date picker
   - End date picker
   - Preset options: Today, This Week, This Month, etc.

4. **Step 3: Filters**:
   - Organisation filter
   - Activity type filter
   - Status filter
   - User/team filter

5. **Step 4: Data Selection**:
   - Checkboxes for data to include
   - Metrics selection

6. **Step 5: Format & Delivery**:
   - Format: PDF, Excel, CSV
   - Email delivery (optional)
   - Schedule (optional)

7. **Step 6: Review & Generate**:
   - Summary of selections
   - "Generate Report" button (purple gradient, 48px height)

**Spacing**: 24px between fields, 32px between steps

### **Page 27: Analytics Dashboard**

**Layout**: Charts and visualizations

**Elements**:

1. **Header**: "Analytics" (32px, bold) + date range selector

2. **Chart Sections** (32px margin-top each):
   - **Activity Trends Chart**:
     - Line chart showing trends over time
     - Time period selector: Week, Month, Quarter, Year
     - Interactive hover states
     - Export button (top right)
   - **Status Breakdown Chart**:
     - Donut chart with legend
     - Colors: Draft (gray), Submitted (blue), Approved (green), Rejected (red)
   - **Engagement Metrics Chart**:
     - Bar chart with multiple metrics
     - Comparison view
   - **Organisation Comparison Chart**:
     - Comparison bars
     - Sortable by metric

3. **Data Table** (32px margin-top):
   - Sortable columns
   - Export to CSV button
   - Pagination

**Spacing**: 32px between sections, 24px card padding

### **Page 28: Activity Heatmap (Time-Based)**

**Layout**: Calendar heatmap view

**Elements**:

1. **Header**:
   - "Activity Heatmap" (32px, bold)
   - Month/year selector
   - View toggle: Month / Week / Day

2. **Heatmap Visualization**:
   - Calendar grid (7 columns × 5 rows for month)
   - Color intensity indicates activity count
   - Light blue = low, dark blue = high
   - Hover: Tooltip with exact count
   - Click: Filter activities by date

3. **Legend**:
   - Color scale explanation
   - Activity count ranges

**Note**: NO geographic/mapping heatmap (per constitution - no mapping features)

**Success Criteria**:
- [ ] Reports dashboard with template library
- [ ] Report generation wizard
- [ ] Analytics dashboard with charts
- [ ] Activity heatmap (time-based only)
- [ ] All charts are interactive
- [ ] Export functionality working
- [ ] Proper spacing throughout

---

# SECTION 8: Settings & Configuration Pages

## ⚙️ Settings & Configuration

Build pages for application settings, preferences, and help.

### **Page 29: Settings Page**

**Layout**: Tabbed interface with settings categories

**Elements**:

1. **Header**: "Settings" (32px, bold)

2. **Settings Tabs**:
   - Account, Notifications, Appearance, Data, Help

3. **Account Tab**:
   - Profile information (same as user profile)
   - Password change
   - Account deletion (danger zone)

4. **Notifications Tab**:
   - Toggle switches for notification types
   - Email preferences
   - SMS preferences
   - Push notification settings

5. **Appearance Tab**:
   - Theme toggle: Light / Dark
   - Font size slider (12px - 20px)
   - High contrast mode toggle
   - Reduced motion toggle

6. **Data Tab**:
   - Auto-sync settings
   - Cache management
   - Data usage display
   - "Clear Cache" button

7. **Help Tab**:
   - FAQ section
   - Contact support form
   - System status
   - Version information

**Spacing**: 24px between settings items, 32px between sections

### **Page 30: Help & Support Page**

**Layout**: Searchable help center

**Elements**:

1. **Header**: "Help & Support" (32px, bold)

2. **Search Bar** (48px height, full width):
   - Search icon
   - Placeholder: "Search for help..."

3. **FAQ Categories**:
   - Getting Started
   - Activities
   - Reports
   - Teams
   - Troubleshooting

4. **FAQ Items** (expandable):
   - Question (16px, bold, #212121)
   - Answer (14px, #757575, expanded)
   - "Was this helpful?" buttons (Yes/No)

5. **Contact Support Section** (32px margin-top):
   - Form:
     - Subject (dropdown)
     - Description (textarea)
     - Attach screenshot (file upload)
   - "Submit" button (purple, 48px height)

6. **System Status** (32px margin-top):
   - Status indicators: API (green), Database (green), Storage (green)
   - Recent incidents log

**Spacing**: 16px between FAQ items, 24px form field spacing

### **Page 31: Notification Preferences Page**

**Layout**: Detailed notification settings

**Elements**:

1. **Header**: "Notification Preferences" (32px, bold)

2. **Notification Categories** (32px margin-top each):
   - **Approvals**:
     - Email toggle
     - SMS toggle
     - Push toggle
     - Frequency: Immediate / Daily Digest / Weekly
   - **Assignments**: Same structure
   - **Alerts**: Same structure
   - **System Updates**: Same structure

3. **Save Preferences Button** (purple gradient, 48px height, bottom)

**Spacing**: 24px between toggles, 32px between categories

**Success Criteria**:
- [ ] Settings page with all tabs
- [ ] Help & support page
- [ ] Notification preferences
- [ ] All forms have proper spacing
- [ ] Toggle switches working
- [ ] Search functionality working

---

# SECTION 9: Template Management Pages

## 📋 Template Management (Admin Only)

Build pages for creating and managing activity templates.

### **Page 32: Template Library**

**Layout**: Grid of template cards

**Elements**:

1. **Header**:
   - "Report Templates" (32px, bold)
   - "Create Template" button (purple gradient, 48px height, admin only)
   - Search bar

2. **Template Categories** (tabs):
   - Emergency, Routine, Campaign, Assessment

3. **Template Grid** (3 columns desktop, 1 column mobile, 16px gap):
   - **Each Template Card** (white, 24px padding):
     - Preview thumbnail (120px height, rounded)
     - Title (18px, bold, #212121)
     - Description (14px, #757575, 2 lines max)
     - Usage count badge: "Used 45 times" (12px, blue)
     - Actions: "Preview", "Use Template", "Edit" (admin)

4. **Empty State** (if no templates):
   - Template icon (64px, #BDBDBD)
   - "No templates yet" (20px, bold)
   - "Create your first template" (14px, #757575)
   - "Create Template" button (purple, 48px height)

**Spacing**: Card gap 16px, card padding 24px

### **Page 33: Template Builder (Admin Only)**

**Layout**: Drag-and-drop template editor

**Elements**:

1. **Header**: "Template Builder" (32px, bold)

2. **Three-Panel Layout**:
   - **Left Panel**: Field library
     - Draggable field types:
       - Text input
       - Number input
       - Date picker
       - File upload
       - Dropdown
       - Checkbox
     - Each field type has icon and color
   - **Center Panel**: Template canvas
     - Drop zone for fields
     - Fields can be reordered (drag)
     - Delete button on each field
   - **Right Panel**: Field configuration
     - Selected field properties:
       - Field label
       - Required/optional toggle
       - Validation rules
       - Help text
       - Default value

3. **Template Settings** (top):
   - Template name (text input)
   - Description (textarea)
   - Category (dropdown)
   - Organisation assignment (multi-select)

4. **Save Template Button** (purple gradient, 48px height, bottom)

**Spacing**: 16px between panels, 24px padding in panels

### **Page 34: Template Preview**

**Layout**: Preview of template in use

**Elements**:

1. **Header**: Template name (24px, bold)

2. **Preview Card**:
   - Shows how template fields appear in activity form
   - Read-only preview
   - "Use This Template" button (green, 48px height)

**Success Criteria**:
- [ ] Template library with grid layout
- [ ] Template builder with drag-and-drop
- [ ] Template preview
- [ ] Proper spacing throughout

---

# SECTION 10: File & Evidence Management Pages

## 📎 File & Evidence Management

Build pages for uploading, viewing, and managing evidence files.

### **Page 35: File Upload Center**

**Layout**: Drag-and-drop upload interface

**Elements**:

1. **Header**: "Upload Evidence" (32px, bold)

2. **Upload Area** (large card, 24px padding):
   - Drag-and-drop zone (200px height, dashed purple border, 16px padding):
     - Upload icon (64px, purple)
     - "Drag files here or click to browse" (16px, #212121)
     - Supported formats: PDF, DOC, DOCX, JPG, PNG, MP4 (12px, #757575)
     - Max file size: 50MB (12px, #757575)
   - "Choose Files" button (purple outline, 48px height)

3. **File List** (below upload area, 16px gap):
   - **Each File Item** (white card, 16px padding):
     - File icon (24px)
     - File name (14px, bold, #212121)
     - File size (12px, #757575)
     - Upload progress bar (purple gradient, 4px height)
     - Remove button (red X icon, 24px × 24px)

4. **Upload Button** (purple gradient, 48px height, full width, bottom)

**Spacing**: 16px between file items, 24px card padding

### **Page 36: File Gallery**

**Layout**: Grid/list view of uploaded files

**Elements**:

1. **Header**:
   - "Evidence Gallery" (32px, bold)
   - View toggle: Grid / List
   - Sort: Date, Name, Size, Type

2. **File Grid** (4 columns desktop, 2 columns tablet, 1 column mobile, 16px gap):
   - **Each File Card** (white, 16px padding):
     - Thumbnail (120px height, rounded, or file icon)
     - File name (14px, bold, truncated)
     - File size (12px, #757575)
     - Upload date (12px, #757575)
     - Actions: Preview, Download, Delete

3. **Empty State**:
   - Upload icon (64px, #BDBDBD)
   - "No files uploaded" (20px, bold)
   - "Upload your first file" (14px, #757575)
   - "Upload Files" button (purple, 48px height)

**Spacing**: Card gap 16px, card padding 16px

### **Page 37: File Detail/Preview**

**Layout**: Full preview with metadata

**Elements**:

1. **Header**:
   - Back button
   - File name (24px, bold)
   - Actions: Download, Share, Delete

2. **Preview Area**:
   - Image preview (if image)
   - PDF viewer (if PDF)
   - Video player (if video)
   - Document icon (if other)

3. **Metadata Panel** (right sidebar or below):
   - File name
   - File type
   - File size
   - Upload date
   - Uploaded by (user name)
   - Associated activity
   - Version history (if applicable)

**Spacing**: 24px padding in preview area

**Success Criteria**:
- [ ] File upload center with drag-and-drop
- [ ] File gallery with grid/list views
- [ ] File preview/detail view
- [ ] Proper spacing throughout
- [ ] File upload progress indicators

---

# SECTION 11: Empty States & Error Pages

## 🚫 Empty States & Error Handling

Build helpful empty states and error pages for better UX.

### **Page 38: Empty States Components**

**Create reusable empty state components for**:

1. **No Activities Empty State**:
   - Illustration (200px height, centered)
   - "No activities yet" (20px, bold, #212121)
   - "Create your first activity to get started" (14px, #757575)
   - "Create Activity" button (purple gradient, 48px height, centered)

2. **No Messages Empty State**:
   - Message icon (64px, #BDBDBD)
   - "No messages" (20px, bold)
   - "Start a conversation" (14px, #757575)
   - "Compose Message" button (purple, 48px height)

3. **No Search Results Empty State**:
   - Search icon (64px, #BDBDBD)
   - "No results found" (18px, bold)
   - "Try different keywords" (14px, #757575)
   - "Clear Filters" button (outline, 48px height)

4. **No Files Empty State**:
   - Upload icon (64px, #BDBDBD)
   - "No files uploaded" (20px, bold)
   - "Upload your first file" (14px, #757575)
   - "Upload Files" button (purple, 48px height)

**Spacing**: 32px between illustration and text, 24px between text and button

### **Page 39: Error States**

**Create error state components for**:

1. **Network Error**:
   - WiFi-off icon (48px, red #F44336)
   - "Connection failed" (16px, bold, #212121)
   - "Please check your internet connection" (14px, #757575)
   - "Retry" button (purple, 48px height)

2. **Permission Error**:
   - Lock icon (48px, orange #FF9800)
   - "Access Denied" (16px, bold)
   - "You don't have permission to access this" (14px, #757575)
   - "Contact Administrator" link (purple)

3. **Server Error**:
   - Alert icon (48px, red #F44336)
   - "Something went wrong" (16px, bold)
   - "Please try again later" (14px, #757575)
   - "Report Issue" button (outline, 48px height)

4. **404 Not Found**:
   - "404" (48px, bold, purple)
   - "Page not found" (20px, bold)
   - "The page you're looking for doesn't exist" (14px, #757575)
   - "Go Home" button (purple, 48px height)

**Spacing**: 24px between icon and message, 16px between message and button

### **Page 40: Loading States**

**Create loading state components**:

1. **Skeleton Screens**:
   - Gray placeholders matching content structure
   - Shimmer animation
   - For: Cards, lists, forms, charts

2. **Spinners**:
   - Purple spinner (24px, #7B2CBF)
   - Centered with "Loading..." text (14px, #757575)

3. **Progress Indicators**:
   - Linear progress bar (purple gradient, 4px height)
   - Circular progress (purple gradient)
   - Percentage display

**Success Criteria**:
- [ ] All empty states created
- [ ] All error states created
- [ ] Loading states implemented
- [ ] Consistent styling across all states
- [ ] Helpful CTAs in empty states

---

# SECTION 12: Mobile Optimizations & Final Polish

## 📱 Mobile Optimizations

Optimize all pages for mobile devices and add final polish.

### **Mobile-Specific Features**

1. **Bottom Navigation** (all pages, mobile only):
   - Fixed at bottom (80px height)
   - 5 tabs: Dashboard, Activities, Reports, Team, Profile
   - Active state: Purple color + gradient accent bar
   - Badge notifications on relevant tabs
   - Haptic feedback on tap

2. **Responsive Header**:
   - Collapsible menu (hamburger icon) on mobile
   - Full navigation on desktop
   - Search icon opens search modal on mobile

3. **Touch Gestures**:
   - Pull to refresh on list pages
   - Swipe actions on activity cards (swipe left = reveal actions)
   - Long press for context menus

4. **Mobile Forms**:
   - Full-width inputs
   - Large touch targets (48px minimum)
   - Numeric keypad for number inputs
   - "Next" button on keyboard for multi-field forms

5. **Offline Indicators**:
   - Connection status in header (green/yellow/red dot)
   - Offline banner when disconnected
   - "Cached" labels on available data
   - Sync status indicator

### **Final Polish Checklist**

**Spacing Verification**:
- [ ] All sections have exactly 32px margin-top
- [ ] All cards have exactly 24px padding
- [ ] All card gaps are exactly 16px
- [ ] All form fields have exactly 24px vertical spacing
- [ ] All button groups have exactly 16px gap

**Component Consistency**:
- [ ] All buttons are 48px height
- [ ] All inputs are 48px height
- [ ] All status badges use correct colors
- [ ] All icons are consistent size (24px standard)

**Responsive Design**:
- [ ] Mobile (375px) - all pages tested
- [ ] Tablet (768px) - all pages tested
- [ ] Desktop (1024px+) - all pages tested

**Accessibility**:
- [ ] All interactive elements are 48px × 48px minimum
- [ ] Focus indicators visible (3px purple outline)
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast meets WCAG AA (4.5:1)

**Performance**:
- [ ] Skeleton screens for all data-driven pages
- [ ] Lazy loading for images
- [ ] Optimized animations (60fps)

**Success Criteria**:
- [ ] All pages mobile-responsive
- [ ] Bottom navigation working
- [ ] Touch gestures implemented
- [ ] Offline indicators visible
- [ ] All spacing verified and consistent
- [ ] Accessibility requirements met
- [ ] Performance optimized

---

# SECTION 13: Integration & Testing

## 🔗 Integration & Final Testing

Connect all pages together and perform final testing.

### **Navigation Flow**

**Verify all navigation paths**:

1. **Authentication Flow**:
   - Login → Dashboard
   - Register → Email Verification → Login
   - Forgot Password → Reset → Login

2. **Dashboard Flow**:
   - Dashboard → Activities List
   - Dashboard → Create Activity
   - Dashboard → Reports
   - Dashboard → Team
   - Dashboard → Profile

3. **Activity Flow**:
   - Activities List → Activity Detail
   - Activities List → Create Activity
   - Create Activity → Activity Detail (after creation)
   - Activity Detail → Edit Activity

4. **Communication Flow**:
   - Messages → Compose Message
   - Messages → Message Thread
   - Notifications → Notification Detail

5. **Management Flow**:
   - Team → User Profile
   - Team → Organisation Management (admin)
   - Profile → Settings

### **Role-Based Access**

**Verify role-based visibility**:
- [ ] Super Admin sees all features
- [ ] Admin sees admin features
- [ ] Sub-admin sees limited admin features
- [ ] User sees only user features
- [ ] Unauthorized features are hidden (not just disabled)

### **Data Flow**

**Verify data displays correctly**:
- [ ] Dashboard metrics load and display
- [ ] Activity list loads with proper data
- [ ] Forms pre-fill with existing data
- [ ] Charts render with data
- [ ] File uploads work
- [ ] Search and filters work

### **Error Handling**

**Verify error states**:
- [ ] Network errors show retry option
- [ ] Permission errors show helpful message
- [ ] Form validation errors display correctly
- [ ] 404 errors redirect appropriately

### **Final Testing Checklist**

**Functionality**:
- [ ] All pages load without errors
- [ ] All forms submit correctly
- [ ] All buttons trigger correct actions
- [ ] All links navigate correctly
- [ ] All filters work
- [ ] All searches work

**Visual**:
- [ ] Consistent spacing throughout
- [ ] Consistent colors throughout
- [ ] Consistent typography throughout
- [ ] All images load
- [ ] All icons display

**Responsive**:
- [ ] Mobile (375px) - all pages work
- [ ] Tablet (768px) - all pages work
- [ ] Desktop (1024px+) - all pages work

**Performance**:
- [ ] Pages load in < 3 seconds
- [ ] Smooth animations (60fps)
- [ ] No layout shifts
- [ ] Images optimized

**Accessibility**:
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

---

# 📋 Complete Page List Summary

## All Pages to Build (40+ Pages)

### **Authentication (6 pages)**
1. Login Screen
2. Registration Screen
3. Forgot Password Screen
4. Password Reset Screen
5. Email Verification Screen
6. Onboarding Tutorial (Optional)

### **Dashboards (4 pages)**
7. Federal Level Dashboard
8. State Level Dashboard
9. LGA/Field Officer Dashboard
10. User Dashboard

### **Activity Management (5 pages)**
11. Activities List Page
12. Create Activity Form (Multi-Step)
13. Activity Detail View
14. Edit Activity Form
15. Activity Timeline View

### **Communication (4 pages)**
16. Message Inbox
17. Compose Message
18. Message Thread/Detail
19. Notification Center

### **User & Organisation Management (5 pages)**
20. User Profile Page
21. Team Directory
22. Organisation Management (Admin)
23. User Management (Admin)
24. Role Assignment Interface (Admin)

### **Reports & Analytics (4 pages)**
25. Reports Dashboard
26. Report Generation Wizard
27. Analytics Dashboard
28. Activity Heatmap (Time-Based)

### **Settings & Configuration (3 pages)**
29. Settings Page
30. Help & Support Page
31. Notification Preferences Page

### **Template Management (3 pages)**
32. Template Library
33. Template Builder (Admin)
34. Template Preview

### **File & Evidence Management (3 pages)**
35. File Upload Center
36. File Gallery
37. File Detail/Preview

### **Empty States & Errors (3 pages)**
38. Empty States Components
39. Error States
40. Loading States

### **Mobile & Polish**
- Mobile optimizations
- Final polish
- Integration testing

---

# 🎯 Success Criteria for Complete Build

**All Pages Built**:
- [ ] 40+ pages created and functional
- [ ] All navigation paths working
- [ ] All forms functional
- [ ] All data displays correctly

**Design Consistency**:
- [ ] Purple-blue gradient theme applied throughout
- [ ] Consistent spacing (24px padding, 16px gaps, 32px sections)
- [ ] Consistent typography
- [ ] Consistent component styling

**Functionality**:
- [ ] Role-based access working
- [ ] Search and filters working
- [ ] File uploads working
- [ ] Charts and visualizations working
- [ ] Forms validation working

**Responsive Design**:
- [ ] Mobile (375px) - all pages work
- [ ] Tablet (768px) - all pages work
- [ ] Desktop (1024px+) - all pages work

**Accessibility**:
- [ ] WCAG AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] 48px minimum touch targets

**Performance**:
- [ ] Fast load times (< 3s on 3G)
- [ ] Smooth animations
- [ ] Optimized images
- [ ] Efficient rendering

---

**Remember**: Build layer by layer, section by section. Don't skip ahead. Each section builds upon the previous one. Test as you go, and ensure spacing is consistent throughout (24px padding, 16px gaps, 32px sections).

**Good luck building RCAP!** 🚀

