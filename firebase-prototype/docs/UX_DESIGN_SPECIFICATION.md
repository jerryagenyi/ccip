# CCIP UI/UX Design Specification
**Version:** 1.0
**Date:** January 1, 2025

**Purpose:** This document provides a comprehensive overview of the UI/UX design, architecture, and components of the CCIP Next.js/React prototype. It is intended to guide the production implementation team in migrating the design to the target Vue/Quasar/Laravel stack, ensuring alignment with the Product Requirements Document (PRD).

---

## 1. Design System Documentation

### 1.1 Color Palette
The color system is defined in `src/app/globals.css` using HSL CSS variables, ensuring a consistent and themeable design. The dark theme is the default and primary theme.

| Variable | Usage | HSL Value | Hex Value |
|:---|:---|:---|:---|
| `--background` | Main page background | `222 47% 11%` | `#111827` |
| `--foreground` | Main text color | `0 0% 98%` | `#FAFAFA` |
| `--card` | Card component background | `217 33% 17%` | `#1D283A` |
| `--primary` | Primary interactive elements, highlights | `234 89% 74%` | `#B5B1F9` |
| `--primary-foreground` | Text on primary elements | `222 47% 11%` | `#111827` |
| `--secondary` | Secondary buttons, backgrounds | `217 22% 23%` | `#2D3748` |
| `--muted` | Subtle backgrounds, borders | `217 33% 22%` | `#2A374A` |
| `--muted-foreground` | Subtle text | `240 5% 64.9%` | `#A0AEC0` |
| `--accent` | Secondary accent, gradients | `207 88% 72%` | `#90CDF4` |
| `--destructive` | Destructive actions (e.g., delete) | `0 62.8% 30.6%` | `#C53030` |
| `--border` | Component borders | `217 33% 25%` | `#324157` |
| `--input` | Input field borders | `217 33% 25%` | `#324157` |
| `--ring` | Focus rings | `234 89% 74%` | `#B5B1F9` |

### 1.2 Typography
Fonts are configured in `src/app/layout.tsx` using `next/font/google`.

- **Sans-serif (Primary):** `Inter` (`--font-sans`). Used for all body text, UI elements, and most headings for a clean, modern feel.
- **Serif (Secondary):** `Merriweather` (`--font-serif`). Reserved for long-form content or reports where readability is key.
- **Monospace:** `JetBrains Mono` (`--font-mono`). Used for code snippets or tabular data where alignment is important.

**Usage Patterns (from `src/app/globals.css`):**
- `h1`: `text-3xl font-semibold`
- `h2`: `text-2xl font-semibold`
- `h3`: `text-xl font-semibold`
- `p`: `text-base`
- `small`: `text-xs`

### 1.3 Component Library
The prototype uses **ShadCN UI** as its base component library. All components are located in `src/components/ui/`. Key components used: `Accordion`, `Alert`, `Avatar`, `Badge`, `Button`, `Card`, `Checkbox`, `Dialog`, `DropdownMenu`, `Form`, `Input`, `Label`, `Popover`, `Progress`, `Select`, `Separator`, `Sheet`, `Switch`, `Table`, `Tabs`, `Textarea`, `Toast`, `Tooltip`.

### 1.4 Icon System
- **Library:** `lucide-react`. Icons are imported directly into components where needed (e.g., `<PlusCircle />`).
- **Custom Icons:** `Logo` icon is a custom SVG component defined in `src/components/icons.tsx`.

### 1.5 Spacing & Breakpoints
- **Spacing:** Follows Tailwind CSS's default spacing scale (e.g., `p-4`, `gap-8`). Conventions are consistent across components.
- **Breakpoints:** Uses Tailwind's default breakpoints (`sm`, `md`, `lg`, `xl`). Responsive design is primarily handled via mobile-first classes (e.g., `grid-cols-1 md:grid-cols-2`).

### 1.6 Accessibility
- **ARIA:** Standard ARIA attributes are used where appropriate by ShadCN components.
- **Keyboard Navigation:** Components are generally keyboard-navigable.
- **Focus Management:** Focus rings are styled using `--ring` variable.
- **Color Contrast:** The default theme palette has been designed to meet WCAG 2.1 AA standards for contrast.

---

## 2. User Flow Diagrams

