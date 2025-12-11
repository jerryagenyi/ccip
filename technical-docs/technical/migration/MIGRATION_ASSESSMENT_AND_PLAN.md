# React to Vue/Quasar Migration Assessment & Detailed Plan

**Date**: January 2025  
**Source**: Next.js/React Prototype (ccip-firebase-main)  
**Target**: Vue 3 + Quasar Framework (frontend/)  
**Purpose**: Comprehensive assessment and step-by-step migration guide

---

## Executive Summary

This document provides a detailed assessment of migrating the CCIP React/Next.js prototype to the existing Vue 3 + Quasar framework. The prototype contains a fully functional UI with authentication, dashboards, activity management, team management, and AI-powered features that need to be systematically migrated.

### Key Findings

- **Source Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS, ShadCN UI, Firebase (Auth/Firestore), Genkit AI
- **Target Stack**: Vue 3, Quasar 2.14, TypeScript, Pinia, Axios, Laravel API backend
- **Migration Complexity**: Medium-High (significant UI component conversion, state management refactoring, API integration changes)
- **Estimated Effort**: 4-6 weeks for complete migration

---

## 1. Current State Assessment

### 1.1 Source Prototype (React/Next.js)

#### Technology Stack
- **Framework**: Next.js 15.3.3 with App Router
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1 with custom HSL color variables
- **UI Components**: ShadCN UI (Radix UI primitives)
- **State Management**: React Context + React Hooks
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: Firebase SDK (Firestore, Auth)
- **Charts**: Recharts 2.15.1
- **Icons**: Lucide React
- **AI Integration**: Google Genkit for AI report generation

#### Key Features Implemented
1. **Authentication System**
   - Login/Register pages with multi-step registration
   - Firebase Authentication integration
   - Forgot password flow
   - User context management

2. **Dashboard System**
   - Role-based dashboards (Federal/State/LGA)
   - Metric cards with trends
   - Performance charts
   - Recent activities widget
   - Map visualization
   - Emergency center widget

3. **Activity Management**
   - Activity list with data table (TanStack Table)
   - Create/Edit activity forms (multi-step)
   - Activity detail view
   - Semiotic risk assessment integration
   - Status workflow (Draft → Submitted → Approved → Completed)
   - File uploads for evidence

4. **Organisation Management**
   - Organisation list and detail views
   - Hierarchical organisation structure
   - Organisation creation/editing

5. **Team Management**
   - Team directory with user cards
   - Invite members functionality
   - CSV upload for bulk invites

6. **Reports & Analytics**
   - Report generation with AI
   - Activity trends charts
   - Geographic distribution
   - Status breakdowns
   - Quick report templates

7. **Communication Features**
   - Messages/Conversations
   - Notifications system
   - Announcements

8. **Settings Pages**
   - Account settings
   - Organisation settings
   - Hierarchy management
   - Notification preferences
   - Appearance (theme toggle)
   - Data & sync
   - Billing

