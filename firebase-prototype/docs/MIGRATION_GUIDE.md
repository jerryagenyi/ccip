# Migration Guide: CCIP from Next.js/React to Vue/Quasar/Laravel

**Objective**: To provide a detailed, step-by-step guide for a development assistant to convert the existing CCIP prototype (Next.js/React) into a Vue.js/Quasar application powered by a Laravel REST API, based on the provided target architecture.

## **Phase 1: Frontend Scaffolding & Initial Setup**

This phase focuses on creating the new Vue/Quasar project and porting over the essential visual and structural elements.

#### **Step 1.1: Initialize New Quasar Project**

Create a new Quasar project using the Vite setup. This will be the home for your new frontend.

1.  Run the Quasar CLI command: `pnpm create quasar`
2.  Select the following options:
    *   **Project name**: `frontend` (or your preferred name)
    *   **Script type**: TypeScript
    *   **Quasar version**: Quasar v2 with Vite
    *   **Features**: Select `Pinia` and `Axios`.
    *   **Linting**: Choose your preferred linter setup.

#### **Step 1.2: Replicate Directory Structure**

Based on the target architecture, create the specified directory structure within your new `frontend/src/` folder.

- `src/boot/`: For `axios.ts` and `router.ts`.
- `src/components/`: For globally reusable components.
- `src/layouts/`: For `MainLayout.vue` and `AuthLayout.vue`.
- `src/pages/`: For all page components.
- `src/router/`: For `index.ts`, `routes.ts`, and `guards.ts`.
- `src/services/`: For the `api.ts` Axios instance.
- `src/stores/`: For all your Pinia store files.

#### **Step 1.3: Port Styling and Theming**

1.  **Tailwind CSS to Quasar CSS:** The prototype uses Tailwind heavily. Quasar has its own rich set of CSS utility classes. The goal is to map concepts, not copy classes 1:1.
    *   Translate flexbox (`flex`, `justify-between`) to Quasar's flex classes (`row`, `justify-between`).
    *   Translate spacing (`p-6`, `gap-4`) to Quasar's spacing classes (`q-pa-md`, `q-gutter-md`).

2.  **Theme Colors:**
    *   Open the prototype's `src/app/globals.css`.
    *   Open your new project's `src/css/quasar.variables.sass`.
    *   Map the HSL color variables from the prototype to the Quasar SASS variables.
        *   `--primary: 258 56% 56%` -> `$primary: #7151B3`
        *   `--accent: 206 79% 62%` -> `$accent: #53A7EA`
        *   `--background: 257 32% 96%` -> `$background: #F2F0F7`

3.  **Fonts:**
    *   In your Quasar project, use a web font service or self-host to include the 'Inter' font family.
    *   Set it as the default font in `src/css/app.scss`.

## **Phase 2: Component & Layout Migration**

This is the most intensive phase. The goal is to recreate all UI elements from the React prototype using Vue and Quasar components.

#### **Step 2.1: Rebuild Layouts**

1.  **AuthLayout:** Create `src/layouts/AuthLayout.vue`.
    *   Look at the prototype's `src/app/(auth)/layout.tsx`.
    *   Use a `q-layout` with a central `q-page-container` and `q-page` with `flex flex-center`.
    *   Recreate the header with the logo and app title. The `Logo.tsx` can be converted to an inline SVG within a `.vue` component.

2.  **MainLayout:** Create `src/layouts/MainLayout.vue`.
    *   Look at the prototype's `src/app/dashboard/layout.tsx`.
    *   Use a `q-layout` with `q-header`, `q-drawer` (for the sidebar), and `q-page-container`.
    *   The `AppSidebar.tsx` will become your `q-drawer`. Use `q-list` and `q-item` to rebuild the navigation menu. Use `q-expansion-item` for the collapsible sections.

#### **Step 2.2: Convert UI Components (ShadCN to Quasar)**

Systematically go through `src/components/ui/` in the prototype and find the Quasar equivalent for each.