### 2.1 Authentication Flow
*   **Login:** User navigates to `/login`. Fills form (`src/app/(auth)/login/page.tsx`) -> Submits -> (Simulated) Redirected to `/dashboard`.
*   **Registration (4-Step):** User navigates to `/register`. The multi-step form is in `src/app/(auth)/register/page.tsx`.
    1.  **Step 1:** `Step1PersonalInfo` -> Enters personal details.
    2.  **Step 2:** `Step2Organisation` -> Selects their organization from a list.
    3.  **Step 3:** `Step3AccountSetup` -> Sets a password.
    4.  **Step 4:** `Step4Verification` -> Agrees to terms, "uploads" ID.
    5.  **Submission:** A success screen is shown.
*   **Password Reset:** User navigates to `/forgot-password`. Enters email -> Submits -> A confirmation screen is shown.

### 2.2 Activity Management Flow
1.  **Create:** User clicks "Create Campaign" button on `/dashboard/activities`. Navigates to `/dashboard/activities/create`.
2.  **Fill Form:** User fills out the `ActivityForm` (`src/app/dashboard/activities/components/activity-form.tsx`).
3.  **Assess Risk:** User types a message in the "Planned Message Content" textarea and clicks "Assess Semiotic Risk". This triggers `handleAssessRisk`.
4.  **Review Assessment:** The `SemioticAssessmentDisplay` component shows the risk score, potential issues, and recommendations.
5.  **Submit:** User confirms human review and clicks "Submit for Approval". A success screen is shown.
6.  **Approve/Execute/Report:** These steps are conceptual in the prototype. The UI shows different statuses (`Approved`, `Completed`, etc.), implying this workflow.

### 2.3 Organization Management Flow
1.  **Create Org:** User navigates to `/dashboard/organisations/create` and uses `OrganisationForm` to define a new organization, including its level and parent.
2.  **Invite Members:** On the `/dashboard/team` page, the "Invite Members" button opens a dialog (`Dialog` component in `team/page.tsx`) allowing admins to invite users via email or CSV upload.

---

## 3. Feature Coverage Matrix

| PRD Feature | UI Implementation | Status |
|:---|:---|:---|
| **Multi-Tier Organization Management** | `organisations/page.tsx`, `organisations/[id]/page.tsx`, `organisations/create/page.tsx`, `settings/hierarchy/page.tsx` | ✅ Complete |
| **Activity Planning & Management** | `activities/page.tsx`, `activities/create/pagetsx`, `activities/[id]/page.tsx`, `activity-form.tsx` | ✅ Complete |
| **Semiotic Risk Assessment** | `activity-form.tsx` -> `SemioticAssessmentDisplay.tsx` | ✅ Framework Only |
| **Field Reporting & Evidence Collection** | Represented by "Completed" status and conceptual `FieldReport` entity in `backend.json`. No specific UI exists. | ❌ Not Implemented |
| **Role-Based Dashboards** | `dashboard/page.tsx` with role switcher and `dashboard/role-specific/*.tsx` components. | ✅ Complete |
| **Internal Communication System** | `messages/page.tsx`, `announcements/page.tsx`, Notifications dropdown in `Header.tsx`. | ✅ Complete |
| **Pattern Database** | Conceptual. Represented by `mockSemioticPatterns` in `data.ts`. No UI for management. | ❌ Not Implemented |

---

## 4. Component Inventory & Specifications

### Key Components

#### `AppSidebar.tsx`
*   **Purpose:** Primary navigation for the dashboard.
*   **Props:** None. It reads the current path to determine the active state.
*   **State:** Uses `usePathname` hook. Collapsible state managed by Radix UI primitive.
*   **Interactions:** Users can click to navigate, expand/collapse sub-menus. It's also collapsible into an icon-only view.
*   **Visuals:** Defined in `src/components/layout/sidebar.tsx` and `src/components/ui/sidebar.tsx`.

#### `Header.tsx`
*   **Purpose:** Top-level bar for search, notifications, and user actions.
*   **Props:** None.
*   **State:** Manages search query locally. Role is switched via local state.
*   **Interactions:**
    *   **Search:** Filters activities, results appear in a `Popover`.
    *   **Notifications:** `DropdownMenu` shows recent notifications.
    *   **Role Switcher:** `DropdownMenu` allows changing user context.
    *   **User Menu:** `DropdownMenu` for profile/settings/logout links.
*   **Visuals:** Sticky header with a blurred background (`backdrop-blur-lg`).

#### `ActivityForm.tsx`
*   **Purpose:** Multi-step wizard for creating and editing campaigns.
*   **Props:** `mode` ('create' or 'edit'), `activity` (for edit mode).
*   **State:** Uses `react-hook-form` with `zodResolver` for comprehensive validation.
*   **Interactions:**
    *   Dynamic `Select` dropdowns (e.g., LGA dropdown populates based on selected State).
    *   File upload via drag-and-drop or click.
    *   Triggers semiotic assessment via a button click.