#### Component Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth layout group
│   ├── (public)/          # Public pages
│   └── dashboard/         # Protected dashboard pages
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Layout components (Header, Sidebar)
│   ├── shared/            # Shared components
│   └── ui/                # ShadCN UI primitives
├── contexts/              # React contexts
├── firebase/             # Firebase integration
├── hooks/                 # Custom React hooks
└── lib/                   # Utilities, types, mock data
```

#### Data Models (TypeScript)
- `Activity` - Complex type with semiotic assessment fields
- `User` - User profile and role information
- `Organisation` - Hierarchical organisation structure
- `Notification` - Notification system
- `Announcement` - Platform announcements
- `Conversation` - Messaging system
- `SemioticAssessment` - AI risk assessment data

### 1.2 Target Framework (Vue/Quasar)

#### Technology Stack
- **Framework**: Vue 3.4.21 (Composition API)
- **UI Framework**: Quasar 2.14.2
- **State Management**: Pinia 2.1.7
- **Routing**: Vue Router 4.3.0
- **HTTP Client**: Axios 1.6.7
- **Backend API**: Laravel REST API (planned)

#### Current Implementation Status
✅ **Completed**:
- Project structure initialized
- Basic layouts (AuthLayout, MainLayout)
- Router configuration with guards
- Pinia stores structure (12 stores created)
- API service layer (Axios with interceptors)
- Basic pages scaffolded (20+ pages)

❌ **Not Yet Implemented**:
- Component implementations (mostly empty templates)
- Store logic (stores are scaffolded but not populated)
- API integration (backend not fully implemented)
- UI components (need to be built from React prototype)
- Theme/styling (Quasar variables need to be configured)

#### Existing Structure
```
frontend/src/
├── boot/                  # Quasar boot files
├── components/            # Vue components (minimal)
├── layouts/               # Quasar layouts (AuthLayout, MainLayout)
├── pages/                 # Route pages (scaffolded)
├── router/                # Vue Router config
├── services/              # API service (Axios)
└── stores/                # Pinia stores (12 stores)
```

---

## 2. Gap Analysis

### 2.1 Component Mapping

| React Component (ShadCN) | Quasar Equivalent | Migration Complexity | Notes |
|---------------------------|-------------------|---------------------|-------|
| `Button` | `q-btn` | Low | Direct mapping, different prop names |
| `Card` | `q-card`, `q-card-section` | Low | Similar structure, different API |
| `Input` | `q-input` | Low | Built-in validation, different API |
| `Select` | `q-select` | Medium | Different data binding approach |
| `Dialog` | `q-dialog` | Medium | Programmatic control vs declarative |
| `Table` | `q-table` | High | TanStack Table → Quasar Table (different API) |
| `Tabs` | `q-tabs`, `q-tab-panels` | Low | Similar functionality |
| `Accordion` | `q-expansion-item` | Low | Direct equivalent |
| `Avatar` | `q-avatar` | Low | Similar, supports images/text |
| `Badge` | `q-badge`, `q-chip` | Low | `q-chip` more versatile |
| `Form` | `q-form` | Medium | React Hook Form → Quasar validation |
| `Textarea` | `q-input type="textarea"` | Low | Same component, different prop |
| `Checkbox` | `q-checkbox` | Low | Direct equivalent |
| `Calendar` | `q-date` | Medium | Different date picker API |
| `Toast` | `q-notify` | Medium | Different notification system |

### 2.2 State Management Migration

**React Approach**:
- React Context for global state
- React Hooks (`useState`, `useEffect`) for local state
- Firebase hooks (`useUser`, `useCollection`, `useDoc`) for data fetching

**Vue/Quasar Approach**:
- Pinia stores for global state
- Vue Composition API (`ref`, `computed`, `watch`) for local state
- Axios service for API calls (Laravel backend)

**Migration Tasks**:
1. Convert Firebase hooks to Pinia store actions
2. Replace React Context with Pinia stores
3. Convert `useState` → `ref()`, `useEffect` → `onMounted()`/`watch()`
4. Replace Firebase real-time listeners with API polling or WebSocket

### 2.3 Form Handling Migration

**React**: React Hook Form + Zod validation
```tsx
const form = useForm<FormData>({
  resolver: zodResolver(schema)
});
```

**Vue**: Quasar Form with built-in validation
```vue
<q-form @submit="onSubmit" ref="formRef">
  <q-input
    v-model="formData.email"
    :rules="[val => !!val || 'Email is required']"
  />
