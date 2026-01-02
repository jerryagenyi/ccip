# Component Inventory - Frontend

**Part:** Frontend (Vue 3 + Quasar)  
**Total Components:** 46 Vue components  
**Framework:** Vue 3.5 (Composition API)  
**UI Library:** Quasar 2.18

## Component Architecture

All components use:
- **Composition API** (`<script setup lang="ts">`)
- **TypeScript** with strict typing
- **Quasar components** as base UI elements
- **Path alias** `@/` for imports

## Base UI Components

Located in `src/components/ui/` - Wrapper components around Quasar for consistency.

### BaseButton.vue
**Purpose:** Standardized button component  
**Props:**
- `variant`: `primary` | `secondary` | `outline` | `text`
- `size`: `xs` | `sm` | `md` | `lg` | `xl`
- `color`: string (Quasar color)
- `type`: `button` | `submit` | `reset`
- `icon`: string (Quasar icon name)
- `round`: boolean
- `loading`: boolean
- `disabled`: boolean

**Emits:** `click`

**Usage:** Wraps `q-btn` with consistent styling

### BaseCard.vue
**Purpose:** Standardized card component  
**Props:**
- `title`: string (optional)
- `variant`: `default` | `elevated` | `outlined` | `flat`
- `padding`: `none` | `sm` | `md` | `lg`
- `flat`: boolean
- `bordered`: boolean

**Slots:** `default`, `header`, `content`, `actions`

**Usage:** Wraps `q-card` with consistent structure

### BaseInput.vue
**Purpose:** Standardized input field  
**Wraps:** `q-input`  
**Features:** Validation, labels, icons, error states

### BaseSelect.vue
**Purpose:** Standardized select dropdown  
**Wraps:** `q-select`  
**Features:** Options, filtering, data binding

### BaseCheckbox.vue
**Purpose:** Standardized checkbox  
**Wraps:** `q-checkbox`

### BaseDialog.vue
**Purpose:** Standardized dialog/modal  
**Wraps:** `q-dialog`  
**Features:** Consistent modal behavior

### BaseBadge.vue
**Purpose:** Standardized badge/chip component  
**Wraps:** `q-badge` or `q-chip`

### DataTable.vue
**Purpose:** Reusable data table component  
**Features:** Sorting, filtering, pagination, selection

### FileUpload.vue
**Purpose:** File upload component  
**Features:** Drag-and-drop, multiple files, progress

### FormWizard.vue
**Purpose:** Multi-step form wizard  
**Features:** Step navigation, validation per step

### PDFExportButton.vue
**Purpose:** PDF export functionality  
**Features:** Generate PDF from data

### ThemeToggle.vue
**Purpose:** Dark/light theme switcher  
**Features:** Theme persistence

## Activity Components

Located in `src/components/activities/`

### SemioticAnalysis.vue
**Purpose:** Display AI semiotic risk analysis results  
**Props:**
- `analysis`: SemioticAssessment object
- `loading`: boolean
- `activityId`: string

**Features:**
- Risk score visualization
- Predicted failures display
- Recommendations list
- Color-coded risk levels

### LocationSelector.vue
**Purpose:** Geographic location selector  
**Features:** Country, state, LGA selection

### StateLgaSelector.vue
**Purpose:** Nigerian state and LGA selector  
**Features:** Cascading dropdowns (state → LGA)

## Layout Components

Located in `src/components/layout/`

### NotificationCenter.vue
**Purpose:** Notification dropdown/center  
**Features:** Unread count, notification list, mark as read

### UserMenu.vue
**Purpose:** User menu dropdown  
**Features:** Profile link, settings, logout

### AppFooter.vue
**Purpose:** Application footer  
**Location:** `src/components/AppFooter.vue`

## Report Components

Located in `src/components/reports/`

### AIReportGenerator.vue
**Purpose:** AI-powered report generation interface  
**Features:** Template selection, filter configuration, generation

## Page Components

Located in `src/pages/` - Route-based page components (46 total)

### Authentication Pages
- `AuthLogin.vue` - Login form
- `AuthRegister.vue` - Registration form
- `AuthForgotPassword.vue` - Password reset request
- `AuthResetPassword.vue` - Password reset form

### Main Application Pages
- `IndexPage.vue` - Landing page
- `Dashboard.vue` - Role-based dashboard
- `UserProfile.vue` - User profile management
- `Settings.vue` - Application settings

### Activity Pages
- `ActivityList.vue` - Activities listing with filters
- `ActivityCreate.vue` - Create new activity
- `ActivityDetail.vue` - Activity details view
- `ActivityTimeline.vue` - Activity timeline view

### Organisation Pages
- `OrganisationList.vue` - Organisations listing
- `OrganisationCreate.vue` - Create organisation
- `OrganisationDetail.vue` - Organisation details

### Messaging Pages
- `MessageInbox.vue` - Message inbox
- `MessageDetail.vue` - Message thread view
- `MessageCompose.vue` - Compose new message

### Reports Pages
- `ReportsList.vue` - Reports listing

### Analytics Pages
- `Analytics.vue` - Analytics dashboard

### Help Pages
- `HelpSearch.vue` - Help article search
- `HelpArticle.vue` - Help article view

### Error Pages
- `ErrorNotFound.vue` - 404 error page

## Layout Components

Located in `src/layouts/`