*   **Visuals:** Uses `Card` components to group sections. `AnimatePresence` from `framer-motion` is used for step transitions, but the prototype currently does not have steps. The structure implies a multi-step design was intended.

#### `SemioticAssessmentDisplay.tsx`
*   **Purpose:** To visually represent the output of the AI risk assessment.
*   **Props:** `result` (the assessment data), `isLoading`.
*   **State:** None. Purely presentational.
*   **Interactions:** None in the prototype, but "Apply Suggestion" buttons are commented out, implying future interactivity.
*   **Visuals:** Uses color-coding (red/orange/green) for risk scores. `ShieldAlert` and `Lightbulb` icons visually distinguish issues from recommendations.

---

## 5. Layout & Navigation Structure

*   **Layout Hierarchy:**
    *   `src/app/layout.tsx`: Root layout, includes Theme and Firebase providers.
    *   `src/app/(public)/layout.tsx`: Wrapper for public-facing pages with a public header/footer.
    *   `src/app/(auth)/layout.tsx`: Minimal layout for login/register pages.
    *   `src/app/dashboard/layout.tsx`: Main application layout with sidebar and header.
*   **Navigation Structure:** Defined in `src/lib/data.ts` (`navItems`, `futureNavItems`, `publicNavItems`). This is the single source of truth for all navigation menus.
*   **Route Organization:** Uses Next.js App Router route groups: `(public)`, `(auth)`, and `dashboard`.
*   **Mobile Navigation:** A bottom navigation bar (`src/components/layout/mobile-bottom-nav.tsx`) appears on mobile screens for core dashboard sections.

---

## 6. Interaction Patterns

*   **Form Patterns:** `react-hook-form` is used for all major forms, providing real-time validation feedback.
*   **Data Display:**
    *   **Tables:** Used for large datasets like organisations (`organisations/page.tsx`). Includes sorting, filtering, and bulk selection.
    *   **Cards:** Used for visual grids like the team directory (`team/page.tsx`).
*   **Modal/Dialog Patterns:** `Dialog` from ShadCN is used for actions like inviting users or confirming deletion, ensuring user focus.
*   **Loading States:** The semiotic assessment uses a `Skeleton` component for loading. Form buttons show a `Loader2` spinner and become disabled during submission.
*   **Success/Error Feedback:** `Toaster` and `useToast` hook are set up but not widely used. Success is typically shown with a full-screen confirmation message (e.g., after registration).

---

## 7. Responsive Design Specifications

*   **Approach:** Mobile-first, using Tailwind CSS's responsive prefixes (`md:`, `lg:`).
*   **Breakpoint Behavior:**
    *   **Sidebar:** Collapses to an icon-only view on desktop and moves to a slide-out sheet on mobile.
    *   **Grids:** Typically switch from multi-column layouts on desktop to single-column on mobile (e.g., `grid-cols-1 md:grid-cols-4`).
    *   **Navigation:** The main sidebar is replaced by the `MobileBottomNav` on mobile.

---

## 8. Gap Analysis (PRD vs. Prototype)

### 8.1 PRD Features Not Fully Implemented in UI

*   **Field Reporting (Feature 4):** There is no UI for submitting a field report. The `FieldReport` entity exists in `backend.json`, but no form has been created for it. **Offline capability is not implemented.**
*   **Pattern Database Management (Feature 7):** No UI exists to search, view, or manage the `SemioticPattern` database. This is a backend-heavy feature but would require an admin interface.
*   **Evidence Uploads & GPS Tagging:** The "Attachments" upload exists, but there's no specific UI for "Evidence" linked to a field report, nor is there any GPS-related UI.

### 8.2 UI Elements Not Explicitly in PRD

*   **Future Features Pages:** The prototype includes placeholder pages for AI Planning, Resources, Training, Integrations, and Research. These are excellent for showing the product vision but are not part of the MVP feature set.
*   **Language Switcher:** The header includes a language switcher, but multi-language support is explicitly excluded from the MVP.

### 8.3 Incomplete Implementations

*   **AI Report Generation:** The page exists (`reports/[reportId]/page.tsx`), but it's a simulation. It calls a Genkit flow but doesn't have a user interface for providing the dynamic inputs required for a real report.
*   **Messaging System:** The UI is well-built but is not functional. It does not send or receive real messages.

---
This document provides a complete and actionable summary of the prototype's UI/UX. It should serve as a solid foundation for your development team's migration efforts.
---