</q-form>
```

**Migration Tasks**:
1. Convert Zod schemas to Quasar validation rules
2. Replace `useForm` with `ref()` and `q-form`
3. Convert form submission handlers

### 2.4 Routing Migration

**React/Next.js**: File-based routing with App Router
- `src/app/dashboard/activities/page.tsx` → `/dashboard/activities`

**Vue**: Centralized route configuration
- `src/router/routes.ts` with explicit route definitions

**Migration Tasks**:
1. Map all Next.js routes to Vue Router routes
2. Convert layout groups to nested routes
3. Implement route guards (auth, role-based)

### 2.5 Styling Migration

**React**: Tailwind CSS with HSL color variables
```css
--primary: 234 89% 74%;
--accent: 207 88% 72%;
```

**Vue/Quasar**: SASS variables
```sass
$primary: #b5b1f9
$accent: #53A7EA
```

**Migration Tasks**:
1. Convert HSL color variables to Quasar SASS variables
2. Replace Tailwind utility classes with Quasar classes
3. Map custom CSS to Quasar component styling

### 2.6 Data Fetching Migration

**React**: Firebase SDK (Firestore, Auth)
```tsx
const { data } = useCollection('activities');
```

**Vue**: Laravel REST API via Axios
```ts
const activities = await api.get('/activities');
```

**Migration Tasks**:
1. Replace all Firebase calls with Laravel API endpoints
2. Convert real-time listeners to polling or WebSocket
3. Update data models to match Laravel API responses

---

## 3. Detailed Migration Plan

### Phase 1: Foundation & Setup (Week 1)

#### 1.1 Theme & Styling Configuration
**Priority**: High  
**Effort**: 1 day

**Tasks**:
1. Extract color palette from React prototype's `globals.css`
2. Map HSL values to Quasar SASS variables in `quasar-variables.sass`
3. Configure Inter font family
4. Set up dark mode support
5. Create custom CSS for any non-Quasar styling needs

**Deliverables**:
- `src/quasar-variables.sass` with complete theme configuration
- `src/app.scss` with custom styles
- Theme toggle functionality working

#### 1.2 Component Library Setup
**Priority**: High  
**Effort**: 2 days

**Tasks**:
1. Create base wrapper components for common Quasar components
2. Create icon mapping utility (Lucide → Quasar icons)
3. Set up component composition patterns
4. Create shared component utilities

**Deliverables**:
- `src/components/base/` directory with wrapper components
- Icon mapping utility
- Component documentation

#### 1.3 Type Definitions Migration
**Priority**: High  
**Effort**: 1 day

**Tasks**:
1. Copy TypeScript types from `src/lib/types.ts`
2. Adapt types for Vue/Quasar patterns (remove React-specific types)
3. Create API response type definitions
4. Set up type exports

**Deliverables**:
- `src/types/` directory with all type definitions
- Type exports file

---

### Phase 2: Core Layouts & Navigation (Week 1-2)

#### 2.1 Main Layout Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/app/dashboard/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/sidebar.tsx`

**Tasks**:
1. Convert `AppSidebar` to Quasar `q-drawer` with `q-list`
2. Convert `Header` component to `q-header`
3. Implement navigation menu from `navItems` data
4. Add role-based menu filtering
5. Implement mobile bottom navigation
6. Add search functionality in header
7. Implement user profile dropdown

**Deliverables**:
- `src/layouts/MainLayout.vue` fully functional
- `src/components/layout/AppSidebar.vue`
- `src/components/layout/AppHeader.vue`
- `src/components/layout/MobileBottomNav.vue`

#### 2.2 Auth Layout Migration
**Priority**: High  
**Effort**: 1 day

**Source**: `src/app/(auth)/layout.tsx`

**Tasks**:
1. Convert auth layout to Quasar layout
2. Add logo and branding
3. Implement responsive design

**Deliverables**:
- `src/layouts/AuthLayout.vue` complete

#### 2.3 Navigation Data Migration
**Priority**: Medium  
**Effort**: 0.5 days

**Tasks**:
1. Convert `navItems` from `src/lib/data.ts` to Vue-compatible format
2. Create navigation store or composable
3. Map icons (Lucide → Quasar icons)