| React Component (shadcn) | Quasar Equivalent           | Notes                                                    |
| :----------------------- | :-------------------------- | :------------------------------------------------------- |
| `Button.tsx`             | `q-btn`                     | Use props like `color`, `flat`, `outline`.               |
| `Card.tsx`               | `q-card`, `q-card-section`  | Use sections for header, content, and footer logic.      |
| `Input.tsx`              | `q-input`                   | Has built-in validation, labels, and icons.              |
| `Select.tsx`             | `q-select`                  | Has options for filtering and data-binding (`v-model`).  |
| `Dialog.tsx`             | `q-dialog`                  | Quasar dialogs are often method-based for more control.  |
| `Avatar.tsx`             | `q-avatar`                  | Use with `q-img` or text inside.                         |
| `Badge.tsx`              | `q-badge`, `q-chip`         | `q-chip` is more versatile for tags.                     |
| `Table.tsx`              | `q-table`                   | A very powerful component with built-in sorting, filtering, and selection. |
| `Tabs.tsx`               | `q-tabs`, `q-tab-panels`    | Direct equivalent for tabbed content.                    |
| `Accordion.tsx`          | `q-expansion-item`          | Used for creating collapsible sections.                  |

**Action:** For each component in the prototype (e.g., `MetricCard.tsx`, `RecentActivities.tsx`), create a new `.vue` component in `src/components/` and rebuild its structure and style using Quasar components.

## **Phase 3: Page & Logic Migration**

With layouts and components ready, you can now rebuild the pages and wire up the application logic.

#### **Step 3.1: Recreate Pages**

For each page in the prototype's `src/app/dashboard/...`, create a corresponding `.vue` file in your `frontend/src/pages/` directory.

*   **Example:** `src/app/dashboard/activities/page.tsx` becomes `src/pages/activities/ActivityList.vue`.
*   Use the component mapping from the previous step to rebuild the page's UI.

#### **Step 3.2: Implement State Management (Pinia)**

1.  **Auth Store:** Create `src/stores/useAuthStore.ts`. This will handle login, logout, and user state. Use the provided example as a template. It should store the user object and JWT.
2.  **Data Stores:** Create stores for each data type (e.g., `useActivityStore.ts`, `useOrganisationStore.ts`). These stores will be responsible for fetching data from the Laravel API and caching it.

    *   **Action:** In `useActivityStore.ts`, create an action `fetchActivities`. This action will use your Axios service to make a GET request to the `/api/v1/activities` endpoint. Store the result in a `ref()` called `activities`.

#### **Step 3.3: Implement Routing & Guards**

1.  **Route Definitions:** Open the prototype's `src/lib/data.ts` to see the `navItems`. Use this structure to define your routes in `src/router/routes.ts`, matching the paths and associating them with your newly created page components.
2.  **Navigation Guards:** Create `src/router/guards.ts`. Implement the `authGuard` function to check `useAuthStore().isAuthenticated`. If a route requires authentication (`meta: { requiresAuth: true }`) and the user is not logged in, redirect them to the login page.

#### **Step 3.4: Connect Pages to Stores**

In your page components (`<script setup>` block), import and use your Pinia stores to get data and perform actions.

*   **Example (`ActivityList.vue`):**
    ```vue
    <script setup lang="ts">
    import { onMounted, computed } from 'vue';
    import { useActivityStore } from '@/stores/useActivityStore';

    const activityStore = useActivityStore();

    // Use a computed property to get reactive data from the store
    const activities = computed(() => activityStore.activities);

    // Fetch data when the component is mounted
    onMounted(() => {
      activityStore.fetchActivities();
    });
    </script>
    ```

## **Phase 4: Feature-Specific Migration**

This phase addresses the complex features.

#### **Step 4.1: Authentication Flow**

1.  Rebuild the Login, Register, and Forgot Password pages from `src/app/(auth)/`.
2.  In the `AuthLogin.vue`'s submit handler, call the `authStore.login()` action. On success, the `authGuard` will allow navigation to the dashboard. On failure, the Axios interceptor will automatically display an error notification.

#### **Step 4.2: AI Report Generation**

Since the AI logic will be handled by the Laravel backend, the frontend's responsibility is minimal for now.

1.  On the `ReportsPage.vue`, when a user clicks a "Generate Report" button, make a POST request to the corresponding Laravel API endpoint (e.g., `/api/v1/reports/generate-ai`).
2.  Display a loading state using `q-spinner`.
3.  When the API returns the generated report content, display it on the page.

---