### MainLayout.vue
**Purpose:** Main application layout  
**Features:**
- Sidebar navigation
- Header with search, notifications, user menu
- Page container

### AuthLayout.vue
**Purpose:** Authentication pages layout  
**Features:** Minimal layout for login/register

### LandingLayout.vue
**Purpose:** Public landing page layout  
**Features:** Public header/footer

## Pinia Stores (State Management)

Located in `src/stores/` - 13 stores total

### useAuthStore.ts
**Purpose:** Authentication state  
**State:**
- `user`: User object
- `token`: Auth token
- `loading`: boolean
- `error`: string | null

**Actions:**
- `login(credentials)`
- `register(data)`
- `logout()`
- `fetchUser()`
- `refreshToken()`
- `forgotPassword(email)`
- `resetPassword(data)`
- `verifyEmail(token)`
- `updateProfile(data)`
- `changePassword(...)`

**Computed:**
- `isAuthenticated`
- `userRole`
- `userOrganisation`
- `userPermissions`
- `hasPermission(permission)`
- `hasRole(role)`

### useActivityStore.ts
**Purpose:** Activity management  
**State:**
- `activities`: Activity[]
- `currentActivity`: Activity | null
- `loading`: boolean
- `error`: string | null
- `total`: number
- `currentPage`: number
- `perPage`: number
- `filters`: ActivityFilters
- `selectedActivities`: string[]

**Actions:**
- `fetchActivities(params)`
- `fetchActivity(id)`
- `createActivity(data)`
- `updateActivity(id, data)`
- `deleteActivity(id)`
- `submitActivity(id)`
- `approveActivity(id)`
- `rejectActivity(id, reason)`
- `completeActivity(id)`
- `duplicateActivity(id)`
- `uploadFiles(id, files)`
- `deleteFile(activityId, fileId)`
- `runSemioticAnalysis(id)`

### useOrganisationStore.ts
**Purpose:** Organisation management  
**Actions:** CRUD operations for organisations

### useUserStore.ts
**Purpose:** User management  
**Actions:** User profile operations

### useMessageStore.ts
**Purpose:** Messaging system  
**Actions:** Send, receive, mark as read

### useNotificationStore.ts
**Purpose:** Notifications  
**Actions:** Fetch, mark as read, preferences

### useDashboardStore.ts
**Purpose:** Dashboard data  
**Actions:** Fetch role-based dashboard data

### useAnalyticsStore.ts
**Purpose:** Analytics data  
**Actions:** Fetch analytics metrics

### useReportStore.ts
**Purpose:** Report management  
**Actions:** Create, generate, export reports

### useTemplateStore.ts
**Purpose:** Activity/report templates  
**Actions:** Fetch templates

### useHelpStore.ts
**Purpose:** Help articles  
**Actions:** Search, fetch articles

### useOnboardingStore.ts
**Purpose:** User onboarding flow  
**Actions:** Track onboarding progress

### useThemeStore.ts
**Purpose:** Theme management  
**Actions:** Toggle dark/light theme, persist preference

## Services

Located in `src/services/`

### api.ts
**Purpose:** Axios instance with interceptors  
**Features:**
- Base URL configuration
- Auth token injection
- Error handling
- Response transformation
- API_ENDPOINTS constants

### pdfExport.ts
**Purpose:** PDF generation service  
**Features:** Generate PDF from data

## Composables

Located in `src/composables/`

### usePDFExport.ts
**Purpose:** PDF export composable  
**Features:** Reusable PDF generation logic

## Router

Located in `src/router/`

### routes.ts
**Purpose:** Route definitions  
**Routes:** 20+ routes defined

### guards.ts
**Purpose:** Route guards  
**Guards:**
- `authGuard` - Authentication check
- `roleGuard` - Role-based access
- `globalGuard` - Global navigation guard

### index.ts
**Purpose:** Router instance setup

## Types

Located in `src/types/`

### api.ts
**Purpose:** API type definitions  
**Types:**
- `ApiResponse<T>`
- `PaginatedResponse<T>`
- `Activity`, `User`, `Organisation`, etc.
- `API_ENDPOINTS` constants

### index.ts
**Purpose:** Shared type definitions

## Component Patterns

### Composition API Pattern
All components use `<script setup lang="ts">`:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  // TypeScript interface
}

const props = defineProps<Props>();
defineEmits<{ event: [data: Type] }>();
</script>
```

### Quasar Integration
- Base components wrap Quasar primitives
- Use Quasar props (`color`, `size`, `variant`)
- Quasar icons via `q-icon`
- Quasar notifications via `Notify`

### State Management
- Pinia stores for global state
- Composition API `ref()`/`computed()` for local state
- Store actions for API calls

### Type Safety
- All props typed with TypeScript interfaces
- All emits typed
- API responses typed
- Store state typed

## Component Count Summary

- **Base UI Components:** 12
- **Activity Components:** 3
- **Layout Components:** 3
- **Report Components:** 1
- **Page Components:** 20+
- **Layouts:** 3
- **Stores:** 13
- **Total Vue Components:** 46+

## Reusability

**Highly Reusable:**
- Base UI components (BaseButton, BaseCard, etc.)
- DataTable
- FileUpload
- FormWizard

**Feature-Specific:**
- Activity components
- Report components
- Page components

**Shared Logic:**
- Composables (usePDFExport)
- Services (api.ts)
- Stores (state management)