**Deliverables**:
- `src/lib/navigation.ts` with navigation data
- Icon mapping utility

---

### Phase 3: Authentication System (Week 2)

#### 3.1 Auth Store Implementation
**Priority**: High  
**Effort**: 1 day

**Source**: `src/firebase/auth/use-user.tsx`, `src/contexts/` (if any)

**Tasks**:
1. Implement `useAuthStore` with Pinia
2. Add login, logout, register actions
3. Add token management (localStorage)
4. Add user state management
5. Implement token refresh logic
6. Add error handling

**Deliverables**:
- `src/stores/useAuthStore.ts` fully implemented
- Integration with Laravel Sanctum API

#### 3.2 Login Page Migration
**Priority**: High  
**Effort**: 1 day

**Source**: `src/app/(auth)/login/page.tsx`

**Tasks**:
1. Convert React form to Quasar form
2. Replace React Hook Form with Quasar validation
3. Integrate with auth store
4. Add loading states
5. Add error display
6. Implement "Remember me" functionality

**Deliverables**:
- `src/pages/AuthLogin.vue` complete

#### 3.3 Register Page Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/app/(auth)/register/page.tsx` and step components

**Tasks**:
1. Convert multi-step form to Quasar stepper
2. Migrate Step 1: Personal Info
3. Migrate Step 2: Organisation
4. Migrate Step 3: Account Setup
5. Migrate Step 4: Verification
6. Add form validation for each step
7. Add progress indicator
8. Integrate with auth store

**Deliverables**:
- `src/pages/AuthRegister.vue` with all steps
- Step components in `src/components/auth/`

#### 3.4 Forgot Password Flow
**Priority**: Medium  
**Effort**: 1 day

**Source**: `src/app/(auth)/forgot-password/page.tsx`

**Tasks**:
1. Convert forgot password form
2. Add email validation
3. Integrate with API
4. Add success/error states

**Deliverables**:
- `src/pages/AuthForgotPassword.vue` complete
- `src/pages/AuthResetPassword.vue` complete

#### 3.5 Route Guards Implementation
**Priority**: High  
**Effort**: 0.5 days

**Tasks**:
1. Enhance `src/router/guards.ts`
2. Add authentication guard
3. Add role-based guard
4. Add redirect logic

**Deliverables**:
- Complete route guards implementation

---

### Phase 4: Dashboard System (Week 2-3)

#### 4.1 Dashboard Store Implementation
**Priority**: High  
**Effort**: 1 day

**Source**: Dashboard data logic from various components

**Tasks**:
1. Implement `useDashboardStore`
2. Add metric fetching logic
3. Add role-based data filtering
4. Add caching logic

**Deliverables**:
- `src/stores/useDashboardStore.ts` complete

#### 4.2 Dashboard Page Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/app/dashboard/page.tsx`, role-specific dashboards

**Tasks**:
1. Convert role switcher tabs
2. Migrate National/Federal dashboard
3. Migrate State dashboard
4. Migrate LGA dashboard
5. Implement role-based data display
6. Add loading states

**Deliverables**:
- `src/pages/Dashboard.vue` with all role views
- `src/components/dashboard/NationalDashboard.vue`
- `src/components/dashboard/StateDashboard.vue`
- `src/components/dashboard/LgaDashboard.vue`

#### 4.3 Dashboard Components Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/components/dashboard/`

**Tasks**:
1. Migrate `MetricCard` → Quasar card component
2. Migrate `PerformanceCharts` → Quasar chart or external library
3. Migrate `RecentActivities` → Quasar list/card
4. Migrate `MapCard` → Map integration (if needed)
5. Migrate `EmergencyCenter` → Quasar card

**Deliverables**:
- All dashboard components migrated
- Chart library integration (Recharts alternative or Quasar charts)

---

### Phase 5: Activity Management (Week 3-4)

#### 5.1 Activity Store Implementation
**Priority**: High  
**Effort**: 1 day

**Source**: Activity data logic, Firebase hooks

**Tasks**:
1. Implement `useActivityStore`
2. Add CRUD actions (create, read, update, delete)
3. Add filtering and pagination
4. Add status workflow management
5. Add file upload handling

**Deliverables**:
- `src/stores/useActivityStore.ts` complete
- API integration with Laravel backend

#### 5.2 Activity List Page Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/app/dashboard/activities/page.tsx`, `ActivitiesDataTable.tsx`

**Tasks**:
1. Convert TanStack Table to Quasar Table
2. Migrate filters component
3. Migrate date range picker
4. Add pagination
5. Add sorting
6. Add bulk actions
7. Add status badges

**Deliverables**:
- `src/pages/ActivityList.vue` complete
- `src/components/activities/ActivitiesTable.vue`
- `src/components/activities/ActivityFilters.vue`
- `src/components/activities/DateRangePicker.vue`

#### 5.3 Activity Form Migration
**Priority**: High  
**Effort**: 3 days

**Source**: `src/app/dashboard/activities/create/page.tsx`, `ActivityForm.tsx`

**Tasks**:
1. Convert multi-step form to Quasar stepper
2. Migrate basic information step
3. Migrate location/context step
4. Migrate message planning step
5. Migrate file upload step
6. Add form validation
7. Add state/LGA dynamic dropdowns
8. Integrate with activity store

**Deliverables**:
- `src/pages/ActivityCreate.vue` complete
- `src/pages/ActivityEdit.vue` complete
- `src/components/activities/ActivityForm.vue`

#### 5.4 Activity Detail Page Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/app/dashboard/activities/[id]/page.tsx`

**Tasks**:
1. Convert activity detail view
2. Migrate semiotic assessment display
3. Add status workflow UI
4. Add edit/delete actions
5. Add comments section (if applicable)

**Deliverables**:
- `src/pages/ActivityDetail.vue` complete
- `src/components/activities/SemioticAssessmentDisplay.vue`

#### 5.5 Semiotic Assessment Integration
**Priority**: Medium  
**Effort**: 2 days

**Source**: `src/app/dashboard/activities/[id]/edit/page.tsx`, semiotic assessment logic

**Tasks**:
1. Integrate "Assess Risk" button functionality
2. Connect to Laravel API endpoint for AI analysis
3. Display risk score and recommendations
4. Add assessment history

**Deliverables**:
- Semiotic assessment fully integrated
- API endpoint integration

---

### Phase 6: Organisation Management (Week 4)

#### 6.1 Organisation Store Implementation
**Priority**: High  
**Effort**: 1 day

**Tasks**:
1. Implement `useOrganisationStore`
2. Add CRUD actions
3. Add hierarchy management
4. Add member management

**Deliverables**:
- `src/stores/useOrganisationStore.ts` complete

#### 6.2 Organisation Pages Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/app/dashboard/organisations/`

**Tasks**:
1. Migrate organisation list page
2. Migrate organisation detail page
3. Migrate organisation create/edit forms
4. Add hierarchy visualization
5. Add member list

**Deliverables**:
- `src/pages/OrganisationList.vue` complete
- `src/pages/OrganisationDetail.vue` complete
- `src/pages/OrganisationCreate.vue` complete
- `src/pages/OrganisationEdit.vue` complete

---

### Phase 7: Team Management (Week 4)

#### 7.1 Team Store Implementation
**Priority**: Medium  
**Effort**: 0.5 days

**Tasks**:
1. Enhance `useUserStore` or create `useTeamStore`
2. Add team member fetching
3. Add invite functionality

**Deliverables**:
- Team management in stores

#### 7.2 Team Directory Migration
**Priority**: Medium  
**Effort**: 1.5 days

**Source**: `src/app/dashboard/team/page.tsx`

**Tasks**:
1. Convert team member grid to Quasar cards
2. Add invite members dialog
3. Add CSV upload functionality
4. Add member filtering/search

**Deliverables**:
- `src/pages/TeamDirectory.vue` complete
- `src/components/team/InviteMembersDialog.vue`

---

### Phase 8: Reports & Analytics (Week 5)

#### 8.1 Analytics Store Implementation
**Priority**: High  
**Effort**: 1 day

**Tasks**:
1. Implement `useAnalyticsStore`
2. Add report generation logic
3. Add chart data fetching

**Deliverables**:
- `src/stores/useAnalyticsStore.ts` complete

#### 8.2 Reports Page Migration
**Priority**: High  
**Effort**: 2 days

**Source**: `src/app/dashboard/reports/`

**Tasks**:
1. Migrate report templates selection
2. Migrate report generation UI
3. Migrate activity trends chart
4. Migrate activity type distribution
5. Migrate geographic distribution
6. Migrate status breakdown
7. Add report export functionality

**Deliverables**:
- `src/pages/Reports.vue` complete
- `src/pages/ReportDetail.vue` complete
- Chart components migrated

#### 8.3 AI Report Generation Integration
**Priority**: Medium  
**Effort**: 1 day

**Source**: AI report generation logic

**Tasks**:
1. Connect report generation to Laravel API
2. Add loading states for AI processing
3. Display generated report content
4. Add report saving functionality

**Deliverables**:
- AI report generation integrated

---

### Phase 9: Communication Features (Week 5)

#### 9.1 Message Store Implementation
**Priority**: Medium  
**Effort**: 1 day

**Tasks**:
1. Implement `useMessageStore`
2. Add conversation fetching
3. Add message sending
4. Add real-time updates (polling or WebSocket)

**Deliverables**:
- `src/stores/useMessageStore.ts` complete

#### 9.2 Messages Pages Migration
**Priority**: Medium  
**Effort**: 2 days

**Source**: `src/app/dashboard/messages/page.tsx`

**Tasks**:
1. Migrate message inbox
2. Migrate conversation view
3. Migrate message compose
4. Add real-time message updates

**Deliverables**:
- `src/pages/MessageInbox.vue` complete
- `src/pages/MessageDetail.vue` complete
- `src/pages/MessageCompose.vue` complete

#### 9.3 Notifications System
**Priority**: Medium  
**Effort**: 1 day

**Source**: `src/app/dashboard/notifications/page.tsx`

**Tasks**:
1. Implement `useNotificationStore`
2. Migrate notifications page
3. Add notification badges
4. Add real-time notification updates

**Deliverables**:
- `src/pages/Notifications.vue` complete
- Notification system integrated

#### 9.4 Announcements
**Priority**: Low  
**Effort**: 1 day

**Source**: `src/app/dashboard/announcements/`

**Tasks**:
1. Migrate announcements list
2. Migrate announcement detail
3. Add announcement filtering

**Deliverables**:
- `src/pages/Announcements.vue` complete

---

### Phase 10: Settings & Profile (Week 6)

#### 10.1 Settings Pages Migration
**Priority**: Medium  
**Effort**: 2 days

**Source**: `src/app/dashboard/settings/`

**Tasks**:
1. Migrate account settings
2. Migrate organisation settings
3. Migrate hierarchy settings
4. Migrate notification preferences
5. Migrate appearance settings (theme toggle)
6. Migrate data & sync settings
7. Migrate billing settings
8. Migrate help page

**Deliverables**:
- All settings pages migrated
- Theme toggle working

#### 10.2 Profile Page Migration
**Priority**: Medium  
**Effort**: 1 day

**Source**: `src/app/dashboard/profile/page.tsx`

**Tasks**:
1. Migrate user profile page
2. Add profile editing
3. Add avatar upload

**Deliverables**:
- `src/pages/UserProfile.vue` complete

---

### Phase 11: Testing & Refinement (Week 6)

#### 11.1 Component Testing
**Priority**: High  
**Effort**: 2 days

**Tasks**:
1. Test all migrated components
2. Fix UI inconsistencies
3. Test responsive design
4. Test accessibility

**Deliverables**:
- All components tested and working

#### 11.2 Integration Testing
**Priority**: High  
**Effort**: 2 days

**Tasks**:
1. Test authentication flow
2. Test data fetching
3. Test form submissions
4. Test error handling
5. Test loading states

**Deliverables**:
- Integration tests passing

#### 11.3 Performance Optimization
**Priority**: Medium  
**Effort**: 1 day

**Tasks**:
1. Optimize bundle size
2. Add code splitting
3. Optimize images
4. Add caching strategies

**Deliverables**:
- Performance optimizations applied

---

## 4. Component Mapping Reference

### 4.1 UI Component Mapping

| React Component | Quasar Component | Migration Notes |
|----------------|------------------|-----------------|
| `<Button>` | `<q-btn>` | Use `color`, `flat`, `outline`, `unelevated` props |
| `<Card>` | `<q-card>` + `<q-card-section>` | Use sections for structure |
| `<Input>` | `<q-input>` | Built-in validation with `:rules` |
| `<Select>` | `<q-select>` | Use `v-model` and `:options` |
| `<Dialog>` | `<q-dialog>` | Control with `v-model` boolean |
| `<Table>` | `<q-table>` | Different API, use `:columns` and `:rows` |
| `<Tabs>` | `<q-tabs>` + `<q-tab-panels>` | Similar structure |
| `<Accordion>` | `<q-expansion-item>` | Direct equivalent |
| `<Avatar>` | `<q-avatar>` | Supports image or text |
| `<Badge>` | `<q-badge>` or `<q-chip>` | `q-chip` for interactive elements |
| `<Form>` | `<q-form>` | Use `@submit` and `ref` for validation |
| `<Textarea>` | `<q-input type="textarea">` | Same component |
| `<Checkbox>` | `<q-checkbox>` | Direct equivalent |
| `<Calendar>` | `<q-date>` | Different date picker API |
| `<Toast>` | `$q.notify()` | Programmatic notification |
| `<Skeleton>` | `<q-skeleton>` | Direct equivalent |
| `<Progress>` | `<q-linear-progress>` | Similar functionality |
| `<Alert>` | `<q-banner>` | Similar purpose |

### 4.2 Icon Mapping

**Lucide React → Quasar Icons**

Common mappings:
- `LayoutDashboard` → `dashboard` (Material Icons)
- `ClipboardList` → `list_alt` or `assignment`
- `Users` → `people`
- `Settings` → `settings`
- `Bell` → `notifications`
- `MessageSquare` → `message`
- `FileText` → `description`
- `BarChart3` → `bar_chart`
- `Building` → `business`
- `Map` → `map`
- `Calendar` → `calendar_today`
- `Search` → `search`
- `User` → `person`
- `LogOut` → `logout`
- `Plus` → `add`
- `Edit` → `edit`
- `Trash` → `delete`
- `Check` → `check`
- `X` → `close`

**Note**: Create an icon mapping utility to convert Lucide icon names to Quasar icon names.

---

## 5. Data Model Migration

### 5.1 TypeScript Types

All types from `src/lib/types.ts` should be migrated to `src/types/index.ts` with the following adaptations:

1. **Remove React-specific types**: Remove `LucideIcon` from icon properties, use string instead
2. **API Response Types**: Create separate types for API request/response
3. **Vue-specific types**: Add Vue ref/computed types where needed

### 5.2 API Integration

**Current (Firebase)**:
```tsx
const { data } = useCollection('activities');
```

**Target (Laravel API)**:
```ts
const activities = await api.get('/activities');
// Store in Pinia store
activityStore.setActivities(activities.data);
```

**Migration Pattern**:
1. Replace Firebase hooks with Pinia store actions
2. Use Axios service for API calls
3. Store data in Pinia stores
4. Use computed properties for reactive access

---

## 6. Styling Migration Guide

### 6.1 Color Variables

**Source (Tailwind CSS)**:
```css
--primary: 234 89% 74%; /* HSL format */
--accent: 207 88% 72%;
```

**Target (Quasar SASS)**:
```sass
$primary: #b5b1f9  // Convert HSL to hex
$accent: #53A7EA
```

**Conversion Tool**: Use online HSL to hex converter or calculate manually.

### 6.2 Utility Classes

**Tailwind → Quasar**:
- `flex` → `row` or `column` (Quasar flex)
- `gap-4` → `q-gutter-*` or custom spacing
- `p-4` → `q-pa-*` (Quasar padding)
- `m-4` → `q-ma-*` (Quasar margin)
- `text-center` → `text-center` (same)
- `bg-primary` → `bg-primary` (Quasar color)

### 6.3 Custom Styles

For styles not covered by Quasar, add to `src/app.scss`:
```scss
.custom-class {
  // Custom styles
}
```

---

## 7. Testing Strategy

### 7.1 Unit Testing
- Test Pinia stores
- Test utility functions
- Test form validation

### 7.2 Component Testing
- Test component rendering
- Test user interactions
- Test props and events

### 7.3 Integration Testing
- Test authentication flow
- Test API integration
- Test routing
- Test state management

### 7.4 E2E Testing
- Test critical user flows
- Test cross-browser compatibility
- Test responsive design

---

## 8. Risk Assessment & Mitigation

### 8.1 High-Risk Areas

1. **Data Table Migration** (TanStack → Quasar)
   - **Risk**: Different APIs, complex features
   - **Mitigation**: Start with basic table, add features incrementally

2. **Form Validation Migration** (Zod → Quasar)
   - **Risk**: Different validation approach
   - **Mitigation**: Create validation rule utilities, test thoroughly

3. **Real-time Data** (Firebase → API)
   - **Risk**: Loss of real-time updates
   - **Mitigation**: Implement polling or WebSocket for critical features

4. **Chart Library** (Recharts → Alternative)
   - **Risk**: Different chart library API
   - **Mitigation**: Evaluate chart libraries (Chart.js, ApexCharts), create wrapper components

### 8.2 Medium-Risk Areas

1. **Theme Migration** (Tailwind → Quasar)
   - **Risk**: Visual inconsistencies
   - **Mitigation**: Careful color mapping, extensive UI testing

2. **State Management** (Context → Pinia)
   - **Risk**: State management bugs
   - **Mitigation**: Thorough testing, use Pinia DevTools

---

## 9. Success Criteria

### 9.1 Functional Requirements
- ✅ All pages from prototype are migrated
- ✅ All features work as in prototype
- ✅ Authentication and authorization working
- ✅ Data fetching and display working
- ✅ Forms submit correctly
- ✅ File uploads working

### 9.2 Non-Functional Requirements
- ✅ Responsive design maintained
- ✅ Performance is acceptable (< 3s initial load)
- ✅ Accessibility standards met
- ✅ Browser compatibility (Chrome, Firefox, Safari, Edge)
- ✅ Code quality (TypeScript, linting, formatting)

---

## 10. Next Steps

1. **Review this plan** with the team
2. **Set up development environment** (if not already done)
3. **Begin Phase 1** (Foundation & Setup)
4. **Create GitHub issues** for each phase/task
5. **Set up project tracking** (Kanban board, etc.)
6. **Schedule weekly reviews** to track progress

---

## 11. Resources & References

### Documentation
- [Quasar Framework Docs](https://quasar.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)

### Migration Guides
- React to Vue migration patterns
- Component library comparison charts
- State management migration guides

### Tools
- HSL to Hex converter
- Icon mapping reference
- Component API comparison

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Status**: Ready for Implementation
